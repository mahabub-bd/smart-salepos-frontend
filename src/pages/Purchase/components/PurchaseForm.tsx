import { zodResolver } from "@hookform/resolvers/zod";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PurchaseFormValues, purchaseSchema } from "./purchaseSchema";

import PageHeader from "../../../components/common/PageHeader";
import PageMeta from "../../../components/common/PageMeta";
import {
  FormField,
  SelectField,
} from "../../../components/form/form-elements/SelectFiled";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";

import {
  useCreatePurchaseMutation,
  useGetPurchaseByIdQuery,
  useUpdatePurchaseMutation,
} from "../../../features/purchases/purchasesApi";

import { useGetProductsQuery } from "../../../features/product/productApi";
import { useGetSuppliersQuery } from "../../../features/suppliers/suppliersApi";
import { useGetWarehousesQuery } from "../../../features/warehouse/warehouseApi";

interface Props {
  mode: "create" | "edit";
  purchaseId?: string;
}

export default function PurchaseForm({ mode, purchaseId }: Props) {
  const navigate = useNavigate();
  const isEdit = mode === "edit";
  const [isFormReady, setIsFormReady] = useState(false);

  /** Fetch Data */
  const { data: supplierData, isLoading: isLoadingSuppliers } =
    useGetSuppliersQuery();
  const { data: productData, isLoading: isLoadingProducts } =
    useGetProductsQuery();
  const { data: warehouseData, isLoading: isLoadingWarehouses } =
    useGetWarehousesQuery();

  const suppliers = supplierData?.data || [];
  const products = productData?.data || [];
  const warehouses = warehouseData?.data || [];

  /** Fetch Existing Purchase (edit mode) */
  const { data: editData, isLoading: isLoadingPurchase } =
    useGetPurchaseByIdQuery(
      isEdit && purchaseId ? Number(purchaseId) : skipToken
    );

  const [createPurchase, { isLoading: isCreating }] =
    useCreatePurchaseMutation();
  const [updatePurchase, { isLoading: isUpdating }] =
    useUpdatePurchaseMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      po_no: "",
      supplier_id: 0,
      warehouse_id: 0,
      items: [{ product_id: 0, quantity: 1, price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  /** Prefill Edit Data - Enhanced with better data loading check */
  useEffect(() => {
    if (!isEdit) {
      setIsFormReady(true);
      return;
    }

    // Check if all required data is loaded
    const isDataLoaded =
      editData?.data &&
      suppliers.length > 0 &&
      warehouses.length > 0 &&
      products.length > 0 &&
      !isLoadingSuppliers &&
      !isLoadingWarehouses &&
      !isLoadingProducts &&
      !isLoadingPurchase;

    if (isDataLoaded) {
      const p = editData.data;

      const formData = {
        po_no: p.po_no || "",
        supplier_id: Number(p.supplier_id),
        warehouse_id: Number(p.warehouse_id),
        items: p.items.map((i: any) => ({
          product_id: Number(i.product_id),
          quantity: Number(i.quantity),
          price: Number(i.price),
        })),
      };

      reset(formData);
      setIsFormReady(true);
    }
  }, [
    isEdit,
    editData,
    suppliers,
    warehouses,
    products,
    isLoadingSuppliers,
    isLoadingWarehouses,
    isLoadingProducts,
    isLoadingPurchase,
    reset,
  ]);

  // Loading states
  if (isEdit && (isLoadingPurchase || !isFormReady)) {
    return <p className="p-6">Loading purchase data...</p>;
  }

  if (isLoadingSuppliers || isLoadingProducts || isLoadingWarehouses) {
    return <p className="p-6">Loading form data...</p>;
  }

  /** Submit */
  const onSubmit = async (values: PurchaseFormValues) => {
    const total = values.items
      .reduce((sum: number, i: { quantity: any; price: any; }) => sum + Number(i.quantity) * Number(i.price), 0)
      .toFixed(2);

    const payload = {
      ...values,
      total,
      supplier_id: Number(values.supplier_id),
      warehouse_id: Number(values.warehouse_id),
      items: values.items.map((item: { product_id: any; quantity: any; price: any; }) => ({
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
        price: Number(item.price),
      })),
    };

    try {
      if (isEdit && purchaseId) {
        await updatePurchase({ id: purchaseId, body: payload }).unwrap();
        toast.success("Purchase updated successfully");
      } else {
        await createPurchase(payload).unwrap();
        toast.success("Purchase created successfully");
      }

      navigate("/purchase");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save purchase");
    }
  };

  const items = watch("items");
  const supplierId = watch("supplier_id");
  const warehouseId = watch("warehouse_id");

  return (
    <div>
      <PageMeta
        title={isEdit ? "Edit Purchase" : "Create Purchase"}
        description="Manage purchase orders"
      />
      <PageHeader title={isEdit ? "Edit Purchase" : "Add New Purchase"} />

      <div className="p-6 bg-white rounded-xl shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Purchase Info */}
          <div className="grid grid-cols-3 gap-4">
            <FormField label="PO Number" error={errors.po_no?.message}>
              <Input {...register("po_no")} />
            </FormField>

            <SelectField
              label="Supplier"
              data={suppliers.map((s: any) => {
                const id =
                  typeof s.id === "string" ? Number(s.id) : Number(s.id);
                return {
                  id: id,
                  name: s.name,
                };
              })}
              value={supplierId ? Number(supplierId) : undefined}
              error={errors.supplier_id?.message}
              onChange={(val) => {
                console.log("Supplier changed to:", val);
                setValue("supplier_id", Number(val), { shouldValidate: true });
              }}
            />

            <SelectField
              label="Warehouse"
              data={warehouses.map((w: any) => {
                const id =
                  typeof w.id === "string" ? Number(w.id) : Number(w.id);
                return {
                  id: id,
                  name: w.name,
                };
              })}
              value={warehouseId ? Number(warehouseId) : undefined}
              error={errors.warehouse_id?.message}
              onChange={(val) => {
                console.log("Warehouse changed to:", val);
                setValue("warehouse_id", Number(val), { shouldValidate: true });
              }}
            />
          </div>

          {/* Purchase Items */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Purchase Items</h2>

              <Button
                size="sm"
                onClick={() => append({ product_id: 0, quantity: 1, price: 0 })}
              >
                Add Item
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Qty</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Subtotal</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>

                <tbody>
                  {fields.map((field, index) => {
                    const qty = Number(items[index]?.quantity) || 0;
                    const price = Number(items[index]?.price) || 0;
                    const productId = items[index]?.product_id
                      ? Number(items[index].product_id)
                      : undefined;

                    return (
                      <tr key={field.id} className="border-b">
                        {/* Product */}
                        <td className="p-3">
                          <SelectField
                            label=""
                            data={products.map((p: any) => {
                              const id =
                                typeof p.id === "string"
                                  ? Number(p.id)
                                  : Number(p.id);
                              return {
                                id: id,
                                name: p.name,
                              };
                            })}
                            value={productId}
                            error={errors.items?.[index]?.product_id?.message}
                            onChange={(val) => {
                              const pid = Number(val);
                              setValue(`items.${index}.product_id`, pid, {
                                shouldValidate: true,
                              });

                              const product = products.find(
                                (p: any) => Number(p.id) === pid
                              );
                              if (product?.purchase_price) {
                                setValue(
                                  `items.${index}.price`,
                                  Number(product.purchase_price),
                                  { shouldValidate: true }
                                );
                              }
                            }}
                          />
                        </td>

                        {/* Quantity */}
                        <td className="p-3">
                          <Input
                            type="number"
                            min="1"
                            step="1"
                            {...register(`items.${index}.quantity`, {
                              valueAsNumber: true,
                            })}
                          />
                          {errors.items?.[index]?.quantity && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.items[index]?.quantity?.message}
                            </p>
                          )}
                        </td>

                        {/* Price */}
                        <td className="p-3">
                          <Input
                            step="0.01"
                            type="number"
                            min="0"
                            {...register(`items.${index}.price`, {
                              valueAsNumber: true,
                            })}
                          />
                          {errors.items?.[index]?.price && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.items[index]?.price?.message}
                            </p>
                          )}
                        </td>

                        {/* Subtotal */}
                        <td className="p-3 font-semibold">
                          ৳{(qty * price).toFixed(2)}
                        </td>

                        {/* Remove */}
                        <td className="p-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => remove(index)}
                            className="text-red-600"
                            disabled={fields.length === 1}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {errors.items && typeof errors.items.message === "string" && (
              <p className="text-red-500 text-sm mt-2">
                {errors.items.message}
              </p>
            )}
          </div>

          {/* Total */}
          <div className="flex justify-end text-lg font-bold">
            Total: ৳
            {items
              .reduce((sum, i) => sum + Number(i.quantity) * Number(i.price), 0)
              .toFixed(2)}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/purchase")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg disabled:opacity-50"
            >
              {isEdit ? "Update Purchase" : "Create Purchase"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
