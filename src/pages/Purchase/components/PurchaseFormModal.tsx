import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import { Modal } from "../../../components/ui/modal";

import { useGetWarehousesQuery } from "../../../features/warehouse/warehouseApi";

import { useGetProductsQuery } from "../../../features/product/productApi";
import {
  useCreatePurchaseMutation,
  useUpdatePurchaseMutation,
} from "../../../features/purchases/purchasesApi";
import { useGetSuppliersQuery } from "../../../features/suppliers/suppliersApi";
import { Purchase } from "../../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  purchase: Purchase | null; // null = create
}

export default function PurchaseFormModal({
  isOpen,
  onClose,
  purchase,
}: Props) {
  const isEdit = !!purchase;

  const [createPurchase] = useCreatePurchaseMutation();
  const [updatePurchase] = useUpdatePurchaseMutation();

  // Fetch dropdown data
  const { data: supplierData } = useGetSuppliersQuery();
  const { data: productsData } = useGetProductsQuery();
  const { data: warehouseData } = useGetWarehousesQuery();

  const suppliers = supplierData?.data || [];
  const products = productsData?.data || [];
  const warehouses = warehouseData?.data || [];

  // Form State
  const [form, setForm] = useState({
    po_no: "",
    supplier_id: "",
    warehouse_id: "",
  });

  const [items, setItems] = useState<
    { product_id: string; quantity: number; price: number }[]
  >([]);

  // Load Edit Data
  useEffect(() => {
    if (isEdit && purchase) {
      setForm({
        po_no: purchase.po_no,
        supplier_id: String(purchase.supplier_id),
        warehouse_id: String(purchase.warehouse_id),
      });

      setItems(
        purchase.items.map((i) => ({
          product_id: String(i.product_id),
          quantity: i.quantity,
          price: Number(i.price),
        }))
      );
    } else {
      setForm({
        po_no: "",
        supplier_id: "",
        warehouse_id: "",
      });
      setItems([]);
    }
  }, [isEdit, purchase]);

  // Add new item row
  const addItem = () => {
    setItems([...items, { product_id: "", quantity: 1, price: 0 }]);
  };

  // Remove item row
  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Update item field
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  // Calculate total
  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  // Submit Form
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (items.length === 0) {
      return toast.error("Add at least 1 item");
    }

    const basePayload = {
      ...form,
      supplier_id: Number(form.supplier_id),
      warehouse_id: Number(form.warehouse_id),
      total: String(total),
    };

    try {
      if (isEdit && purchase) {
        await updatePurchase({ id: purchase.id, body: basePayload }).unwrap();
        toast.success("Purchase updated successfully");
      } else {
        const payload = {
          po_no: form.po_no,
          supplier_id: Number(form.supplier_id),
          warehouse_id: Number(form.warehouse_id),
          total: String(total),
          items: items.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
          })),
        };
        await createPurchase(payload).unwrap();
        toast.success("Purchase created successfully");
      }

      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl p-6">
      <h2 className="text-lg font-semibold mb-4">
        {isEdit ? "Edit Purchase" : "Create New Purchase"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Purchase Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>PO Number</Label>
            <Input
              required
              value={form.po_no}
              onChange={(e) => setForm({ ...form, po_no: e.target.value })}
            />
          </div>

          <div>
            <Label>Supplier</Label>
            <Select
              options={suppliers.map((s) => ({
                value: String(s.id),
                label: s.name,
              }))}
              defaultValue={form.supplier_id}
              onChange={(e: any) => setForm({ ...form, supplier_id: e.value })}
            />
          </div>

          <div>
            <Label>Warehouse</Label>
            <Select
              options={warehouses.map((w) => ({
                value: String(w.id),
                label: w.name,
              }))}
              defaultValue={form.warehouse_id}
              onChange={(e: any) => setForm({ ...form, warehouse_id: e.value })}
            />
          </div>
        </div>

        {/* Items */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between mb-3">
            <h3 className="font-medium">Purchase Items</h3>
            <button
              type="button"
              onClick={addItem}
              className="px-3 py-1 bg-brand-600 text-white rounded-md"
            >
              Add Item
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 items-end border-b pb-3"
              >
                {/* Product */}
                <div>
                  <Label>Product</Label>
                  <Select
                    options={products.map((p) => ({
                      value: String(p.id),
                      label: p.name,
                    }))}
                    defaultValue={item.product_id}
                    onChange={(e: any) =>
                      updateItem(index, "product_id", e.value)
                    }
                  />
                </div>

                {/* Quantity */}
                <div>
                  <Label>Qty</Label>
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", Number(e.target.value))
                    }
                  />
                </div>

                {/* Price */}
                <div>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    min={0}
                    value={item.price}
                    onChange={(e) =>
                      updateItem(index, "price", Number(e.target.value))
                    }
                  />
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}

            {items.length === 0 && (
              <p className="text-gray-400 text-sm">
                No items added. Click "Add Item".
              </p>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="text-right font-semibold text-lg">
          Total: {total.toFixed(2)}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg"
        >
          {isEdit ? "Update Purchase" : "Create Purchase"}
        </button>
      </form>
    </Modal>
  );
}
