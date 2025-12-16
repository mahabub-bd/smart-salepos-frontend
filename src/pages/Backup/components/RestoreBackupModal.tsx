import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  FormField,
  SelectField,
} from "../../../components/form/form-elements/SelectFiled";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import { Backup } from "../../../features/backup/backupApi";

interface RestoreBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (backupId: string, confirm: boolean) => void;
  backups: Backup[];
}

export default function RestoreBackupModal({
  isOpen,
  onClose,
  onConfirm,
  backups
}: RestoreBackupModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const watchBackupId = watch("backup_id");

  const handleBackupChange = (value: string) => {
    setSelectedBackup(value);
    setValue("backup_id", value, { shouldValidate: true });
    setIsConfirmed(false);
  };

  const handleFormSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await onConfirm(data.backup_id, isConfirmed);
      reset();
      setIsConfirmed(false);
      setSelectedBackup("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      reset();
      setIsConfirmed(false);
      setSelectedBackup("");
      onClose();
    }
  };

  const selectedBackupData = backups.find(b => b.id === selectedBackup);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-lg">
      <div className="m-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Restore Database Backup
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
          {/* Warning Message */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                  Warning: This will restore the database
                </p>
                <p className="mt-1 text-yellow-700 dark:text-yellow-300">
                  Restoring from a backup will overwrite all current data. This action cannot be undone.
                  Make sure you have a recent backup before proceeding.
                </p>
              </div>
            </div>
          </div>

          <SelectField
            label="Select Backup to Restore"
            placeholder="Choose a backup"
            value={selectedBackup}
            error={errors.backup_id?.message as string}
            onChange={handleBackupChange}
            data={backups.map((backup) => ({
              id: backup.id,
              name: `${backup.filename} (${new Date(backup.created_at).toLocaleDateString()})`,
            }))}
          />

          {/* Selected Backup Details */}
          {selectedBackupData && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Backup Details:
              </h4>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <div><span className="font-medium">File:</span> {selectedBackupData.filename}</div>
                <div><span className="font-medium">Created:</span> {new Date(selectedBackupData.created_at).toLocaleString()}</div>
                <div><span className="font-medium">Size:</span> {(selectedBackupData.file_size / (1024 * 1024)).toFixed(2)} MB</div>
                {selectedBackupData.description && (
                  <div><span className="font-medium">Description:</span> {selectedBackupData.description}</div>
                )}
              </div>
            </div>
          )}

          {/* Confirmation Checkbox */}
          {watchBackupId && (
            <div className="space-y-3">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-red-800 dark:text-red-200">
                    <p className="font-medium">Final Confirmation Required</p>
                    <p className="mt-1">
                      Type "RESTORE" in the confirmation field to proceed with the database restore.
                    </p>
                  </div>
                </div>
              </div>

              <FormField
                label='Type "RESTORE" to confirm'
                error={errors.confirm?.message as string}
              >
                <input
                  type="text"
                  {...register("confirm", {
                    required: "Please type RESTORE to confirm",
                    validate: (value) => value === "RESTORE" || "Please type RESTORE exactly",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Type RESTORE"
                />
              </FormField>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !watchBackupId}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Restore Database
            </Button>
          </div>
        </form>
      </div >
    </Modal >
  );
}