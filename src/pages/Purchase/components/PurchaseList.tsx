import { Eye, FileCheck, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import IconButton from "../../../components/common/IconButton";
import Loading from "../../../components/common/Loading";
import PageHeader from "../../../components/common/PageHeader";

import { useGetPurchasesQuery } from "../../../features/purchases/purchasesApi";

import { Purchase } from "../../../types";
import PurchaseFormModal from "./PurchaseFormModal";
import PurchaseReceiveModal from "./PurchaseReceiveModal";

export default function PurchaseList() {
  const { data, isLoading, isError } = useGetPurchasesQuery();
  const navigate = useNavigate();

  const purchases = data?.data || [];

  // State
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );

  // Open create purchase modal
  const openCreateModal = () => {
    setSelectedPurchase(null); // Create mode
    setIsFormModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsFormModalOpen(true);
  };

  // Open receive modal
  const openReceiveModal = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsReceiveModalOpen(true);
  };

  if (isLoading) return <Loading message="Loading Purchases..." />;
  if (isError)
    return <p className="p-6 text-red-500">Failed to fetch purchases.</p>;

  return (
    <>
      <PageHeader
        title="Purchase Management"
        icon={<Plus size={16} />}
        addLabel="Add Purchase"
        onAdd={openCreateModal}
        permission="purchase.create"
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="table-header">PO No</th>
                <th className="table-header">Supplier</th>
                <th className="table-header">Total</th>
                <th className="table-header">Status</th>
                <th className="table-header">Created At</th>
                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {purchases.length > 0 ? (
                purchases.map((p) => (
                  <tr key={p.id} className="border-b">
                    <td className="table-body font-medium">{p.po_no}</td>
                    <td className="table-body">
                      {p.supplier?.name || `Supplier #${p.supplier_id}`}
                    </td>
                    <td className="table-body">{p.total}</td>
                    <td className="table-body capitalize">{p.status}</td>
                    <td className="table-body">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>

                    <td className="table-body text-right">
                      <div className="flex justify-end gap-2">
                        {/* View Details */}
                        <IconButton
                          icon={Eye}
                          color="gray"
                          onClick={() => navigate(`/purchases/${p.id}`)}
                        />

                        {/* Receive */}
                        <IconButton
                          icon={FileCheck}
                          color="green"
                          onClick={() => openReceiveModal(p)}
                        />

                        {/* Edit */}
                        <IconButton
                          icon={Pencil}
                          color="blue"
                          onClick={() => openEditModal(p)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500">
                    No purchases found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receive Modal */}
      {selectedPurchase && (
        <PurchaseReceiveModal
          isOpen={isReceiveModalOpen}
          onClose={() => setIsReceiveModalOpen(false)}
          purchase={selectedPurchase}
        />
      )}

      {/* Add/Edit Purchase Modal */}
      <PurchaseFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        purchase={selectedPurchase} // null = create, object = edit
      />
    </>
  );
}
