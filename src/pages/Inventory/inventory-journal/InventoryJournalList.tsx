import { useState } from "react";

import Loading from "../../../components/common/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useGetInventoryJournalQuery } from "../../../features/inventory/inventoryApi";
import { InventoryJournalEntry } from "../../../types";
import { formatDateTime } from "../../../utlis";

// Movement type badge component
const MovementTypeBadge = ({ type }: { type: string }) => {
  const config: Record<string, { label: string; className: string }> = {
    IN: {
      label: "Stock In",
      className: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    },
    OUT: {
      label: "Stock Out",
      className: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    },
    ADJUST: {
      label: "Adjustment",
      className: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    },
    TRANSFER: {
      label: "Transfer",
      className:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
    },
  };

  const { label, className } = config[type] || {
    label: type,
    className: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
};

export default function InventoryJournalList() {
  const [filters] = useState({
    product_id: undefined,
    warehouse_id: undefined,
    start_date: undefined,
    end_date: undefined,
  });

  const { data, isLoading, isError } = useGetInventoryJournalQuery(filters);
  const journal: InventoryJournalEntry[] = data?.data || [];

  if (isLoading) return <Loading message="Loading Inventory Journal..." />;
  if (isError)
    return <p className="p-6 text-red-500">Failed to load inventory journal</p>;

  return (
    <div>
      <div className="rounded-xl border bg-white">
        <div className="overflow-x-auto">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow>
                <TableCell isHeader>Date</TableCell>
                <TableCell isHeader>Product</TableCell>
                <TableCell isHeader>Warehouse</TableCell>
                <TableCell isHeader>Type</TableCell>
                <TableCell isHeader>Description</TableCell>
                <TableCell isHeader>Reference</TableCell>
                <TableCell isHeader className="text-right">
                  Debit (In)
                </TableCell>
                <TableCell isHeader className="text-right">
                  Credit (Out)
                </TableCell>
                <TableCell isHeader className="text-right">
                  Balance
                </TableCell>
                <TableCell isHeader>Created By</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {journal.length > 0 ? (
                journal.map((entry) => (
                  <TableRow key={entry.id} className="border-b hover:bg-gray-50">
                    {/* Date */}
                    <TableCell className="align-middle">
                      <span className="text-xs text-gray-600">
                        {formatDateTime(entry.date)}
                      </span>
                    </TableCell>

                    {/* Product */}
                    <TableCell className="align-middle">
                      <div className="flex items-center gap-3">
                        {entry.product.image && (
                          <img
                            src={entry.product.image}
                            alt={entry.product.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {entry.product.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            SKU: {entry.product.sku}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Warehouse */}
                    <TableCell className="align-middle">
                      <span className="font-medium">{entry.warehouse.name}</span>
                    </TableCell>

                    {/* Type */}
                    <TableCell className="align-middle">
                      <MovementTypeBadge type={entry.type} />
                    </TableCell>

                    {/* Description */}
                    <TableCell className="align-middle">
                      <span className="text-gray-700">{entry.description}</span>
                    </TableCell>

                    {/* Reference */}
                    <TableCell className="align-middle">
                      <span className="text-xs text-gray-600">
                        {entry.reference}
                      </span>
                    </TableCell>

                    {/* Debit (In) */}
                    <TableCell className="align-middle text-right">
                      {entry.debit > 0 ? (
                        <span className="font-semibold text-green-600">
                          +{entry.debit}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>

                    {/* Credit (Out) */}
                    <TableCell className="align-middle text-right">
                      {entry.credit > 0 ? (
                        <span className="font-semibold text-red-600">
                          -{entry.credit}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>

                    {/* Balance */}
                    <TableCell className="align-middle text-right">
                      <span className="font-bold text-blue-600">
                        {entry.balance}
                      </span>
                    </TableCell>

                    {/* Created By */}
                    <TableCell className="align-middle">
                      {entry.created_by ? (
                        <span className="text-sm font-medium">
                          {entry.created_by.name}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="py-6 text-center text-gray-500"
                  >
                    No journal entries found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Summary Section */}
      {journal.length > 0 && (
        <div className="mt-6 rounded-xl border bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Journal Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Total Entries</span>
              <span className="text-2xl font-bold text-gray-900">
                {journal.length}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Total Stock In</span>
              <span className="text-2xl font-bold text-green-600">
                +{journal.reduce((sum, entry) => sum + entry.debit, 0)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Total Stock Out</span>
              <span className="text-2xl font-bold text-red-600">
                -{journal.reduce((sum, entry) => sum + entry.credit, 0)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
