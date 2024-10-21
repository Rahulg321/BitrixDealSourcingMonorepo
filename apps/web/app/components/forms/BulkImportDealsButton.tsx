"use client";

import { z } from "zod";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as XLSX from "xlsx";
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
      const file = values.deals;

      if (file) {
        const reader = new FileReader();

        reader.onload = async (event) => {
          const fileExtension = file.name.split(".").pop();
          await new Promise((resolve) => setTimeout(resolve, 10000));

          if (
            typeof event.target?.result === "string" &&
            fileExtension === "csv"
          ) {
            // Parse CSV files
            const parsedData = Papa.parse(event.target.result, {
              header: true,
            });

            console.log("Parsed CSV Data:", parsedData.data.slice(0, 5));
          } else if (fileExtension === "xlsx") {
            const data = event.target?.result;
            const workbook = XLSX.read(data, { type: "binary" });
            // Extract the first sheet from the workbook
            const firstSheetName = workbook.SheetNames[0];

            if (!firstSheetName) {
              return;
            }

            const worksheet = workbook.Sheets[firstSheetName];

            // Convert the worksheet data to JSON
            const jsonData = XLSX.utils.sheet_to_json(
              worksheet as XLSX.WorkSheet,
              { header: 1 }
            );

            // If you want to extract columns individually, you can do this:
            const columns = jsonData[0]; // Assuming first row contains column headers
            const rows = jsonData.slice(1); // Remaining rows are the actual data

            console.log("Columns:", columns);
            console.log("Rows:", rows[0]);
            const mappedData = rows.map((row) => {
              const rowObject = {};
              columns.forEach((col, index) => {
                rowObject[col] = row[index] || null; // Handle cases where data might be missing
              });
              return rowObject;
            });

            console.log("total rows are", mappedData.length);

            console.log(
              "Mapped Data (Columns with corresponding Rows):",
              mappedData[0]
            );
          }
        };

        reader.onerror = (error) => {
          console.error("Error reading file:", error);
        };

        // Handle both CSV and XLSX by using the appropriate method
        if (file.name.endsWith(".csv")) {
          reader.readAsText(file);
        } else if (file.name.endsWith(".xlsx")) {
          reader.readAsArrayBuffer(file);
        } else {
          toast({
            variant: "destructive",
            title: "Unsupported file type",
            description: "Please upload a valid CSV or XLSX file.",
          });
        }
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
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
              <FileIcon className="mr-2 h-4 w-4" /> Upload File (xlsx,csv)
            </div>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default BulkImportDealsButton;
