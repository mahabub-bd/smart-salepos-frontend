import {
  BarChart3,
  Building2,
  Calendar,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

import Loading from "@/components/common/Loading";
import StatCard from "@/components/common/stat-card";
import Select from "@/components/form/Select";
import { useGetDashboardDataQuery } from "@/features/report/reportApi";
import { useBranchOptions } from "@/pages/Reports/components/hooks/useBranchOptions";
import { RootState } from "@/store";

export default function EcommerceMetrics() {
  const [dateRange, setDateRange] = useState<string>("this_year");
  const [branchId, setBranchId] = useState<number | undefined>();

  // Get user info from Redux store
  const { user } = useSelector((state: RootState) => state.auth);
  const fullName = user?.full_name || user?.username || "User";

  // Using the query hook with auto-refetch
  const { data, isLoading, isError } = useGetDashboardDataQuery(
    {
      dateRange,
      branch_id: branchId,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // Fetch branches
  const branchOptions = useBranchOptions();

  if (isLoading) {
    return <Loading message="Loading dashboard..." />;
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
        Failed to load dashboard data. Please try again.
      </div>
    );
  }

  const dashboardData = data?.data;
  const periodData = dashboardData?.period;
  const previousPeriodData = dashboardData?.previousPeriod;
  const todayData = dashboardData?.today;
  const inventoryData = dashboardData?.inventory;

  // Calculate growth percentages
  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const revenueGrowth = calculateGrowth(
    periodData?.revenue || 0,
    previousPeriodData?.revenue || 0
  );
  const salesGrowth = calculateGrowth(
    periodData?.salesCount || 0,
    previousPeriodData?.salesCount || 0
  );
  const profitGrowth = calculateGrowth(
    periodData?.netProfit || 0,
    previousPeriodData?.netProfit || 0
  );

  return (
    <div>
      {/* Welcome Message, Branch and Date Range Filters - All in One Line */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        {/* Welcome Message - Left Side */}
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Welcome back,{" "}
            <span className="text-blue-600 dark:text-blue-400 capitalize">
              {fullName}
            </span>
            !
          </h1>
        </div>

        {/* Filters - Right Side */}
        <div className="flex items-center gap-3">
          {/* Branch Filter */}
          <div className="flex items-center gap-2 min-w-50">
            <Building2 className="h-4 w-4 text-gray-500" />
            <Select
              value={branchId ? branchId.toString() : ""}
              onChange={(value) =>
                setBranchId(value ? parseInt(value) : undefined)
              }
              placeholder="Select Branches"
              options={[{ value: "", label: "All Branches" }, ...branchOptions]}
              className="min-w-50"
            />
          </div>

          {/* Date Range Selector */}
          <div className="flex items-center gap-2 min-w-50">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Select
              value={dateRange}
              onChange={(value) => setDateRange(value)}
              placeholder="Select Range"
              options={[
                { value: "this_year", label: "This Year" },
                { value: "last_year", label: "Last Year" },
                { value: "this_month", label: "This Month" },
                { value: "last_month", label: "Last Month" },
                { value: "this_week", label: "This Week" },
                { value: "last_week", label: "Last Week" },
                { value: "today", label: "Today" },
                { value: "yesterday", label: "Yesterday" },
              ]}
              className="min-w-50"
            />
          </div>
        </div>
      </div>

      {/* Stat Cards - Main KPIs */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 md:gap-3">
        {/* Revenue - Primary KPI */}
        <StatCard
          icon={DollarSign}
          title="Revenue"
          value={`৳${(periodData?.revenue || 0).toLocaleString()}`}
          bgColor="green"
          badge={{
            icon: revenueGrowth >= 0 ? TrendingUp : TrendingDown,
            text: `${revenueGrowth >= 0 ? "+" : ""}${revenueGrowth.toFixed(
              1
            )}%`,
            color: revenueGrowth >= 0 ? "success" : "danger",
          }}
          compact
        />

        {/* Sales Count */}
        <StatCard
          icon={ShoppingCart}
          title="Sales"
          value={periodData?.salesCount?.toLocaleString() || "0"}
          bgColor="blue"
          badge={{
            icon: salesGrowth >= 0 ? TrendingUp : TrendingDown,
            text: `${salesGrowth >= 0 ? "+" : ""}${salesGrowth.toFixed(1)}%`,
            color: salesGrowth >= 0 ? "success" : "danger",
          }}
          compact
        />

        {/* Net Profit */}
        <StatCard
          icon={BarChart3}
          title="Net Profit"
          value={`৳${(periodData?.netProfit || 0).toLocaleString()}`}
          bgColor={(periodData?.netProfit || 0) >= 0 ? "purple" : "pink"}
          badge={{
            icon: profitGrowth >= 0 ? TrendingUp : TrendingDown,
            text: `${profitGrowth >= 0 ? "+" : ""}${profitGrowth.toFixed(1)}%`,
            color: profitGrowth >= 0 ? "success" : "danger",
          }}
          compact
        />

        {/* Gross Profit */}
        <StatCard
          icon={TrendingUp}
          title="Gross Profit"
          value={`৳${(periodData?.profit || 0).toLocaleString()}`}
          bgColor="green"
          badge={{
            text: "",
            color: "success",
          }}
          compact
        />

        {/* Expenses */}
        <StatCard
          icon={TrendingDown}
          title="Expenses"
          value={`৳${(periodData?.expense || 0).toLocaleString()}`}
          bgColor="pink"
          badge={{
            text: "Total spent",
            color: "danger",
          }}
          compact
        />

        {/* Products Overview */}
        <StatCard
          icon={Package}
          title="Inventory"
          value={`${inventoryData?.totalProducts || 0} products`}
          bgColor="blue"
          badge={{
            text: `${inventoryData?.lowStockCount || 0} low stock`,
            color:
              (inventoryData?.lowStockCount || 0) > 0 ? "danger" : "success",
          }}
          compact
        />
      </div>

      {/* Today's Quick Stats - 6 cards */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 md:gap-3 mt-4">
        {/* Today's Revenue */}
        <StatCard
          icon={DollarSign}
          title="Today's Revenue"
          value={`৳${(todayData?.revenue || 0).toLocaleString()}`}
          bgColor="green"
          badge={{
            text: "Today",
            color: "info",
          }}
          compact
        />

        {/* Today's Sales */}
        <StatCard
          icon={ShoppingCart}
          title="Today's Sales"
          value={todayData?.salesCount?.toLocaleString() || "0"}
          bgColor="blue"
          badge={{
            text: "Orders",
            color: "info",
          }}
          compact
        />

        {/* Today's Net Profit */}
        <StatCard
          icon={BarChart3}
          title="Today's Profit"
          value={`৳${(todayData?.netProfit || 0).toLocaleString()}`}
          bgColor="purple"
          badge={{
            text: "Net profit",
            color: "info",
          }}
          compact
        />

        {/* Today's Purchases */}
        <StatCard
          icon={Package}
          title="Today's Purchases"
          value={`৳${(todayData?.purchaseAmount || 0).toLocaleString()}`}
          bgColor="orange"
          badge={{
            text: `${todayData?.purchaseCount || 0} orders`,
            color: "warning",
          }}
          compact
        />

        {/* Period Purchases */}
        <StatCard
          icon={ShoppingCart}
          title="Period Purchases"
          value={`৳${(periodData?.purchaseAmount || 0).toLocaleString()}`}
          bgColor="orange"
          badge={{
            text: `${periodData?.purchaseCount || 0} orders`,
            color: "warning",
          }}
          compact
        />

        {/* Today's Gross Profit */}
        <StatCard
          icon={TrendingUp}
          title="Today's Gross Profit"
          value={`৳${(todayData?.profit || 0).toLocaleString()}`}
          bgColor="green"
          badge={{
            text: "",
            color: "info",
          }}
          compact
        />
      </div>
    </div>
  );
}
