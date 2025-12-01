import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { Fragment, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import IconButton from "../../../components/common/IconButton";
import Loading from "../../../components/common/Loading";
import Badge from "../../../components/ui/badge/Badge";
import ResponsiveImage from "../../../components/ui/images/ResponsiveImage";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../../../features/product/productApi";

import Button from "../../../components/ui/button/Button";
import { useHasPermission } from "../../../hooks/useHasPermission";
import { Product } from "../../../types";

export default function ProductList() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const canCreate = useHasPermission("product.create");
  const canUpdate = useHasPermission("product.update");
  const canDelete = useHasPermission("product.delete");

  const products = data?.data || [];

  // 🔹 Route Handlers

  const canView = useHasPermission("product.view");
  const openViewPage = useCallback(
    (product: Product) => {
      navigate(`/products/view/${product.id}`);
    },
    [navigate]
  );

  const openCreatePage = useCallback(() => {
    navigate("/products/create");
  }, [navigate]);

  const openEditPage = useCallback(
    (product: Product) => {
      navigate(`/products/edit/${product.id}`);
    },
    [navigate]
  );

  // 🔹 Delete Handling
  const openDeleteDialog = useCallback((product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id).unwrap();
      toast.success("Product deleted successfully");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  }, [productToDelete, deleteProduct]);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  }, []);

  // 🔹 Loading & Error States
  if (isLoading) return <Loading message="Loading Products..." />;
  if (isError)
    return <p className="p-6 text-red-500">Failed to fetch products.</p>;

  return (
    <Fragment>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/3 sm:px-6">
        {/* Header Section */}
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Product Management
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {canCreate && (
              <Button size="sm" onClick={openCreatePage}>
                <Plus size={16} />
                Add
              </Button>
            )}
          </div>
        </div>

        {/* Table Section */}
        <div className="max-w-full overflow-x-auto mx-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell isHeader>Image</TableCell>
                <TableCell isHeader>Product Name</TableCell>

                <TableCell isHeader>Category</TableCell>

                <TableCell isHeader>Subcategory</TableCell>
                <TableCell isHeader>Brand</TableCell>
                <TableCell isHeader>Supplier</TableCell>
                <TableCell isHeader>Purchase Price</TableCell>
                <TableCell isHeader>Selling Price</TableCell>
                <TableCell isHeader>Stock</TableCell>
                <TableCell isHeader>Status</TableCell>
                <TableCell isHeader>Actions</TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800 mx-auto">
              {products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.id} className="">
                    {/* Product Image */}
                    <TableCell className="py-3">
                      {product.images?.[0]?.url ? (
                        <ResponsiveImage
                          src={product.images[0].url}
                          alt={product.name}
                          className="h-12 w-20 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-12 w-20 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                          <span className="text-xs text-gray-400">
                            No Image
                          </span>
                        </div>
                      )}
                    </TableCell>

                    {/* Product Name */}
                    <TableCell className="py-3">
                      <div className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {product.name}
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell className="hidden xl:table-cell py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {product.category?.name || (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>

                    {/* Subcategory */}
                    <TableCell className="hidden 2xl:table-cell py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {product.subcategory?.name || (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>

                    {/* Brand */}
                    <TableCell className="hidden xl:table-cell py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {product.brand?.name || (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>

                    {/* Supplier */}
                    <TableCell className="hidden 2xl:table-cell py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {product.supplier?.name || (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>

                    {/* Purchase Price */}
                    <TableCell className="hidden lg:table-cell py-3 text-gray-800 text-theme-sm font-medium text-right dark:text-white/90">
                      ৳{Number(product.purchase_price).toLocaleString()}
                    </TableCell>

                    {/* Selling Price */}
                    <TableCell className="py-3 text-green-600 text-theme-sm font-medium text-right dark:text-green-400">
                      ৳{Number(product.selling_price).toLocaleString()}
                    </TableCell>
                    <TableCell>{product.available_stock}</TableCell>
                    {/* Status */}
                    <TableCell className="py-3 text-center">
                      <Badge
                        size="sm"
                        color={product.status ? "success" : "error"}
                      >
                        {product.status ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-3">
                      <div className="flex justify-end gap-2">
                        {canView && (
                          <IconButton
                            icon={Eye}
                            tooltip="View"
                            onClick={() => openViewPage(product)}
                            color="blue"
                            title="View Product"
                          />
                        )}
                        {canUpdate && (
                          <IconButton
                            icon={Pencil}
                            tooltip="Edit"
                            onClick={() => openEditPage(product)}
                            color="blue"
                            title="Edit Product"
                          />
                        )}
                        {canDelete && (
                          <IconButton
                            icon={Trash2}
                            onClick={() => openDeleteDialog(product)}
                            color="red"
                            title="Delete Product"
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center gap-2 w-full justify-center">
                      <p className="text-lg font-medium">No products found</p>
                      <p className="text-sm">
                        Get started by adding your first product
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {canDelete && (
        <ConfirmDialog
          isOpen={isDeleteModalOpen}
          title="Delete Product"
          message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
          confirmLabel="Yes, Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
        />
      )}
    </Fragment>
  );
}
