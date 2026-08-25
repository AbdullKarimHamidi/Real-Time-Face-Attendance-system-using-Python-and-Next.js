"use client";

import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ================== COLUMNS ==================
const columns = [
  {
    accessorKey: "image",
    header: "Photo",
    cell: ({ row }: any) => (
      <img
        src={row.getValue("image")}
        alt="engineer"
        className="w-10 h-10 rounded-full object-cover border"
      />
    ),
  },
  {
    accessorKey: "custom",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
];

// ================== COMPONENT ==================
export default function All_users_report() {
  const [engineers, setEngineers] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // ===== Fetch from DB =====
  useEffect(() => {
    const fetchEngineers = async () => {
      const res = await fetch("http://localhost:8000/all_engineers");
      const data = await res.json();
      setEngineers(data);
    };
    fetchEngineers();
  }, []);



  const globalSearch = (row: any, _columnId: string, filterValue: string) => {
  const search = filterValue.toLowerCase()

  return (
    row.original.custom?.toLowerCase().includes(search) ||
    row.original.name?.toLowerCase().includes(search) ||
    row.original.lastName?.toLowerCase().includes(search) ||
    row.original.email?.toLowerCase().includes(search) ||
    row.original.phone?.toLowerCase().includes(search) || 
    row.original.city?.toLowerCase().includes(search)
  )
}

  // ===== Table =====
const table = useReactTable({
  data: engineers,
  columns,
  state: {
    globalFilter,
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
  },
  onGlobalFilterChange: setGlobalFilter,
  globalFilterFn: globalSearch, 
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})

  // ===== EXPORT HELPERS =====
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const data = table.getRowModel().rows.map((r) => r.original);
    downloadFile(
      JSON.stringify(data, null, 2),
      "engineers_backup.json",
      "application/json",
    );
  };

  const exportTXT = () => {
    const text = table
      .getRowModel()
      .rows.map((row, i) => {
        const e = row.original;
        return `
${i + 1}.
Name: ${e.name} ${e.lastName}
Email: ${e.email}
Address: ${e.address}
City: ${e.city}
Phone: ${e.phone}
-------------------------
`;
      })
      .join("");
    downloadFile(text, "engineers_backup.txt", "text/plain");
  };

  const buildTextReport = () => {
    return table
      .getRowModel()
      .rows.map((row, i) => {
        const e = row.original;
        return `
${i + 1}.
Name    : ${e.name} ${e.lastName}
Email   : ${e.email}
Address : ${e.address}
City    : ${e.city}
Phone   : ${e.phone}
-----------------------------------------
`;
      })
      .join("");
  };


  
   const printTXTReport = () => {
    const text = buildTextReport();

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
    <html>
      <head>
        <title>Engineers Report</title>
        <style>
          body {
            font-family: monospace;
            white-space: pre-wrap;
            padding: 20px;
          }
        </style>
      </head>
      <body>
${text}
        <script>
          window.onload = () => window.print()
        </script>
      </body>
    </html>
  `);

    printWindow.document.close();
  };


  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 justify-between">
       <Input
  placeholder="Search by ID, name, email, phone..."
  value={globalFilter}
  onChange={(e) => setGlobalFilter(e.target.value)}
  className="max-w-sm"
/>


        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportJSON}>
            Backup JSON
          </Button>
          <Button variant="outline" size="sm" onClick={exportTXT}>
            Backup TXT
          </Button>
          <Button onClick={() => window.print()} variant="outline">Print Report</Button>
         
    
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/40">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center h-24"
                >
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
