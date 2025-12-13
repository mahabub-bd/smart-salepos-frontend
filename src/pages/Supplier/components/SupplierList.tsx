import { Eye, Pencil, Plus, Trash2, BookOpen } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import ConfirmDialog from "../../../components/common/ConfirmDialog";
import IconButton from "../../../components/common/IconButton";
import Loading from "../../../components/common/Loading";
import PageHeader from "../../../components/common/PageHeader";
import SupplierFormModal from "./SupplierFormModal";

import { Link } from "react-router";
import {
  useDeleteSupplierMutation,
  useGetSuppliersQuery,
} from "../../../features/suppliers/suppliersApi";
import { Supplier } from "../../../types";

// 🆕 Use updated table components
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

export default function SupplierList() {
  const { data, isLoading, isError } = useGetSuppliersQuery();
  const [deleteSupplier] = useDeleteSupplierMutation();

  const suppliers = data?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);

  const openCreate = () => {
    setEditSupplier(null);
    setIsModalOpen(true);
  };

  const openEdit = (supplier: Supplier) => {
    setEditSupplier(supplier);
    setIsModalOpen(true);
  };

  const openDelete = (supplier: Supplier) => {
    setSupplierToDelete(supplier);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!supplierToDelete) return;
    try {
      await deleteSupplier(supplierToDelete.id).unwrap();
      toast.success("Supplier deleted successfully");
    } catch {
      toast.error("Failed to delete supplier");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) return <Loading message="Loading Suppliers" />;
  if (isError) return <p className="p-6 text-red-500">Failed to fetch suppliers.</p>;

  return (
    <>
      <PageHeader
        title="Supplier Management"
        icon={<Plus size={16} />}
        addLabel="Add Supplier"
        onAdd={openCreate}
        permission="suppliers.create"
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-[#1e1e1e]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader>Code</TableCell>
                <TableCell isHeader>Name</TableCell>

                <TableCell isHeader>Contact Person</TableCell>
                <TableCell isHeader>Phone</TableCell>
                <TableCell isHeader>Email</TableCell>
                <TableCell isHeader>Address</TableCell>
                <TableCell isHeader>Products</TableCell>
                <TableCell isHeader className="text-right">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {suppliers.length > 0 ? (
                suppliers.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.supplier_code || "-"}</TableCell>
                    <TableCell>{s.name}</TableCell>

                    <TableCell>{s.contact_person || "-"}</TableCell>
                    <TableCell>{s.phone || "-"}</TableCell>
                    <TableCell>{s.email || "-"}</TableCell>
                    <TableCell>{s.address || "-"}</TableCell>
                    <TableCell>{s.products?.length || 0}</TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/suppliers/${s.id}`}>
                          <IconButton
                            icon={Eye}
                            tooltip="View Details"
                            color="purple"
                          />
                        </Link>

                        <Link to={`/suppliers/${s.id}/ledger`}>
                          <IconButton
                            icon={BookOpen}
                            tooltip="View Ledger"
                            color="green"
                          />
                        </Link>

                        <IconButton
                          icon={Pencil}
                          tooltip="Edit"
                          color="blue"
                          onClick={() => openEdit(s)}
                        />

                        <IconButton
                          icon={Trash2}
                          tooltip="Delete"
                          color="red"
                          onClick={() => openDelete(s)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No suppliers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <SupplierFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        supplier={editSupplier}
      />

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Delete Supplier"
        message={`Are you sure you want to delete "${supplierToDelete?.name}"?`}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
