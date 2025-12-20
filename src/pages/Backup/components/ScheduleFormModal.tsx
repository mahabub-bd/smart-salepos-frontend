import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  FormField,
  SelectField,
} from "../../../components/form/form-elements/SelectFiled";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import { BackupSchedule } from "../../../types/backup";

interface ScheduleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  schedule?: BackupSchedule | null;
}

export default function ScheduleFormModal({
  isOpen,
  onClose,
  onSubmit,
  schedule,
}: ScheduleFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const watchFrequency = watch("frequency");

  useEffect(() => {
    if (schedule) {
      reset({
        name: schedule.name,
        type: schedule.type,
        frequency: schedule.frequency,
        time: schedule.time,
        day_of_week: schedule.day_of_week?.toString(),
        day_of_month: schedule.day_of_month?.toString(),
        retention_days: schedule.retention_days.toString(),
        description: schedule.description,
      });
    } else {
      reset({
        type: "full",
        frequency: "daily",
        time: "02:00",
        retention_days: "30",
      });
    }
  }, [schedule, reset, isOpen]);

  const handleFormSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const transformedData = {
        ...data,
        ...(data.day_of_week && { day_of_week: parseInt(data.day_of_week) }),
        ...(data.day_of_month && { day_of_month: parseInt(data.day_of_month) }),
        ...(data.retention_days && {
          retention_days: parseInt(data.retention_days),
        }),
      };
      await onSubmit(transformedData);
      if (!schedule) {
        reset();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      reset();
      onClose();
    }
  };

  const frequencyOptions = [
    { id: "daily", name: "Daily" },
    { id: "weekly", name: "Weekly" },
    { id: "monthly", name: "Monthly" },
  ];

  const dayOfWeekOptions = Array.from({ length: 7 }, (_, i) => ({
    id: i.toString(),
    name: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][i],
  }));

  const dayOfMonthOptions = Array.from({ length: 31 }, (_, i) => ({
    id: (i + 1).toString(),
    name: `Day ${i + 1}`,
  }));

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md">
      <div className="m-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            {schedule ? "Edit Backup Schedule" : "Create Backup Schedule"}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <FormField
            label="Schedule Name"
            error={errors.name?.message as string}
          >
            <Input
              placeholder="Enter schedule name"
              {...register("name", { required: "Schedule name is required" })}
            />
          </FormField>

          <Controller
            control={control}
            name="type"
            rules={{ required: "Backup type is required" }}
            render={({ field: { onChange, value } }) => (
              <SelectField
                label="Backup Type"
                placeholder="Select backup type"
                value={value}
                onChange={onChange}
                error={errors.type?.message as string}
                data={[
                  { id: "full", name: "Full Database Backup" },
                  { id: "selective", name: "Selective Tables Backup" },
                ]}
              />
            )}
          />

          <Controller
            control={control}
            name="frequency"
            rules={{ required: "Frequency is required" }}
            render={({ field: { onChange, value } }) => (
              <SelectField
                label="Frequency"
                placeholder="Select frequency"
                value={value}
                onChange={(newValue) => {
                  onChange(newValue);
                  // Clear dependent fields when frequency changes
                  if (newValue !== "weekly") setValue("day_of_week", "");
                  if (newValue !== "monthly") setValue("day_of_month", "");
                }}
                error={errors.frequency?.message as string}
                data={frequencyOptions}
              />
            )}
          />

          {watchFrequency === "weekly" && (
            <Controller
              control={control}
              name="day_of_week"
              rules={{ required: "Day of week is required" }}
              render={({ field: { onChange, value } }) => (
                <SelectField
                  label="Day of Week"
                  placeholder="Select day of week"
                  value={value}
                  onChange={onChange}
                  error={errors.day_of_week?.message as string}
                  data={dayOfWeekOptions}
                />
              )}
            />
          )}

          {watchFrequency === "monthly" && (
            <Controller
              control={control}
              name="day_of_month"
              rules={{ required: "Day of month is required" }}
              render={({ field: { onChange, value } }) => (
                <SelectField
                  label="Day of Month"
                  placeholder="Select day of month"
                  value={value}
                  onChange={onChange}
                  error={errors.day_of_month?.message as string}
                  data={dayOfMonthOptions}
                />
              )}
            />
          )}

          <FormField label="Time" error={errors.time?.message as string}>
            <Input
              type="time"
              {...register("time", { required: "Time is required" })}
            />
          </FormField>

          <FormField
            label="Retention Days"
            error={errors.retention_days?.message as string}
          >
            <Input
              type="number"
              min="1"
              max="365"
              placeholder="Number of days to keep backups"
              {...register("retention_days", {
                required: "Retention days is required",
                min: { value: 1, message: "Minimum 1 day" },
                max: { value: 365, message: "Maximum 365 days" },
              })}
            />
          </FormField>

          <FormField
            label="Description (Optional)"
            error={errors.description?.message as string}
          >
            <TextArea
              placeholder="Enter schedule description..."
              value={watch("description")}
              onChange={(val) => setValue("description", val)}
              rows={3}
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {schedule ? "Update Schedule" : "Create Schedule"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
