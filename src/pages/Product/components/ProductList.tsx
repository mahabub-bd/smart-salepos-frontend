import { Eye, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import Loading from "../../../components/common/Loading";
import { Dropdown } from "../../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../../components/ui/dropdown/DropdownItem";
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
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

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

  // 🔹 Dropdown Handling
  const toggleDropdown = useCallback(
    (productId: number) => {
      setActiveDropdown(activeDropdown === productId ? null : productId);
    },
    [activeDropdown]
  );

  const closeDropdown = useCallback(() => {
    setActiveDropdown(null);
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
                <TableCell isHeader colSpan={2}>
                  Product
                </TableCell>
                <TableCell isHeader>Brand</TableCell>
                <TableCell isHeader>Supplier</TableCell>
                <TableCell isHeader>Unit Price</TableCell>
                <TableCell isHeader>Purchase Price</TableCell>
                <TableCell isHeader>Stock</TableCell>
                <TableCell isHeader>Actions</TableCell>
                <TableCell isHeader>Status</TableCell>
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
                    {/* Product Info - 2 columns */}
                    <TableCell className="py-3 w-20">
                      {product.images?.[0]?.url ? (
                        <ResponsiveImage
                          src={product.images[0].url}
                          alt={product.name}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                          <span className="text-xs text-gray-400">
                            No Image
                          </span>
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="py-3">
                      <div className="flex flex-col gap-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                          <div>
                            {product.category?.name && (
                              <span className="mr-2">
                                {product.category.name}
                              </span>
                            )}
                            {product.subcategory?.name && (
                              <span className="mr-2">
                                {product.subcategory.name}
                              </span>
                            )}
                          </div>
                          <div>
                            <span className="mr-2">SKU: {product.sku}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.brand?.name && (
                        <span className="mr-2">{product.brand.name}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.supplier?.name && (
                        <span> {product.supplier.name}</span>
                      )}
                    </TableCell>
                    {/* Pricing */}
                    <TableCell className="py-3">
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="font-medium text-green-600">
                          ৳{Number(product.selling_price).toLocaleString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="text-gray-500">
                          ৳{Number(product.purchase_price).toLocaleString()}
                        </div>
                      </div>
                    </TableCell>
                    {/* Inventory */}
                    <TableCell className="py-3">
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="font-medium">
                          {product.available_stock}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.status && (
                        <span
                          className={
                            product.status ? "text-green-600" : "text-red-600"
                          }
                        >
                          {product.status ? "Active" : "Inactive"}
                        </span>
                      )}
                    </TableCell>
                    {/* Actions */}
                    <TableCell className="py-3">
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(product.id)}
                          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors dropdown-toggle"
                          title="Actions"
                        >
                          <MoreHorizontal size={18} className="text-gray-500" />
                        </button>

                        <Dropdown
                          isOpen={activeDropdown === product.id}
                          onClose={() => {
                            closeDropdown();
                            closeDeleteModal();
                          }}
                          className="min-w-40"
                        >
                          {canView && (
                            <DropdownItem
                              onClick={() => {
                                openViewPage(product);
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
                                openEditPage(product);
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
                                openDeleteDialog(product);
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
                    colSpan={5}
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
