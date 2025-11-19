import type React from "react";
import { cn } from "../../utlis";

interface BadgeProps {
  children: React.ReactNode;
  color?: "success" | "warning" | "danger" | "info" | "default";
}

export function Badge({ children, color = "default" }: BadgeProps) {
  const colorClasses = {
    success:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    warning:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
        colorClasses[color]
      )}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  badge?: {
    icon?: React.ComponentType<{ className?: string }>;
    text: string;
    color?: "success" | "warning" | "danger" | "info" | "default";
  };
  bgColor?:
    | "blue"
    | "green"
    | "purple"
    | "orange"
    | "pink"
    | "indigo"
    | "default";
  className?: string;
}

export function StatCard({
  icon: Icon,
  title,
  value,
  badge,
  bgColor = "default",
  className,
}: StatCardProps) {
  const bgColorClasses = {
    blue: "bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-800/30",
    green:
      "bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 border-green-200 dark:border-green-800/30",
    purple:
      "bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 border-purple-200 dark:border-purple-800/30",
    orange:
      "bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10 border-orange-200 dark:border-orange-800/30",
    pink: "bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-950/20 dark:to-pink-900/10 border-pink-200 dark:border-pink-800/30",
    indigo:
      "bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/20 dark:to-indigo-900/10 border-indigo-200 dark:border-indigo-800/30",
    default:
      "bg-white dark:bg-white/[0.03] border-gray-200 dark:border-gray-800",
  };

  const iconBgClasses = {
    blue: "bg-blue-100/80 dark:bg-blue-800/50",
    green: "bg-green-100/80 dark:bg-green-800/50",
    purple: "bg-purple-100/80 dark:bg-purple-800/50",
    orange: "bg-orange-100/80 dark:bg-orange-800/50",
    pink: "bg-pink-100/80 dark:bg-pink-800/50",
    indigo: "bg-indigo-100/80 dark:bg-indigo-800/50",
    default: "bg-gray-100/80 dark:bg-gray-800/50",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-4 md:p-4",
        bgColorClasses[bgColor],
        className
      )}
    >
      {/* Background Icon */}
      <div className="absolute -top-4 -right-4 opacity-5 dark:opacity-10">
        <Icon className="text-8xl text-gray-800 dark:text-white" />
      </div>

      {/* Main Icon */}
      <div
        className={cn(
          "relative z-10 flex items-center justify-center w-12 h-12 rounded-xl",
          iconBgClasses[bgColor]
        )}
      >
        <Icon className="text-gray-800 text-2xl dark:text-white/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {title}
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-xl dark:text-white/90">
            {value}
          </h4>
        </div>
        {badge && (
          <Badge color={badge.color}>
            {badge.icon && <badge.icon className="text-sm" />}
            {badge.text}
          </Badge>
        )}
      </div>
    </div>
  );
}
