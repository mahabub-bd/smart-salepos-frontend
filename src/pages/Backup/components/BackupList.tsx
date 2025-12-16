import {
  Calendar,
  Download,
  FileText,
  HardDrive,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

import ConfirmDialog from "../../../components/common/ConfirmDialog";
import Loading from "../../../components/common/Loading";
import PageHeader from "../../../components/common/PageHeader";
import { SelectField } from "../../../components/form/form-elements/SelectFiled";
import Input from "../../../components/form/input/InputField";
import Badge from "../../../components/ui/badge/Badge";
import Button from "../../../components/ui/button";

import { Dropdown } from "../../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../../components/ui/dropdown/DropdownItem";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Backup,
  BackupStatus,
  BackupType,
  useCreateBackupMutation,
  useDeleteBackupMutation,
  useDownloadBackupMutation,
  useListBackupsQuery,
  useRestoreBackupMutation,
} from "../../../features/backup/backupApi";
import { useHasPermission } from "../../../hooks/useHasPermission";
import { formatDateTime } from "../../../utlis";
import BackupFormModal from "./BackupFormModal";
import RestoreBackupModal from "./RestoreBackupModal";
import ScheduleList from "./ScheduleList";

export default function BackupList() {
  /* ================= FILTER STATES ================= */
  const [searchInput, setSearchInput] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  /* ================= MODAL STATES ================= */
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [backupToDelete, setBackupToDelete] = useState<Backup | null>(null);
  const [showSchedules, setShowSchedules] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  /* ================= API ================= */
  const queryParams = {
    page: currentPage,
    limit,
    status: (selectedStatus as BackupStatus) || undefined,
    type: (selectedType as BackupType) || undefined,
  };

  const { data, isLoading, isError, error } = useListBackupsQuery(queryParams);
  const [createBackup] = useCreateBackupMutation();
  const [deleteBackup] = useDeleteBackupMutation();
  const [downloadBackup] = useDownloadBackupMutation();
  const [restoreBackup] = useRestoreBackupMutation();

  /* ================= PERMISSIONS ================= */
  const canCreate = useHasPermission("backup.create");
  const canDelete = useHasPermission("backup.delete");
  const canDownload = useHasPermission("backup.download");
  const canRestore = useHasPermission("backup.restore");

  /* ================= DATA ================= */
  const backupsData = data?.data;
  const backups = backupsData?.backups || [];
  const total = backupsData?.total || 0;
  const totalPages = Math.ceil(total / limit);

  /* ================= DERIVED ================= */
  const filteredBackups = useMemo(() => {
    if (!searchInput) return backups;

    const search = searchInput.toLowerCase();
    return backups.filter(
      (backup) =>
        backup.filename.toLowerCase().includes(search) ||
        backup.type.toLowerCase().includes(search) ||
        backup.status.toLowerCase().includes(search)
    );
  }, [backups, searchInput]);

  const getStatusColor = (status: BackupStatus) => {
    switch (status) {
      case BackupStatus.COMPLETED:
        return "success";
      case BackupStatus.IN_PROGRESS:
        return "warning";
      case BackupStatus.FAILED:
        return "error";
      case BackupStatus.PENDING:
        return "info";
      default:
        return "light";
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

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  /* ================= HANDLERS ================= */
  const handleCreateBackup = async (data: any) => {
    try {
      await createBackup(data).unwrap();
      toast.success("Backup created successfully");
      setIsCreateModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create backup");
    }
  };

  const handleDownload = async (backup: Backup) => {
    try {
      const response = await downloadBackup(backup.id).unwrap();
      // Create download link
      const url = window.URL.createObjectURL(response);
      const link = document.createElement("a");
      link.href = url;
      link.download = backup.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Backup downloaded successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to download backup");
    }
  };

  const confirmDelete = async () => {
    if (!backupToDelete) return;
    try {
      await deleteBackup(backupToDelete.id).unwrap();
      toast.success("Backup deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete backup");
    } finally {
      setIsDeleteModalOpen(false);
      setBackupToDelete(null);
    }
  };

  const handleRestore = async (backupId: string, confirm: boolean) => {
    try {
      await restoreBackup({ backup_id: backupId, confirm }).unwrap();
      toast.success("Database restored successfully");
      setIsRestoreModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to restore database");
    }
  };

  if (isLoading && currentPage === 1)
    return <Loading message="Loading Backup Records" />;
  if (isError)
    return (
      <div className="p-6 text-red-500">
        <p>Failed to load backups.</p>
        <p className="text-sm">{JSON.stringify(error)}</p>
      </div>
    );

  return (
    <>
      <PageHeader
        title="Database Backup"
        icon={<Plus size={16} />}
        addLabel="Create Backup"
        onAdd={() => setIsCreateModalOpen(true)}
        permission="backup.create"
      />

      {/* ================= TABS ================= */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setShowSchedules(false)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${!showSchedules
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
            >
              <div className="flex items-center gap-2">
                <HardDrive size={16} />
                Backups
              </div>
            </button>
            <button
              onClick={() => setShowSchedules(true)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${showSchedules
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
            >
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                Scheduled Backups
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* ================= FILTERS ================= */}
      {!showSchedules && (
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search backups..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full"
            />
          </div>

          <SelectField
            label=""
            placeholder="All Status"
            value={selectedStatus}
            onChange={setSelectedStatus}
            data={[
              { id: "", name: "All Status" },
              { id: BackupStatus.PENDING, name: "Pending" },
              { id: BackupStatus.IN_PROGRESS, name: "In Progress" },
              { id: BackupStatus.COMPLETED, name: "Completed" },
              { id: BackupStatus.FAILED, name: "Failed" },
            ]}
          />

          <SelectField
            label=""
            placeholder="All Types"
            value={selectedType}
            onChange={setSelectedType}
            data={[
              { id: "", name: "All Types" },
              { id: BackupType.FULL, name: "Full Backup" },
              { id: BackupType.SELECTIVE, name: "Selective Backup" },
            ]}
          />
        </div>
      )}

      {/* ================= CONTENT ================= */}
      {!showSchedules ? (
        /* BACKUPS LIST */
        <div className="overflow-hidden rounded-xl border bg-white dark:bg-[#1e1e1e] dark:border-white/5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader>Backup Name</TableCell>
                <TableCell isHeader>Type</TableCell>
                <TableCell isHeader>Status</TableCell>
                <TableCell isHeader>Size</TableCell>
                <TableCell isHeader>Created</TableCell>
                <TableCell isHeader>Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredBackups.length ? (
                filteredBackups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium">{backup.filename}</div>
                          {backup.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {backup.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge color={getTypeColor(backup.type)} size="sm">
                        {backup.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge color={getStatusColor(backup.status)} size="sm">
                        {backup.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatFileSize(backup.file_size)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          {formatDateTime(backup.created_at)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDateTime(backup.created_at)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenDropdownId(
                                openDropdownId === backup.id ? null : backup.id
                              )
                            }
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          <Dropdown
                            isOpen={openDropdownId === backup.id}
                            onClose={() => setOpenDropdownId(null)}
                            className="min-w-40"
                          >
                            {canDownload &&
                              backup.status === BackupStatus.COMPLETED && (
                                <DropdownItem
                                  onClick={() => {
                                    handleDownload(backup);
                                    setOpenDropdownId(null);
                                  }}
                                  className="flex items-center gap-2"
                                >
                                  <Download size={16} />
                                  Download
                                </DropdownItem>
                              )}
                            {canRestore &&
                              backup.status === BackupStatus.COMPLETED && (
                                <DropdownItem
                                  onClick={() => {
                                    setIsRestoreModalOpen(true);
                                    setOpenDropdownId(null);
                                  }}
                                  className="flex items-center gap-2"
                                >
                                  <RefreshCw size={16} />
                                  Restore
                                </DropdownItem>
                              )}
                            {canDelete && (
                              <DropdownItem
                                onClick={() => {
                                  setBackupToDelete(backup);
                                  setIsDeleteModalOpen(true);
                                  setOpenDropdownId(null);
                                }}
                                className="flex items-center gap-2 text-red-600 dark:text-red-400"
                              >
                                <Trash2 size={16} />
                                Delete
                              </DropdownItem>
                            )}
                          </Dropdown>
                        </div>
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
                    No backup records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing {(currentPage - 1) * limit + 1} to{" "}
                  {Math.min(currentPage * limit, total)} of {total} results
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* SCHEDULED BACKUPS */
        <ScheduleList />
      )}

      {/* ================= MODALS ================= */}
      {canCreate && (
        <BackupFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateBackup}
        />
      )}

      {canRestore && (
        <RestoreBackupModal
          isOpen={isRestoreModalOpen}
          onClose={() => setIsRestoreModalOpen(false)}
          onConfirm={handleRestore}
          backups={backups.filter((b) => b.status === BackupStatus.COMPLETED)}
        />
      )}

      {canDelete && (
        <ConfirmDialog
          isOpen={isDeleteModalOpen}
          title="Delete Backup"
          message={`Are you sure you want to delete "${backupToDelete?.filename}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setBackupToDelete(null);
          }}
        />
      )}
    </>
  );
}
