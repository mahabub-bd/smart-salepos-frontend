import { FileCheck, Wallet } from "lucide-react";
import { useState } from "react";

import IconButton from "../../../components/common/IconButton";
import Loading from "../../../components/common/Loading";
import { useGetPurchaseByIdQuery } from "../../../features/purchases/purchasesApi";
import { PurchaseItem } from "../../../types";
import PurchasePaymentModal from "./PurchasePaymentModal";
import PurchaseReceiveModal from "./PurchaseReceiveModal";
import PurchaseStatusBadge from "./PurchaseStatusBadge";

interface Props {
  purchaseId: string;
}

export default function PurchaseDetail({ purchaseId }: Props) {
  const { data, isLoading, isError } = useGetPurchaseByIdQuery(purchaseId);
  const purchase = data?.data;

  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  if (isLoading) return <Loading message="Loading Purchase..." />;
  if (isError || !purchase)
    return <p className="p-6 text-red-500">Failed to load purchase details.</p>;

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Purchase Details</h1>
        <div className="flex justify-end gap-4">
          {purchase.status === "ordered" && (
            <IconButton
              icon={FileCheck}
              color="green"
              tooltip=" Receive Items"
              onClick={() => setIsReceiveModalOpen(true)}
            >
              Receive Items
            </IconButton>
          )}
          {Number(purchase.due_amount) > 0 && (
            <IconButton
              icon={Wallet}
              color="purple"
              tooltip="Make Payment"
              onClick={() => setIsPaymentModalOpen(true)}
            >
              Make Payment
            </IconButton>
          )}
        </div>
      </div>

      {/* Purchase Info */}
      <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Purchase Information</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
          <Info label="PO Number" value={purchase.po_no} />
          <Info label="Supplier" value={purchase.supplier?.name || "-"} />
          <Info label="Warehouse" value={purchase.warehouse?.name || "-"} />

          <Info
            label="Purchase Status"
            value={<PurchaseStatusBadge status={purchase.status} />}
          />

          <Info
            label="Paid Amount"
            value={
              <span className="text-green-600 font-medium">
                {Number(purchase.paid_amount).toLocaleString()}
              </span>
            }
          />

          <Info
            label="Due Amount"
            value={
              <span
                className={
                  Number(purchase.due_amount) > 0
                    ? "text-red-500 font-semibold"
                    : "text-gray-500"
                }
              >
                {Number(purchase.due_amount).toLocaleString()}
              </span>
            }
          />

          <Info
            label="Date"
            value={new Date(purchase.created_at).toLocaleDateString()}
          />

          <Info
            label="Total Amount"
            value={
              <span className="font-semibold">
                {Number(purchase.total).toLocaleString()}
              </span>
            }
          />
        </div>
      </div>

      {/* Items Table */}
      <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
        <h2 className="text-lg font-medium mb-3">Purchased Items</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="table-header">Product</th>
                <th className="table-header">SKU</th>
                <th className="table-header">Qty</th>
                <th className="table-header">Price</th>
                <th className="table-header">Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {purchase.items.map((item: PurchaseItem) => (
                <tr key={item.id} className="border-b">
                  <td className="table-body">{item.product?.name || "-"}</td>
                  <td className="table-body">{item.product?.sku || "-"}</td>
                  <td className="table-body">{item.quantity}</td>
                  <td className="table-body">{item.price}</td>
                  <td className="table-body">
                    {(Number(item.price) * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="font-semibold">
                <td className="px-4 py-3" colSpan={4}>
                  Total
                </td>
                <td className="px-4 py-3">{purchase.total}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Receive Modal */}
      <PurchaseReceiveModal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
        purchase={purchase}
      />
      <PurchasePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        purchase={purchase}
      />
    </>
  );
}

const Info = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-gray-500 text-xs uppercase">{label}</p>
    <p className="mt-1 font-medium text-gray-800">{value}</p>
  </div>
);
