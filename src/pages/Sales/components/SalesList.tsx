import { ChevronLeft, ChevronRight, Eye, Plus, Wallet } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

import IconButton from "../../../components/common/IconButton";
import Loading from "../../../components/common/Loading";
import PageHeader from "../../../components/common/PageHeader";
import Badge from "../../../components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import { useGetSalesQuery } from "../../../features/sale/saleApi";
import { useHasPermission } from "../../../hooks/useHasPermission";
import { Sale } from "../../../types";
import { formatCurrencyEnglish, formatDate } from "../../../utlis";
import SalePaymentModal from "./SalePaymentModal";

// Import the Payment Modal


export default function SaleList() {
  const canView = useHasPermission("sale.view");
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const { data, isLoading, isError, refetch } = useGetSalesQuery({
    page,
    limit,
  });

  const sales = data?.data || [];
  const total = data?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // Loading state
  if (isLoading) return <Loading message="Loading Sales..." />;

  // Error state
  if (isError)
    return (
      <div className="p-6">
        <p className="text-red-500">Failed to fetch sales. Please try again.</p>
      </div>
    );

  // Helper function for badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      default:
        return "error";
    }
  };

  return (
    <>
      {/* Page Header */}
      <PageHeader
        title="Sale Management"
        icon={<Plus size={16} />}
        addLabel="Add"
        onAdd={() => navigate("/sales/create")}
        permission="sale.create"
      />

      {/* Sales Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-[#1e1e1e]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader>Invoice</TableCell>
                <TableCell isHeader>Customer</TableCell>
                <TableCell isHeader>Total</TableCell>
                <TableCell isHeader>Paid</TableCell>
                <TableCell isHeader>Due</TableCell>
                <TableCell isHeader>Status</TableCell>
                <TableCell isHeader>Date</TableCell>
                <TableCell isHeader className="text-right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sales.length > 0 ? (
                sales.map((sale: Sale) => {
                  const dueAmount = Number(sale.total) - Number(sale.paid_amount);

                  return (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.invoice_no}</TableCell>
                      <TableCell>{sale.customer?.name || "N/A"}</TableCell>

                      <TableCell>{formatCurrencyEnglish(Number(sale.total))}</TableCell>
                      <TableCell>{formatCurrencyEnglish(Number(sale.paid_amount))}</TableCell>

                      <TableCell
                        className={
                          dueAmount > 0
                            ? "text-red-600 font-bold"
                            : "text-green-600 font-medium"
                        }
                      >
                        {formatCurrencyEnglish(dueAmount)}
                      </TableCell>

                      <TableCell>
                        <Badge
                          size="sm"
                          color={getStatusColor(sale.status)}
                          className="capitalize"
                        >
                          {sale.status}
                        </Badge>
                      </TableCell>

                      <TableCell>{formatDate(sale.created_at)}</TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* View Button */}
                          {canView && (
                            <Link to={`/sales/${sale.id}`}>
                              <IconButton
                                icon={Eye}
                                tooltip="View"
                                color="gray"
                              />
                            </Link>
                          )}

                          {/* Pay Due Button */}
                          {dueAmount > 0 && (
                            <IconButton
                              icon={Wallet}
                              tooltip="Pay Due"
                              color="purple"
                              disabled={dueAmount <= 0}
                              onClick={() => {
                                setSelectedSale(sale);
                                setPaymentModalOpen(true);
                              }}
                            />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No sales found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white dark:border-white/5 dark:bg-[#1e1e1e]">
          {/* Showing count */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {((page - 1) * limit) + 1} - {Math.min(page * limit, total)} of {total}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-3">

            {/* Prev Button */}
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous Page"
              className="flex items-center justify-center w-8 h-8 border rounded-full transition-all
          hover:bg-gray-100 dark:hover:bg-white/10
          disabled:opacity-50 disabled:cursor-not-allowed
          dark:border-white/10 hover:scale-105"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Current Page Indicator */}
            <span className="text-sm px-3 py-1 rounded-md border bg-gray-50 dark:bg-white/10 dark:border-white/10">
              Page <span className="font-medium">{page}</span> of {totalPages}
            </span>

            {/* Next Button */}
            <button
              onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
              disabled={page === totalPages}
              aria-label="Next Page"
              className="flex items-center justify-center w-8 h-8 border rounded-full transition-all
          hover:bg-gray-100 dark:hover:bg-white/10
          disabled:opacity-50 disabled:cursor-not-allowed
          dark:border-white/10 hover:scale-105"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}


      {/* Sale Due Payment Modal */}
      {paymentModalOpen && selectedSale && (
        <SalePaymentModal
          isOpen={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false);
            refetch(); // Refresh sale data after successful payment
          }}
          sale={selectedSale}
        />
      )}
    </>
  );
}
