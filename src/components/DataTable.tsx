"use client";

import { cn, formatDate } from "@/lib/utils";
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
} from "@syncfusion/ej2-react-grids";
import React from "react";
import Image from "next/image";

interface BaseTableProps {
  title: string;
  dataSource: any[];
  columns: TableColumn[];
  loading?: boolean;
  error?: string | null;
  className?: string;
}

interface TableColumn {
  field: string;
  headerText: string;
  width?: number | string;
  textAlign?: "Left" | "Right" | "Center";
  template?: (props: any) => React.ReactNode;
}

export default function DataTable({
  title,
  dataSource = [],
  columns,
  loading = false,
  error = null,
  className = "",
}: BaseTableProps) {
  if (loading) {
    return (
      <div className={cn("data-table-container", className)}>
        <h3 className="p-20-semibold text-dark-100 mb-4">{title}</h3>
        <div className="flex items-center justify-center p-8">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("data-table-container", className)}>
        <h3 className="p-20-semibold text-dark-100 mb-4">{title}</h3>
        <div className="flex items-center justify-center p-8">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!dataSource || dataSource.length === 0) {
    return (
      <div className={cn("data-table-container", className)}>
        <h3 className="p-20-semibold text-dark-100 mb-4">{title}</h3>
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500">No data available</div>
        </div>
      </div>
    );
  }
  return (
    <div className={cn("data-table-container bg-white", className)}>
      <h3 className="p-20-semibold text-dark-100 mb-4 px-4 pt-4">{title}</h3>
      <GridComponent
        dataSource={dataSource}
        gridLines="None"
        className="overflow-hidden"
      >
        <ColumnsDirective>
          {columns.map((column, index) => (
            <ColumnDirective
              key={index}
              field={column.field}
              headerText={column.headerText}
              width={column.width || "auto"}
              textAlign={column.textAlign || "Left"}
              template={column.template}
            />
          ))}
        </ColumnsDirective>
      </GridComponent>
    </div>
  );
}

// Predefined column configurations for common data types
export const userTableColumns: TableColumn[] = [
  {
    field: "name",
    headerText: "Name",
    width: 200,
    template: (props: any) => (
      <div className="flex items-center gap-1.5 px-4">
        <Image
          src={props.imageUrl || "/images/favicon.png"}
          alt={`${props.name} profile image`}
          height={28}
          width={28}
          className="aspect-square size-8 rounded-full"
        />
        <span className="text-gray-800">{props.name}</span>
      </div>
    ),
  },
  {
    field: "email",
    headerText: "Email",
    width: 180,
  },
  {
    field: "joinedAt",
    headerText: "Date Joined",
    width: 120,
    template: (props: any) => (
      <span>{props.joinedAt ? formatDate(props.joinedAt) : "N/A"}</span>
    ),
  },
  {
    field: "status",
    headerText: "Type",
    width: 100,
    template: (props: any) => (
      <article
        className={cn(
          "status-column",
          props.status === "user" ? "bg-success-50" : "bg-light-300",
        )}
      >
        <div
          className={cn(
            "size-1.5 rounded-full",
            props.status === "user" ? "bg-success-500" : "bg-gray-500",
          )}
        />
        <h3
          className={cn(
            "text-xs font-semibold",
            props.status === "user" ? "text-success-700" : "text-gray-500",
          )}
        >
          {props.status}
        </h3>
      </article>
    ),
  },
];

export const tripTableColumns: TableColumn[] = [
  {
    field: "name",
    headerText: "Trip Name",
    width: 200,
    template: (props: any) => (
      <div className="flex items-center gap-1.5 px-4">
        <Image
          src={props.imageUrl || "/images/sample.jpeg"}
          alt={`${props.name} trip image`}
          height={28}
          width={28}
          className="aspect-square size-8 rounded object-cover"
        />
        <span className="text-gray-800">{props.name}</span>
      </div>
    ),
  },
  {
    field: "country",
    headerText: "Destination",
    width: 120,
  },
  {
    field: "travelStyle",
    headerText: "Travel Style",
    width: 120,
  },
  {
    field: "interests",
    headerText: "Interests",
    width: 150,
    template: (props: any) => (
      <span className="text-sm text-gray-600">{props.interests || "N/A"}</span>
    ),
  },
  {
    field: "createdAt",
    headerText: "Created",
    width: 120,
    template: (props: any) => (
      <span>{props.createdAt ? formatDate(props.createdAt) : "N/A"}</span>
    ),
  },
];
