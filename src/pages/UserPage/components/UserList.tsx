import { useState } from "react";
import Badge from "../../../components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../../../features/user/userApi";

import { User } from "../../../types/auth.ts/auth";
import UserFormModal from "./UserFormModal";

export default function UserList() {
  const { data, isLoading, isError } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  const users = data?.data || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  function openCreateModal() {
    setEditUser(null);
    setIsModalOpen(true);
  }

  function openEditModal(user: User) {
    setEditUser(user);
    setIsModalOpen(true);
  }

  if (isLoading)
    return (
      <p className="p-6 text-gray-500 dark:text-gray-400">Loading users...</p>
    );

  if (isError)
    return (
      <p className="p-6 text-red-500 dark:text-red-400">
        Failed to fetch users!
      </p>
    );

  return (
    <>
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          User Management
        </h2>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg"
        >
          + Create User
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                <TableCell isHeader className="table-header w-[220px]">
                  User
                </TableCell>

                <TableCell isHeader className="table-header w-[200px]">
                  Email
                </TableCell>

                <TableCell isHeader className="table-header w-[150px]">
                  Phone
                </TableCell>

                <TableCell isHeader className="table-header w-[120px]">
                  Role
                </TableCell>

                <TableCell isHeader className="table-header w-[120px]">
                  Status
                </TableCell>

                <TableCell isHeader className="table-header w-[120px]">
                  Joined
                </TableCell>

                <TableCell
                  isHeader
                  className="table-header text-right w-[120px]"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {users.map((user: User) => (
                <TableRow key={user.id}>
                  {/* User + Avatar */}
                  <TableCell className="table-body">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800 shrink-0">
                        <img
                          src="/images/user/owner.jpg"
                          alt={user.full_name}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      <div className="truncate">
                        <div className="font-medium text-gray-800 dark:text-white/90 truncate">
                          {user.full_name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.username}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Email */}
                  <TableCell className="table-body truncate max-w-[200px]">
                    {user.email}
                  </TableCell>

                  {/* Phone */}
                  <TableCell className="table-body">{user.phone}</TableCell>

                  {/* Role */}
                  <TableCell className="table-body">
                    <Badge size="sm" color="primary">
                      {user.roles?.[0]?.name?.toUpperCase()}
                    </Badge>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="table-body">
                    <Badge
                      size="sm"
                      color={user.status === "active" ? "success" : "error"}
                    >
                      {user.status.toUpperCase()}
                    </Badge>
                  </TableCell>

                  {/* Joined */}
                  <TableCell className="table-body">
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-4 py-3 text-right w-[120px]">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteUser(user.id)}
                        className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={editUser}
      />
    </>
  );
}
