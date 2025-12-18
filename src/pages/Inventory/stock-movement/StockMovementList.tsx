import { ArrowDownLeft, ArrowRightLeft, ArrowUpRight, Edit3 } from "lucide-react";
import { useState } from "react";

import Loading from "../../../components/common/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useGetStockMovementsQuery } from "../../../features/inventory/inventoryApi";
import { StockMovement, StockMovementType } from "../../../types";
import { formatDateTime } from "../../../utlis";

// Movement type badge component
const MovementTypeBadge = ({ type }: { type: StockMovementType }) => {
  const config = {
    IN: {
      icon: ArrowDownLeft,
      label: "Stock In",
      className: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    },
    OUT: {
      icon: ArrowUpRight,
      label: "Stock Out",
      className: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    },
    ADJUST: {
      icon: Edit3,
      label: "Adjustment",
      className: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    },
    TRANSFER: {
      icon: ArrowRightLeft,
      label: "Transfer",
      className: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
    },
  };

  const { icon: Icon, label, className } = config[type];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${className}`}
    >
      <Icon size={12} />
      {label}
    </span>
  );
};

export default function StockMovementList() {
  const [filters] = useState({
    product_id: undefined,
    warehouse_id: undefined,
    type: undefined,
  });

  const { data, isLoading, isError } = useGetStockMovementsQuery(filters);
  const movements: StockMovement[] = data?.data || [];

  if (isLoading) return <Loading message="Loading Stock Movements..." />;
  if (isError)
    return <p className="p-6 text-red-500">Failed to load stock movements</p>;

  return (
    <div>
      <div className="rounded-xl border bg-white">
        <div className="overflow-x-auto">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow>
                <TableCell isHeader>Date</TableCell>
                <TableCell isHeader>Product</TableCell>
                <TableCell isHeader>Type</TableCell>
                <TableCell isHeader>Quantity</TableCell>
                <TableCell isHeader>From Warehouse</TableCell>
                <TableCell isHeader>To Warehouse</TableCell>
                <TableCell isHeader>Note</TableCell>
                <TableCell isHeader>Created By</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {movements.length > 0 ? (
                movements.map((movement) => (
                  <TableRow key={movement.id} className="border-b">
                    {/* Date */}
                    <TableCell className="align-middle">
                      {formatDateTime(movement.created_at)}
                    </TableCell>

                    {/* Product */}
                    <TableCell className="align-middle">
                      <div className="flex flex-col">
                        <span className="font-medium">{movement.product.name}</span>
                        <span className="text-xs text-gray-500">
                          SKU: {movement.product.sku}
                        </span>
                      </div>
                    </TableCell>

                    {/* Type */}
                    <TableCell className="align-middle">
                      <MovementTypeBadge type={movement.type} />
                    </TableCell>

                    {/* Quantity */}
                    <TableCell className="align-middle font-semibold">
                      <span
                        className={
                          movement.type === "IN" || movement.type === "TRANSFER"
                            ? "text-green-600"
                            : movement.type === "OUT"
                            ? "text-red-600"
                            : "text-blue-600"
                        }
                      >
                        {movement.type === "OUT" ? "-" : "+"}
                        {movement.quantity}
                      </span>
                    </TableCell>

                    {/* From Warehouse */}
                    <TableCell className="align-middle">
                      {movement.from_warehouse ? (
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {movement.from_warehouse.name}
                          </span>
                          {movement.from_warehouse.location && (
                            <span className="text-xs text-gray-500">
                              {movement.from_warehouse.location}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>

                    {/* To Warehouse */}
                    <TableCell className="align-middle">
                      {movement.to_warehouse ? (
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {movement.to_warehouse.name}
                          </span>
                          {movement.to_warehouse.location && (
                            <span className="text-xs text-gray-500">
                              {movement.to_warehouse.location}
                            </span>
                          )}
                        </div>
                      ) : movement.type === "TRANSFER" ? (
                        <span className="text-gray-400">—</span>
                      ) : (
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {movement.warehouse.name}
                          </span>
                          {movement.warehouse.location && (
                            <span className="text-xs text-gray-500">
                              {movement.warehouse.location}
                            </span>
                          )}
                        </div>
                      )}
                    </TableCell>

                    {/* Note */}
                    <TableCell className="align-middle">
                      {movement.note ? (
                        <span className="text-gray-600">{movement.note}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>

                    {/* Created By */}
                    <TableCell className="align-middle">
                      {movement.created_by ? (
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {movement.created_by.full_name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {movement.created_by.username}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-6 text-center text-gray-500"
                  >
                    No stock movements found
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
