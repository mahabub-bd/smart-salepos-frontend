import {
  MinusCircle,
  PlusCircle,
  Search,
  ShoppingCart,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

import { useGetAccountsQuery } from "../../features/accounts/accountsApi";
import { useGetCustomersQuery } from "../../features/customer/customerApi";

import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import { useGetWarehouseWiseReportQuery } from "../../features/inventory/inventoryApi";
import { useCreatePosSaleMutation } from "../../features/pos/posApi";
import { useGetWarehousesQuery } from "../../features/warehouse/warehouseApi";
import { Account, Customer, Warehouse } from "../../types";
import CustomerFormModal from "../Customer/components/CustomerFormModal";

interface CartItem {
  product_id: number;
  product_name: string;
  warehouse_id: number;
  warehouse_name: string;
  quantity: number;
  unit_price: number;
  available_stock: number;
  batch_no: string;
}

interface ProductData {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  selling_price: string;
  purchase_price: string;
  description?: string;
  discount_price?: string;
  status?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Product {
  product: ProductData;
  purchased_quantity: number;
  sold_quantity: number;
  remaining_quantity: number;
  batch_no: string;
  purchase_value: number;
  sale_value: number;
}

interface WarehouseReport {
  warehouse_id: number;
  warehouse: Warehouse;
  total_stock: number;
  total_sold_quantity: number;
  remaining_stock: number;
  purchase_value: number;
  sale_value: number;
  products: Product[];
}

interface ExtendedProduct extends Product {
  warehouse_id: number;
  warehouse_name: string;
}

export default function POSPage() {
  const [searchProduct, setSearchProduct] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState<number>(0);
  const [discountType, setDiscountType] = useState<"fixed" | "percentage">(
    "fixed"
  );
  const [discountValue, setDiscountValue] = useState(0);
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank" | "bkash">(
    "cash"
  );
  const [paymentAccountCode, setPaymentAccountCode] = useState("");
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  // API Queries
  const { data: warehouseData } = useGetWarehousesQuery();
  const { data: customerData, refetch: refetchCustomers } =
    useGetCustomersQuery();
  const { data: accountsData } = useGetAccountsQuery({
    type: "asset",
    isCash: true,
    isBank: true,
  });
  const { data: warehouseReportData } = useGetWarehouseWiseReportQuery({
    search: searchProduct,
    warehouse_id: selectedWarehouse || undefined,
  });
  const [createSale, { isLoading: isCreating }] = useCreatePosSaleMutation();

  // Data extraction
  const warehouses = (warehouseData?.data || []) as Warehouse[];
  const customers = (customerData?.data || []) as Customer[];
  const accounts = (accountsData?.data || []) as Account[];

  // Extract products from warehouse report
  const products: ExtendedProduct[] =
    warehouseReportData?.data?.flatMap((warehouse: WarehouseReport) =>
      warehouse.products.map((p: Product) => ({
        ...p,
        warehouse_id: warehouse.warehouse_id,
        warehouse_name: warehouse.warehouse.name,
      }))
    ) || [];

  // Filter products by search and warehouse
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.product.name
      .toLowerCase()
      .includes(searchProduct.toLowerCase());
    const matchesWarehouse =
      !selectedWarehouse || p.warehouse_id === selectedWarehouse;
    const hasStock = p.remaining_quantity > 0;
    return matchesSearch && matchesWarehouse && hasStock;
  });

  // Filter accounts by payment method
  const filteredAccounts = accounts.filter((acc: Account) =>
    paymentMethod === "cash"
      ? acc.isCash
      : paymentMethod === "bank"
      ? acc.isBank
      : false
  );

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );
  const discount =
    discountType === "fixed" ? discountValue : (subtotal * discountValue) / 100;
  const tax = (subtotal * taxPercentage) / 100;
  const total = subtotal - discount + tax;
  const due = total - paidAmount;

  const addToCart = (productData: ExtendedProduct) => {
    if (!selectedWarehouse) {
      return toast.error("Please select a warehouse first");
    }

    const product = productData.product;
    const warehouse = warehouses.find((w) => w.id === productData.warehouse_id);

    if (!warehouse) {
      return toast.error("Warehouse not found");
    }

    if (productData.remaining_quantity <= 0) {
      return toast.error("Product out of stock");
    }

    const existingItem = cart.find(
      (item) =>
        item.product_id === product.id &&
        item.warehouse_id === productData.warehouse_id
    );

    if (existingItem) {
      if (existingItem.quantity >= productData.remaining_quantity) {
        return toast.error("Cannot exceed available stock");
      }
      updateQuantity(
        product.id,
        productData.warehouse_id,
        existingItem.quantity + 1
      );
    } else {
      setCart([
        ...cart,
        {
          product_id: product.id,
          product_name: product.name,
          warehouse_id: productData.warehouse_id,
          warehouse_name: warehouse.name,
          quantity: 1,
          unit_price: Number(product.selling_price),
          available_stock: productData.remaining_quantity,
          batch_no: productData.batch_no,
        },
      ]);
      toast.success(`${product.name} added to cart`);
    }
  };

  const updateQuantity = (
    productId: number,
    warehouseId: number,
    newQty: number
  ) => {
    if (newQty <= 0) {
      return removeFromCart(productId, warehouseId);
    }

    const item = cart.find(
      (i) => i.product_id === productId && i.warehouse_id === warehouseId
    );

    if (item && newQty > item.available_stock) {
      return toast.error(
        `Only ${item.available_stock} units available in stock`
      );
    }

    setCart(
      cart.map((item) =>
        item.product_id === productId && item.warehouse_id === warehouseId
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const removeFromCart = (productId: number, warehouseId: number) => {
    setCart(
      cart.filter(
        (item) =>
          item.product_id !== productId || item.warehouse_id !== warehouseId
      )
    );
    toast.info("Item removed from cart");
  };

  const clearCart = () => {
    setCart([]);
    setPaidAmount(0);
    setDiscountValue(0);
    setTaxPercentage(0);
    setSelectedCustomer("");
  };

  const handleCheckout = async () => {
    if (!selectedCustomer) {
      return toast.error("Please select a customer");
    }
    if (cart.length === 0) {
      return toast.error("Cart is empty");
    }
    if (paidAmount > total) {
      return toast.error("Paid amount cannot exceed total");
    }
    if (paidAmount > 0 && !paymentAccountCode) {
      return toast.error("Please select a payment account");
    }

    try {
      await createSale({
        customer_id: Number(selectedCustomer),
        branch_id: 1,
        discount_type: discountType,
        discount_value: discountValue,
        tax_percentage: taxPercentage,
        paid_amount: paidAmount,
        payment_method: paidAmount > 0 ? paymentMethod : undefined,
        account_code: paidAmount > 0 ? paymentAccountCode : undefined,
        items: cart.map((item) => ({
          product_id: item.product_id,
          warehouse_id: item.warehouse_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
        payments:
          paidAmount > 0
            ? [
                {
                  method: paymentMethod,
                  amount: paidAmount,
                  account_code: paymentAccountCode,
                },
              ]
            : [],
      }).unwrap();

      toast.success("Sale completed successfully!");
      clearCart();
    } catch (error: any) {
      toast.error(error?.data?.message || "Sale failed");
    }
  };

  return (
    <div className="w-full h-full">
      <PageMeta
        title="POS - Point of Sale"
        description="Quick sale interface"
      />
      <PageBreadcrumb pageTitle="POS" />

      {/* Customer Modal */}
      <CustomerFormModal
        isOpen={isCustomerModalOpen}
        onClose={() => {
          setIsCustomerModalOpen(false);
          refetchCustomers();
        }}
        customer={null}
      />

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsCustomerModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium shadow-sm transition-colors"
        >
          <UserPlus size={18} /> Add Customer
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-300px)]">
        {/* Left Side - Products */}
        <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden">
          {/* Search & Warehouse Selection */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
                  size={18}
                />
                <Input
                  type="text"
                  placeholder="Search products by name..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={String(selectedWarehouse)}
                onChange={(value) => setSelectedWarehouse(Number(value))}
                placeholder="All Warehouses"
                options={[
                  { value: "0", label: "All Warehouses" },
                  ...warehouses.map((w) => ({
                    value: String(w.id),
                    label: w.name,
                  })),
                ]}
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map((productData, index) => {
                const product = productData.product;
                return (
                  <button
                    key={`${product.id}-${productData.warehouse_id}-${index}`}
                    onClick={() => addToCart(productData)}
                    className="group border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:border-brand-500 dark:hover:border-brand-600 hover:shadow-md transition-all bg-white dark:bg-gray-900 flex flex-col items-center"
                  >
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 transition-colors">
                      <ShoppingCart
                        size={32}
                        className="text-gray-400 dark:text-gray-500 group-hover:text-brand-600 dark:group-hover:text-brand-400"
                      />
                    </div>
                    <h3 className="font-medium text-sm text-center text-gray-900 dark:text-white line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-brand-600 dark:text-brand-400 font-semibold text-base mb-1">
                      ৳{Number(product.selling_price).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Stock: {productData.remaining_quantity}
                    </p>
                    {productData.warehouse_name && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {productData.warehouse_name}
                      </p>
                    )}
                  </button>
                );
              })}
              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                  <ShoppingCart size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No products found</p>
                  <p className="text-sm mt-1">
                    Try adjusting your search or warehouse filter
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Cart & Checkout */}
        <div className="flex flex-col gap-4 overflow-y-scroll">
          {/* Customer Selection */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <Select
              value={selectedCustomer}
              onChange={setSelectedCustomer}
              placeholder="Select a customer"
              options={customers.map((c) => ({
                value: String(c.id),
                label: `${c.customer_code} — ${c.name}`,
              }))}
            />
          </div>

          {/* Cart Items */}
          <div className="flex-1  bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Cart Items
              </h3>
              <span className="px-3 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 rounded-full text-sm font-medium">
                {cart.length} {cart.length === 1 ? "item" : "items"}
              </span>
            </div>
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={`${item.product_id}-${item.warehouse_id}`}
                  className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-sm transition-shadow"
                >
                  {/* Product Name and Warehouse */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                        {item.product_name}
                      </h4>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          📍 {item.warehouse_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          📦 Available: {item.available_stock} units
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        removeFromCart(item.product_id, item.warehouse_id)
                      }
                      className="ml-2 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      title="Remove from cart"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Quantity Controls and Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Qty:
                      </span>
                      <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product_id,
                              item.warehouse_id,
                              item.quantity - 1
                            )
                          }
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <MinusCircle
                            size={16}
                            className="text-gray-600 dark:text-gray-400"
                          />
                        </button>
                        <span className="px-3 font-semibold text-sm text-gray-900 dark:text-white min-w-10 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product_id,
                              item.warehouse_id,
                              item.quantity + 1
                            )
                          }
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
                          disabled={item.quantity >= item.available_stock}
                        >
                          <PlusCircle
                            size={16}
                            className="text-gray-600 dark:text-gray-400"
                          />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                        @ ৳{item.unit_price.toFixed(2)}
                      </p>
                      <p className="font-bold text-base text-brand-600 dark:text-brand-400">
                        ৳{(item.unit_price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <ShoppingCart
                      size={40}
                      className="text-gray-400 dark:text-gray-500"
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Your cart is empty
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Add products to get started
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Discount & Tax */}
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium mb-0.5 text-gray-700 dark:text-gray-300">
                  Discount Type
                </label>
                <Select
                  className="h-8"
                  value={discountType}
                  onChange={(value) =>
                    setDiscountType(value as "fixed" | "percentage")
                  }
                  options={[
                    { value: "fixed", label: "Fixed Amount" },
                    { value: "percentage", label: "Percentage %" },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-0.5 text-gray-700 dark:text-gray-300">
                  Discount {discountType === "percentage" && "(%)"}
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  className="h-8"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-0.5 text-gray-700 dark:text-gray-300">
                  Tax (%)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  className="h-8"
                  value={taxPercentage}
                  onChange={(e) => setTaxPercentage(Number(e.target.value))}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-0.5 text-gray-700 dark:text-gray-300">
                  Method
                </label>
                <Select
                  className="h-8"
                  value={paymentMethod}
                  onChange={(value) => {
                    setPaymentMethod(value as "cash" | "bank" | "bkash");
                    setPaymentAccountCode("");
                  }}
                  options={[
                    { value: "cash", label: "Cash" },
                    { value: "bank", label: "Bank" },
                    { value: "bkash", label: "Bkash" },
                  ]}
                />
              </div>

              {(paymentMethod === "cash" || paymentMethod === "bank") && (
                <div>
                  <label className="block text-xs font-medium mb-0.5 text-gray-700 dark:text-gray-300">
                    Account
                  </label>
                  <Select
                    className="h-8"
                    value={paymentAccountCode}
                    onChange={setPaymentAccountCode}
                    placeholder="Select Account"
                    options={filteredAccounts.map((acc) => ({
                      value: acc.code,
                      label: `${acc.name} - ${acc.code}`,
                    }))}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium mb-0.5 text-gray-700 dark:text-gray-300">
                Paid Amount
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                className="h-8"
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Summary & Checkout */}
          <div className="bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Subtotal:</span>
                <span>৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-red-600 dark:text-red-400">
                <span>Discount:</span>
                <span>-৳{discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                <span>Tax:</span>
                <span>+৳{tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                  <span>Total:</span>
                  <span>৳{total.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between text-base font-semibold text-orange-600 dark:text-orange-400">
                <span>Due:</span>
                <span>৳{due.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCreating || !selectedCustomer || cart.length === 0}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? "Processing..." : "Complete Sale"}
            </button>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="w-full mt-2 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
