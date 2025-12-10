import { Edit, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Input from "../../../../components/form/input/InputField";
import { useUpdateAttendanceMutation } from "../../../../features/attendance/attendanceApi";
import { AttendanceRecord } from "../../../../types";
import Button from "../../../../components/ui/button/Button";

interface AttendanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendance: AttendanceRecord | null;
}

export default function AttendanceFormModal({
  isOpen,
  onClose,
  attendance,
}: AttendanceFormModalProps) {
  const [formData, setFormData] = useState({
    date: "",
    check_in: "",
    check_out: "",
    break_start: "",
    break_end: "",
    status: "present",
    notes: "",
  });

  const [updateAttendance, { isLoading }] = useUpdateAttendanceMutation();

  // Helper function to safely format datetime for input
  const formatDateTimeForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().slice(0, 16);
    } catch {
      return "";
    }
  };

  useEffect(() => {
    if (attendance) {
      setFormData({
        date: attendance.date,
        check_in: formatDateTimeForInput(attendance.check_in),
        check_out: formatDateTimeForInput(attendance.check_out),
        break_start: formatDateTimeForInput(attendance.break_start),
        break_end: formatDateTimeForInput(attendance.break_end),
        status: attendance.status,
        notes: attendance.notes || "",
      });
    }
  }, [attendance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!attendance) return;

    try {
      await updateAttendance({
        id: attendance.id,
        date: formData.date,
        check_in: formData.check_in || undefined,
        check_out: formData.check_out || undefined,
        break_start: formData.break_start || undefined,
        break_end: formData.break_end || undefined,
        status: formData.status as any,
        notes: formData.notes || undefined,
      }).unwrap();

      toast.success("Attendance updated successfully");
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update attendance");
    }
  };

  if (!isOpen || !attendance) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-[#1e1e1e]">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit className="text-blue-600 dark:text-blue-400" size={24} />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Edit Attendance Record
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-white/5"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Employee Info */}
        <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-white/5">
          <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Employee Information
          </h3>
          <div className="text-base font-semibold text-gray-900 dark:text-white">
            {attendance.employee
              ? `${attendance.employee.first_name} ${attendance.employee.last_name}`
              : "Unknown Employee"}
          </div>
          {attendance.employee?.employee_code && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Code: {attendance.employee.employee_code}
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
          </div>

          {/* Check In & Check Out */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Check In Time
              </label>
              <Input
                type="datetime-local"
                value={formData.check_in}
                onChange={(e) =>
                  setFormData({ ...formData, check_in: e.target.value })
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Check Out Time
              </label>
              <Input
                type="datetime-local"
                value={formData.check_out}
                onChange={(e) =>
                  setFormData({ ...formData, check_out: e.target.value })
                }
              />
            </div>
          </div>

          {/* Break Start & Break End */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Break Start
              </label>
              <Input
                type="datetime-local"
                value={formData.break_start}
                onChange={(e) =>
                  setFormData({ ...formData, break_start: e.target.value })
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Break End
              </label>
              <Input
                type="datetime-local"
                value={formData.break_end}
                onChange={(e) =>
                  setFormData({ ...formData, break_end: e.target.value })
                }
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#2a2a2a] dark:border-white/10 dark:text-white"
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="half_day">Half Day</option>
              <option value="leave">Leave</option>
            </select>
          </div>

          {/* Hours Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <div className="text-xs text-blue-700 dark:text-blue-400">
                Regular Hours
              </div>
              <div className="mt-1 text-lg font-semibold text-blue-900 dark:text-blue-300">
                {attendance.regular_hours || "0.00"} hrs
              </div>
            </div>

            <div className="rounded-lg bg-orange-50 p-3 dark:bg-orange-900/20">
              <div className="text-xs text-orange-700 dark:text-orange-400">
                Overtime Hours
              </div>
              <div className="mt-1 text-lg font-semibold text-orange-900 dark:text-orange-300">
                {attendance.overtime_hours || "0.00"} hrs
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#2a2a2a] dark:border-white/10 dark:text-white"
              placeholder="Add any additional notes..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Attendance"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
