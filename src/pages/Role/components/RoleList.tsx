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
import RoleFormModal from "./RoleFormModal";

export default function RoleList() {
  const { data, isLoading, isError } = useGetRolesQuery();
  const [deleteRole] = useDeleteRoleMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);

  const roles = data?.data || [];

  function openCreateModal() {
    setEditRole(null);
    setIsModalOpen(true);
  }

  function openEditModal(role: Role) {
    setEditRole(role);
    setIsModalOpen(true);
  }

  if (isLoading) return <p className="p-6 text-gray-500">Loading roles...</p>;
  if (isError)
    return <p className="p-6 text-red-500">Failed to fetch roles.</p>;

  return (
    <>
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Role Management
        </h2>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg"
        >
          + Create Role
        </button>
      </div>

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
                      <button
                        onClick={() => openEditModal(role)}
                        className="px-3 py-1 text-xs rounded-md bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteRole(role.id)}
                        className="px-3 py-1 text-xs rounded-md bg-red-500 text-white hover:bg-red-600"
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
      <RoleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        role={editRole}
      />
    </>
  );
}
