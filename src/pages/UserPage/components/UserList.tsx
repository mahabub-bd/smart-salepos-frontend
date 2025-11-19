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

import { Pencil, Plus, Trash2 } from "lucide-react";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import IconButton from "../../../components/common/IconButton";
import PageHeader from "../../../components/common/PageHeader";
import { useHasPermission } from "../../../hooks/useHasPermission";

import { User } from "../../../types";
import UserFormModal from "./UserFormModal";

export default function UserList() {
  const { data, isLoading, isError } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const canUpdate = useHasPermission("user.update");
  const canDelete = useHasPermission("user.delete");
  const users = data?.data || [];

  function openCreateModal() {
    setEditUser(null);
    setIsModalOpen(true);
  }

  function openEditModal(user: User) {
    setEditUser(user);
    setIsModalOpen(true);
  }

  function openDeleteDialog(user: User) {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  }

  async function confirmDelete() {
    if (!userToDelete) return;

    await deleteUser(userToDelete.id);
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
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

      <PageHeader
        title=" User Management"
        onAdd={openCreateModal}
        addLabel="Add"
        permission="user.create"
        icon={<Plus size={16} />}
      />

      {/* Desktop / Tablet Table */}
      <div className="hidden sm:block rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/5">
            <TableRow>
              <TableCell isHeader className="table-header w-[220px]">
                User
              </TableCell>
              <TableCell
                isHeader
                className="table-header w-[200px] hidden md:table-cell"
              >
                Email
              </TableCell>
              <TableCell
                isHeader
                className="table-header w-[150px] hidden 2xl:table-cell"
              >
                Phone
              </TableCell>
              <TableCell isHeader className="table-header w-[120px]">
                Role
              </TableCell>
              <TableCell isHeader className="table-header w-[120px]">
                Status
              </TableCell>
              <TableCell
                isHeader
                className="table-header w-[120px] hidden md:table-cell"
              >
                Joined
              </TableCell>
              <TableCell isHeader className="table-header text-right w-[120px]">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {users.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell className="table-body">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800">
                      <img
                        src="/images/user/owner.jpg"
                        alt={user.full_name}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <div>
                      <div className="font-medium text-gray-800 dark:text-white/90">
                        {user.full_name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {user.username}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="table-body hidden md:table-cell">
                  {user.email}
                </TableCell>
                <TableCell className="table-body hidden 2xl:table-cell">
                  {user.phone}
                </TableCell>

                <TableCell className="table-body">
                  <Badge size="sm" color="primary">
                    {user.roles?.[0]?.name?.toUpperCase()}
                  </Badge>
                </TableCell>

                <TableCell className="table-body">
                  <Badge
                    size="sm"
                    color={user.status === "active" ? "success" : "error"}
                  >
                    {user.status.toUpperCase()}
                  </Badge>
                </TableCell>

                <TableCell className="table-body hidden md:table-cell">
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>

                <TableCell className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    {canUpdate && (
                      <IconButton
                        icon={Pencil}
                        onClick={() => openEditModal(user)}
                        color="blue"
                      />
                    )}

                    {canDelete && (
                      <IconButton
                        icon={Trash2}
                        onClick={() => openDeleteDialog(user)}
                        color="red"
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile List View */}
      <div className="sm:hidden space-y-3">
        {users.map((user: User) => (
          <div
            key={user.id}
            className="p-3 rounded-lg border border-gray-200 bg-white dark:bg-white/3 dark:border-white/5"
          >
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800">
                <img
                  src="/images/user/owner.jpg"
                  alt={user.full_name}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="flex-1">
                <div className="font-medium text-gray-800 dark:text-white/90">
                  {user.full_name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {user.username}
                </div>

                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                  <br />
                  {user.phone}
                </div>

                <div className="mt-2 flex justify-between">
                  <Badge size="sm" color="primary">
                    {user.roles?.[0]?.name?.toUpperCase()}
                  </Badge>

                  <Badge
                    size="sm"
                    color={user.status === "active" ? "success" : "error"}
                  >
                    {user.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => openEditModal(user)}
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteDialog(user)}
                    className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={editUser}
      />

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Delete User"
        message={`Are you sure you want to delete "${userToDelete?.full_name}"?`}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
