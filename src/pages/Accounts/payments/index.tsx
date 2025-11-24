import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import IconButton from "../../../components/common/IconButton";
import Loading from "../../../components/common/Loading";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useGetPaymentsQuery } from "../../../features/payment/paymentApi";

const badgeColors: Record<string, string> = {
  cash: "text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs",
  bank: "text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs",
  bkash: "text-pink-600 bg-pink-50 px-2 py-1 rounded-full text-xs",
};

export default function PaymentsPage() {
  const { data, isLoading, isError } = useGetPaymentsQuery({});
  const payments = data?.data || [];

  if (isLoading) return <Loading message="Loading payments..." />;
  if (isError)
    return <p className="text-red-500 p-4">Failed to fetch payments.</p>;

  return (
    <div>
      <PageMeta title="Payment List" description="View all payments" />
      <PageBreadcrumb pageTitle="Payment List" />

      <div className="flex flex-col gap-5 min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/5">
        <h1 className="text-xl font-semibold">Payment List</h1>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Supplier
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Purchase No
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-right text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Amount
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Method
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Type
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-right text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {payments.length > 0 ? (
                payments.map((payment: any) => (
                  <TableRow key={payment.id}>
                    {/* LEFT     */}
                    <TableCell className="px-4 py-3 text-sm text-left">
                      {payment.supplier?.name || "-"}
                    </TableCell>
                    {/* LEFT     */}
                    <TableCell className="px-4 py-3 text-sm text-left">
                      {payment.purchase?.po_no || "-"}
                    </TableCell>
                    {/* RIGHT    */}
                    <TableCell className="px-4 py-3 text-sm text-right">
                      {Number(payment.amount).toFixed(2)}
                    </TableCell>
                    {/* CENTER   */}
                    <TableCell className="px-4 py-3 text-sm text-center">
                      <span className={badgeColors[payment.method]}>
                        {payment.method}
                      </span>
                    </TableCell>
                    {/* CENTER   */}
                    <TableCell className="px-4 py-3 text-sm text-center capitalize">
                      {payment.type}
                    </TableCell>
                    {/* CENTER   */}
                    <TableCell className="px-4 py-3 text-sm text-center">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </TableCell>
                    {/* RIGHT    */}
                    <TableCell className="px-4 py-3 text-sm text-right capitalize">
                      <Link to={`/payments/${payment.id}`}>
                        <IconButton icon={Eye} color="blue" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
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
