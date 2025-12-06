import { Eye, FileCheck, Pencil, Plus, RotateCcw, Wallet } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import IconButton from "../../../components/common/IconButton";
import Loading from "../../../components/common/Loading";
import PageHeader from "../../../components/common/PageHeader";
import { useGetPurchasesQuery } from "../../../features/purchases/purchasesApi";
import PurchaseReturnModal from "../../Purchase-Return/components/PurchaseReturnModal";
import PurchaseStatusBadge from "./PurchaseStatusBadge";

export default function PurchaseList() {
  const { data, isLoading, isError } = useGetPurchasesQuery();
  const navigate = useNavigate();
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  const purchases = data?.data || [];

  if (isLoading) return <Loading message="Loading Purchases..." />;
  if (isError)
    return <p className="p-6 text-red-500">Failed to fetch purchases.</p>;

  return (
    <>
      <PageHeader
        title="Purchase Management"
        icon={<Plus size={16} />}
        addLabel="Add Purchase"
        onAdd={() => navigate("/purchases/create")}
        permission="purchase.create"
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="table-header">PO No</th>
                <th className="table-header">Supplier</th>
                <th className="table-header">Warehouse</th>
                <th className="table-header">Total</th>
                <th className="table-header">Paid</th>
                <th className="table-header">Due</th>
                <th className="table-header">Status</th>
                <th className="table-header">Created At</th>
                <th className="table-header flex justify-end w-full ">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {purchases.length > 0 ? (
                purchases.map((p) => {
                  const total = Number(p.total || 0);
                  const paid = Number(p.paid_amount || 0);
                  const due = Number(p.due_amount || 0);
                  const isFullyPaid = due === 0;
                  const isReceived = p.status === "received";
                  const canReturn = p.status === "received";

                  return (
                    <tr key={p.id} className="border-b hover:bg-gray-50">
                      <td className="table-body font-medium">{p.po_no}</td>
                      <td className="table-body">
                        {p.supplier?.name || `Supplier #${p.supplier_id}`}
                      </td>
                      <td className="table-body">
                        {p.warehouse?.name || `Warehouse #${p.warehouse_id}`}
                      </td>

                      {/* Total */}
                      <td className="table-body font-medium">
                        {total.toLocaleString()}
                      </td>

                      {/* Paid */}
                      <td className="table-body text-green-600 font-medium">
                        {paid.toLocaleString()}
                      </td>

                      {/* Due */}
                      <td
                        className={`table-body font-medium ${
                          due > 0 ? "text-red-500" : "text-gray-500"
                        }`}
                      >
                        {due.toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="table-body capitalize">
                        <PurchaseStatusBadge status={p.status} />
                      </td>

                      {/* Created Date */}
                      <td className="table-body">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="table-body">
                        <div className="flex justify-end gap-2">
                          {/* View */}
                          <IconButton
                            icon={Eye}
                            color="gray"
                            tooltip="View"
                            onClick={() => navigate(`/purchases/${p.id}`)}
                          />

                          {/* Receive Items */}
                          <IconButton
                            icon={FileCheck}
                            color="green"
                            tooltip="Receive"
                            disabled={isReceived} // Disable if already received
                            onClick={() =>
                              navigate(`/purchases/${p.id}?receive=true`)
                            }
                          />

                          {/* Make Payment */}
                          <IconButton
                            icon={Wallet}
                            color="purple"
                            tooltip={isFullyPaid ? "No Due" : "Make Payment"}
                            disabled={isFullyPaid} // Disable if paid fully
                            onClick={() =>
                              navigate(`/purchases/${p.id}?payment=true`)
                            }
                          />

                          {/* Purchase Return */}
                          <IconButton
                            icon={RotateCcw}
                            tooltip="Purchase Return"
                            color="orange"
                            disabled={!canReturn}
                            onClick={() => {
                              setSelectedPurchase(p);
                              setIsReturnModalOpen(true);
                            }}
                          />

                          {/* Edit Purchase */}
                          <IconButton
                            icon={Pencil}
                            tooltip="Edit"
                            color="blue"
                            disabled={isReceived} // Optional: block edit if received
                            onClick={() => navigate(`/purchases/edit/${p.id}`)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-6 text-center text-gray-500">
                    No purchases found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purchase Return Modal */}
      <PurchaseReturnModal
        isOpen={isReturnModalOpen}
        onClose={() => {
          setIsReturnModalOpen(false);
          setSelectedPurchase(null);
        }}
        purchase={selectedPurchase}
      />
    </>
  );
}
