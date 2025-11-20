import { Pencil, Plus, Trash2 } from "lucide-react";
import { Fragment, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import IconButton from "../../../components/common/IconButton";
import Loading from "../../../components/common/Loading";
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

import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../../../features/product/productApi";

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
    }
  }, [productToDelete, deleteProduct]);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  // 🔹 Loading State
  if (isLoading) return <Loading message="Loading Products..." />;
  if (isError)
    return <p className="p-6 text-red-500">Failed to fetch products.</p>;

  return (
    <Fragment>
      <PageHeader
        title="Product Management"
        icon={<Plus size={16} />}
        addLabel="Add"
        onAdd={openCreatePage}
        permission="product.create"
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#1e1e1e]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-gray-700">
              <TableRow>
                <TableCell isHeader className="table-header">
                  Image
                </TableCell>
                <TableCell isHeader className="table-header">
                  Product Name
                </TableCell>
                <TableCell isHeader className="table-header">
                  SKU
                </TableCell>

                <TableCell isHeader className="table-header">
                  Brand
                </TableCell>
                <TableCell isHeader className="table-header">
                  Category
                </TableCell>
                <TableCell isHeader className="table-header">
                  Purchase Price
                </TableCell>
                <TableCell isHeader className="table-header">
                  Sale Price
                </TableCell>
                <TableCell isHeader className="table-header">
                  Status
                </TableCell>
                <TableCell isHeader className="table-header text-right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
              {products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.id}>
                    {/* Product Image */}
                    <TableCell className="table-body">
                      {product.images?.[0]?.url ? (
                        <ResponsiveImage
                          src={product.images[0].url}
                          alt={product.name}
                          className="h-12 w-24 rounded-md"
                        />
                      ) : (
                        <Badge size="sm" color="warning">
                          No Image
                        </Badge>
                      )}
                    </TableCell>

                    {/* Product Name */}
                    <TableCell className="table-body font-medium">
                      {product.name}
                    </TableCell>

                    {/* SKU */}
                    <TableCell className="table-body">{product.sku}</TableCell>
                    {/* Brand */}
                    <TableCell className="table-body">
                      {product.brand?.name || "-"}
                    </TableCell>
                    {/* Category */}
                    <TableCell className="table-body">
                      {product.category?.name || "-"}
                    </TableCell>

                    {/* Price */}
                    <TableCell className="table-body">
                      ৳{product.purchase_price}
                    </TableCell>
                    <TableCell className="table-body">
                      ৳{product.selling_price}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="table-body">
                      <Badge
                        size="sm"
                        color={product.status ? "success" : "error"}
                      >
                        {product.status ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {canUpdate && (
                          <IconButton
                            icon={Pencil}
                            onClick={() => openEditPage(product)}
                            color="blue"
                          />
                        )}
                        {canDelete && (
                          <IconButton
                            icon={Trash2}
                            onClick={() => openDeleteDialog(product)}
                            color="red"
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="py-6 text-center text-gray-500 dark:text-gray-400">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {canDelete && (
        <ConfirmDialog
          isOpen={isDeleteModalOpen}
          title="Delete Product"
          message={`Are you sure you want to delete "${productToDelete?.name}"?`}
          confirmLabel="Yes, Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
        />
      )}
    </Fragment>
  );
}
