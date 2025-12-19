import { useState } from "react";

import Loading from "../../../components/common/Loading";
import DatePicker from "../../../components/form/date-picker";
import { SelectField } from "../../../components/form/form-elements/SelectFiled";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useGetInventoryJournalQuery } from "../../../features/inventory/inventoryApi";
import { useGetProductsQuery } from "../../../features/product/productApi";
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
  const [filters, setFilters] = useState({
    product_id: undefined as number | undefined,
    warehouse_id: undefined as number | undefined,
    start_date: undefined as string | undefined,
    end_date: undefined as string | undefined,
  });

  const { data: productsData } = useGetProductsQuery();
  const products = productsData?.data || [];

  const { data, isLoading, isError } = useGetInventoryJournalQuery(filters);
  const journal: InventoryJournalEntry[] = data?.data || [];

  if (isLoading) return <Loading message="Loading Inventory Journal..." />;
  if (isError)
    return <p className="p-6 text-red-500">Failed to load inventory journal</p>;

  return (
    <div>
      {/* Filters Section */}
      <div className="mb-6 rounded-xl border bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SelectField
            label="Product"
            data={products}
            value={filters.product_id?.toString() || ""}
            onChange={(value) =>
              setFilters(prev => ({
                ...prev,
                product_id: value === "" ? undefined : parseInt(value)
              }))
            }
            placeholder="Select a product"
            allowEmpty={true}
            emptyLabel="All Products"
          />

          <DatePicker
            id="inventory-from-date"
            label="From Date"
            value={filters.start_date ? new Date(filters.start_date) : null}
            onChange={(value) =>
              setFilters(prev => ({
                ...prev,
                start_date: value ? (value as Date).toISOString().split('T')[0] : undefined
              }))
            }
            placeholder="Start date"
          />

          <DatePicker
            id="inventory-to-date"
            label="To Date"
            value={filters.end_date ? new Date(filters.end_date) : null}
            onChange={(value) =>
              setFilters(prev => ({
                ...prev,
                end_date: value ? (value as Date).toISOString().split('T')[0] : undefined
              }))
            }
            placeholder="End date"
          />

          <div className="flex items-end">
            <button
              onClick={() => setFilters({
                product_id: undefined,
                warehouse_id: undefined,
                start_date: undefined,
                end_date: undefined,
              })}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

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
