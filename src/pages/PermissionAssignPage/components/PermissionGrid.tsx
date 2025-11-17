import { useState } from "react";
import Button from "../../../components/ui/button/Button";
import { Permission } from "../../../types/role";
import PermissionActions from "./PermissionActions";
import PermissionCard from "./PermissionCard";

interface PermissionGridProps {
  permissions: Permission[];
  selectedPermissions: string[];
  onTogglePermission: (key: string) => void;
  onSelectAll: () => void; // global
  onUnselectAll: () => void; // global
  onAssign: () => void;
  isAssigning: boolean;
}

export default function PermissionGrid({
  permissions,
  selectedPermissions,
  onTogglePermission,
  onSelectAll,
  onUnselectAll,
  onAssign,
  isAssigning,
}: PermissionGridProps) {
  // Group permissions by module (prefix before ".")
  const groupedPermissions = permissions.reduce((acc, perm) => {
    const moduleName = perm.key.split(".")[0]; // example: "user.create" → "user"
    if (!acc[moduleName]) acc[moduleName] = [];
    acc[moduleName].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  // Toggle collapse/expand
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggleGroup = (module: string) => {
    setCollapsed((prev) => ({ ...prev, [module]: !prev[module] }));
  };

  // Format module name nicely (user → User)
  const formatModuleName = (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1);

  // Select All inside a module
  const selectModule = (moduleName: string) => {
    const perms = groupedPermissions[moduleName].map((p) => p.key);
    onUnselectAll(); // clear first
    perms.forEach((key) => onTogglePermission(key)); // add all
  };

  // Unselect All inside a module
  const unselectModule = (moduleName: string) => {
    const perms = groupedPermissions[moduleName].map((p) => p.key);
    perms.forEach((key) => {
      if (selectedPermissions.includes(key)) {
        onTogglePermission(key);
      }
    });
  };

  return (
    <div>
      {/* Global Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Permissions</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selectedPermissions.length} of {permissions.length} selected
          </p>
        </div>

        <PermissionActions
          onSelectAll={onSelectAll}
          onUnselectAll={onUnselectAll}
        />
      </div>

      {/* Grouped Permissions */}
      <div className="space-y-6">
        {Object.entries(groupedPermissions).map(([moduleName, perms]) => {
          const total = perms.length;
          const selectedCount = perms.filter((p) =>
            selectedPermissions.includes(p.key)
          ).length;

          const isCollapsed = collapsed[moduleName] || false;
          const allSelected = selectedCount === total;
          const partiallySelected = selectedCount > 0 && selectedCount < total;

          return (
            <div
              key={moduleName}
              className="border rounded-xl dark:border-white/10 overflow-hidden"
            >
              {/* Group Header */}
              <div
                className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-800 cursor-pointer"
                onClick={() => toggleGroup(moduleName)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      allSelected
                        ? "bg-brand-600"
                        : partiallySelected
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }`}
                  ></div>

                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                    {formatModuleName(moduleName)} Module
                  </h4>

                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({total})
                  </span>
                </div>

                {/* Group actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      selectModule(moduleName);
                    }}
                    className="text-xs px-2 py-1 rounded bg-brand-600 text-white hover:bg-brand-700"
                  >
                    Select All
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      unselectModule(moduleName);
                    }}
                    className="text-xs px-2 py-1 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:text-white"
                  >
                    Unselect
                  </button>

                  <span className="text-gray-600 dark:text-gray-300">
                    {isCollapsed ? "➕" : "➖"}
                  </span>
                </div>
              </div>

              {/* Group Content */}
              {!isCollapsed && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-900/30">
                  {perms.map((perm) => (
                    <PermissionCard
                      key={perm.key}
                      permission={perm}
                      isSelected={selectedPermissions.includes(perm.key)}
                      onToggle={() => onTogglePermission(perm.key)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Assign Button */}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Selected permissions will be assigned to the role
        </p>

        <Button
          size="sm"
          onClick={onAssign}
          disabled={isAssigning || selectedPermissions.length === 0}
          className="px-5 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50"
        >
          {isAssigning ? "Saving..." : "Assign Permissions"}
        </Button>
      </div>
    </div>
  );
}
