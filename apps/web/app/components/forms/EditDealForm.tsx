"use client";

import React, { useTransition } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import Link from "next/link";
import { Pen, PenIcon } from "lucide-react";
import { useToast } from "@repo/ui/hooks/use-toast";
import { editDealFromFirebase } from "../../actions";
import { useRouter } from "next/navigation";

export const dealSchema = z.object({
  title: z.string().min(1, "Title is required"),
  under_contract: z.string().optional(),
  revenue: z.string().optional(),
  status: z.enum(["Approved", "Rejected"]).optional(),
  link: z.string().url("Invalid URL").optional(),
  asking_price: z.string().optional(),
  listing_code: z.string().optional(),
  state: z.string().min(1, "State is required"),
  category: z.string().min(1, "Category is required"),
  main_content: z.string().min(1, "Teaser for a deal is required"),
  explanation: z.string().optional(),
});

export type DealSchemaZodType = z.infer<typeof dealSchema>;

type EditDealFormProps = {
  title: string;
  under_contract?: string;
  revenue?: string;
  link?: string;
  asking_price?: string;
  listing_code?: string;
  state?: string;
  status?: "Approved" | "Rejected";
  category?: string;
  main_content?: string;
  explanation?: string;
  id: string;
};

const EditDealForm = ({
  id,
  title,
  under_contract,
  revenue,
  link,
  asking_price,
  listing_code,
  state,
  status,
  category,
  main_content,
  explanation,
}: EditDealFormProps) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<DealSchemaZodType>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: title,
      under_contract: under_contract,
      revenue: revenue,
      link: link,
      asking_price: asking_price,
      listing_code: listing_code,
      state: state,
      status: status ? status : "Rejected",
      category: category,
      main_content: main_content,
      explanation: explanation,
    },
  });

  function onSubmit(values: DealSchemaZodType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    startTransition(async () => {
      console.log(values);
      const response = await editDealFromFirebase(id, values);
      console.log("response afte editing", response);
      if (response.type === "success") {
        toast({
          variant: "success",
          title: "Successfully Edited Deal 🎉",
          description: response.message,
        });

        router.push(`/raw-deals/${id}`);
      }
      if (response.type === "error") {
        toast({
          variant: "destructive",
          title: "Error Occured",
          description: response.message,
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deal Title</FormLabel>
              <FormControl>
                <Input placeholder="name...." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="Healthcare, Aerospace...." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deal Approved Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Deal Approved by AI Model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="revenue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Revenue</FormLabel>
              <FormControl>
                <Input placeholder="$200000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="under_contract"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Under Contract</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Deal Under Contract..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deal Link</FormLabel>
              <FormControl>
                <Input placeholder="name...." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="asking_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asking Price</FormLabel>
              <FormControl>
                <Input placeholder="asking_price...." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="listing_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Listing Code</FormLabel>
              <FormControl>
                <Input placeholder="listing_code...." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="main_content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teaser</FormLabel>
              <FormControl>
                <Textarea placeholder="deal teaser....." {...field} rows={15} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Screening Explanation</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="screening explanation....."
                  {...field}
                  rows={15}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            "Editing....."
          ) : (
            <div className="flex items-center">
              <PenIcon className="h-4 w-4 mr-2" />
              Edit Deal
            </div>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default EditDealForm;
