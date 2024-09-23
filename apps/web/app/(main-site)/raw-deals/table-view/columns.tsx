"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Badge } from "@repo/ui/components/badge";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type DataTableDeal = {
  id: string;
  title: string;
  revenue: string;
  asking_price?: string;
  category: string;
  status?: "Rejected" | "Approved";
  location: string;
  link: string;
};

export const columns: ColumnDef<DataTableDeal>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "revenue",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Revenue" />;
    },
  },
  {
    accessorKey: "asking_price",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Asking Price" />;
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Category" />;
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Location" />;
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Category" />;
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-right">Status</div>,
    cell: ({ row }) => {
      const dealStatus = row.getValue("status");

      return (
        <div className="text-right font-medium">
          {dealStatus === "Approved" ? (
            <div>
              <Badge variant={"default"}>Approved</Badge>
            </div>
          ) : null}
          {dealStatus === "Rejected" ? (
            <div>
              <Badge variant={"destructive"}>Rejected</Badge>
            </div>
          ) : null}
          {!dealStatus ? (
            <div>
              <Badge variant={"secondary"}>Unchecked</Badge>
            </div>
          ) : null}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Deal</DropdownMenuItem>
            <DropdownMenuItem>Deal Link</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
