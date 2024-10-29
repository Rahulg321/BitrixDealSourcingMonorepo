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
import { addDealToFirebase } from "../../actions";
import { useRouter } from "next/navigation";
import { ToastAction } from "@repo/ui/components/toast";

export const newDealSchema = z.object({
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  direct_phone: z.string().min(1).optional(),
  work_phone: z.string().min(1).optional(),
  title: z.string().min(1, "Title is required"),
  under_contract: z.string().optional(),
  revenue: z.string().optional(),
  status: z.enum(["Approved", "Rejected"]).optional(),
  link: z.string().optional(),
  asking_price: z.string().optional(),
  listing_code: z.string().optional(),
  state: z.string().min(1, "State is required"),
  category: z.string().min(1, "Category is required"),
  main_content: z.string().min(1, "Teaser for a deal is required"),
  explanation: z.string().optional(),
});

export type NewDealSchemaZodType = z.infer<typeof newDealSchema>;

const CreateNewDealForm = () => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<NewDealSchemaZodType>({
    resolver: zodResolver(newDealSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      direct_phone: "",
      work_phone: "",
      title: "",
      under_contract: "",
      revenue: "",
      link: "",
      asking_price: "",
      listing_code: "",
      state: "",
      status: "Rejected",
      category: "",
      main_content: "",
      explanation: "",
    },
  });

  function onSubmit(values: NewDealSchemaZodType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    startTransition(async () => {
      console.log("values", values);
      const response = await addDealToFirebase(values);
      console.log("response after adding", response);
      if (response.type === "success") {
        toast({
          variant: "success",
          title: "Successfully Added Deal 🎉",
          action: (
            <ToastAction
              altText="View Deal"
              onClick={() => {
                router.push(`/raw-deals/${response.documentId}`);
              }}
            >
              View Deal
            </ToastAction>
          ),
          description: response.message,
        });

        router.push(`/raw-deals`);
      }
      if (response.type === "error") {
        toast({
          variant: "destructive",
          title: "Could not add Deal",
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
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="first_name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="last_name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="direct_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Direct Phone</FormLabel>
              <FormControl>
                <Input placeholder="direct_phone..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="work_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work Phone</FormLabel>
              <FormControl>
                <Input placeholder="work_phone..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
            "Adding....."
          ) : (
            <div className="flex items-center">
              <PenIcon className="h-4 w-4 mr-2" />
              Add Deal
            </div>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CreateNewDealForm;
