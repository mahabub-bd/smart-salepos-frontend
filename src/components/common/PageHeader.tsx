import { Plus } from "lucide-react";
import { ReactNode } from "react";
import { useHasPermission } from "../../hooks/useHasPermission";
import Button from "../ui/button/Button";

interface PageHeaderProps {
  title: string;
  onAdd?: () => void;
  addLabel?: string;
  icon?: ReactNode;
  permission?: string; // 👈 add this
  children?: ReactNode;
}

export default function PageHeader({
  title,
  onAdd,
  addLabel = "Add",
  icon = <Plus size={16} />,
  permission,
  children,
}: PageHeaderProps) {
  const canAdd = permission ? useHasPermission(permission) : true;

  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
        {title}
      </h2>

      <div className="flex items-center gap-2">
        {children}

        {onAdd && canAdd && (
          <Button variant="primary" size="sm" onClick={onAdd}>
            {icon}
            <span className="ml-1">{addLabel}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
