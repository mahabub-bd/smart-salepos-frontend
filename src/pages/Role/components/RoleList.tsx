import { useState } from "react";
import {
  useDeleteRoleMutation,
  useGetRolesQuery,
} from "../../../features/role/roleApi";
import { Role } from "../../../types/role";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import Badge from "../../../components/ui/badge/Badge";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import IconButton from "../../../components/common/IconButton";
import PageHeader from "../../../components/common/PageHeader";
import { useHasPermission } from "../../../hooks/useHasPermission";
import RoleFormModal from "./RoleFormModal";

export default function RoleList() {
  const { data, isLoading, isError } = useGetRolesQuery();
  const [deleteRole] = useDeleteRoleMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);

  // Delete confirmation dialog state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const canUpdate = useHasPermission("role.update");
  const canDelete = useHasPermission("role.delete");
  const roles = data?.data || [];

  function openCreateModal() {
    setEditRole(null);
    setIsModalOpen(true);
  }

  function openEditModal(role: Role) {
    setEditRole(role);
    setIsModalOpen(true);
  }

  function openDeleteDialog(role: Role) {
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  }

  async function confirmDelete() {
    if (!roleToDelete) return;

    await deleteRole(roleToDelete.id);
    setIsDeleteModalOpen(false);
    setRoleToDelete(null);
    toast.success("Deleted Sucessfully");
  }

  if (isLoading) return <p className="p-6 text-gray-500">Loading roles...</p>;
  if (isError)
    return <p className="p-6 text-red-500">Failed to fetch roles.</p>;

  return (
    <>
      {/* Header */}

      <PageHeader
        title="Role Management"
        onAdd={openCreateModal}
        addLabel="Add"
        permission="role.create"
        icon={<Plus size={16} />}
      />

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                <TableCell isHeader className="table-header">
                  Role Name
                </TableCell>
                <TableCell isHeader className="table-header">
                  Description
                </TableCell>
                <TableCell isHeader className="table-header">
                  Permissions
                </TableCell>
                <TableCell isHeader className="table-header text-right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {roles.map((role: Role) => (
                <TableRow key={role.id}>
                  <TableCell className="table-body font-medium">
                    {role.name}
                  </TableCell>
                  <TableCell className="table-body">
                    {role.description}
                  </TableCell>

                  <TableCell className="table-body">
                    <div className="flex flex-wrap gap-1">
                      {role.permissions?.map((perm) => (
                        <Badge key={perm.id} size="sm" color="primary">
                          {perm.key}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {canUpdate && (
                        <IconButton
                          icon={Pencil}
                          onClick={() => openEditModal(role)}
                          color="blue"
                        />
                      )}

                      {canDelete && (
                        <IconButton
                          icon={Trash2}
                          onClick={() => openDeleteDialog(role)}
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
      </div>

      {/* Create / Edit Modal */}
      <RoleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        role={editRole}
      />

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Delete Role"
        message={`Are you sure you want to delete the role "${roleToDelete?.name}"?`}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
