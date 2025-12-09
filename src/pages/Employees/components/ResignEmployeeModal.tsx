import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import { useResignEmployeeMutation } from "../../../features/employee/employeeApi";
import { Employee } from "../../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onSuccess?: () => void;
}

interface ResignFormData {
  resignation_date: string;
  reason: string;
  notes?: string;
}

export default function ResignEmployeeModal({
  isOpen,
  onClose,
  employee,
  onSuccess,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resignEmployee] = useResignEmployeeMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResignFormData>();

  const onSubmit = async (data: ResignFormData) => {
    if (!employee) return;

    setIsSubmitting(true);
    try {
      await resignEmployee({
        id: employee.id,
        ...data,
      }).unwrap();

      toast.success("Employee resignation processed successfully");
      reset();
      onClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to process employee resignation");
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
      title="Process Employee Resignation"
      description={`Process resignation for ${employee?.first_name} ${employee?.last_name} (${employee?.employee_code})`}
      className="max-w-xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Resignation Date *
          </label>
          <input
            type="date"
            {...register("resignation_date", {
              required: "Resignation date is required",
              min: {
                value: today,
                message: "Resignation date cannot be in the past",
              },
            })}
            min={today}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          {errors.resignation_date && (
            <p className="mt-1 text-sm text-red-500">
              {errors.resignation_date.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Resignation Reason *
          </label>
          <textarea
            {...register("reason", {
              required: "Resignation reason is required",
              minLength: {
                value: 5,
                message: "Reason must be at least 5 characters",
              },
            })}
            rows={3}
            placeholder="e.g., Accepted new job opportunity, Personal reasons, Further education..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white resize-none"
          />
          {errors.reason && (
            <p className="mt-1 text-sm text-red-500">{errors.reason.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Additional Notes
          </label>
          <textarea
            {...register("notes")}
            rows={2}
            placeholder="Any additional notes about the employee's contribution or transition..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white resize-none"
          />
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> This will mark the employee as resigned.
            Their access will be automatically revoked on the resignation date.
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
            Process Resignation
          </Button>
        </div>
      </form>
    </Modal>
  );
}
