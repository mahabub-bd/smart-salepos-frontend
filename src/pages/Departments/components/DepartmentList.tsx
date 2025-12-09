import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import IconButton from "../../../components/common/IconButton";
import Loading from "../../../components/common/Loading";
import PageHeader from "../../../components/common/PageHeader";
import Badge from "../../../components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  useDeleteDepartmentMutation,
  useGetDepartmentsQuery,
} from "../../../features/department/departmentApi";
import { useHasPermission } from "../../../hooks/useHasPermission";
import { Department } from "../../../types";
import DepartmentFormModal from "./DepartmentFormModal";

export default function DepartmentList() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetDepartmentsQuery();
  const [deleteDepartment] = useDeleteDepartmentMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editDepartment, setEditDepartment] = useState<Department | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] =
    useState<Department | null>(null);

  const canCreate = useHasPermission("department.create");
  const canUpdate = useHasPermission("department.update");
  const canDelete = useHasPermission("department.delete");
  const canView = useHasPermission("department.view");

  const departments = data?.data || [];

  const openCreateModal = () => {
    setEditDepartment(null);
    setIsModalOpen(true);
  };

  const openEditModal = (department: Department) => {
    setEditDepartment(department);
    setIsModalOpen(true);
  };

  const openDeleteDialog = (department: Department) => {
    setDepartmentToDelete(department);
    setIsDeleteModalOpen(true);
  };

  const viewDepartment = (department: Department) => {
    navigate(`/departments/${department.id}`);
  };

  const confirmDelete = async () => {
    if (!departmentToDelete) return;
    try {
      await deleteDepartment(departmentToDelete.id).unwrap();
      toast.success("Department deleted successfully");
    } catch {
      toast.error("Failed to delete department");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) return <Loading message="Loading Departments" />;

  if (isError)
    return <p className="p-6 text-red-500">Failed to fetch departments.</p>;

  return (
    <>
      <PageHeader
        title="Department Management"
        icon={<Plus size={16} />}
        addLabel="Add Department"
        onAdd={openCreateModal}
        permission="department.create"
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-[#1e1e1e]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader>Code</TableCell>
                <TableCell isHeader>Department Name</TableCell>
                <TableCell isHeader>Description</TableCell>
                <TableCell isHeader>Manager</TableCell>
                <TableCell isHeader>Status</TableCell>
                <TableCell isHeader>Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {departments.length > 0 ? (
                departments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="table-body font-medium">
                      {department.code}
                    </TableCell>

                    <TableCell className="table-body font-medium">
                      {department.name}
                    </TableCell>

                    <TableCell className="table-body">
                      {department.description || "-"}
                    </TableCell>

                    <TableCell className="table-body">
                      {department.manager_name ? (
                        <div>
                          <div className="font-medium">
                            {department.manager_name}
                          </div>
                          {department.manager_email && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {department.manager_email}
                            </div>
                          )}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    <TableCell className="table-body">
                      <Badge
                        size="sm"
                        color={
                          department.status === "active" ? "success" : "warning"
                        }
                      >
                        {department.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <div className="flex justify-start gap-2">
                        {canView && (
                          <IconButton
                            icon={Eye}
                            tooltip="View"
                            onClick={() => viewDepartment(department)}
                            color="green"
                          />
                        )}
                        {canUpdate && (
                          <IconButton
                            icon={Pencil}
                            tooltip="Edit"
                            onClick={() => openEditModal(department)}
                            color="blue"
                          />
                        )}
                        {canDelete && (
                          <IconButton
                            icon={Trash2}
                            tooltip="Delete"
                            onClick={() => openDeleteDialog(department)}
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
                    colSpan={6}
                    className="py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No departments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {(canCreate || canUpdate) && (
        <DepartmentFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          department={editDepartment}
        />
      )}

      {canDelete && (
        <ConfirmDialog
          isOpen={isDeleteModalOpen}
          title="Delete Department"
          message={`Are you sure you want to delete "${departmentToDelete?.name}"?`}
          confirmLabel="Yes, Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </>
  );
}
