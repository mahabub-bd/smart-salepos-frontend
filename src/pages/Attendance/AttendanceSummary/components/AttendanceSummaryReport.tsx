import { FileText } from "lucide-react";
import { useState } from "react";
import Loading from "../../../../components/common/Loading";
import PageHeader from "../../../../components/common/PageHeader";
import {
  FormField,
  SelectField,
} from "../../../../components/form/form-elements/SelectFiled";
import Input from "../../../../components/form/input/InputField";
import { useGetAttendanceSummaryQuery } from "../../../../features/attendance/attendanceApi";
import { useGetBranchesQuery } from "../../../../features/branch/branchApi";
import { useGetDepartmentsQuery } from "../../../../features/department/departmentApi";

export default function AttendanceSummaryReport() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  const { data, isLoading, isError } = useGetAttendanceSummaryQuery({
    start_date: startDate,
    end_date: endDate,
    branch_id: selectedBranch ? Number(selectedBranch) : undefined,
    department: selectedDepartment ? Number(selectedDepartment) : undefined,
  });

  const { data: branchesData } = useGetBranchesQuery();
  const { data: departmentsData } = useGetDepartmentsQuery();

  const summaryData = data?.data;
  const branches = branchesData?.data || [];
  const departments = departmentsData?.data || [];

  if (isLoading) return <Loading message="Loading Attendance Summary" />;

  if (isError)
    return (
      <p className="p-6 text-red-500">Failed to fetch attendance summary.</p>
    );

  return (
    <>
      <PageHeader
        title="Attendance Summary Report"
        icon={<FileText size={16} />}
      />

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Date and Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <FormField label="Start Date">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-sm"
            />
          </FormField>

          <FormField label="End Date">
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-sm"
            />
          </FormField>

          <SelectField
            label="Branch"
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
            label="Department"
            value={selectedDepartment}
            onChange={(value) => setSelectedDepartment(value)}
            data={[
              { id: "", name: "All Departments" },
              ...departments.map((dept) => ({
                id: dept.id,
                name: dept.name,
              })),
            ]}
          />
        </div>
      </div>

      {/* Summary Stats */}
      {summaryData && (
        <>
          <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/5">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Total Days
              </div>
              <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {summaryData.total_records}
              </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/5">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Total Employees
              </div>
              <div className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                {summaryData.total_employees}
              </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/5">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Total Regular Hours
              </div>
              <div className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
                {summaryData.total_regular_hours}
              </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/5">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Total Overtime
              </div>
              <div className="mt-1 text-2xl font-bold text-orange-600 dark:text-orange-400">
                {summaryData.total_overtime_hours}
              </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/5">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Attendance Rate
              </div>
              <div className="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">
                {summaryData.total_records > 0
                  ? (
                      (summaryData.status_breakdown.present /
                        (summaryData.status_breakdown.present +
                          summaryData.status_breakdown.absent +
                          summaryData.status_breakdown.late +
                          summaryData.status_breakdown.half_day)) *
                      100
                    ).toFixed(1)
                  : "0"}
                %
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-[#1e1e1e]">
            <div className="border-b border-gray-200 dark:border-white/5 p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Status Breakdown
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {summaryData.status_breakdown.present}
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Present
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {summaryData.status_breakdown.absent}
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Absent
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {summaryData.status_breakdown.late}
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Late
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {summaryData.status_breakdown.half_day}
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Half Day
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {summaryData.status_breakdown.on_leave}
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    On Leave
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {!summaryData && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-white/5 dark:bg-[#1e1e1e]">
          <p className="text-gray-500 dark:text-gray-400">
            No attendance summary data available for the selected period
          </p>
        </div>
      )}
    </>
  );
}
