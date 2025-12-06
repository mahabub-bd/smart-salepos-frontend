import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useCreatePurchaseReturnMutation } from "../../../features/purchase-return/purchaseReturnApi";

interface PurchaseItem {
  id: number;
  product: {
    id: number;
    name: string;
    sku: string;
  };
  product_id: number;
  quantity: number;
  price: string;
}

interface Purchase {
  id: number;
  po_no: string;
  supplier_id: number;
  warehouse_id: number;
  supplier: {
    id: number;
    name: string;
  };
  warehouse: {
    id: number;
    name: string;
  };
  items: PurchaseItem[];
}

interface PurchaseReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchase: Purchase | null;
}

export default function PurchaseReturnModal({
  isOpen,
  onClose,
  purchase,
}: PurchaseReturnModalProps) {
  const [createPurchaseReturn, { isLoading }] =
    useCreatePurchaseReturnMutation();
  const [returnItems, setReturnItems] = useState<
    Array<{
      purchase_item_id: number;
      product_id: number;
      returned_quantity: number;
      price: number;
      max_quantity: number;
    }>
  >([]);
  const [reason, setReason] = useState("");

  // Initialize return items when purchase changes
  useEffect(() => {
    if (purchase && isOpen) {
      setReturnItems(
        purchase.items.map((item) => ({
          purchase_item_id: item.id,
          product_id: item.product_id,
          returned_quantity: 0,
          price: parseFloat(item.price),
          max_quantity: item.quantity,
        }))
      );
      setReason("");
    }
  }, [purchase, isOpen]);

  if (!isOpen) return null;

  const handleQuantityChange = (index: number, value: string) => {
    const qty = parseInt(value) || 0;
    const newItems = [...returnItems];
    newItems[index].returned_quantity = Math.min(
      qty,
      newItems[index].max_quantity
    );
    setReturnItems(newItems);
  };

  const getTotalReturnAmount = () => {
    return returnItems.reduce(
      (total, item) => total + item.returned_quantity * item.price,
      0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!purchase) return;

    const itemsToReturn = returnItems.filter(
      (item) => item.returned_quantity > 0
    );

    if (itemsToReturn.length === 0) {
      toast.error("Please select at least one item to return");
      return;
    }

    if (!reason.trim()) {
      toast.error("Please provide a reason for return");
      return;
    }

    try {
      await createPurchaseReturn({
        purchase_id: purchase.id,
        supplier_id: purchase.supplier_id,
        warehouse_id: purchase.warehouse_id,
        reason: reason.trim(),
        items: itemsToReturn.map((item) => ({
          product_id: item.product_id,
          purchase_item_id: item.purchase_item_id,
          returned_quantity: item.returned_quantity,
          price: item.price,
        })),
      }).unwrap();

      toast.success("Purchase return created successfully");
      onClose();
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to create purchase return");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-3xl w-full max-h-[90vh] "
      title="Create Purchase Return"
      description={`Po No ${purchase?.po_no}`}
    >
      {purchase ? (
        <form onSubmit={handleSubmit}>
          {/* Purchase Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex gap-2 items-center ">
              <Label>Supplier :{purchase.supplier.name} </Label>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Warehouse: {purchase.warehouse.name}
              </Label>
            </div>
          </div>

          {/* Reason */}
          <div className="mb-6">
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Return *
            </Label>
            <TextArea
              rows={3}
              className="w-full"
              placeholder="Enter reason for return..."
              value={reason}
              onChange={(value) => setReason(value)}
            />
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <Label className="block text-sm font-medium text-gray-700 mb-3">
              Return Items
            </Label>
            <div className="border rounded-lg overflow-hidden">
              <Table className="w-full">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableCell isHeader>Product</TableCell>
                    <TableCell isHeader>Ordered</TableCell>
                    <TableCell isHeader>Return Qty</TableCell>
                    <TableCell isHeader>Price</TableCell>
                    <TableCell isHeader>Total</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y">
                  {returnItems.map((item, index) => (
                    <TableRow
                      key={item.purchase_item_id}
                      className="hover:bg-gray-50"
                    >
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {purchase.items[index].product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            SKU: {purchase.items[index].product.sku}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{item.max_quantity}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max={item.max_quantity}
                          value={item.returned_quantity}
                          onChange={(e) =>
                            handleQuantityChange(index, e.target.value)
                          }
                          className="w-20 text-center"
                        />
                      </TableCell>
                      <TableCell>{item.price.toLocaleString()}</TableCell>
                      <TableCell>
                        {(item.returned_quantity * item.price).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg">
            <span className="text-lg font-medium">Total Return Amount</span>
            <span className="text-xl font-bold text-orange-600">
              {getTotalReturnAmount().toLocaleString()}
            </span>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Return"}
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-center text-gray-500">Loading purchase details...</p>
      )}
    </Modal>
  );
}
