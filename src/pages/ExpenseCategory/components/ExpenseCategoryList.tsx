import { ChevronLeft, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import IconButton from "../../../components/common/IconButton";
import Loading from "../../../components/common/Loading";
import PageHeader from "../../../components/common/PageHeader";
import Badge from "../../../components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import {
  useDeleteExpenseCategoryMutation,
  useGetExpenseCategoriesQuery,
} from "../../../features/expense-category/expenseCategoryApi";
import { useHasPermission } from "../../../hooks/useHasPermission";
import { ExpenseCategory } from "../../../types";
import ExpenseCategoryFormModal from "./ExpenseCategoryFormModal";

export default function ExpenseCategoryList() {
  const { data, isLoading, isError } = useGetExpenseCategoriesQuery();
  const [deleteExpenseCategory] = useDeleteExpenseCategoryMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<ExpenseCategory | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<ExpenseCategory | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const canCreate = useHasPermission("expensecategory.create");
  const canUpdate = useHasPermission("expensecategory.update");
  const canDelete = useHasPermission("expensecategory.delete");

  const categories = data?.data || [];

  // Pagination calculations
  const totalItems = categories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = categories.slice(startIndex, endIndex);

  const openCreateModal = () => {
    setEditCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category: ExpenseCategory) => {
    setEditCategory(category);
    setIsModalOpen(true);
  };

  const openDeleteDialog = (category: ExpenseCategory) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteExpenseCategory(categoryToDelete.id).unwrap();
      toast.success("Expense category deleted successfully");

      // Adjust current page if necessary after deletion
      const newTotalPages = Math.ceil((totalItems - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch {
      toast.error("Failed to delete expense category");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  if (isLoading) return <Loading message="Loading Expense Categories" />;

  if (isError)
    return (
      <p className="p-6 text-red-500">Failed to fetch expense categories.</p>
    );

  return (
    <>
      <PageHeader
        title="Expense Category Management"
        icon={<Plus size={16} />}
        addLabel="Add"
        onAdd={openCreateModal}
        permission="expensecategory.create"
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-[#1e1e1e]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                <TableCell isHeader className="table-header">
                  Name
                </TableCell>
                <TableCell isHeader className="table-header">
                  Description
                </TableCell>
                <TableCell isHeader className="table-header">
                  Status
                </TableCell>
                <TableCell isHeader className="table-header text-right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {currentCategories.length > 0 ? (
                currentCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="table-body font-medium">
                      {category.name}
                    </TableCell>

                    <TableCell className="table-body">
                      {category.description}
                    </TableCell>

                    <TableCell className="table-body">
                      <Badge
                        size="sm"
                        color={category.is_active ? "success" : "error"}
                      >
                        {category.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {canUpdate && (
                          <IconButton
                            icon={Pencil}
                            tooltip="Edit"
                            onClick={() => openEditModal(category)}
                            color="blue"
                          />
                        )}
                        {canDelete && (
                          <IconButton
                            icon={Trash2}
                            tooltip="Delete"
                            onClick={() => openDeleteDialog(category)}
                            color="red"
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No expense categories found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {totalItems > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Show
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(Number(e.target.value))
                }
                className="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                per page
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {startIndex + 1} - {Math.min(endIndex, totalItems)} of{" "}
                {totalItems}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded p-1 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
                  aria-label="Previous page"
                >
                  <ChevronLeft
                    size={20}
                    className="text-gray-600 dark:text-gray-400"
                  />
                </button>

                <span className="px-3 text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded p-1 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
                  aria-label="Next page"
                >
                  <ChevronRight
                    size={20}
                    className="text-gray-600 dark:text-gray-400"
                  />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {(canCreate || canUpdate) && (
        <ExpenseCategoryFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          category={editCategory}
        />
      )}

      {canDelete && (
        <ConfirmDialog
          isOpen={isDeleteModalOpen}
          title="Delete Expense Category"
          message={`Are you sure you want to delete "${categoryToDelete?.name}"?`}
          confirmLabel="Yes, Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </>
  );
}
