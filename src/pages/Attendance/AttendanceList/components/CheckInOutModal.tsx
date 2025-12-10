import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Input from "../../../../components/form/input/InputField";
import {
  FormField,
  SelectField,
} from "../../../../components/form/form-elements/SelectFiled";
import { Modal } from "../../../../components/ui/modal";
import Button from "../../../../components/ui/button/Button";

import {
  useCheckInMutation,
  useCheckOutMutation,
} from "../../../../features/attendance/attendanceApi";
import { useGetEmployeesQuery } from "../../../../features/employee/employeeApi";
import { useGetBranchesQuery } from "../../../../features/branch/branchApi";

import { CheckInOutFormType, checkInOutSchema } from "./check-in-out.schema";

interface CheckInOutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckInOutModal({
  isOpen,
  onClose,
}: CheckInOutModalProps) {
  const [mode, setMode] = useState<"check_in" | "check_out">("check_in");

  const { data: employeesData } = useGetEmployeesQuery();
  const { data: branchesData } = useGetBranchesQuery();
  const [checkIn, { isLoading: isCheckingIn }] = useCheckInMutation();
  const [checkOut, { isLoading: isCheckingOut }] = useCheckOutMutation();

  const employees = employeesData?.data || [];
  const branches = branchesData?.data || [];

  // React Hook Form Initialization
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CheckInOutFormType>({
    resolver: zodResolver(checkInOutSchema),
    defaultValues: {
      employee_id: "",
      branch_id: "",
      check_in_time: "",
      check_out_time: "",
    },
  });

  // Reset form when modal opens or mode changes
  useEffect(() => {
    if (isOpen) {
      reset({
        employee_id: "",
        branch_id: "",
        check_in_time: "",
        check_out_time: "",
      });
    }
  }, [isOpen, reset]);

  const onSubmit = async (values: CheckInOutFormType) => {
    try {
      if (mode === "check_in") {
        if (!values.check_in_time) {
          toast.error("Please enter check-in time");
          return;
        }

        await checkIn({
          employee_id: Number(values.employee_id),
          branch_id: Number(values.branch_id),
          check_in_time: values.check_in_time,
        }).unwrap();

        toast.success("Checked in successfully");
      } else {
        if (!values.check_out_time) {
          toast.error("Please enter check-out time");
          return;
        }

        await checkOut({
          employee_id: Number(values.employee_id),
          branch_id: Number(values.branch_id),
          check_out_time: values.check_out_time,
        }).unwrap();

        toast.success("Checked out successfully");
      }

      onClose();
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          `Failed to ${mode === "check_in" ? "check in" : "check out"}`
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md"
      title="Employee Attendance"
    >
      {/* Mode Toggle */}
      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("check_in")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
            mode === "check_in"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400"
          }`}
        >
          <LogIn size={18} />
          Check In
        </button>
        <button
          type="button"
          onClick={() => setMode("check_out")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
            mode === "check_out"
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              : "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400"
          }`}
        >
          <LogOut size={18} />
          Check Out
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Employee Select */}
        <Controller
          name="employee_id"
          control={control}
          render={({ field }) => (
            <SelectField
              label="Employee"
              data={employees.map((emp) => ({
                id: emp.id,
                name: `${emp.first_name} ${emp.last_name} - ${emp.employee_code}`,
              }))}
              value={field.value}
              onChange={field.onChange}
              error={errors.employee_id?.message}
            />
          )}
        />

        {/* Branch Select */}
        <Controller
          name="branch_id"
          control={control}
          render={({ field }) => (
            <SelectField
              label="Branch"
              data={branches}
              value={field.value}
              onChange={field.onChange}
              error={errors.branch_id?.message}
            />
          )}
        />

        {/* Time Input */}
        {mode === "check_in" ? (
          <Controller
            name="check_in_time"
            control={control}
            render={({ field }) => (
              <FormField
                label="Check In Time"
                error={errors.check_in_time?.message}
              >
                <Input
                  type="datetime-local"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormField>
            )}
          />
        ) : (
          <Controller
            name="check_out_time"
            control={control}
            render={({ field }) => (
              <FormField
                label="Check Out Time"
                error={errors.check_out_time?.message}
              >
                <Input
                  type="datetime-local"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormField>
            )}
          />
        )}

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
            disabled={isCheckingIn || isCheckingOut}
          >
            {isCheckingIn || isCheckingOut
              ? "Processing..."
              : mode === "check_in"
              ? "Check In"
              : "Check Out"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
