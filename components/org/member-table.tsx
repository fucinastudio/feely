import React from 'react';
import { Ellipsis } from 'lucide-react';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@fucina/ui';

const MemberTable = () => {
  return (
    <Table className="w-fit sm:w-full">
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Mail</TableHead>
          <TableHead className="w-24">Role</TableHead>
          <TableHead className="w-10"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow key="key">
          <TableCell className="font-medium">Federico Kratter Thaler</TableCell>
          <TableCell>kkratterf@gmail.com</TableCell>
          <TableCell>Owner</TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="text" icon>
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem>Delete user</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
        <TableRow key="key">
          <TableCell className="font-medium">-</TableCell>
          <TableCell>r.cornacchiari@gmail.com</TableCell>
          <TableCell>Admin</TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="text" icon>
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem>Delete user</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default MemberTable;
