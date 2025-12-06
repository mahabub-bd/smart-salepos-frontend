import { useState } from "react";
import { toast } from "react-toastify";

import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import TextArea from "../../../components/form/input/TextArea";
import Label from "../../../components/form/Label";
import { useProcessPurchaseReturnMutation } from "../../../features/purchase-return/purchaseReturnApi";

interface ProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseReturn: {
    id: number;
    return_no: string;
    supplier_name?: string;
    total: string;
  } | null;
  onSuccess?: () => void;
}

export default function ProcessingModal({
  isOpen,
  onClose,
  purchaseReturn,
  onSuccess,
}: ProcessingModalProps) {
  const [processingNotes, setProcessingNotes] = useState("");
  const [processPurchaseReturn, { isLoading }] = useProcessPurchaseReturnMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!purchaseReturn) return;

    try {
      await processPurchaseReturn({
        id: purchaseReturn.id,
        body: {
          processing_notes: processingNotes.trim() || undefined,
        },
      }).unwrap();

      toast.success(`Purchase return ${purchaseReturn.return_no} processed successfully`);
      setProcessingNotes("");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to process purchase return");
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setProcessingNotes("");
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-md w-full"
      title="Process Purchase Return"
    >
      {purchaseReturn ? (
        <form onSubmit={handleSubmit}>
          {/* Return Information */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              Return #{purchaseReturn.return_no}
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              {purchaseReturn.supplier_name && (
                <p>Supplier: <span className="font-medium text-gray-900">{purchaseReturn.supplier_name}</span></p>
              )}
              <p>Amount: <span className="font-medium text-gray-900">{parseFloat(purchaseReturn.total).toLocaleString()}</span></p>
            </div>
          </div>

          {/* Processing Notes */}
          <div className="mb-6">
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Processing Notes (Optional)
            </Label>
            <TextArea
              rows={3}
              className="w-full"
              placeholder="Add any notes about this processing..."
              value={processingNotes}
              onChange={(value) => setProcessingNotes(value)}
              disabled={isLoading}
            />
          </div>

          {/* Confirmation Message */}
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Are you sure you want to process this purchase return? This action will update inventory levels and post accounting entries.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Processing..." : "Process"}
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-center text-gray-500">Loading purchase return details...</p>
      )}
    </Modal>
  );
}