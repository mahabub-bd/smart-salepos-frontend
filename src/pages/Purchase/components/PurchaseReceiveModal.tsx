import { useState } from "react";
import { toast } from "react-toastify";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import { useReceivePurchaseMutation } from "../../../features/purchases/purchasesApi";
import { Purchase, ReceivePurchaseItemPayload } from "../../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  purchase: Purchase;
}

interface ReceiveItemState {
  purchase_item_id: number;
  product_id: number;
  received_quantity: number;
  batch_no?: string;
  expiry_date?: string;
}

export default function PurchaseReceiveModal({
  isOpen,
  onClose,
  purchase,
}: Props) {
  const [receivePurchase] = useReceivePurchaseMutation();
  const [items, setItems] = useState<ReceiveItemState[]>(
    purchase.items.map((i) => ({
      purchase_item_id: i.id,
      product_id: i.product_id,
      received_quantity: i.quantity,
    }))
  );

  const handleQtyChange = (index: number, qty: number) => {
    const updated = [...items];
    updated[index].received_quantity = qty;
    setItems(updated);
  };

  const handleSubmit = async () => {
    try {
      // Map to the correct payload shape
      const payload: ReceivePurchaseItemPayload[] = items.map(item => ({
        purchase_item_id: item.purchase_item_id,
        received_quantity: item.received_quantity,
        batch_no: item.batch_no,
        expiry_date: item.expiry_date,
      }));

      await receivePurchase({
        id: purchase.id,
        body: { items: payload },
      }).unwrap();

      toast.success("Purchase items received successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to receive items");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Purchase Receive Items"
      description="Review and enter the received quantities for this purchase order."
      className="max-w-lg p-6 min-h-[400px] max-h-screen overflow-y-auto"
    >
      <div className="space-y-4">
        {purchase.items.map((item, idx) => (
          <div key={item.id} className="flex justify-between items-center">
            <p>{item.product?.name}</p>

            <input
              type="number"
              className="w-24 border px-2 py-1 rounded"
              value={items[idx].received_quantity}
              onChange={(e) => handleQtyChange(idx, Number(e.target.value))}
            />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Button onClick={handleSubmit} variant="primary" className="w-full">
          Confirm Receive
        </Button>
      </div>
    </Modal>
  );
}
