import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import IconButton from "../../../components/common/IconButton";
import Loading from "../../../components/common/Loading";
import PageHeader from "../../../components/common/PageHeader";
import Input from "../../../components/form/input/InputField";
import Badge from "../../../components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  useDeleteEmployeeMutation,
  useGetEmployeesQuery,
} from "../../../features/employee/employeeApi";
import { useHasPermission } from "../../../hooks/useHasPermission";
import { Employee } from "../../../types";
import { getEmployeeTypeColor, getStatusColor } from "../../../utlis";
import EmployeeFormModal from "./EmployeeFormModal";

export default function EmployeeList() {
  const { data, isLoading, isError } = useGetEmployeesQuery();
  const [deleteEmployee] = useDeleteEmployeeMutation();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );
  const [searchInput, setSearchInput] = useState("");

  const canCreate = useHasPermission("employee.create");
  const canUpdate = useHasPermission("employee.update");
  const canDelete = useHasPermission("employee.delete");
  const canView = useHasPermission("employee.view");

  const employees = data?.data || [];

  // Filter employees based on search input
  const filteredEmployees = employees.filter((employee) => {
    const searchLower = searchInput.toLowerCase();
    const fullName = `${employee.first_name} ${employee.last_name}`.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      employee.email?.toLowerCase().includes(searchLower) ||
      employee.phone?.toLowerCase().includes(searchLower) ||
      employee.employee_code?.toLowerCase().includes(searchLower)
    );
  });

  const openCreateModal = () => {
    setEditEmployee(null);
    setIsModalOpen(true);
  };

  const openEditModal = (employee: Employee) => {
    setEditEmployee(employee);
    setIsModalOpen(true);
  };

  const openDeleteDialog = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;
    try {
      await deleteEmployee(employeeToDelete.id).unwrap();
      toast.success("Employee deleted successfully");
    } catch {
      toast.error("Failed to delete employee");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) return <Loading message="Loading Employees" />;

  if (isError)
    return <p className="p-6 text-red-500">Failed to fetch employees.</p>;

  return (
    <>
      <PageHeader
        title="Employee Management"
        icon={<Plus size={16} />}
        addLabel="Add Employee"
        onAdd={openCreateModal}
        permission="employee.create"
      />

      {/* Search Bar */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
            size={20}
          />
          <Input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-[#1e1e1e]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                <TableCell
                  isHeader
                  className="table-header hidden sm:table-cell"
                >
                  Employee Code
                </TableCell>
                <TableCell isHeader className="table-header">
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="table-header hidden md:table-cell"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="table-header hidden lg:table-cell"
                >
                  Phone
                </TableCell>
                <TableCell
                  isHeader
                  className="table-header hidden lg:table-cell"
                >
                  Department
                </TableCell>
                <TableCell
                  isHeader
                  className="table-header hidden xl:table-cell"
                >
                  Designation
                </TableCell>
                <TableCell
                  isHeader
                  className="table-header hidden xl:table-cell"
                >
                  Type
                </TableCell>
                <TableCell
                  isHeader
                  className="table-header hidden sm:table-cell"
                >
                  Status
                </TableCell>
                <TableCell isHeader className="table-header text-right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="table-body font-medium hidden sm:table-cell">
                      {employee.employee_code}
                    </TableCell>

                    <TableCell className="table-body">
                      <div>
                        <div className="font-medium">
                          {employee.first_name} {employee.last_name}
                        </div>
                        {/* Show employee code on mobile */}
                        <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {employee.employee_code}
                        </div>
                        {/* Show email on mobile/tablet */}
                        <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {employee.email}
                        </div>
                        {/* Show status badge on mobile */}
                        <div className="sm:hidden mt-1">
                          <Badge
                            size="sm"
                            color={getStatusColor(employee.status)}
                          >
                            {employee.status.charAt(0).toUpperCase() +
                              employee.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="table-body hidden md:table-cell">
                      {employee.email}
                    </TableCell>

                    <TableCell className="table-body hidden lg:table-cell">
                      {employee.phone}
                    </TableCell>

                    <TableCell className="table-body hidden lg:table-cell">
                      {employee.department?.name || "-"}
                    </TableCell>

                    <TableCell className="table-body hidden xl:table-cell">
                      {employee.designation?.title || "-"}
                    </TableCell>

                    <TableCell className="table-body hidden xl:table-cell">
                      <Badge
                        size="sm"
                        color={getEmployeeTypeColor(employee.employee_type)}
                      >
                        {employee.employee_type.replace("_", " ")}
                      </Badge>
                    </TableCell>

                    <TableCell className="table-body hidden sm:table-cell">
                      <Badge size="sm" color={getStatusColor(employee.status)}>
                        {employee.status.charAt(0).toUpperCase() +
                          employee.status.slice(1)}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-2 py-3 sm:px-4">
                      <div className="flex justify-end gap-1">
                        {canView && (
                          <IconButton
                            icon={Eye}
                            tooltip="View"
                            onClick={() =>
                              navigate(`/employees/${employee.id}`)
                            }
                            color="green"
                          />
                        )}
                        {canUpdate && (
                          <IconButton
                            icon={Pencil}
                            tooltip="Edit"
                            onClick={() => openEditModal(employee)}
                            color="blue"
                          />
                        )}
                        {canDelete && (
                          <IconButton
                            icon={Trash2}
                            tooltip="Delete"
                            onClick={() => openDeleteDialog(employee)}
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
                    colSpan={9}
                    className="py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    {searchInput
                      ? "No employees match your search"
                      : "No employees found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {(canCreate || canUpdate) && (
        <EmployeeFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          employee={editEmployee}
        />
      )}

      {canDelete && (
        <ConfirmDialog
          isOpen={isDeleteModalOpen}
          title="Delete Employee"
          message={`Are you sure you want to delete "${employeeToDelete?.first_name} ${employeeToDelete?.last_name}"?`}
          confirmLabel="Yes, Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </>
  );
}
