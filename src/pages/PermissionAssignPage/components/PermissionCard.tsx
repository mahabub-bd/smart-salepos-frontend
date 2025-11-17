import Checkbox from "../../../components/form/input/Checkbox";
import { Permission } from "../../../types/role";

interface PermissionCardProps {
  permission: Permission;
  isSelected: boolean;
  onToggle: () => void;
}

export default function PermissionCard({
  permission,
  isSelected,
  onToggle,
}: PermissionCardProps) {
  return (
    <div
      onClick={onToggle}
      className={`
        group cursor-pointer select-none
        rounded-xl border p-4 transition-all duration-200
        shadow-sm hover:shadow-md
        ${
          isSelected
            ? "border-brand-600 bg-brand-50 dark:bg-brand-600/20 dark:border-brand-400"
            : "border-gray-200 bg-white hover:border-brand-300 dark:bg-gray-900 dark:border-gray-700 dark:hover:border-brand-500/50"
        }
      `}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <div className="mt-1">
          <Checkbox checked={isSelected} onChange={onToggle} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Permission Key */}
          <h4
            className={`
              font-semibold text-sm tracking-wide mb-1
              ${
                isSelected
                  ? "text-brand-700 dark:text-brand-300"
                  : "text-gray-900 dark:text-gray-100"
              }
            `}
          >
            {permission.key}
          </h4>

          {/* Permission Description */}
          {permission.description && (
            <p
              className={`
                text-xs leading-snug
                ${
                  isSelected
                    ? "text-brand-600 dark:text-brand-400"
                    : "text-gray-500 dark:text-gray-400"
                }
              `}
            >
              {permission.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
