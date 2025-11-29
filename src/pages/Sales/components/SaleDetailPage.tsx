import { Plus } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";

import IconButton from "../../../components/common/IconButton";
import Loading from "../../../components/common/Loading";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import Badge from "../../../components/ui/badge/Badge";

import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";

import { useGetSaleByIdQuery } from "../../../features/sale/saleApi";
import { SaleItem, SalePayment } from "../../../types";
import SalePaymentModal from "./SalePaymentModal";


export default function SaleDetailPage() {
    const { id } = useParams<{ id: string }>();

    const { data, isLoading, isError, refetch } = useGetSaleByIdQuery(String(id));
    const sale = data?.data;

    // Modal state
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);

    if (isLoading) return <Loading message="Loading sale details..." />;
    if (isError || !sale)
        return <p className="text-red-500 p-4">Failed to fetch sale details.</p>;

    const dueAmount = Number(sale.total) - Number(sale.paid_amount);

    return (
        <div>
            <PageMeta title={`Sale - ${sale.invoice_no}`} description="Sale Details" />
            <PageBreadcrumb pageTitle={`Sale Details (${sale.invoice_no})`} />

            <div className="flex flex-col gap-5 min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/5">

                {/* Sale Info */}
                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-lg font-medium">Sale Information</h2>

                        {/* Show Pay Due button ONLY if there's a due */}
                        {dueAmount > 0 && (
                            <IconButton
                                icon={Plus}
                                color="blue"
                                tooltip="Pay Due"
                                onClick={() => setPaymentModalOpen(true)}
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <Info label="Invoice No" value={sale.invoice_no} />
                        <Info label="Subtotal" value={`${sale.subtotal} ৳`} />
                        <Info label="Discount" value={`${sale.discount} ৳`} />
                        <Info label="Tax" value={`${sale.tax} ৳`} />
                        <Info label="Total Amount" value={`${sale.total} ৳`} />
                        <Info label="Paid Amount" value={`${sale.paid_amount} ৳`} />
                        <Info label="Due Amount" value={`${dueAmount} ৳`} />
                        <div className="inline-flex items-center gap-2">
                            Status:
                            <Badge
                                color={
                                    sale.status === "completed"
                                        ? "success"
                                        : sale.status === "pending"
                                            ? "warning"
                                            : "error"
                                }
                            >
                                {sale.status}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <h2 className="text-lg font-medium mb-3">Customer Information</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <Info label="Customer Code" value={sale.customer.customer_code} />
                        <Info label="Name" value={sale.customer.name} />
                        <Info label="Phone" value={sale.customer.phone} />
                        <Info label="Email" value={sale.customer.email || "-"} />
                        <Info label="Address" value={sale.customer.address || "-"} />
                    </div>
                </div>

                {/* Sale Item List */}
                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <h2 className="text-lg font-medium mb-3">Sale Items</h2>

                    <Table>
                        <TableHeader className="border-b bg-gray-100 dark:bg-gray-700">
                            <TableRow>
                                <TableCell isHeader>Product</TableCell>
                                <TableCell isHeader>Qty</TableCell>
                                <TableCell isHeader>Unit Price</TableCell>
                                <TableCell isHeader>Discount</TableCell>
                                <TableCell isHeader>Tax</TableCell>
                                <TableCell isHeader>Line Total</TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {sale.items.map((item: SaleItem) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <p className="font-medium">{item.product.name}</p>
                                        <p className="text-xs text-gray-500">{item.product.sku}</p>
                                    </TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.unit_price}</TableCell>
                                    <TableCell>{item.discount}</TableCell>
                                    <TableCell>{item.tax}</TableCell>
                                    <TableCell>{item.line_total}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Payment History */}
                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <h2 className="text-lg font-medium mb-3">Payment History</h2>

                    <Table>
                        <TableHeader className="border-b bg-gray-100 dark:bg-gray-700">
                            <TableRow>
                                <TableCell isHeader>Method</TableCell>
                                <TableCell isHeader>Amount</TableCell>
                                <TableCell isHeader>Account Code</TableCell>
                                <TableCell isHeader>Date</TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {sale.payments.map((p: SalePayment) => (
                                <TableRow key={p.id}>
                                    <TableCell className="capitalize">{p.method}</TableCell>
                                    <TableCell>{p.amount}</TableCell>
                                    <TableCell>{p.account_code}</TableCell>
                                    <TableCell>{new Date(p.created_at).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Payment Modal */}
            {paymentModalOpen && (
                <SalePaymentModal
                    isOpen={paymentModalOpen}
                    onClose={() => {
                        setPaymentModalOpen(false);
                        refetch(); // Refresh sale details after payment
                    }}
                    sale={sale}
                />
            )}
        </div>
    );
}

// Reusable info component
const Info = ({ label, value }: { label: string; value: any }) => (
    <div>
        <p className="text-gray-500 text-xs">{label}</p>
        <p className="font-medium">{value}</p>
    </div>
);
