import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import ConfirmDialog from "../../../components/common/ConfirmDialog";
import IconButton from "../../../components/common/IconButton";
import Loading from "../../../components/common/Loading";
import PageHeader from "../../../components/common/PageHeader";

import {
  useDeleteSupplierMutation,
  useGetSuppliersQuery,
} from "../../../features/suppliers/suppliersApi";
import { Supplier } from "../../../types";
import SupplierFormModal from "./SupplierFormModal";

export default function SupplierList() {
  const { data, isLoading, isError } = useGetSuppliersQuery();
  const [deleteSupplier] = useDeleteSupplierMutation();

  const suppliers = data?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(
    null
  );

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
  if (isError)
    return <p className="p-6 text-red-500">Failed to fetch suppliers.</p>;

  return (
    <>
      <PageHeader
        title="Supplier Management"
        icon={<Plus size={16} />}
        addLabel="Add Supplier"
        onAdd={openCreate}
        permission="suppliers.create"
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header">Contact Person</th>
                <th className="table-header">Phone</th>
                <th className="table-header">Email</th>
                <th className="table-header">Address</th>
                <th className="table-header">Products</th>


                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {suppliers.length ? (
                suppliers.map((s) => (
                  <tr key={s.id} className="border-b">
                    <td className="table-body">{s.name}</td>
                    <td className="table-body">{s.contact_person || "-"}</td>
                    <td className="table-body">{s.phone || "-"}</td>
                    <td className="table-body">{s.email || "-"}</td>
                    <td className="table-body">{s.address || "-"}</td>
                    <td className="table-body">{s.products?.length || 0}</td>

                    <td className="table-body text-right">
                      <div className="flex justify-end gap-2">
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
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No suppliers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
