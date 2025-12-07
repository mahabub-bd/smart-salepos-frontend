import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../components/common/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { useGetProductWiseReportQuery } from "../../../../features/inventory/inventoryApi";
import { ProductWiseInventoryItem } from "../../../../types";

export default function InventoryListProductWise() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetProductWiseReportQuery();

  const inventory: ProductWiseInventoryItem[] = data?.data || [];

  if (isLoading) return <Loading message="Loading Inventory..." />;
  if (isError)
    return <p className="p-6 text-red-500">Failed to load inventory</p>;

  return (
    <div>
      <div className="rounded-xl border bg-white mt-5">
        <div className="overflow-x-auto">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow>
                <TableCell isHeader>Product</TableCell>
                <TableCell isHeader>SKU</TableCell>
                <TableCell isHeader>Purchased</TableCell>
                <TableCell isHeader>Sold</TableCell>
                <TableCell isHeader>Remaining</TableCell>
                <TableCell isHeader>Purchase Value</TableCell>
                <TableCell isHeader>Sale Value</TableCell>
                <TableCell isHeader>Warehouses</TableCell>
                <TableCell isHeader>Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {inventory ? (
                inventory.map((item) => (
                  <TableRow key={item.product_id} className="border-b">
                    {/* Product Name */}
                    <TableCell>{item.product.name}</TableCell>

                    {/* SKU */}
                    <TableCell>{item.product.sku}</TableCell>

                    {/* Purchased (Total Stock) */}
                    <TableCell>{item.total_stock}</TableCell>

                    {/* Sold */}
                    <TableCell className=" text-red-500">
                      {item.total_sold_quantity}
                    </TableCell>

                    {/* Remaining */}
                    <TableCell className=" text-green-600">
                      {item.remaining_stock}
                    </TableCell>

                    {/* Purchase Value */}
                    <TableCell className=" text-blue-600">
                      ৳{item.purchase_value.toLocaleString()}
                    </TableCell>

                    {/* Sale Value */}
                    <TableCell className=" text-purple-600">
                      ৳{item.sale_value.toLocaleString()}
                    </TableCell>

                    {/* Warehouse Details */}
                    <TableCell className="table-body">
                      {item.warehouses.map((warehouse, index) => (
                        <div key={index} className="text-sm mb-2">
                          <span className="font-medium">
                            {warehouse.warehouse.name}
                          </span>{" "}
                          —
                          <span className="text-blue-500">
                            {" "}
                            {warehouse.purchased_quantity} purchased
                          </span>
                          ,
                          <span className="text-red-500">
                            {" "}
                            {warehouse.sold_quantity} sold
                          </span>
                          ,
                          <span className="text-green-600">
                            {" "}
                            {warehouse.remaining_quantity} left
                          </span>
                          <br />
                          <span className="text-xs text-gray-500">
                            Batch: {warehouse.batch_no}
                          </span>
                        </div>
                      ))}
                    </TableCell>

                    {/* Action */}
                    <TableCell className="table-body text-right">
                      <button
                        className="p-2 rounded hover:bg-gray-100"
                        onClick={() =>
                          navigate(`/inventory/product/${item.product_id}`)
                        }
                      >
                        <Eye size={18} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="py-6 text-center text-gray-500"
                  >
                    No inventory records found
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
