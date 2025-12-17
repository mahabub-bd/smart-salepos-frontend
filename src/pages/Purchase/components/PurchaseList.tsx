import {
  Eye,
  FileCheck,
  MoreVertical,
  Pencil,
  Plus,
  RotateCcw,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Loading from "../../../components/common/Loading";
import PageHeader from "../../../components/common/PageHeader";
import { Dropdown } from "../../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../../components/ui/dropdown/DropdownItem";
import { useGetPurchasesQuery } from "../../../features/purchases/purchasesApi";
import { formatDateTime } from "../../../utlis";
import PurchaseReturnModal from "../../Purchase-Return/components/PurchaseReturnModal";
import PurchaseStatusBadge from "./PurchaseStatusBadge";

export default function PurchaseList() {
  const { data, isLoading, isError } = useGetPurchasesQuery();
  const navigate = useNavigate();
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | number | null>(null);

  const purchases = data?.data?.purchases || [];

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
                <th className="table-header text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {purchases.length > 0 ? (
                purchases.map((p) => {
                  const total = Number(p.total_amount || p.total || 0);
                  const paid = Number(p.paid_amount || 0);
                  const due = Number(p.due_amount || 0);
                  const isFullyPaid = due === 0;
                  const isReceived =
                    p.status === "fully_received" ||
                    p.status === "partial_received";
                  const canReturn =
                    p.status === "fully_received" ||
                    p.status === "partial_received";
                  const isDraft = p.status === "draft";
                  const canEdit = isDraft && !isReceived;
                  const shouldHideEditAndPayment =
                    isFullyPaid && p.status === "fully_received";

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
                        ৳{total.toLocaleString()}
                      </td>

                      {/* Paid */}
                      <td className="table-body text-green-600 font-medium">
                        ৳{paid.toLocaleString()}
                      </td>

                      {/* Due */}
                      <td
                        className={`table-body font-medium ${
                          due > 0 ? "text-red-500" : "text-gray-500"
                        }`}
                      >
                        ৳{due.toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="table-body capitalize">
                        <PurchaseStatusBadge status={p.status} />
                      </td>

                      {/* Created Date */}
                      <td className="table-body">
                        {formatDateTime(p.created_at)}
                      </td>

                      {/* Actions */}
                      <td className="table-body">
                        <div className="relative">
                          <button
                            onClick={() =>
                              setActiveDropdown(
                                activeDropdown === p.id ? null : p.id
                              )
                            }
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical size={16} className="text-gray-600" />
                          </button>

                          <Dropdown
                            isOpen={activeDropdown === p.id}
                            onClose={() => setActiveDropdown(null)}
                            className="min-w-[180px]"
                          >
                            {/* View Details */}
                            <DropdownItem
                              onClick={() => {
                                navigate(`/purchases/${p.id}`);
                                setActiveDropdown(null);
                              }}
                              className="flex items-center gap-2"
                            >
                              <Eye size={14} />
                              View Details
                            </DropdownItem>

                            {/* Receive Items - Only show when not received */}
                            {!isReceived && (
                              <DropdownItem
                                onClick={() => {
                                  navigate(`/purchases/${p.id}?receive=true`);
                                  setActiveDropdown(null);
                                }}
                                className="flex items-center gap-2"
                              >
                                <FileCheck size={14} />
                                Receive Items
                              </DropdownItem>
                            )}

                            {/* Make Payment - Only show when due > 0 or not fully received */}
                            {!shouldHideEditAndPayment && (
                              <DropdownItem
                                onClick={() => {
                                  navigate(`/purchases/${p.id}?payment=true`);
                                  setActiveDropdown(null);
                                }}
                                disabled={isFullyPaid}
                                className="flex items-center gap-2"
                              >
                                <Wallet size={14} />
                                Make Payment
                              </DropdownItem>
                            )}

                            {/* Purchase Return */}
                            <DropdownItem
                              onClick={() => {
                                setSelectedPurchase(p);
                                setIsReturnModalOpen(true);
                                setActiveDropdown(null);
                              }}
                              disabled={!canReturn}
                              className="flex items-center gap-2"
                            >
                              <RotateCcw size={14} />
                              Purchase Return
                            </DropdownItem>

                            {/* Edit Purchase - Only for draft status and not received, or when not fully paid and received */}
                            {!shouldHideEditAndPayment && (
                              <DropdownItem
                                onClick={() => {
                                  navigate(`/purchases/edit/${p.id}`);
                                  setActiveDropdown(null);
                                }}
                                disabled={!canEdit}
                                className="flex items-center gap-2"
                              >
                                <Pencil size={14} />
                                Edit
                              </DropdownItem>
                            )}
                          </Dropdown>
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
