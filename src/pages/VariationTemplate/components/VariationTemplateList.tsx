import {
  Eye,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import Loading from "../../../components/common/Loading";
import { Dropdown } from "../../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../../components/ui/dropdown/DropdownItem";
import Pagination from "../../../components/ui/pagination/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  useDeleteVariationTemplateMutation,
  useGetVariationTemplatesQuery,
  VariationTemplate,
  VariationTemplateFilters,
} from "../../../features/variation-template/variationTemplateApi";

import PageHeader from "../../../components/common/PageHeader";
import { useHasPermission } from "../../../hooks/useHasPermission";
import { formatDateTime } from "../../../utlis";
import CreateVariationTemplateModal from "./CreateVariationTemplateModal";
import EditVariationTemplateModal from "./EditVariationTemplateModal";

export default function VariationTemplateList() {
  const navigate = useNavigate();

  // Filter states
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState<boolean | undefined>();
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] =
    useState<VariationTemplate | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] =
    useState<VariationTemplate | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Build filter object
  const filters: VariationTemplateFilters = {
    page,
    limit,
    search: debouncedSearch,
    isActive: selectedStatus,
  };

  const { data, isLoading, isError } = useGetVariationTemplatesQuery(filters);
  const [deleteVariationTemplate] = useDeleteVariationTemplateMutation();

  const templates = data?.data || [];
  const meta = data?.meta;

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedStatus]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchInput("");
    setSelectedStatus(undefined);
    setPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = searchInput || selectedStatus !== undefined;

  // Permission checks
  const canCreate = useHasPermission("template.create");
  const canUpdate = useHasPermission("template.update");
  const canDelete = useHasPermission("template.delete");
  const canView = useHasPermission("template.view");

  // Handlers
  const openCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const openViewPage = useCallback(
    (template: VariationTemplate) => {
      navigate(`/variation/view/${template.id}`);
    },
    [navigate]
  );

  const openEditModal = useCallback((template: VariationTemplate) => {
    setTemplateToEdit(template);
    setIsEditModalOpen(true);
  }, []);

  const openDeleteDialog = useCallback((template: VariationTemplate) => {
    setTemplateToDelete(template);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!templateToDelete) return;
    try {
      await deleteVariationTemplate(templateToDelete.id).unwrap();
      toast.success("Variation template deleted successfully");
    } catch {
      toast.error("Failed to delete variation template");
    } finally {
      setIsDeleteModalOpen(false);
      setTemplateToDelete(null);
      setActiveDropdown(null);
    }
  }, [templateToDelete, deleteVariationTemplate]);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setTemplateToDelete(null);
  }, []);

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const handleCreateSuccess = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setTemplateToEdit(null);
  }, []);

  const handleEditSuccess = useCallback(() => {
    setIsEditModalOpen(false);
    setTemplateToEdit(null);
  }, []);

  // Dropdown handling
  const toggleDropdown = useCallback(
    (templateId: number) => {
      setActiveDropdown(activeDropdown === templateId ? null : templateId);
    },
    [activeDropdown]
  );

  const closeDropdown = useCallback(() => {
    setActiveDropdown(null);
  }, []);

  // Loading and error states
  if (isLoading) return <Loading message="Loading Variation Templates..." />;
  if (isError)
    return (
      <p className="p-6 text-red-500">Failed to fetch variation templates.</p>
    );

  return (
    <>
      {/* Header Section */}
      <PageHeader
        title="Variation Templates"
        icon={<Plus size={16} />}
        addLabel="Add Template"
        onAdd={openCreateModal}
        permission="template.create"
      />

      {/* Search & Filters */}
      <div className="mb-4 space-y-4">
        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              showFilters || hasActiveFilters
                ? "bg-brand-50 border-brand-300 text-brand-700 dark:bg-brand-900/20 dark:border-brand-700 dark:text-brand-300"
                : "border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            }`}
          >
            Filters{" "}
            {hasActiveFilters &&
              `(${[searchInput, selectedStatus].filter(Boolean).length})`}
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
            >
              <X size={16} />
              Clear all
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={
                    selectedStatus === undefined
                      ? ""
                      : selectedStatus.toString()
                  }
                  onChange={(e) =>
                    setSelectedStatus(
                      e.target.value === ""
                        ? undefined
                        : e.target.value === "true"
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      {meta && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {templates.length} of {meta.total} variation templates
        </div>
      )}

      {/* Table Section */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-[#1e1e1e]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell isHeader>Name</TableCell>
                <TableCell isHeader>Description</TableCell>
                <TableCell isHeader>Values</TableCell>
                <TableCell isHeader>Order</TableCell>
                <TableCell isHeader>Status</TableCell>
                <TableCell isHeader>Created At</TableCell>
                <TableCell isHeader>Actions</TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {templates.length > 0 ? (
                templates.map((template) => (
                  <TableRow
                    key={template.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <TableCell className="py-3 font-medium text-gray-900 dark:text-white">
                      {template.name}
                    </TableCell>
                    <TableCell className="py-3 text-gray-600 dark:text-gray-400">
                      {template.description || "-"}
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {typeof template.values === "string"
                          ? template.values.split(",").map((value, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
                              >
                                {value.trim()}
                              </span>
                            ))
                          : template.values.map((value: any, index: number) => (
                              <span
                                key={value.id || index}
                                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
                              >
                                {value.value || value}
                              </span>
                            ))}
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      {template.sort_order}
                    </TableCell>

                    <TableCell className="py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          template.is_active
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                        }`}
                      >
                        {template.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 text-gray-600 dark:text-gray-400">
                      {formatDateTime(template.created_at)}
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(template.id)}
                          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Actions"
                        >
                          <MoreVertical size={16} className="text-gray-600" />
                        </button>

                        <Dropdown
                          isOpen={activeDropdown === template.id}
                          onClose={() => {
                            closeDropdown();
                            closeDeleteModal();
                          }}
                          className="min-w-40"
                        >
                          {canView && (
                            <DropdownItem
                              onClick={() => {
                                openViewPage(template);
                                closeDropdown();
                              }}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Eye size={16} />
                              View
                            </DropdownItem>
                          )}

                          {canUpdate && (
                            <DropdownItem
                              onClick={() => {
                                openEditModal(template);
                                closeDropdown();
                              }}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Pencil size={16} />
                              Edit
                            </DropdownItem>
                          )}

                          {canDelete && (
                            <DropdownItem
                              onClick={() => {
                                openDeleteDialog(template);
                                closeDropdown();
                              }}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                              Delete
                            </DropdownItem>
                          )}
                        </Dropdown>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-2 w-full justify-center">
                      <p className="text-lg font-medium">
                        No variation templates found
                      </p>
                      <p className="text-sm">
                        Get started by adding your first variation template
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <Pagination
          meta={{
            currentPage: meta.page,
            totalPages: meta.totalPages,
            total: meta.total,
          }}
          currentPage={meta.page}
          onPageChange={handlePageChange}
          currentPageItems={templates.length}
          itemsPerPage={limit}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {canDelete && (
        <ConfirmDialog
          isOpen={isDeleteModalOpen}
          title="Delete Variation Template"
          message={`Are you sure you want to delete "${templateToDelete?.name}"? This action cannot be undone.`}
          confirmLabel="Yes, Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
        />
      )}

      {/* Create Modal */}
      {canCreate && (
        <CreateVariationTemplateModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          onSuccess={handleCreateSuccess}
        />
      )}

      {/* Edit Modal */}
      {canUpdate && (
        <EditVariationTemplateModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSuccess={handleEditSuccess}
          template={templateToEdit}
        />
      )}
    </>
  );
}
