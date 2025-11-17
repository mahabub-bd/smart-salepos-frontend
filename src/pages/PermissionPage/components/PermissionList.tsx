import { useState } from "react";

import ConfirmDialog from "../../../components/common/ConfirmDialog";

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
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Permissions
        </h2>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg"
        >
          + Create Permission
        </button>
      </div>

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
                      <button
                        onClick={() => openEditModal(perm)}
                        className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => openDeleteDialog(perm)}
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
