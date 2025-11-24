import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import {
  useDeleteCategoryMutation,
  useGetCategoryTreeQuery,
} from "../../../features/category/categoryApi";

import ConfirmDialog from "../../../components/common/ConfirmDialog";
import IconButton from "../../../components/common/IconButton";
import Badge from "../../../components/ui/badge/Badge";
import ResponsiveImage from "../../../components/ui/images/ResponsiveImage";
import { useHasPermission } from "../../../hooks/useHasPermission";

import Loading from "../../../components/common/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import { CategoryWithChildren } from "../../../types";
import CategoryFormModal from "./CategoryFormModal";

// Flattened item type
interface FlattenedCategory {
  id: number;
  name: string;
  slug?: string | null;
  description?: string;
  status: boolean;
  logo_attachment: any;
  created_at: string;
  updated_at: string;
  category_id?: string;
  parent?: CategoryWithChildren | null;
}

const flattenCategories = (
  nodes: CategoryWithChildren[]
): FlattenedCategory[] => {
  const result: FlattenedCategory[] = [];

  const traverse = (
    list: CategoryWithChildren[],
    parent: CategoryWithChildren | null = null
  ) => {
    list.forEach((cat) => {
      // Add main category or subcategory
      result.push({
        ...cat,
        parent,
      });

      // Process children (subcategories)
      if (cat.children?.length) {
        traverse(cat.children as CategoryWithChildren[], cat);
      }
    });
  };

  traverse(nodes);
  return result;
};

export default function CategoryList() {
  const { data, isLoading, isError } = useGetCategoryTreeQuery();
  const [deleteCategory] = useDeleteCategoryMutation();

  const categories = flattenCategories(data?.data || []);

  const canCreate = useHasPermission("category.create");
  const canUpdate = useHasPermission("category.update");
  const canDelete = useHasPermission("category.delete");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<FlattenedCategory | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<FlattenedCategory | null>(null);

  // Open modal to create a main category
  const openCreateCategoryModal = () => {
    setEditCategory(null);
    setIsModalOpen(true);
  };

  // Open modal to create a subcategory under a parent
  const openCreateSubCategoryModal = (parent: FlattenedCategory) => {
    setEditCategory({
      id: 0, // Temporary ID for new subcategory
      name: "",
      status: true,
      logo_attachment: null,
      created_at: "",
      updated_at: "",
      category_id: String(parent.id), // Set parent category ID
    });
    setIsModalOpen(true);
  };

  // Open modal to edit existing category/subcategory
  const openEditModal = (category: FlattenedCategory) => {
    setEditCategory(category);
    setIsModalOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (category: FlattenedCategory) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  // Confirm and execute delete
  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete.id).unwrap();
      toast.success(
        `${
          categoryToDelete.parent ? "Subcategory" : "Category"
        } deleted successfully`
      );
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete category");
    } finally {
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  if (isLoading) return <Loading message="Loading Categories..." />;
  if (isError)
    return <p className="p-6 text-red-500">Failed to fetch categories.</p>;

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/3 sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Category Management
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {canCreate && (
              <button
                onClick={openCreateCategoryModal}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200"
              >
                <Plus size={16} />
                Add Category
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto hide-scrollbar scroll-smooth">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Logo
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Type
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Parent
                </TableCell>

                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No categories found. Create your first category to get
                    started.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((cat) => (
                  <TableRow key={cat.id}>
                    {/* Logo */}
                    <TableCell className="py-3">
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

                    {/* Name */}
                    <TableCell className="py-3">
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {cat.parent && (
                          <span className="text-gray-400 mr-2">└─</span>
                        )}
                        {cat.name}
                      </p>
                    </TableCell>

                    {/* Type */}
                    <TableCell className="py-3">
                      <Badge size="sm" color={cat.parent ? "primary" : "error"}>
                        {cat.parent ? "Subcategory" : "Main Category"}
                      </Badge>
                    </TableCell>

                    {/* Parent */}
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {cat.parent ? (
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {cat.parent.name}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-3">
                      <Badge size="sm" color={cat.status ? "success" : "error"}>
                        {cat.status ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-3">
                      <div className="flex justify-end gap-2">
                        {/* Add Subcategory - Only for main categories */}
                        {!cat.parent && canCreate && (
                          <IconButton
                            icon={Plus}
                            color="green"
                            tooltip="Add "
                            onClick={() => openCreateSubCategoryModal(cat)}
                          />
                        )}

                        {/* Edit */}
                        {canUpdate && (
                          <IconButton
                            icon={Pencil}
                            color="blue"
                            tooltip={`Edit ${
                              cat.parent ? "Subcategory" : "Category"
                            }`}
                            onClick={() => openEditModal(cat)}
                          />
                        )}

                        {/* Delete */}
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
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Category / SubCategory Form Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditCategory(null);
        }}
        category={editCategory}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title={`Delete ${
          categoryToDelete?.parent ? "Subcategory" : "Category"
        }`}
        message={`Are you sure you want to delete "${
          categoryToDelete?.name
        }"? ${
          !categoryToDelete?.parent
            ? "This will also delete all subcategories under it."
            : ""
        }`}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setCategoryToDelete(null);
        }}
      />
    </>
  );
}
