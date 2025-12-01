import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import IconButton from "../../../components/common/IconButton";
import Loading from "../../../components/common/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useGetPaymentsQuery } from "../../../features/payment/paymentApi";

const badgeColors: Record<string, string> = {
  cash: "text-green-600 Capitalized bg-green-50 px-2 py-1 rounded-full text-xs",
  bank: "text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs",
  bkash: "text-pink-600 bg-pink-50 px-2 py-1 rounded-full text-xs",
};

export default function PaymentList() {
  const { data, isLoading, isError } = useGetPaymentsQuery({});
  const payments = data?.data || [];

  if (isLoading) return <Loading message="Loading payments..." />;
  if (isError)
    return <p className="text-red-500 p-4">Failed to fetch payments.</p>;

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-[#1e1e1e]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell isHeader>Supplier</TableCell>
                <TableCell isHeader>Purchase No</TableCell>
                <TableCell isHeader>Amount</TableCell>
                <TableCell isHeader>Method</TableCell>
                <TableCell isHeader>Type</TableCell>
                <TableCell isHeader>Date</TableCell>
                <TableCell isHeader>Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {payments.length > 0 ? (
                payments.map((payment: any) => {
                  const isSupplierPayment = payment.type === "supplier";
                  const displayName = isSupplierPayment
                    ? payment.supplier?.name
                    : payment.customer?.name;

                  const referenceNo = isSupplierPayment
                    ? payment.purchase?.po_no
                    : payment.sale?.invoice_no;

                  return (
                    <TableRow key={payment.id}>
                      {/* Supplier / Customer */}
                      <TableCell>{displayName || "-"}</TableCell>

                      {/* PO No or Invoice No */}
                      <TableCell>{referenceNo || "-"}</TableCell>

                      {/* Amount */}
                      <TableCell>{Number(payment.amount).toFixed(2)}</TableCell>

                      {/* Method Badge */}
                      <TableCell>
                        <span
                          className={
                            badgeColors[payment.method] ||
                            "bg-gray-50 text-gray-600 px-2 py-1 rounded-full text-xs"
                          }
                        >
                          {payment.method.charAt(0).toUpperCase() +
                            payment.method.slice(1)}
                        </span>
                      </TableCell>

                      {/* Type */}
                      <TableCell className=" capitalize">
                        {payment.type}
                      </TableCell>

                      {/* Date */}
                      <TableCell>
                        {new Date(payment.created_at).toLocaleDateString()}
                      </TableCell>

                      {/* Action */}
                      <TableCell>
                        <Link to={`/payments/${payment.id}`}>
                          <IconButton icon={Eye} color="blue" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell className="py-6 text-center text-gray-500 dark:text-gray-400">
                    No payments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
