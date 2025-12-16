import { X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Label from "../../../components/form/Label";
import { SelectField } from "../../../components/form/form-elements/SelectFiled";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";

interface BackupFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function BackupFormModal({
  isOpen,
  onClose,
  onSubmit,
}: BackupFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      reset();
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

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md">
      <div className="m-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Create New Backup
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
          <div>

            <Controller
              name="type"
              control={control}
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
          </div>

          <div>
            <Label>Description (Optional)</Label>
            <textarea
              placeholder="Enter backup description..."
              {...register("description")}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-hidden focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message as string}
              </p>
            )}
          </div>

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
              {isLoading ? "Creating..." : "Create Backup"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
