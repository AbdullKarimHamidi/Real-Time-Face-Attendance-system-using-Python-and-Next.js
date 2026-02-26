import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

export type Engineer = {
  name: string;
  lastName: string;
  email: string;
  city: string;
  phone: string;
};

export const columns: ColumnDef<Engineer>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(v) =>
          table.toggleAllPageRowsSelected(!!v)
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
      />
    ),
    enableSorting: false,
  },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "lastName", header: "Last Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "city", header: "City" },
  { accessorKey: "phone", header: "Phone" },
];
