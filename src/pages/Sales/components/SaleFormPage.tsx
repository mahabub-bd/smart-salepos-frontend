import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { z } from "zod";

import IconButton from "../../../components/common/IconButton";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";

import { useEffect } from "react";
import { useGetAccountsQuery } from "../../../features/accounts/accountsApi";
import { useGetCustomersQuery } from "../../../features/customer/customerApi";
import { useGetProductsQuery } from "../../../features/product/productApi";
import { useCreateSaleMutation } from "../../../features/sale/saleApi";
import { useGetWarehousesQuery } from "../../../features/warehouse/warehouseApi";

const saleSchema = z.object({
    customer_id: z.string().min(1, "Customer is required"),
    branch_id: z.number().min(1),
    discount_type: z.enum(["fixed", "percentage"]),
    discount_value: z.number().min(0),
    tax_percentage: z.number().min(0),
    paid_amount: z.number().min(0),
    payment_method: z.enum(["cash", "bank", "bkash"]).optional(),
    payment_account_code: z.string().optional(),
    items: z.array(
        z.object({
            product_id: z.number().min(1),
            warehouse_id: z.number().min(1),
            quantity: z.number().positive(),
            unit_price: z.number().min(0),
        })
    ),
    payments: z.array(
        z.object({
            method: z.string(),
            amount: z.number().min(0),
            account_code: z.string(),
        })
    ),
});

type SaleFormValues = z.infer<typeof saleSchema>;

