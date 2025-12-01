import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import IconButton from "../../../components/common/IconButton";
import Loading from "../../../components/common/Loading";
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

import PageHeader from "../../../components/common/PageHeader";
import { useHasPermission } from "../../../hooks/useHasPermission";
import { Product } from "../../../types";

export default function ProductList() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

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
    <>
      {/* Header Section */}

      <PageHeader
        title="Product Management"
        icon={<Plus size={16} />}
        addLabel="Add"
        onAdd={openCreatePage}
        permission="product.create"
      />
      {/* Table Section */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-[#1e1e1e]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell isHeader>Image</TableCell>
                <TableCell isHeader>Product Name</TableCell>

                <TableCell isHeader>Subcategory</TableCell>
                <TableCell isHeader>Brand</TableCell>
                <TableCell isHeader>Supplier</TableCell>
                <TableCell isHeader>Purchase Price</TableCell>
                <TableCell isHeader>Selling Price</TableCell>
                <TableCell isHeader>Stock</TableCell>
                <TableCell isHeader>SKU</TableCell>
                <TableCell isHeader>Actions</TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {products.length > 0 ? (
                products.map((product) => (
                  <TableRow
                    key={product.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    {/* Product Image - Hidden on mobile */}
                    <TableCell className="py-3 hidden sm:table-cell">
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
                      <div className="flex flex-col gap-1">
                        <div>{product.name}</div>
                        {/* Mobile-only additional info */}
                        <div>
                          {product.category?.name && (
                            <span>{product.category.name}</span>
                          )}
                          {product.category?.name && product.status && (
                            <span> • </span>
                          )}
                          {product.status && (
                            <span
                              className={
                                product.status
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {product.status ? "Active" : "Inactive"}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Subcategory */}
                    <TableCell>
                      {product.subcategory?.name || (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>

                    {/* Brand */}
                    <TableCell>
                      {product.brand?.name || (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>

                    {/* Supplier */}
                    <TableCell>
                      {product.supplier?.name || (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      ৳{Number(product.purchase_price).toLocaleString()}
                    </TableCell>
                    {/* Selling Price */}
                    <TableCell>
                      ৳{Number(product.selling_price).toLocaleString()}
                    </TableCell>

                    {/* Stock */}
                    <TableCell>
                      <span>{product.available_stock}</span>
                    </TableCell>
                    <TableCell>
                      <span>{product.sku}</span>
                    </TableCell>
                    {/* Actions */}
                    <TableCell className="py-3">
                      <div className="flex justify-start gap-1 sm:gap-2">
                        {canView && (
                          <IconButton
                            icon={Eye}
                            tooltip="View"
                            onClick={() => openViewPage(product)}
                            color="blue"
                            title="View Product"
                            size={16}
                          />
                        )}
                        {canUpdate && (
                          <IconButton
                            icon={Pencil}
                            tooltip="Edit"
                            onClick={() => openEditPage(product)}
                            color="blue"
                            title="Edit Product"
                            size={16}
                          />
                        )}
                        {canDelete && (
                          <IconButton
                            icon={Trash2}
                            onClick={() => openDeleteDialog(product)}
                            color="red"
                            title="Delete Product"
                            size={16}
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="py-12 text-center text-gray-500 dark:text-gray-400"
                  >
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
    </>
  );
}
