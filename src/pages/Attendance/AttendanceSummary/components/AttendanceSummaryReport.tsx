import { FileText } from "lucide-react";
import { useState } from "react";
import Loading from "../../../../components/common/Loading";
import PageHeader from "../../../../components/common/PageHeader";
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
      <PageHeader title="Attendance Summary Report" icon={<FileText size={16} />} />

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Date and Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
              Start Date
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
              End Date
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
              Branch
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#1e1e1e] dark:border-white/10 dark:text-white"
            >
              <option value="">All Branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#1e1e1e] dark:border-white/10 dark:text-white"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
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
                {summaryData.total_days}
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
                {summaryData.total_days > 0
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
