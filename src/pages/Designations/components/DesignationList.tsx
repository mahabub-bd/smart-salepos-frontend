import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  useDeleteDesignationMutation,
  useGetDesignationsQuery,
} from "../../../features/designation/designationApi";
import { useHasPermission } from "../../../hooks/useHasPermission";
import { Designation } from "../../../types";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import ConfirmDialog from "../../../components/common/ConfirmDialog";
import IconButton from "../../../components/common/IconButton";
import Loading from "../../../components/common/Loading";
import PageHeader from "../../../components/common/PageHeader";
import Badge from "../../../components/ui/badge/Badge";
import DesignationFormModal from "./DesignationFormModal";

export default function DesignationList() {
  const { data, isLoading, isError } = useGetDesignationsQuery();
  const [deleteDesignation] = useDeleteDesignationMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editDesignation, setEditDesignation] = useState<Designation | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [designationToDelete, setDesignationToDelete] =
    useState<Designation | null>(null);

  const canCreate = useHasPermission("designation.create");
  const canUpdate = useHasPermission("designation.update");
  const canDelete = useHasPermission("designation.delete");

  const designations = data?.data?.items || [];

  const openCreateModal = () => {
    setEditDesignation(null);
    setIsModalOpen(true);
  };

  const openEditModal = (designation: Designation) => {
    setEditDesignation(designation);
    setIsModalOpen(true);
  };

  const openDeleteDialog = (designation: Designation) => {
    setDesignationToDelete(designation);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!designationToDelete) return;
    try {
      await deleteDesignation(designationToDelete.id).unwrap();
      toast.success("Designation deleted successfully");
    } catch {
      toast.error("Failed to delete designation");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) return <Loading message="Loading Designations" />;

  if (isError)
    return <p className="p-6 text-red-500">Failed to fetch designations.</p>;

  return (
    <>
      <PageHeader
        title="Designation Management"
        icon={<Plus size={16} />}
        addLabel="Add"
        onAdd={openCreateModal}
        permission="designation.create"
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-[#1e1e1e]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                <TableCell isHeader>Title</TableCell>
                <TableCell isHeader>Code</TableCell>
                <TableCell isHeader>Level</TableCell>
                <TableCell isHeader>Salary Range</TableCell>
                <TableCell isHeader>Parent</TableCell>
                <TableCell isHeader>Permissions</TableCell>
                <TableCell isHeader>Status</TableCell>
                <TableCell isHeader className="table-header text-right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {designations.length > 0 ? (
                designations.map((designation) => (
                  <TableRow key={designation.id}>
                    <TableCell className="table-body font-medium">
                      {designation.title}
                    </TableCell>
                    <TableCell className="table-body">
                      {designation.code}
                    </TableCell>
                    <TableCell className="table-body">
                      <span className="capitalize">
                        {designation.level.replace(/_/g, " ")}
                      </span>
                    </TableCell>
                    <TableCell className="table-body">
                      {designation.minSalary} - {designation.maxSalary}
                    </TableCell>
                    <TableCell className="table-body">
                      {designation.parentDesignation?.title || "-"}
                    </TableCell>
                    <TableCell className="table-body">
                      <div className="flex gap-1">
                        {designation.canApproveLeave && (
                          <Badge color="info" size="sm">
                            Leave
                          </Badge>
                        )}
                        {designation.canApprovePayroll && (
                          <Badge color="warning" size="sm">
                            Payroll
                          </Badge>
                        )}
                        {!designation.canApproveLeave &&
                          !designation.canApprovePayroll && (
                            <span className="text-gray-400">-</span>
                          )}
                      </div>
                    </TableCell>
                    <TableCell className="table-body">
                      <Badge
                        color={designation.isActive ? "success" : "error"}
                        size="sm"
                      >
                        {designation.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <div className="flex justify-start gap-2">
                        {canUpdate && (
                          <IconButton
                            icon={Pencil}
                            tooltip="Edit"
                            onClick={() => openEditModal(designation)}
                            color="blue"
                          />
                        )}
                        {canDelete && (
                          <IconButton
                            tooltip="Delete"
                            icon={Trash2}
                            onClick={() => openDeleteDialog(designation)}
                            color="red"
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No designations found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {(canCreate || canUpdate) && (
        <DesignationFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          designation={editDesignation}
        />
      )}

      {canDelete && (
        <ConfirmDialog
          isOpen={isDeleteModalOpen}
          title="Delete Designation"
          message={`Are you sure you want to delete "${designationToDelete?.title}"?`}
          confirmLabel="Yes, Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </>
  );
}
