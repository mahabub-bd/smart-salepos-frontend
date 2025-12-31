import { ReactNode, useEffect, useState } from "react";
import Select from "../../../../components/form/Select";
import DatePicker from "../../../../components/form/date-picker";


interface DateRangeOption {
  value: string;
  label: string;
}

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  label: string;
  value: string | number | undefined;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
  type?: "select" | "date";
}

interface ReportFiltersProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  dateRangeOptions?: DateRangeOption[];
  filters?: FilterConfig[];
  actions?: ReactNode;
}

export function useDateRangeOptions(): DateRangeOption[] {
  return [
    { value: "custom", label: "Custom Range" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "this_week", label: "This Week" },
    { value: "last_week", label: "Last Week" },
    { value: "this_month", label: "This Month" },
    { value: "last_month", label: "Last Month" },
    { value: "this_quarter", label: "This Quarter" },
    { value: "last_quarter", label: "Last Quarter" },
    { value: "this_year", label: "This Year" },
    { value: "last_year", label: "Last Year" },
  ];
}

export function useDateRangeCalculation(dateRange: string) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!dateRange || dateRange === "custom") return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let start: Date | null = null;
    let end: Date | null = null;

    switch (dateRange) {
      case "today":
        start = today;
        end = today;
        break;
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        start = yesterday;
        end = yesterday;
        break;
      case "this_week":
        const dayOfWeek = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        start = startOfWeek;
        end = endOfWeek;
        break;
      case "last_week":
        const startOfLastWeek = new Date(today);
        const lastWeekDay = today.getDay();
        startOfLastWeek.setDate(today.getDate() - lastWeekDay - 7);
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
        start = startOfLastWeek;
        end = endOfLastWeek;
        break;
      case "this_month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "last_month":
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case "this_quarter":
        const quarter = Math.floor(now.getMonth() / 3);
        start = new Date(now.getFullYear(), quarter * 3, 1);
        end = new Date(now.getFullYear(), quarter * 3 + 3, 0);
        break;
      case "last_quarter":
        const lastQuarter = Math.floor((now.getMonth() - 3) / 3);
        start = new Date(now.getFullYear(), lastQuarter * 3, 1);
        end = new Date(now.getFullYear(), lastQuarter * 3 + 3, 0);
        break;
      case "this_year":
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
        break;
      case "last_year":
        start = new Date(now.getFullYear() - 1, 0, 1);
        end = new Date(now.getFullYear() - 1, 11, 31);
        break;
    }

    setStartDate(start);
    setEndDate(end);
  }, [dateRange]);

  return { startDate, endDate };
}

export default function ReportFilters({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  dateRange,
  onDateRangeChange,
  dateRangeOptions,
  filters = [],
  actions,
}: ReportFiltersProps) {
  const defaultDateRangeOptions = useDateRangeOptions();
  const options = dateRangeOptions || defaultDateRangeOptions;

  const handleStartDateChange = (dates: Date | Date[] | null) => {
    if (Array.isArray(dates)) {
      onStartDateChange(dates[0] || null);
    } else {
      onStartDateChange(dates);
    }
  };

  const handleEndDateChange = (dates: Date | Date[] | null) => {
    if (Array.isArray(dates)) {
      onEndDateChange(dates[0] || null);
    } else {
      onEndDateChange(dates);
    }
  };

  // Calculate grid columns based on number of filters
  const filterCount = 3 + filters.length; // date range + start date + end date + filters
  const gridCols =
    filterCount <= 4
      ? "md:grid-cols-2 lg:grid-cols-4"
      : filterCount <= 6
      ? "md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6"
      : "md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7";

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <div className={`grid grid-cols-1 gap-4 ${gridCols}`}>
        {/* Date Range Preset */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date Range
          </label>
          <Select
            value={dateRange}
            onChange={onDateRangeChange}
            options={options}
            placeholder="Select range"
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Start Date
          </label>
          <DatePicker
            id="report-start-date"
            value={startDate}
            onChange={handleStartDateChange}
            placeholder="Select start date"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            End Date
          </label>
          <DatePicker
            id="report-end-date"
            value={endDate}
            onChange={handleEndDateChange}
            placeholder="Select end date"
          />
        </div>

        {/* Additional Filters */}
        {filters.map((filter, index) => (
          <div key={index}>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {filter.label}
            </label>
            <Select
              value={filter.value?.toString() || ""}
              onChange={filter.onChange}
              options={filter.options}
              placeholder={filter.placeholder || `Select ${filter.label}`}
            />
          </div>
        ))}

        {/* Actions */}
        {actions && <div className="flex items-end">{actions}</div>}
      </div>
    </div>
  );
}
