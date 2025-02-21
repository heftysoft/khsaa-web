import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserActions } from "@/components/admin/user-actions";
import { UserColumn } from "@/types/admin-user";

type UserStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'INPROGRESS';

export const columns: ColumnDef<UserColumn>[] = [
  {
    accessorKey: "image",
    header: "",
    cell: ({ row }) => {
      const image = row.getValue("image") as string;
      const name = row.getValue("name") as string;
      
      return (
        <Avatar>
          <AvatarImage src={image || ''} />
          <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "profile.mobileNumber",
    header: "Mobile",
  },
  {
    accessorKey: "profile.sscRegNumber",
    header: "SSC Reg No",
  },
  {
    accessorKey: "profile.occupation",
    header: "Occupation",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as UserStatus;
      
      const statusColors: Record<UserStatus, "default" | "secondary" | "destructive" | "outline"> = {
        PENDING: "secondary",
        VERIFIED: "default",
        REJECTED: "destructive",
        INPROGRESS: "outline",
      };

      return (
        <Badge variant={statusColors[status]}>
          {status.toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return <Badge variant="outline">{role.toLowerCase()}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => {
      return format(row.getValue("createdAt"), "MMM d, yyyy");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UserActions user={row.original} />,
  },
];
