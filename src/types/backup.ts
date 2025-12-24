import { TimestampFields } from ".";


export enum BackupType {
  FULL = 'full',
  SELECTIVE = 'selective',
}

export enum BackupStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

// ----------------------------------------------------------------------------
// Backup File
// ----------------------------------------------------------------------------

export interface Backup extends TimestampFields {
  id: string;

  filename: string;
  type: BackupType;
  status: BackupStatus;

  file_size: number;
  file_path: string;
  s3_url?: string;

  created_by: string;
  completed_at?: string;
  error_message?: string;

  tables?: string[];
  branch_id?: string;
  description?: string;
}

// ----------------------------------------------------------------------------
// Backup Schedule
// ----------------------------------------------------------------------------

export type BackupFrequency = 'daily' | 'weekly' | 'monthly';

export interface BackupSchedule extends TimestampFields {
  id: string;

  name: string;
  type: BackupType;
  frequency: BackupFrequency;
  time: string; // HH:mm

  day_of_week?: number;  // 0-6 (Sunday–Saturday)
  day_of_month?: number; // 1-31

  is_active: boolean;
  retention_days: number;

  tables?: string[];
  last_run?: string;
  next_run?: string;

  created_by: string;
  branch_id?: string;
  description?: string;
}
export interface CreateBackupDto {
  type?: BackupType;
  tables?: string[];
  description?: string;
}

export interface ScheduleBackupDto {
  name: string;
  type: BackupType;
  frequency: "daily" | "weekly" | "monthly";
  time: string;
  day_of_week?: number;
  day_of_month?: number;
  tables?: string[];
  retention_days?: number;
  description?: string;
}

export interface RestoreBackupDto {
  backup_id: string;
  confirm?: boolean;
}

export interface ListBackupsParams {
  page?: number;
  limit?: number;
  status?: BackupStatus;
  type?: BackupType;
}

export interface ListSchedulesParams {
  page?: number;
  limit?: number;
}