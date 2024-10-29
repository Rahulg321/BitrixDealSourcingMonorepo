"use client";

import React, { useState, useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import { Button } from "@repo/ui/components/button";
import { inferDealFromDescription } from "../../actions/infer-deal";
import { readStreamableValue } from "ai/rsc";
import { Pen, Save } from "lucide-react";
import { resolve } from "path";
import Link from "next/link";
import EditInferDealDialog from "../../components/dialogs/edit-infer-deal-dialog";
import SaveInferredDeal from "../../actions/save-infer-deal";

const InferDealSchema = z.object({
  description: z
    .string()
    .min(10, "Description should be at least 10 characters long"),
});

export type InferDealSchemaType = z.infer<typeof InferDealSchema>;

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const InferNewDealPage = () => {
  const [isPending, startTransition] = useTransition();
  const [saveDealPending, saveDealTransition] = useTransition();
  const [generation, setGeneration] = useState<string>("");

  const form = useForm<InferDealSchemaType>({
    resolver: zodResolver(InferDealSchema),
    defaultValues: {
      description: "",
    },
  });

  async function onSubmit(values: InferDealSchemaType) {
    startTransition(async () => {
      const object = await inferDealFromDescription(values);

      for await (const partialObject of readStreamableValue(object!)) {
        if (partialObject) {
          setGeneration(JSON.stringify(partialObject, null, 2));
        }
      }
    });
  }

  return (
    <section className="container block-space">
      <div className="mb-6 text-center md:mb-8 space-y-2">
        <h1>Infer a New Deal</h1>
        <span className="text-gray-600 block mb-2 text-center">
          Enter the description of a deal and use AI to generate the required
          format for the deal, save it to the database and then scrape it
        </span>

        <span className="text-red-600 mb-6 text-center block">
          Note:- Double check the output given by AI and save it accordingly
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-12">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deal Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Kat Sparks Commercial is proud to exclusively present the opportunity to acquire the fee simple interes......"
                        {...field}
                        rows={20}
                      />
                    </FormControl>
                    <FormDescription>
                      This is deal's detailed explanation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending}>
                {isPending ? "Inferring..." : "Infer Deal"}
              </Button>
            </form>
          </Form>
        </div>
        <div>
          <h2>Inferred Deal using ChatGPT</h2>
          <div className="text-wrap">
            <pre
              style={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                overflowX: "hidden",
                fontSize: "0.875rem", // Reduces the font size (14px)
                lineHeight: "1.2",
              }}
            >
              {generation}
            </pre>
          </div>
          <div className="mt-4 md:mt-6 flex items-center justify-between">
            <Button
              variant={"success"}
              onClick={async () => {
                await SaveInferredDeal({ generation });
              }}
              disabled={generation === "" ? true : false}
            >
              <Save className="mr-2 size-4" /> Save Deal
            </Button>

            {/* <EditInferDealDialog /> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InferNewDealPage;
