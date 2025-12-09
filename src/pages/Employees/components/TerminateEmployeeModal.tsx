import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import { useTerminateEmployeeMutation } from "../../../features/employee/employeeApi";
import { Employee } from "../../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onSuccess?: () => void;
}

interface TerminateFormData {
  termination_date: string;
  reason: string;
}

export default function TerminateEmployeeModal({
  isOpen,
  onClose,
  employee,
  onSuccess,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [terminateEmployee] = useTerminateEmployeeMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TerminateFormData>();

  const onSubmit = async (data: TerminateFormData) => {
    if (!employee) return;

    setIsSubmitting(true);
    try {
      await terminateEmployee({
        id: employee.id,
        ...data,
      }).unwrap();

      toast.success("Employee terminated successfully");
      reset();
      onClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to terminate employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Terminate Employee"
      description={`This action will terminate ${employee?.first_name} ${employee?.last_name} (${employee?.employee_code})`}
      className="max-w-xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Termination Date *
          </label>
          <input
            type="date"
            {...register("termination_date", {
              required: "Termination date is required",
              min: {
                value: today,
                message: "Termination date cannot be in the past",
              },
            })}
            min={today}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          {errors.termination_date && (
            <p className="mt-1 text-sm text-red-500">
              {errors.termination_date.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Termination Reason *
          </label>
          <textarea
            {...register("reason", {
              required: "Termination reason is required",
              minLength: {
                value: 5,
                message: "Reason must be at least 5 characters",
              },
            })}
            rows={4}
            placeholder="Please provide a detailed reason for termination..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white resize-none"
          />
          {errors.reason && (
            <p className="mt-1 text-sm text-red-500">{errors.reason.message}</p>
          )}
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Warning:</strong> This action cannot be undone. The employee
            will be marked as terminated and will lose access to the system.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            Terminate Employee
          </Button>
        </div>
      </form>
    </Modal>
  );
}
