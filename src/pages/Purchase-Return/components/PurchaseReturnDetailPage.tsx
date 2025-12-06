import {
  ArrowLeft,
  Calendar,
  FileText,
  MapPin,
  Package,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../../../components/ui/button/Button";
import { useGetPurchaseReturnByIdQuery } from "../../../features/purchase-return/purchaseReturnApi";
import ApprovalModal from "./ApprovalModal";
import CancelModal from "./CancelModal";
import ProcessingModal from "./ProcessingModal";
import PurchaseReturnStatusBadge from "./PurchaseReturnStatusBadge";
import RefundModal from "./RefundModal";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

export default function PurchaseReturnDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: purchaseReturnData,
    isLoading,
    isError,
    refetch,
  } = useGetPurchaseReturnByIdQuery(id!);

  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);

  const purchaseReturn = purchaseReturnData?.data;

  const handleApproveClick = () => {
    setIsApprovalModalOpen(true);
  };

  const handleProcessClick = () => {
    setIsProcessingModalOpen(true);
  };

  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
  };

  const handleRefundClick = () => {
    setIsRefundModalOpen(true);
  };

  if (isLoading)
    return <div className="p-6">Loading purchase return details...</div>;

  if (isError || !purchaseReturn) {
    return (
      <div className="p-6">
        <p className="text-red-500 mb-4">Purchase return not found</p>
        <Button onClick={() => navigate("/purchase-returns")} variant="outline">
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-end mb-4">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/purchase-returns")}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to list
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Purchase Return #{purchaseReturn.return_no}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Created on{" "}
              {new Date(purchaseReturn.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Action Buttons */}
            {purchaseReturn.status === "draft" && (
              <>
                <Button
                  size="sm"
                  onClick={handleApproveClick}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  onClick={handleCancelClick}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Cancel
                </Button>
              </>
            )}
            {purchaseReturn.status === "approved" && (
              <>
                <Button
                  size="sm"
                  onClick={handleProcessClick}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Process
                </Button>
                <Button
                  size="sm"
                  onClick={handleCancelClick}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Cancel
                </Button>
              </>
            )}
            {purchaseReturn.status === "processed" && !purchaseReturn.refund_to_supplier && (
              <Button
                size="sm"
                onClick={handleRefundClick}
                className="bg-green-600 hover:bg-green-700"
              >
                Process Refund
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Purchase Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText size={18} />
              Purchase Information
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Purchase Order</p>
                <p className="font-medium">
                  {purchaseReturn.purchase?.po_no ||
                    `PO #${purchaseReturn.purchase_id}`}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-medium text-lg">
                  {parseFloat(purchaseReturn.total || "0").toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Return Date</p>
                <p className="font-medium flex items-center gap-2">
                  <Calendar size={16} />
                  {new Date(purchaseReturn.created_at).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Reason</p>
                <p className="font-medium">{purchaseReturn.reason}</p>
              </div>
            </div>
          </div>

          {/* Original Purchase Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package size={18} />
              Original Purchase Details
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Purchase Order #</p>
                <p className="font-medium">{purchaseReturn.purchase?.po_no}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Purchase Total</p>
                <p className="font-medium">
                  {parseFloat(
                    purchaseReturn.purchase?.total || "0"
                  ).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Paid Amount</p>
                <p className="font-medium">
                  {parseFloat(
                    purchaseReturn.purchase?.paid_amount || "0"
                  ).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Due Amount</p>
                <p className="font-medium">
                  {parseFloat(
                    purchaseReturn.purchase?.due_amount || "0"
                  ).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Purchase Status</p>
                <p className="font-medium capitalize">
                  {purchaseReturn.purchase?.status}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Created Date</p>
                <p className="font-medium">
                  {purchaseReturn.purchase?.created_at
                    ? new Date(
                        purchaseReturn.purchase.created_at
                      ).toLocaleDateString()
                    : "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Approval Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText size={18} />
              Approval Status
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <PurchaseReturnStatusBadge status={purchaseReturn.status} />
                </div>
              </div>

              {/* Approved At */}
              <div>
                <p className="text-sm text-gray-600">Approved At</p>
                <p className="font-medium">
                  {purchaseReturn.approved_at
                    ? new Date(
                        purchaseReturn.approved_at
                      ).toLocaleDateString() +
                      " " +
                      new Date(purchaseReturn.approved_at).toLocaleTimeString()
                    : "-"}
                </p>
              </div>

              {/* Approved By */}
              <div>
                <p className="text-sm text-gray-600">Approved By</p>
                <p className="font-medium">
                  {purchaseReturn.approved_user?.full_name || "-"}
                </p>
              </div>

              {/* Processed By */}
              <div>
                <p className="text-sm text-gray-600">Processed By</p>
                <p className="font-medium">
                  {purchaseReturn.processed_user?.full_name || "-"}
                </p>
              </div>

              {/* Processed At */}
              <div>
                <p className="text-sm text-gray-600">Processed At</p>
                <p className="font-medium">
                  {purchaseReturn.processed_at
                    ? new Date(
                        purchaseReturn.processed_at
                      ).toLocaleDateString() +
                      " " +
                      new Date(purchaseReturn.processed_at).toLocaleTimeString()
                    : "-"}
                </p>
              </div>

              {/* Approval Notes */}
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Approval Notes</p>
                <p className="font-medium">
                  {purchaseReturn.approval_notes || "-"}
                </p>
              </div>

              {/* Processing Notes */}
              {purchaseReturn.processing_notes && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Processing Notes</p>
                  <p className="font-medium">
                    {purchaseReturn.processing_notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Refund Information */}
          {purchaseReturn.refund_to_supplier && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText size={18} />
                Refund Information
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Refund to Supplier</p>
                  <p className="font-medium capitalize">
                    {purchaseReturn.refund_to_supplier ? "Yes" : "No"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Refund Amount</p>
                  <p className="font-medium text-lg">
                    {parseFloat(
                      purchaseReturn.refund_amount || "0"
                    ).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium capitalize">
                    {purchaseReturn.refund_payment_method || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Refund Reference</p>
                  <p className="font-medium">
                    {purchaseReturn.refund_reference || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Refunded At</p>
                  <p className="font-medium">
                    {purchaseReturn.refunded_at
                      ? new Date(
                          purchaseReturn.refunded_at
                        ).toLocaleDateString() +
                        " " +
                        new Date(
                          purchaseReturn.refunded_at
                        ).toLocaleTimeString()
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Debit Account Code</p>
                  <p className="font-medium">
                    {purchaseReturn.debit_account_code || "-"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Refund History */}
          {purchaseReturn.refund_history && purchaseReturn.refund_history.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText size={18} />
                Refund Transaction History
              </h2>

              <div className="space-y-3">
                {purchaseReturn.refund_history.map((history, index) => (
                  <div key={history.id || index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                          Amount
                        </p>
                        <p className="font-semibold text-lg text-green-600">
                          {parseFloat(history.amount || "0").toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                          Method
                        </p>
                        <p className="font-medium capitalize">
                          {history.method || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                          Date & Time
                        </p>
                        <p className="font-medium text-sm">
                          {history.created_at
                            ? new Date(history.created_at).toLocaleDateString() +
                              " " +
                              new Date(history.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                          Debit Account
                        </p>
                        <p className="font-mono text-sm">
                          {history.debit_account_code || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                          Credit Account
                        </p>
                        <p className="font-mono text-sm">
                          {history.credit_account_code || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                          Type
                        </p>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                          {history.type?.replace(/_/g, " ") || "-"}
                        </span>
                      </div>
                    </div>

                    {history.note && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">
                          Note
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {history.note}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Returned Items */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package size={18} />
              Returned Items
            </h2>

            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableCell isHeader>Product</TableCell>
                    <TableCell isHeader className="text-center">
                      SKU
                    </TableCell>
                    <TableCell isHeader className="text-center">
                      Barcode
                    </TableCell>
                    <TableCell isHeader className="text-center">
                      Returned Qty
                    </TableCell>
                    <TableCell isHeader className="text-right">
                      Price
                    </TableCell>
                    <TableCell isHeader className="text-right">
                      Total
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {purchaseReturn.items.map((item, index) => (
                    <TableRow key={item.id || index}>
                      <TableCell>
                        <p className="font-medium">{item.product?.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.product?.description}
                        </p>
                      </TableCell>

                      <TableCell className="text-center">
                        {item.product?.sku}
                      </TableCell>

                      <TableCell className="text-center font-mono text-sm">
                        {item.product?.barcode}
                      </TableCell>

                      <TableCell className="text-center">
                        {item.returned_quantity}
                      </TableCell>

                      <TableCell className="text-right">
                        {(typeof item.price === "string"
                          ? parseFloat(item.price)
                          : item.price
                        ).toLocaleString()}
                      </TableCell>

                      <TableCell className="text-right font-medium">
                        {parseFloat(item.line_total || "0").toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Footer total row */}
                  <TableRow>
                    <TableCell colSpan={5} className="text-right font-semibold">
                      Total Return Amount:
                    </TableCell>
                    <TableCell className="text-right text-lg font-bold text-orange-600">
                      {parseFloat(purchaseReturn.total || "0").toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Supplier Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User size={18} />
              Supplier Information
            </h2>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{purchaseReturn.supplier?.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Supplier Code</p>
                <p className="font-medium">
                  {purchaseReturn.supplier?.supplier_code}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Contact Person</p>
                <p className="font-medium">
                  {purchaseReturn.supplier?.contact_person}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{purchaseReturn.supplier?.phone}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{purchaseReturn.supplier?.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium text-sm">
                  {purchaseReturn.supplier?.address}
                </p>
              </div>
            </div>
          </div>

          {/* Warehouse Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin size={18} />
              Warehouse Information
            </h2>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{purchaseReturn.warehouse?.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium">
                  {purchaseReturn.warehouse?.location}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium text-sm">
                  {purchaseReturn.warehouse?.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Modal */}
      <ApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        purchaseReturn={
          purchaseReturn
            ? {
                id: purchaseReturn.id,
                return_no: purchaseReturn.return_no,
                supplier_name: purchaseReturn.supplier?.name,
                total: purchaseReturn.total || "0",
              }
            : null
        }
        onSuccess={() => {
          refetch();
        }}
      />

      {/* Processing Modal */}
      <ProcessingModal
        isOpen={isProcessingModalOpen}
        onClose={() => setIsProcessingModalOpen(false)}
        purchaseReturn={
          purchaseReturn
            ? {
                id: purchaseReturn.id,
                return_no: purchaseReturn.return_no,
                supplier_name: purchaseReturn.supplier?.name,
                total: purchaseReturn.total || "0",
              }
            : null
        }
        onSuccess={() => {
          refetch();
        }}
      />

      {/* Cancel Modal */}
      <CancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        purchaseReturn={
          purchaseReturn
            ? {
                id: purchaseReturn.id,
                return_no: purchaseReturn.return_no,
                supplier_name: purchaseReturn.supplier?.name,
                total: purchaseReturn.total || "0",
              }
            : null
        }
        onSuccess={() => {
          refetch();
        }}
      />

      {/* Refund Modal */}
      <RefundModal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        purchaseReturn={
          purchaseReturn
            ? {
                id: purchaseReturn.id,
                return_no: purchaseReturn.return_no,
                supplier_name: purchaseReturn.supplier?.name,
                total: purchaseReturn.total || "0",
                status: purchaseReturn.status,
              }
            : null
        }
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
}
