import { FileCheck } from "lucide-react";
import { useState } from "react";

import IconButton from "../../../components/common/IconButton";
import Loading from "../../../components/common/Loading";
import { useGetPurchaseByIdQuery } from "../../../features/purchases/purchasesApi";
import { PurchaseItem } from "../../../types";
import PurchaseReceiveModal from "./PurchaseReceiveModal";
import PurchaseStatusBadge from "./PurchaseStatusBadge";

interface Props {
  purchaseId: string;
}

export default function PurchaseDetail({ purchaseId }: Props) {
  const { data, isLoading, isError } = useGetPurchaseByIdQuery(purchaseId);
  const purchase = data?.data;

  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);

  if (isLoading) return <Loading message="Loading Purchase..." />;
  if (isError || !purchase)
    return <p className="p-6 text-red-500">Failed to load purchase details.</p>;

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Purchase Details</h1>
        {
          purchase.status === 'ordered' && (
            <IconButton
              icon={FileCheck}
              color="green"
              onClick={() => setIsReceiveModalOpen(true)}
            >
              Receive Items
            </IconButton>
          )}
      </div>

      {/* Purchase Info */}
      <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
        <h2 className="text-lg font-medium mb-3">Purchase Information</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <Info label="PO Number" value={purchase.po_no} />
          <Info label="Supplier" value={purchase.supplier?.name || "-"} />
          <Info label="Warehouse" value={purchase.warehouse?.name || "-"} />
          <div className="inline-flex items-center gap-2"> Purchase Status:  <PurchaseStatusBadge status={purchase.status} /></div>
          <Info label="Paid Amount" value={purchase.paid_amount} />
          <Info label="Due Amount" value={purchase.due_amount} />
          <Info
            label="Date"
            value={new Date(purchase.created_at).toLocaleDateString()}
          />
          <Info label="Total Amount" value={purchase.total} />
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
    </>
  );
}

const Info = ({ label, value }: { label: string; value: any }) => (
  <div>
    <p className="text-gray-500 text-xs">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);