export default function SaleFormPage() {
    const navigate = useNavigate();
    const [createSale, { isLoading: isCreating }] = useCreateSaleMutation();

    const { data: productData } = useGetProductsQuery(undefined, { skip: false })
    const { data: warehouseData } = useGetWarehousesQuery();
    const { data: customerData } = useGetCustomersQuery();
    const { data: accountsData } = useGetAccountsQuery({
        type: "asset",
        isCash: true,
        isBank: true,
    });

    const products = productData?.data || [];
    const warehouses = warehouseData?.data || [];
    const customers = customerData?.data || [];
    const accounts = accountsData?.data || [];

    const invoiceNo = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(
        Math.random() * 1000
    )}`;

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<SaleFormValues>({
        resolver: zodResolver(saleSchema),
        defaultValues: {
            customer_id: "",
            branch_id: 1,
            discount_type: "fixed",
            discount_value: 0,
            tax_percentage: 0,
            paid_amount: 0,
            payment_method: undefined,
            payment_account_code: "",
            items: [{ product_id: 0, warehouse_id: 0, quantity: 1, unit_price: 0 }],
            payments: [{ method: "cash", amount: 0, account_code: "ASSET.CASH" }],
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: "items" });

    const formValues = watch();
    const selectedPaymentMethod = watch("payment_method");

    // Calculate subtotal
    const subtotal = formValues.items.reduce(
        (sum, item) => sum + item.quantity * Number(item.unit_price),
        0
    );

    // Calculate discount
    let discount =
        formValues.discount_type === "fixed"
            ? formValues.discount_value
            : (subtotal * formValues.discount_value) / 100;

    // Calculate tax
    const tax = (subtotal * formValues.tax_percentage) / 100;

    // Calculate total
    const total = subtotal - discount + tax;

    // Calculate due amount
    const due = total - formValues.paid_amount;

    // Filter accounts based on selected payment method
    const filteredAccounts = accounts.filter((acc: any) =>
        selectedPaymentMethod === "cash"
            ? acc.isCash
            : selectedPaymentMethod === "bank"
                ? acc.isBank
                : false
    );
    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (
                name === "paid_amount" ||
                name === "payment_method" ||
                name === "payment_account_code"
            ) {
                const paidAmount = value.paid_amount || 0;
                const paymentMethod = value.payment_method;
                const paymentAccountCode = value.payment_account_code;

                if (paidAmount > 0 && paymentMethod && paymentAccountCode) {
                    setValue("payments", [
                        {
                            method: paymentMethod,
                            amount: paidAmount,
                            account_code: paymentAccountCode,
                        },
                    ]);
                } else {
                    setValue("payments", []);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, setValue]);
    const onSubmit = async (data: SaleFormValues) => {
        try {
            await createSale({ ...data, customer_id: Number(data.customer_id), invoice_no: invoiceNo }).unwrap();
            toast.success("Sale created successfully!");
            navigate("/sales");
        } catch (error: any) {
            toast.error(error?.message || "Failed to create sale");
            console.error("Sale creation error:", error);
        }
    };

    return (
        <div className="w-full">
            <PageMeta title="Create Sale" description="Create a new sale" />
            <PageBreadcrumb pageTitle="Create Sale" />

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5 p-5 border bg-white dark:bg-gray-800 rounded-xl shadow-sm"
            >
                {/* Invoice Number */}
                <div className="w-full">
                    <Label htmlFor="invoice_no">Invoice Number</Label>
                    <Input
                        id="invoice_no"
                        disabled
                        value={invoiceNo}
                        className="bg-gray-50 dark:bg-gray-700"
                    />
                </div>

                {/* Customer */}
                <div className="w-full">
                    <Label htmlFor="customer_id">Customer</Label>
                    <Controller
                        name="customer_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select Customer"
                                options={customers.map((c) => ({
                                    value: String(c.id),
                                    label: `${c.customer_code} — ${c.name}`,
                                }))}
                            />
                        )}
                    />
                    {errors.customer_id && (
                        <p className="text-red-500 text-sm mt-1.5">{errors.customer_id.message}</p>
                    )}
                </div>

                {/* Items Section */}
                <div className="w-full">
                    <Label>Sale Items</Label>

                    {/* Column Headers */}
                    <div className="grid grid-cols-5 gap-3 items-center font-medium text-sm text-gray-600 dark:text-gray-400 mb-3 px-1">
                        <span>Product</span>
                        <span>Warehouse</span>
                        <span>Quantity</span>
                        <span>Unit Price</span>
                        <span className="text-center">Actions</span>
                    </div>

                    {/* Item Rows */}
                    {fields.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-5 gap-3 items-start mb-3">
                            {/* Product Select */}
                            <div>
                                <Controller
                                    name={`items.${index}.product_id`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value === 0 ? "" : String(field.value)}
                                            onChange={(value) => {
                                                const productId = Number(value);
                                                field.onChange(productId);

                                                // Auto-populate unit price from product selling_price
                                                const product = products.find((p) => p.id === productId);
                                                if (product) {
                                                    setValue(
                                                        `items.${index}.unit_price`,
                                                        Number(product.selling_price)
                                                    );
                                                }
                                            }}
                                            placeholder="Select Product"
                                            options={products.map((p) => ({
                                                value: String(p.id),
                                                label: p.name,
                                            }))}
                                        />
                                    )}
                                />
                                {errors.items?.[index]?.product_id && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.items[index]?.product_id?.message}
                                    </p>
                                )}
                            </div>

                            {/* Warehouse Select */}
                            <div>
                                <Controller
                                    name={`items.${index}.warehouse_id`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value === 0 ? "" : String(field.value)}
                                            onChange={(value) => field.onChange(Number(value))}
                                            placeholder="Select Warehouse"
                                            options={warehouses.map((w) => ({
                                                value: String(w.id),
                                                label: w.name,
                                            }))}
                                        />
                                    )}
                                />
                                {errors.items?.[index]?.warehouse_id && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.items[index]?.warehouse_id?.message}
                                    </p>
                                )}
                            </div>

                            {/* Quantity Input */}
                            <div>
                                <Input
                                    type="number"
                                    min="1"
                                    step="1"
                                    {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                                    placeholder="Qty"
                                />
                                {errors.items?.[index]?.quantity && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.items[index]?.quantity?.message}
                                    </p>
                                )}
                            </div>

                            {/* Unit Price Input */}
                            <div>
                                <Input
                                    type="number"
                                    disabled
                                    min="0"
                                    step="0.01"
                                    {...register(`items.${index}.unit_price`, { valueAsNumber: true })}
                                    placeholder="Price"
                                />
                                {errors.items?.[index]?.unit_price && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.items[index]?.unit_price?.message}
                                    </p>
                                )}
                            </div>

                            {/* Remove Button */}
                            <div className="flex justify-center">
                                <IconButton
                                    icon={X}
                                    color="red"
                                    onClick={() => remove(index)}
                                    disabled={fields.length === 1}
                                    tooltip="Remove item"
                                />
                            </div>
                        </div>
                    ))}

                    {/* Add Item Button */}
                    <div className="mt-3">
                        <IconButton
                            icon={Plus}
                            color="green"
                            onClick={() => append({
                                product_id: products[0]?.id || 1,
                                warehouse_id: warehouses[0]?.id || 1,
                                quantity: 1,
                                unit_price: 0
                            })}
                            tooltip="Add item"
                        />
                    </div>
                </div>

                {/* Discount & Tax Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Discount Type */}
                    <div>
                        <Label htmlFor="discount_type">Discount Type</Label>
                        <Controller
                            name="discount_type"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={[
                                        { value: "fixed", label: "Fixed" },
                                        { value: "percentage", label: "Percentage (%)" },
                                    ]}
                                />
                            )}
                        />
                    </div>

                    {/* Discount Value */}
                    <div>
                        <Label htmlFor="discount_value">
                            Discount Value {formValues.discount_type === "percentage" && "(%)"}
                        </Label>
                        <Input
                            id="discount_value"
                            type="number"
                            min="0"
                            step="0.01"
                            {...register("discount_value", { valueAsNumber: true })}
                            placeholder="0.00"
                        />
                        {errors.discount_value && (
                            <p className="text-red-500 text-sm mt-1">{errors.discount_value.message}</p>
                        )}
                    </div>

                    {/* Tax Percentage */}
                    <div>
                        <Label htmlFor="tax_percentage">Tax Percentage (%)</Label>
                        <Input
                            id="tax_percentage"
                            type="number"
                            min="0"
                            step="0.01"
                            {...register("tax_percentage", { valueAsNumber: true })}
                            placeholder="0.00"
                        />
                        {errors.tax_percentage && (
                            <p className="text-red-500 text-sm mt-1">{errors.tax_percentage.message}</p>
                        )}
                    </div>
                </div>

                {/* Payment Section */}
                <div className="border-t pt-5 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Payment Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Paid Amount */}
                        <div>
                            <Label htmlFor="paid_amount">Paid Amount</Label>
                            <Input
                                id="paid_amount"
                                type="number"
                                min="0"
                                step="0.01"
                                {...register("paid_amount", { valueAsNumber: true })}
                                placeholder="0.00"
                            />
                            {errors.paid_amount && (
                                <p className="text-red-500 text-sm mt-1">{errors.paid_amount.message}</p>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div>
                            <Label htmlFor="payment_method">Payment Method</Label>
                            <Controller
                                name="payment_method"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value || ""}
                                        onChange={(value) => {
                                            field.onChange(value);
                                            // Reset account when method changes
                                            setValue("payment_account_code", "");
                                        }}
                                        placeholder="Select Method"
                                        options={[
                                            { value: "cash", label: "Cash" },
                                            { value: "bank", label: "Bank" },
                                            { value: "bkash", label: "Bkash" },
                                        ]}
                                    />
                                )}
                            />
                            {errors.payment_method && (
                                <p className="text-red-500 text-sm mt-1">{errors.payment_method.message}</p>
                            )}
                        </div>

                        {/* Payment Account - Only show if method is selected */}
                        {selectedPaymentMethod && (selectedPaymentMethod === "cash" || selectedPaymentMethod === "bank") && (
                            <div>
                                <Label htmlFor="payment_account_code">Payment Account</Label>
                                <Controller
                                    name="payment_account_code"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select Account"
                                            options={filteredAccounts.map((acc: any) => ({
                                                value: acc.code,
                                                label: `${acc.name} - ${acc.code}${acc.account_number ? ` - ${acc.account_number}` : ""}`,
                                            }))}
                                        />
                                    )}
                                />
                                {errors.payment_account_code && (
                                    <p className="text-red-500 text-sm mt-1">{errors.payment_account_code.message}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary Section */}
                <div className="bg-gray-100 dark:bg-gray-700 p-5 rounded-lg space-y-3 border border-gray-200 dark:border-gray-600">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-3">
                        Order Summary
                    </h3>

                    <div className="flex justify-between items-center">
                        <Label className="mb-0 text-gray-600 dark:text-gray-300">Subtotal:</Label>
                        <span className="font-medium text-gray-800 dark:text-white">
                            ৳{subtotal.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <Label className="mb-0 text-gray-600 dark:text-gray-300">Discount:</Label>
                        <span className="font-medium text-red-600">
                            -৳{discount.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <Label className="mb-0 text-gray-600 dark:text-gray-300">Tax:</Label>
                        <span className="font-medium text-green-600">
                            +৳{tax.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-300 dark:border-gray-600 pt-3 mt-3">
                        <Label className="mb-0 text-lg font-bold text-gray-800 dark:text-white">
                            Total:
                        </Label>
                        <span className="text-xl font-bold text-gray-800 dark:text-white">
                            ৳{total.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <Label className="mb-0 text-green-700 dark:text-green-400">Paid:</Label>
                        <span className="font-semibold text-green-700 dark:text-green-400">
                            ৳{formValues.paid_amount.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <Label className="mb-0 text-red-700 dark:text-red-400 font-bold">Due:</Label>
                        <span className="text-lg font-bold text-red-700 dark:text-red-400">
                            ৳{due.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={() => navigate("/sales")}
                        className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isCreating}
                        className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium flex items-center gap-2"
                    >
                        {isCreating ? (
                            <>
                                <span className="animate-spin">⏳</span>
                                Saving...
                            </>
                        ) : (
                            "Save Sale"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}