import {
  Calculator,
  DollarSign,
  Package,
  Percent,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import Loading from "@/components/common/Loading";
import PageHeader from "@/components/common/PageHeader";

import StatCard from "@/components/ui/badge/StatCard";
import Button from "@/components/ui/button";
import { useLazyGetProfitLossReportQuery } from "@/features/report/reportApi";
import { ProfitLossReportData } from "@/types/report";
import ReportFilters, {
  useDateRangeCalculation,
} from "../common/ReportFilters";
import { useBranchOptions } from "../hooks/useBranchOptions";

export default function ProfitLossReportView() {
  const [dateRange, setDateRange] = useState<string>("custom");
  const [branchId, setBranchId] = useState<number | undefined>();

  const [fetchReport, { data, isLoading, isError }] =
    useLazyGetProfitLossReportQuery();

  // Auto-calculate dates based on date range preset
  const { startDate: autoStartDate, endDate: autoEndDate } =
    useDateRangeCalculation(dateRange);

  // Fetch branches
  const branchOptions = useBranchOptions();

  const handleGenerateReport = async () => {
    if (!autoStartDate || !autoEndDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    try {
      await fetchReport({
        start_date: autoStartDate.toISOString().split("T")[0],
        end_date: autoEndDate.toISOString().split("T")[0],
        branch_id: branchId,
      }).unwrap();

      toast.success("Profit & Loss report generated successfully");
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to generate profit & loss report"
      );
    }
  };

  const reportData = data?.data as ProfitLossReportData | undefined;

  return (
    <>
      <PageHeader
        title="Profit & Loss Report"
        subtitle="Generate and view profit & loss reports"
      />

      {/* Filters */}
      <ReportFilters
        startDate={autoStartDate}
        endDate={autoEndDate}
        onStartDateChange={() => {}}
        onEndDateChange={() => {}}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        filters={[
          {
            label: "Branch",
            value: branchId?.toString() || "",
            onChange: (val) => setBranchId(val ? parseInt(val) : undefined),
            options: branchOptions,
            placeholder: "All Branches",
          },
        ]}
        actions={
          <Button
            onClick={handleGenerateReport}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Generating..." : "Generate Report"}
          </Button>
        }
      />

      {/* Loading State */}
      {isLoading && <Loading message="Generating profit & loss report..." />}

      {/* Error State */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          Failed to load profit & loss report. Please try again.
        </div>
      )}

      {/* Report Data Display */}
      {reportData && reportData.summary && (
        <div className="space-y-6">
          {/* Revenue & Profit Metrics */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={DollarSign}
              title="Total Revenue"
              value={`৳${(reportData.summary.revenue || 0).toLocaleString()}`}
              bgColor="green"
              badge={{
                icon: TrendingUp,
                text: "Gross Revenue",
                color: "success",
              }}
              compact
            />

            <StatCard
              icon={Package}
              title="COGS"
              value={`৳${(reportData.summary.cogs || 0).toLocaleString()}`}
              bgColor="orange"
              badge={{
                text: "Cost of Goods",
                color: "warning",
              }}
              compact
            />

            <StatCard
              icon={TrendingUp}
              title="Gross Profit"
              value={`৳${(
                reportData.summary.grossProfit || 0
              ).toLocaleString()}`}
              bgColor="blue"
              badge={{
                text: `${
                  reportData.summary.grossProfitMargin?.toFixed(1) || 0
                }% Margin`,
                color: "info",
              }}
              compact
            />

            <StatCard
              icon={TrendingUp}
              title="Net Profit"
              value={`৳${(reportData.summary.netProfit || 0).toLocaleString()}`}
              bgColor="indigo"
              badge={{
                icon: TrendingUp,
                text: "Bottom Line",
                color: "success",
              }}
              compact
            />
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={ShoppingCart}
              title="Total Purchases"
              value={`৳${(reportData.summary.purchases || 0).toLocaleString()}`}
              bgColor="purple"
              badge={{
                text: "Purchases",
                color: "default",
              }}
              compact
            />

            <StatCard
              icon={TrendingDown}
              title="Total Expenses"
              value={`৳${(
                reportData.summary.totalExpenses || 0
              ).toLocaleString()}`}
              bgColor="red"
              badge={{
                text: "Operating Costs",
                color: "error",
              }}
              compact
            />

            <StatCard
              icon={TrendingUp}
              title="Operating Profit"
              value={`৳${(
                reportData.summary.operatingProfit || 0
              ).toLocaleString()}`}
              bgColor="cyan"
              badge={{
                text: "EBIT",
                color: "info",
              }}
              compact
            />

            <StatCard
              icon={Percent}
              title="Gross Profit Margin"
              value={`${
                reportData.summary.grossProfitMargin?.toFixed(2) || 0
              }%`}
              bgColor="green"
              badge={{
                icon: TrendingUp,
                text: "Margin %",
                color: "success",
              }}
              compact
            />
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Percent}
              title="Total Discount"
              value={`৳${(
                reportData.summary.totalDiscount || 0
              ).toLocaleString()}`}
              bgColor="pink"
              badge={{
                text: "Discounts",
                color: "default",
              }}
              compact
            />

            <StatCard
              icon={Calculator}
              title="Total Tax"
              value={`৳${(reportData.summary.totalTax || 0).toLocaleString()}`}
              bgColor="indigo"
              badge={{
                text: "Tax",
                color: "info",
              }}
              compact
            />
          </div>

          {/* Profit & Loss Summary */}
          <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Profit & Loss Summary
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* Revenue Section */}
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Revenue
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                    ৳{(reportData.summary.revenue || 0).toLocaleString()}
                  </p>
                </div>

                {/* Cost of Goods Sold */}
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Less: Cost of Goods Sold (COGS)
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                    ৳{(reportData.summary.cogs || 0).toLocaleString()}
                  </p>
                </div>

                {/* Gross Profit */}
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Gross Profit
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {reportData.summary.grossProfitMargin?.toFixed(1) || 0}%
                      margin
                    </p>
                  </div>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    ৳{(reportData.summary.grossProfit || 0).toLocaleString()}
                  </p>
                </div>

                {/* Discounts */}
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Less: Total Discounts
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                    ৳{(reportData.summary.totalDiscount || 0).toLocaleString()}
                  </p>
                </div>

                {/* Taxes */}
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Plus: Total Taxes
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                    ৳{(reportData.summary.totalTax || 0).toLocaleString()}
                  </p>
                </div>

                {/* Total Expenses */}
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Less: Total Expenses
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                    ৳{(reportData.summary.totalExpenses || 0).toLocaleString()}
                  </p>
                </div>

                {/* Operating Profit */}
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20 px-4 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Operating Profit (EBIT)
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Before interest & taxes
                    </p>
                  </div>
                  <p className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
                    ৳
                    {(reportData.summary.operatingProfit || 0).toLocaleString()}
                  </p>
                </div>

                {/* Net Profit */}
                <div className="flex justify-between items-center py-4 bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 px-6 rounded-xl">
                  <div>
                    <p className="font-bold text-lg text-gray-900 dark:text-white">
                      Net Profit
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Bottom line profit
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    ৳{(reportData.summary.netProfit || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
