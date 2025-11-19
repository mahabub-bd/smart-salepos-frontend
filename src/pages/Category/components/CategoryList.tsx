import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import {
  useDeleteCategoryMutation,
  useGetCategoryTreeQuery,
} from "../../../features/category/categoryApi";

import { useHasPermission } from "../../../hooks/useHasPermission";
import { Category } from "../../../types";

import ConfirmDialog from "../../../components/common/ConfirmDialog";
import IconButton from "../../../components/common/IconButton";
import PageHeader from "../../../components/common/PageHeader";
import Badge from "../../../components/ui/badge/Badge";
import ResponsiveImage from "../../../components/ui/images/ResponsiveImage";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import CategoryFormModal from "./CategoryFormModal";

// 🔥 Flatten nested category tree into table-ready array
const flattenCategories = (nodes: Category[]): Category[] => {
  const result: Category[] = [];

  const traverse = (list: Category[], parent: Category | null = null) => {
    list.forEach((cat) => {
      result.push({
        ...cat,
        parent, // attach parent reference for UI
      });

      if (cat.children?.length) {
        traverse(cat.children, cat);
      }
    });
  };

  traverse(nodes);
  return result;
};

export default function CategoryList() {
  const { data, isLoading, isError } = useGetCategoryTreeQuery();
  const [deleteCategory] = useDeleteCategoryMutation();

  // Convert TREE → FLAT list
  const categories = flattenCategories(data?.data || []);

  const canCreate = useHasPermission("category.create");
  const canUpdate = useHasPermission("category.update");
  const canDelete = useHasPermission("category.delete");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const openCreateModal = () => {
    setEditCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditCategory(category);
    setIsModalOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.id).unwrap();
      toast.success("Category deleted successfully");
    } catch (err) {
      toast.error("Failed to delete category");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading)
    return <p className="p-6 text-gray-500">Loading categories...</p>;

  if (isError)
    return <p className="p-6 text-red-500">Failed to fetch categories.</p>;

  return (
    <>
      <PageHeader
        title="Category Management"
        icon={<Plus size={16} />}
        addLabel="Add"
        onAdd={openCreateModal}
        permission="category.create"
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-[#1e1e1e]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                <TableCell isHeader className="table-header">
                  Logo
                </TableCell>
                <TableCell isHeader className="table-header">
                  Category
                </TableCell>
                <TableCell isHeader className="table-header">
                  Parent
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
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <TableRow key={cat.id}>
                    {/* Logo */}
                    <TableCell className="table-body">
                      {cat.logo_attachment?.url ? (
                        <div className="aspect-video w-24">
                          <ResponsiveImage
                            src={cat.logo_attachment.url}
                            alt={cat.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                      ) : (
                        <Badge size="sm" color="warning">
                          No Logo
                        </Badge>
                      )}
                    </TableCell>

                    {/* Category Name */}
                    <TableCell className="table-body font-medium">
                      {cat.name}
                    </TableCell>

                    {/* Parent */}
                    <TableCell className="table-body">
                      {cat.parent?.name || "-"}
                    </TableCell>

                    {/* Description */}
                    <TableCell className="table-body">
                      {cat.description || "-"}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="table-body">
                      <Badge color={cat.status ? "success" : "error"}>
                        {cat.status ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {canUpdate && (
                          <IconButton
                            icon={Pencil}
                            color="blue"
                            onClick={() => openEditModal(cat)}
                          />
                        )}
                        {canDelete && (
                          <IconButton
                            icon={Trash2}
                            color="red"
                            onClick={() => openDeleteDialog(cat)}
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="py-6 text-center text-gray-500 dark:text-gray-400">
                    No categories found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {(canCreate || canUpdate) && (
        <CategoryFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          category={editCategory}
        />
      )}

      {canDelete && (
        <ConfirmDialog
          isOpen={isDeleteModalOpen}
          title="Delete Category"
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
