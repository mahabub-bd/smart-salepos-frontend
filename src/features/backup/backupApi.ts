import { ApiResponse } from "../../types";
import { Backup, BackupSchedule, CreateBackupDto, ListBackupsParams, ListSchedulesParams, RestoreBackupDto, ScheduleBackupDto } from "../../types/backup";
import { apiSlice } from "../apiSlice";



export const backupApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE BACKUP
    createBackup: builder.mutation<ApiResponse<Backup>, CreateBackupDto>({
      query: (body) => ({
        url: "/backup/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Backup"],
    }),

    // LIST BACKUPS
    listBackups: builder.query<
      ApiResponse<{
        backups: Backup[];
        total: number;
        page: number;
        limit: number;
      }>,
      ListBackupsParams
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.status) queryParams.append("status", params.status);
        if (params?.type) queryParams.append("type", params.type);

        return {
          url: `/backup/list${
            queryParams.toString() ? `?${queryParams.toString()}` : ""
          }`,
          method: "GET",
        };
      },
      providesTags: ["Backup"],
    }),

    // GET BACKUP BY ID
    getBackup: builder.query<ApiResponse<Backup>, string>({
      query: (id) => ({
        url: `/backup/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Backup", id }],
    }),

    // DELETE BACKUP
    deleteBackup: builder.mutation<void, string>({
      query: (id) => ({
        url: `/backup/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Backup"],
    }),

    // DOWNLOAD BACKUP
    downloadBackup: builder.mutation<Blob, string>({
      query: (id) => ({
        url: `/backup/${id}/download`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),

    // RESTORE BACKUP
    restoreBackup: builder.mutation<
      ApiResponse<{ message: string }>,
      RestoreBackupDto
    >({
      query: (body) => ({
        url: "/backup/restore",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Backup"],
    }),

    // SCHEDULE BACKUP
    scheduleBackup: builder.mutation<
      ApiResponse<BackupSchedule>,
      ScheduleBackupDto
    >({
      query: (body) => ({
        url: "/backup/schedule",
        method: "POST",
        body,
      }),
      invalidatesTags: ["BackupSchedule"],
    }),

    // LIST SCHEDULES
    listSchedules: builder.query<
      ApiResponse<{
        schedules: BackupSchedule[];
        total: number;
        page: number;
        limit: number;
      }>,
      ListSchedulesParams
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());

        return {
          url: `/backup/schedule/list${
            queryParams.toString() ? `?${queryParams.toString()}` : ""
          }`,
          method: "GET",
        };
      },
      providesTags: ["BackupSchedule"],
    }),

    // UPDATE SCHEDULE
    updateSchedule: builder.mutation<
      ApiResponse<BackupSchedule>,
      { id: string } & Partial<ScheduleBackupDto>
    >({
      query: ({ id, ...body }) => ({
        url: `/backup/schedule/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "BackupSchedule",
        { type: "BackupSchedule", id },
      ],
    }),

    // TOGGLE SCHEDULE
    toggleSchedule: builder.mutation<ApiResponse<BackupSchedule>, string>({
      query: (id) => ({
        url: `/backup/schedule/${id}/toggle`,
        method: "PUT",
      }),
      invalidatesTags: (_result, _error, id) => [
        "BackupSchedule",
        { type: "BackupSchedule", id },
      ],
    }),

    // DELETE SCHEDULE
    deleteSchedule: builder.mutation<void, string>({
      query: (id) => ({
        url: `/backup/schedule/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BackupSchedule"],
    }),

    // PROCESS SCHEDULED BACKUPS (Admin only)
    processScheduledBackups: builder.mutation<
      ApiResponse<{ message: string }>,
      void
    >({
      query: () => ({
        url: "/backup/process-scheduled",
        method: "POST",
      }),
      invalidatesTags: ["Backup"],
    }),

    // CLEANUP OLD BACKUPS (Admin only)
    cleanupOldBackups: builder.mutation<ApiResponse<{ message: string }>, void>(
      {
        query: () => ({
          url: "/backup/cleanup",
          method: "POST",
        }),
        invalidatesTags: ["Backup"],
      }
    ),
  }),
});

export const {
  useCreateBackupMutation,
  useListBackupsQuery,
  useGetBackupQuery,
  useDeleteBackupMutation,
  useDownloadBackupMutation,
  useRestoreBackupMutation,
  useScheduleBackupMutation,
  useListSchedulesQuery,
  useUpdateScheduleMutation,
  useToggleScheduleMutation,
  useDeleteScheduleMutation,
  useProcessScheduledBackupsMutation,
  useCleanupOldBackupsMutation,
} = backupApi;
