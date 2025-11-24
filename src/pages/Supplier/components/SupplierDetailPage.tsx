import { Link, useParams } from "react-router";

import Loading from "../../../components/common/Loading";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";

import { useGetSupplierByIdQuery } from "../../../features/suppliers/suppliersApi";

import { Eye } from "lucide-react";
import IconButton from "../../../components/common/IconButton";
import Badge from "../../../components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Purchase } from "../../../types";
import PurchaseStatusBadge from "../../Purchase/components/PurchaseStatusBadge";

export default function SupplierDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetSupplierByIdQuery(String(id));

  const supplier = data?.data;

  if (isLoading) return <Loading message="Loading supplier details..." />;
  if (isError || !supplier)
    return (
      <p className="text-red-500 p-4">Failed to fetch supplier details.</p>
    );

  return (
    <div>
      <PageMeta
        title={`Supplier - ${supplier.name}`}
        description="Supplier Details"
      />
      <PageBreadcrumb pageTitle={`Supplier - ${supplier.name}`} />

      <div className="flex flex-col gap-5 min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/5">
        {/* Header */}

        {/* Supplier Info */}
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <h2 className="text-lg font-medium mb-3">Supplier Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <Info
              label="Contact Person"
              value={supplier.contact_person || "-"}
            />
            <Info label="Phone" value={supplier.phone || "-"} />
            <Info label="Email" value={supplier.email || "-"} />
            <Info label="Address" value={supplier.address || "-"} />
            <Info
              label="Payment Terms"
              value={supplier.payment_terms || "N/A"}
            />
            <div className="inline-flex items-center gap-2">
              Status:
              <Badge color={supplier.status ? "success" : "error"}>
                {supplier.status ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Purchase History */}
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <h2 className="text-lg font-medium mb-3">Purchase History</h2>

          {supplier.purchase_history ? (
            <Table className="w-full text-sm">
              <TableHeader className="border-b bg-gray-100 dark:bg-gray-700">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-4 py-2 text-left text-xs font-semibold uppercase"
                  >
                    PO No
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-2 text-center text-xs font-semibold uppercase"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-2 text-right text-xs font-semibold uppercase"
                  >
                    Total
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-2 text-right text-xs font-semibold uppercase"
                  >
                    Paid
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-2 text-right text-xs font-semibold uppercase"
                  >
                    Due
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-2 text-center text-xs font-semibold uppercase"
                  >
                    Date
                  </TableCell>
                  {/* 👇 New column */}
                  <TableCell
                    isHeader
                    className="px-4 py-2 text-center text-xs font-semibold uppercase"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {supplier.purchase_history.map((purchase: Purchase) => (
                  <TableRow
                    key={purchase.id}
                    className="border-b last:border-0"
                  >
                    <TableCell className="px-4 py-2 text-left">
                      {purchase.po_no}
                    </TableCell>
                    <TableCell className="px-4 py-2 text-center">
                      <PurchaseStatusBadge status={purchase.status} />
                    </TableCell>
                    <TableCell className="px-4 py-2 text-right">
                      {Number(purchase.total).toFixed(2)}
                    </TableCell>
                    <TableCell className="px-4 py-2 text-right">
                      {Number(purchase.paid_amount).toFixed(2)}
                    </TableCell>
                    <TableCell
                      className={`px-4 py-2 text-right font-medium ${
                        Number(purchase.due_amount) > 0
                          ? "text-red-500"
                          : "text-green-600"
                      }`}
                    >
                      {Number(purchase.due_amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="px-4 py-2 text-center">
                      {new Date(purchase.created_at).toLocaleDateString()}
                    </TableCell>

                    {/* 👇 View Button */}
                    <TableCell className="px-4 py-2 text-center">
                      <Link
                        to={`/purchases/${purchase.id}`}
                        className="text-blue-600 hover:text-blue-700 underline text-sm"
                      >
                        <IconButton color="green" tooltip="View" icon={Eye}>
                          View
                        </IconButton>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500 text-sm">No purchase history found.</p>
          )}
        </div>

        {/* Total Purchased */}
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <h2 className="text-lg font-medium">Total Purchased</h2>
          <p className="text-lg font-semibold text-green-600">
            {Number(supplier.totalPurchased).toFixed(2)} ৳
          </p>
        </div>
      </div>
    </div>
  );
}

// Info component
const Info = ({ label, value }: { label: string; value: any }) => (
  <div>
    <p className="text-gray-500 text-xs">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);
