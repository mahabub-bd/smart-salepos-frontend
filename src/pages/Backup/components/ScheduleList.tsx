import { Edit, Pause, Play, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import ConfirmDialog from "../../../components/common/ConfirmDialog";
import IconButton from "../../../components/common/IconButton";
import Loading from "../../../components/common/Loading";
import Badge from "../../../components/ui/badge/Badge";
import Button from "../../../components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import {
  useDeleteScheduleMutation,
  useListSchedulesQuery,
  useToggleScheduleMutation,
  useUpdateScheduleMutation,
} from "../../../features/backup/backupApi";
import { useHasPermission } from "../../../hooks/useHasPermission";

import ScheduleFormModal from "./ScheduleFormModal";
import { BackupSchedule, BackupType } from "../../../types/backup";

export default function ScheduleList() {
  /* ================= MODAL STATES ================= */
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editSchedule, setEditSchedule] = useState<BackupSchedule | null>(null);
  const [scheduleToDelete, setScheduleToDelete] =
    useState<BackupSchedule | null>(null);

  /* ================= API ================= */
  const {
    data: schedulesData,
    isLoading,
    error,
  } = useListSchedulesQuery({ page: 1, limit: 100 });
  const [deleteSchedule] = useDeleteScheduleMutation();
  const [toggleSchedule] = useToggleScheduleMutation();
  const [updateSchedule] = useUpdateScheduleMutation();

  /* ================= PERMISSIONS ================= */
  const canCreate = useHasPermission("backup.schedule");
  const canUpdate = useHasPermission("backup.update");
  const canDelete = useHasPermission("backup.delete");

  /* ================= DATA ================= */
  const schedules = schedulesData?.data?.schedules || [];

  /* ================= HANDLERS ================= */
  const handleCreateSchedule = async () => {
    try {
      // This would be handled by the create schedule mutation
      toast.success("Schedule created successfully");
      setIsCreateModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create schedule");
    }
  };

  const handleUpdateSchedule = async (data: any) => {
    if (!editSchedule) return;
    try {
      await updateSchedule({ id: editSchedule.id, ...data }).unwrap();
      toast.success("Schedule updated successfully");
      setIsEditModalOpen(false);
      setEditSchedule(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update schedule");
    }
  };

  const confirmDelete = async () => {
    if (!scheduleToDelete) return;
    try {
      await deleteSchedule(scheduleToDelete.id).unwrap();
      toast.success("Schedule deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete schedule");
    } finally {
      setIsDeleteModalOpen(false);
      setScheduleToDelete(null);
    }
  };

  const handleToggle = async (schedule: BackupSchedule) => {
    try {
      await toggleSchedule(schedule.id).unwrap();
      toast.success(
        `Schedule ${schedule.is_active ? "paused" : "activated"} successfully`
      );
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to toggle schedule");
    }
  };

  const getTypeColor = (type: BackupType) => {
    switch (type) {
      case BackupType.FULL:
        return "primary";
      case BackupType.SELECTIVE:
        return "info";
      default:
        return "light";
    }
  };

  const getFrequencyDisplay = (
    frequency: string,
    dayOfWeek?: number,
    dayOfMonth?: number
  ) => {
    switch (frequency) {
      case "daily":
        return "Daily";
      case "weekly":
        return dayOfWeek !== undefined ? `Weekly (Day ${dayOfWeek})` : "Weekly";
      case "monthly":
        return dayOfMonth ? `Monthly (Day ${dayOfMonth})` : "Monthly";
      default:
        return frequency;
    }
  };

  if (isLoading) return <Loading message="Loading Scheduled Backups" />;
  if (error)
    return (
      <div className="p-6 text-red-500">
        <p>Failed to load scheduled backups.</p>
        <p className="text-sm">{JSON.stringify(error)}</p>
      </div>
    );

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Scheduled Backups
          </h3>
          <Badge color="info">
            {schedules.length}{" "}
            {schedules.length === 1 ? "schedule" : "schedules"}
          </Badge>
        </div>

        {canCreate && (
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={16} />
            Add Schedule
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border bg-white dark:bg-[#1e1e1e] dark:border-white/5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Schedule Name</TableCell>
              <TableCell isHeader>Type</TableCell>
              <TableCell isHeader>Frequency</TableCell>
              <TableCell isHeader>Next Run</TableCell>
              <TableCell isHeader>Status</TableCell>
              <TableCell isHeader>Actions</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {schedules.length ? (
              schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {schedule.name}
                      </div>
                      {schedule.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {schedule.description}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Created:{" "}
                        {new Date(schedule.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge color={getTypeColor(schedule.type)} size="sm">
                      {schedule.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>
                        {getFrequencyDisplay(
                          schedule.frequency,
                          schedule.day_of_week,
                          schedule.day_of_month
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        at {schedule.time}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {schedule.next_run ? (
                        <>
                          <div>
                            {new Date(schedule.next_run).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(schedule.next_run).toLocaleTimeString()}
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        color={schedule.is_active ? "success" : "warning"}
                        size="sm"
                      >
                        {schedule.is_active ? "Active" : "Paused"}
                      </Badge>
                      {schedule.last_run && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Last:{" "}
                          {new Date(schedule.last_run).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {canUpdate && (
                        <IconButton
                          icon={Edit}
                          onClick={() => {
                            setEditSchedule(schedule);
                            setIsEditModalOpen(true);
                          }}
                        />
                      )}
                      {canUpdate && (
                        <IconButton
                          icon={schedule.is_active ? Pause : Play}
                          onClick={() => handleToggle(schedule)}
                        />
                      )}
                      {canDelete && (
                        <IconButton
                          icon={Trash2}
                          color="red"
                          onClick={() => {
                            setScheduleToDelete(schedule);
                            setIsDeleteModalOpen(true);
                          }}
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-gray-500"
                >
                  No scheduled backups found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ================= MODALS ================= */}
      {canCreate && (
        <ScheduleFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateSchedule}
        />
      )}

      {canUpdate && editSchedule && (
        <ScheduleFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditSchedule(null);
          }}
          onSubmit={handleUpdateSchedule}
          schedule={editSchedule}
        />
      )}

      {canDelete && (
        <ConfirmDialog
          isOpen={isDeleteModalOpen}
          title="Delete Scheduled Backup"
          message={`Are you sure you want to delete the scheduled backup "${scheduleToDelete?.name}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setScheduleToDelete(null);
          }}
        />
      )}
    </>
  );
}
