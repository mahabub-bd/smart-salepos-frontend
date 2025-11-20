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

import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Badge from "../../../components/ui/badge/Badge";

import ConfirmDialog from "../../../components/common/ConfirmDialog";
import IconButton from "../../../components/common/IconButton";
import Loading from "../../../components/common/Loading";
import PageHeader from "../../../components/common/PageHeader";
import { useHasPermission } from "../../../hooks/useHasPermission";
import RoleFormModal from "./RoleFormModal";

export default function RoleList() {
  // API hooks
  const { data, isLoading, isError } = useGetRolesQuery();
  const [deleteRole] = useDeleteRoleMutation();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  // Permission checks
  const canUpdate = useHasPermission("role.update");
  const canDelete = useHasPermission("role.delete");

  const roles = data?.data || [];

  // Handlers
  const openCreateModal = () => {
    setEditRole(null);
    setIsModalOpen(true);
  };

  const openEditModal = (role: Role) => {
    setEditRole(role);
    setIsModalOpen(true);
  };

  const openDeleteDialog = (role: Role) => {
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!roleToDelete) return;
    await deleteRole(roleToDelete.id);
    toast.success("Role deleted successfully");
    setIsDeleteModalOpen(false);
  };

  // Loading & Error states
  if (isLoading) return <Loading message="Loading Roles" />;
  if (isError)
    return <p className="p-6 text-red-500">Failed to fetch roles.</p>;

  return (
    <>
      {/* HEADER */}
      <PageHeader
        title="Role Management"
        icon={<Plus size={16} />}
        addLabel="Add"
        onAdd={openCreateModal}
        permission="role.create"
      />

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-[#1e1e1e]">
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
              {roles.length > 0 ? (
                roles.map((role: Role) => (
                  <TableRow key={role.id}>
                    <TableCell className="table-body font-medium">
                      {role.name}
                    </TableCell>
                    <TableCell className="table-body">
                      {role.description || "-"}
                    </TableCell>
                    <TableCell className="table-body">
                      <div className="flex flex-wrap gap-1">
                        {role.permissions?.length ? (
                          role.permissions.map((perm) => (
                            <Badge key={perm.id} size="sm" color="primary">
                              {perm.key}
                            </Badge>
                          ))
                        ) : (
                          <Badge size="sm" color="warning">
                            No Permissions
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3">
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
                ))
              ) : (
                <TableRow>
                  <TableCell className="py-6 text-center text-gray-500 dark:text-gray-400">
                    No roles found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      <RoleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        role={editRole}
      />

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Delete Role"
        message={`Are you sure you want to delete "${roleToDelete?.name}"?`}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
