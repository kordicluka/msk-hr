"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/atoms/admin/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/admin/table";

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, item: T) => React.ReactNode;
  className?: string;
}

export interface UniversalTableProps<T> {
  title: string;
  data: T[];
  columns: TableColumn<T>[];
  searchableKeys?: (keyof T)[];
  sortableColumns?: string[];
  createButtonText?: string;
  onCreateClick?: () => void;
  onRowClick?: (item: T) => void;
  emptyStateText?: string;
  emptyStateDescription?: string;
  loading?: boolean;
  className?: string;
}

export function UniversalTable<T extends Record<string, unknown>>({
  title,
  data,
  columns,
  searchableKeys = [],
  sortableColumns = [],
  createButtonText = `Create ${title.toLowerCase().slice(0, -1)}`,
  onCreateClick,
  onRowClick,
  emptyStateText = `No ${title.toLowerCase()} yet`,
  emptyStateDescription = `Create a new ${title
    .toLowerCase()
    .slice(0, -1)} or learn how to migrate existing ${title.toLowerCase()}`,
  loading = false,
  className = "",
}: UniversalTableProps<T>) {
  const [searchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Filtering and searching
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    return data.filter((item) =>
      searchableKeys.some((key) => {
        const value = item[key];
        if (value == null) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, searchableKeys]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const renderCellValue = (column: TableColumn<T>, item: T) => {
    if (column.render) {
      return column.render(item[column.key as keyof T], item);
    }

    const value = item[column.key as keyof T];
    if (value == null) return "-";

    // Format dates
    if (value instanceof Date) {
      return new Date(value).toLocaleDateString("hr-HR");
    }
    
    // Handle Date strings
    if (typeof value === 'string' && !isNaN(Date.parse(value))) {
      return new Date(value).toLocaleDateString("hr-HR");
    }

    return String(value);
  };

  return (
    <div className={`${className}`}>
      {/* Table */}
      <div className="bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : sortedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <h6 className="my-2">{emptyStateText}</h6>
            <p className="mb-8 text-xs text-gray-500 text-center max-w-md">
              {emptyStateDescription}
            </p>
            {onCreateClick && (
              <Button onClick={onCreateClick}>{createButtonText}</Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={String(column.key)}
                    className={`${column.className || ""} ${
                      sortableColumns.includes(String(column.key)) ||
                      column.sortable
                        ? "cursor-pointer hover:bg-gray-50"
                        : ""
                    }`}
                    onClick={() => {
                      if (
                        sortableColumns.includes(String(column.key)) ||
                        column.sortable
                      ) {
                        handleSort(String(column.key));
                      }
                    }}
                  >
                    <div className="flex items-center gap-1">
                      {column.label}
                      {sortField === String(column.key) && (
                        <span className="text-xs">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item, index) => (
                <TableRow
                  key={index + "services-table-row"}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <TableCell key={String(column.key)}>
                      {renderCellValue(column, item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
