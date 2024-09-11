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
import { DealCardProps } from "../DealCard";
import { editDealFromFirebase } from "../../actions";

export const dealSchema = z.object({
  title: z.string().min(1, "Title is required"),
  under_contract: z.string().optional(),
  revenue: z.string().optional(),
  link: z.string().url("Invalid URL").optional(),
  asking_price: z.string().optional(),
  listing_code: z.string().optional(),
  state: z.string().min(1, "State is required"),
  category: z.string().min(1, "Category is required"),
});

export type DealSchemaZodType = z.infer<typeof dealSchema>;

const EditDealForm = ({
  id,
  title,
  under_contract,
  revenue,
  link,
  asking_price,
  listing_code,
  state,
  category,
  setOpenDialog,
}: DealCardProps & { setOpenDialog: (openDialog: boolean) => void }) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

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
      category: category,
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
          title: "Successfully Deleted Deal 🎉",
          description: response.message,
        });
        setOpenDialog(false);
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