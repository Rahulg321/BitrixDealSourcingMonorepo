"use client";

import { z } from "zod";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@repo/ui/components/button";
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
import Papa from "papaparse";
import { FileIcon, Loader } from "lucide-react";
import { useToast } from "@repo/ui/hooks/use-toast";

export const bulkUploadSchema = z.object({
  deals: z.instanceof(File).refine((file) => file.size < 7000000, {
    message: "Your resume must be less than 7MB.",
  }),
});

type BulkUploadSchemaZodType = z.infer<typeof bulkUploadSchema>;

const BulkImportDealsButton = () => {
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof bulkUploadSchema>>({
    resolver: zodResolver(bulkUploadSchema),
  });

  function onSubmit(values: z.infer<typeof bulkUploadSchema>) {
    startTransition(async () => {
      console.log("type safe and validated");
      const file = values.deals;
      console.log("file is", file);

      if (file) {
        const reader = new FileReader();

        reader.onload = async (event) => {
          const text = event.target?.result;
          console.log("text is", text);
          if (typeof text === "string") {
            // Parse the CSV file using PapaParse
            const parsedData = Papa.parse(text, { header: true });

            console.log("Parsed CSV Data:", parsedData.data.slice(0, 5));
            // const response = await bulkUploadQuestionsFromCSV(
            //   examId,
            //   parsedData.data as BaseQuestion[]
            // );

            // if (response.success) {
            //   toast({
            //     variant: "success",
            //     title: "Successfully Uploaded Questions 🎉",
            //     description: response.success,
            //   });
            // }

            // if (response.error) {
            //   toast({
            //     variant: "destructive",
            //     title: "Uh oh! Something went wrong. ❌",
            //     description: response.error,
            //   });
            // }
          }
        };

        reader.onerror = (error) => {
          console.error("Error reading file:", error);
        };

        reader.readAsText(file);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="deals"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...fieldProps}
                  placeholder="Upload Deals"
                  type="file"
                  accept=".csv, .xlsx"
                  onChange={(event) =>
                    onChange(event.target.files && event.target.files[0])
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <div className="flex items-center">
              {" "}
              <Loader className="mr-2 h-4 w-4" />
              Uploading Deals....
            </div>
          ) : (
            <div className="flex items-center">
              <FileIcon className="mr-2 h-4 w-4" /> Upload CSV
            </div>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default BulkImportDealsButton;
