import { Pencil, Plus, Search, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import ConfirmDialog from "../../../../components/common/ConfirmDialog";
import IconButton from "../../../../components/common/IconButton";
import Loading from "../../../../components/common/Loading";
import PageHeader from "../../../../components/common/PageHeader";
import DatePicker from "../../../../components/form/date-picker";
import Input from "../../../../components/form/input/InputField";
import { SelectField } from "../../../../components/form/form-elements/SelectFiled";
import Badge from "../../../../components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import {
  useDeleteAttendanceMutation,
  useGetAttendanceByIdQuery,
  useGetAttendanceListQuery,
} from "../../../../features/attendance/attendanceApi";
import { useGetBranchesQuery } from "../../../../features/branch/branchApi";
import { useGetEmployeesQuery } from "../../../../features/employee/employeeApi";
import { useHasPermission } from "../../../../hooks/useHasPermission";
import { AttendanceRecord } from "../../../../types";
import { getStatusColorAttendence } from "../../../../utlis";
import AttendanceFormModal from "./AttendanceFormModal";
import BulkAttendanceModal from "./BulkAttendanceModal";
import CheckInOutModal from "./CheckInOutModal";

export default function AttendanceList() {
  const [searchInput, setSearchInput] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCheckInOutModalOpen, setIsCheckInOutModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editAttendanceId, setEditAttendanceId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [attendanceToDelete, setAttendanceToDelete] =
    useState<AttendanceRecord | null>(null);

  const { data, isLoading, isError } = useGetAttendanceListQuery({
    employee_id: selectedEmployee ? Number(selectedEmployee) : undefined,
    branch_id: selectedBranch ? Number(selectedBranch) : undefined,
    status: selectedStatus as any,
    start_date: startDate ? startDate.toISOString().split("T")[0] : undefined,
    end_date: endDate ? endDate.toISOString().split("T")[0] : undefined,
  });

  const { data: employeesData } = useGetEmployeesQuery();
  const { data: branchesData } = useGetBranchesQuery();
  const { data: editAttendanceData, isFetching: isEditAttendanceFetching } =
    useGetAttendanceByIdQuery(editAttendanceId ?? "", {
      skip: !editAttendanceId,
      refetchOnMountOrArgChange: true,
    });
  const [deleteAttendance] = useDeleteAttendanceMutation();

  const canCreate = useHasPermission("attendance.create");
  const canUpdate = useHasPermission("attendance.update");
  const canDelete = useHasPermission("attendance.delete");

  const attendanceRecords = data?.data || [];
  const employees = employeesData?.data || [];
  const branches = branchesData?.data || [];
  

  // Filter attendance based on search input
  const filteredAttendance = attendanceRecords.filter((record) => {
    const searchLower = searchInput.toLowerCase();
    const employeeName = record.employee
      ? `${record.employee.first_name} ${record.employee.last_name}`.toLowerCase()
      : "";
    return (
      employeeName.includes(searchLower) ||
      record.date?.toLowerCase().includes(searchLower) ||
      record.status?.toLowerCase().includes(searchLower)
    );
  });

  const openEditModal = (attendance: AttendanceRecord) => {
    setEditAttendanceId(attendance.id);
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (attendance: AttendanceRecord) => {
    setAttendanceToDelete(attendance);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!attendanceToDelete) return;
    try {
      await deleteAttendance(attendanceToDelete.id).unwrap();
      toast.success("Attendance deleted successfully");
    } catch {
      toast.error("Failed to delete attendance");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) return <Loading message="Loading Attendance Records" />;

  if (isError)
    return (
      <p className="p-6 text-red-500">Failed to fetch attendance records.</p>
    );

  return (
    <>
      <PageHeader
        title="Attendance Management"
        icon={<Plus size={16} />}
        addLabel="Check In/Out"
        onAdd={() => setIsCheckInOutModalOpen(true)}
        permission="attendance.create"
      />

      {/* Filters */}
      <div className="mb-4 space-y-4">
        {/* Search Bar */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
              size={20}
            />
            <Input
              type="text"
              placeholder="Search by employee name or date..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>

          {canCreate && (
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
            >
              <Upload size={16} />
              Bulk Upload
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <SelectField
            label=""
            value={selectedEmployee}
            onChange={(value) => setSelectedEmployee(value)}
            data={[
              { id: "", name: "All Employees" },
              ...employees.map((emp) => ({
                id: emp.id,
                name: `${emp.first_name} ${emp.last_name}`,
              })),
            ]}
          />

          <SelectField
            label=""
            value={selectedBranch}
            onChange={(value) => setSelectedBranch(value)}
            data={[
              { id: "", name: "All Branches" },
              ...branches.map((branch) => ({
                id: branch.id,
                name: branch.name,
              })),
            ]}
          />

          <SelectField
            label=""
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value)}
            data={[
              { id: "", name: "All Status" },
              { id: "present", name: "Present" },
              { id: "absent", name: "Absent" },
              { id: "late", name: "Late" },
              { id: "half_day", name: "Half Day" },
              { id: "leave", name: "Leave" },
            ]}
          />

          <DatePicker
            id="attendance-start-date"
            mode="single"
            value={startDate}
            onChange={(date) => setStartDate(date as Date | null)}
            placeholder="Start Date"
            disableFuture={false}
          />

          <DatePicker
            id="attendance-end-date"
            mode="single"
            value={endDate}
            onChange={(date) => setEndDate(date as Date | null)}
            placeholder="End Date"
            disableFuture={false}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-[#1e1e1e]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                <TableCell isHeader>Employee</TableCell>
                <TableCell isHeader className="hidden sm:table-cell">
                  Date
                </TableCell>
                <TableCell isHeader className="hidden md:table-cell">
                  Check In
                </TableCell>
                <TableCell isHeader className="hidden md:table-cell">
                  Check Out
                </TableCell>
                <TableCell isHeader className="hidden lg:table-cell">
                  Regular Hours
                </TableCell>
                <TableCell isHeader className="hidden xl:table-cell">
                  Overtime
                </TableCell>
                <TableCell isHeader>Status</TableCell>
                <TableCell isHeader className="text-right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredAttendance.length > 0 ? (
                filteredAttendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="table-body font-medium">
                      <div>
                        <div>
                          {record.employee
                            ? `${record.employee.first_name} ${record.employee.last_name}`
                            : "N/A"}
                        </div>
                        {/* Show date on mobile */}
                        <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {new Date(record.date).toLocaleDateString()}
                        </div>
                        {/* Show check-in/out on mobile */}
                        <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          In: {record.check_in} | Out: {record.check_out}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="table-body hidden sm:table-cell">
                      {new Date(record.date).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="table-body hidden md:table-cell">
                      {record.check_in}
                    </TableCell>

                    <TableCell className="table-body hidden md:table-cell">
                      {record.check_out}
                    </TableCell>

                    <TableCell className="table-body hidden lg:table-cell">
                      {record.regular_hours || "0.00"} hrs
                    </TableCell>

                    <TableCell className="table-body hidden xl:table-cell">
                      {record.overtime_hours || "0.00"} hrs
                    </TableCell>

                    <TableCell className="table-body">
                      <Badge
                        color={getStatusColorAttendence(record.status)}
                        size="sm"
                      >
                        {record.status.charAt(0).toUpperCase() +
                          record.status.slice(1)}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-2 py-3 sm:px-4">
                      <div className="flex justify-end gap-1">
                        {canUpdate && (
                          <IconButton
                            icon={Pencil}
                            tooltip="Edit"
                            onClick={() => openEditModal(record)}
                            color="blue"
                          />
                        )}
                        {canDelete && (
                          <IconButton
                            tooltip="Delete"
                            icon={Trash2}
                            onClick={() => openDeleteDialog(record)}
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
                    {searchInput
                      ? "No attendance records match your search"
                      : "No attendance records found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {canCreate && (
        <CheckInOutModal
          isOpen={isCheckInOutModalOpen}
          onClose={() => setIsCheckInOutModalOpen(false)}
        />
      )}

      {canCreate && (
        <BulkAttendanceModal
          isOpen={isBulkModalOpen}
          onClose={() => setIsBulkModalOpen(false)}
        />
      )}

      {canUpdate && (
        <AttendanceFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditAttendanceId(null);
          }}
          attendance={
            isEditAttendanceFetching ? null : editAttendanceData?.data || null
          }
          onSuccess={() => {
            setIsEditModalOpen(false);
            setEditAttendanceId(null);
          }}
        />
      )}

      {canDelete && (
        <ConfirmDialog
          isOpen={isDeleteModalOpen}
          title="Delete Attendance"
          message={`Are you sure you want to delete this attendance record?`}
          confirmLabel="Yes, Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </>
  );
}
