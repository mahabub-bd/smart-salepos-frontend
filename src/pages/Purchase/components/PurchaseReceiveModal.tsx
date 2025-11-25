import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "../../../components/ui/modal";
import { useReceivePurchaseMutation } from "../../../features/purchases/purchasesApi";
import { Purchase } from "../../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  purchase: Purchase;
}

export default function PurchaseReceiveModal({
  isOpen,
  onClose,
  purchase,
}: Props) {
  const [receivePurchase] = useReceivePurchaseMutation();
  const [items, setItems] = useState(
    purchase.items.map((i) => ({
      id: i.id,
      product_id: i.product_id,
      received_qty: i.quantity,
    }))
  );

  const handleQtyChange = (index: number, qty: number) => {
    const updated = [...items];
    updated[index].received_qty = qty;
    setItems(updated);
  };

  const handleSubmit = async () => {
    try {
      await receivePurchase({
        id: purchase.id,
        body: { items },
      }).unwrap();

      toast.success("Purchase items received successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to receive items");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg p-6 min-h-[400px] max-h-screen overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">
        Receive Items – {purchase.po_no}
      </h2>
      <p>Product Received </p>
      <div className="space-y-4">
        {purchase.items.map((item, idx) => (
          <div key={item.id} className="flex justify-between items-center">
            <p>{item.product?.name}</p>

            <input
              type="number"
              className="w-24 border px-2 py-1 rounded"
              value={items[idx].received_qty}
              onChange={(e) => handleQtyChange(idx, Number(e.target.value))}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg w-full"
      >
        Confirm Receive
      </button>
    </Modal>
  );
}
