import { useState } from "react";

import ConfirmDialog from "../../../components/common/ConfirmDialog";

import { Pencil, Plus, Trash2 } from "lucide-react";
import IconButton from "../../../components/common/IconButton";
import PageHeader from "../../../components/common/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  useDeletePermissionMutation,
  useGetPermissionsQuery,
} from "../../../features/permissions/permissionsApi";
import { useHasPermission } from "../../../hooks/useHasPermission";
import { Permission } from "../../../types/role";
import PermissionFormModal from "./PermissionFormModal";

export default function PermissionList() {
  const { data, isLoading, isError } = useGetPermissionsQuery();
  const [deletePermission] = useDeletePermissionMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPermission, setEditPermission] = useState<Permission | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] =
    useState<Permission | null>(null);

  const permissions = data?.data || [];

  function openCreateModal() {
    setEditPermission(null);
    setIsModalOpen(true);
  }

  function openEditModal(permission: Permission) {
    setEditPermission(permission);
    setIsModalOpen(true);
  }

  function openDeleteDialog(permission: Permission) {
    setPermissionToDelete(permission);
    setIsDeleteModalOpen(true);
  }

  async function confirmDelete() {
    if (!permissionToDelete) return;

    try {
      await deletePermission(permissionToDelete.id).unwrap();
      setIsDeleteModalOpen(false);
      setPermissionToDelete(null);
    } catch (error) {
      console.error("Failed to delete permission:", error);
    }
  }

  if (isLoading)
    return <p className="p-5 text-gray-500">Loading permissions...</p>;

  if (isError)
    return <p className="p-5 text-red-500">Failed to fetch permissions.</p>;

  return (
    <>
      <PageHeader
        title="Permissions Management"
        onAdd={openCreateModal}
        addLabel="Add"
        permission="permission.create"
        icon={<Plus size={16} />}
      />

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-white dark:bg-white/5">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader className="table-header w-[250px]">
                  Key
                </TableCell>
                <TableCell isHeader className="table-header w-[300px]">
                  Description
                </TableCell>
                <TableCell
                  isHeader
                  className="table-header text-right w-[100px]"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {permissions.map((perm) => (
                <TableRow key={perm.id}>
                  <TableCell className="table-body">{perm.key}</TableCell>

                  <TableCell className="table-body">
                    {perm.description}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {useHasPermission("permission.update") && (
                        <IconButton
                          icon={Pencil}
                          onClick={() => openEditModal(perm)}
                          color="blue"
                        />
                      )}

                      {useHasPermission("permission.delete") && (
                        <IconButton
                          icon={Trash2}
                          onClick={() => openDeleteDialog(perm)}
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

      {/* Form Modal */}
      <PermissionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        permission={editPermission}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Delete Permission"
        message={`Are you sure you want to delete "${permissionToDelete?.key}"?`}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
