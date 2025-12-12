import {
  CreditCard,
  Eye,
  FileDown,
  Plus,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

import IconButton from "../../../components/common/IconButton";
import Loading from "../../../components/common/Loading";
import PageHeader from "../../../components/common/PageHeader";
import Badge from "../../../components/ui/badge/Badge";
import Pagination from "../../../components/ui/pagination/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { useGetSalesQuery } from "../../../features/sale/saleApi";
import { useHasPermission } from "../../../hooks/useHasPermission";
import { Sale } from "../../../types";
import { formatCurrencyEnglish, formatDate } from "../../../utlis";
import SingleSalePDF from "./pdf/SingleSalePDF";
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

  const { data, isLoading, isFetching, isError, refetch } = useGetSalesQuery({
    page,
    limit,
  });

  const sales = data?.data || [];

  const meta = data?.meta;

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Only show full loading screen on initial load, not on pagination
  if (isLoading && !data) return <Loading message="Loading Sales..." />;

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
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-[#1e1e1e] relative">
        {/* Loading overlay during pagination */}
        {isFetching && data && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center z-10">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Loading...
            </div>
          </div>
        )}
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader>Invoice</TableCell>
                <TableCell isHeader>Customer</TableCell>
                <TableCell isHeader>Total</TableCell>
                <TableCell isHeader>Paid</TableCell>
                <TableCell isHeader>Due</TableCell>
                <TableCell isHeader>Sale Type</TableCell>
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
                  const dueAmount =
                    Number(sale.total) - Number(sale.paid_amount);

                  return (
                    <TableRow key={sale.id}>
                      <TableCell>
                        <Link
                          to={`/sales/${sale.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {sale.invoice_no}
                        </Link>
                      </TableCell>
                      <TableCell>{sale.customer?.name || "N/A"}</TableCell>

                      <TableCell>
                        {formatCurrencyEnglish(Number(sale.total))}
                      </TableCell>
                      <TableCell>
                        {formatCurrencyEnglish(Number(sale.paid_amount))}
                      </TableCell>

                      <TableCell
                        className={
                          dueAmount > 0
                            ? "text-red-600 font-bold"
                            : "text-green-600 font-medium"
                        }
                      >
                        {formatCurrencyEnglish(dueAmount)}
                      </TableCell>
                      <TableCell className="capitalize flex items-center gap-1">
                        {sale.sale_type === "pos" ? (
                          <>
                            <CreditCard size={14} className="text-blue-600" />
                            POS
                          </>
                        ) : (
                          <>
                            <ShoppingCart
                              size={14}
                              className="text-green-600"
                            />
                            Regular
                          </>
                        )}
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
                          <PDFDownloadLink
                            document={<SingleSalePDF sale={sale} />}
                            fileName={`sale-${sale.invoice_no}.pdf`}
                          >
                            <IconButton
                              icon={FileDown}
                              tooltip="PDF"
                              color="orange"
                            />
                          </PDFDownloadLink>
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
      {meta && meta.totalPages > 1 && (
        <Pagination
          meta={{
            currentPage: meta.page,
            totalPages: meta.totalPages,
            total: meta.total,
          }}
          currentPage={page}
          onPageChange={handlePageChange}
          currentPageItems={sales.length}
          itemsPerPage={limit}
        />
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
