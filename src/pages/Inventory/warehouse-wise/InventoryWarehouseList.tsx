import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetWarehouseWiseReportQuery } from "../../../features/inventory/inventoryApi";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";
import Loading from "../../../components/common/Loading";



export default function InventoryWarehouseList() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetWarehouseWiseReportQuery({});

  const warehouses = data?.data || [];

  if (isLoading) return <Loading message="Loading warehouse inventory..." />;
  if (isError)
    return <p className="p-6 text-red-500">Failed to load inventory</p>;

  return (
    <div className="mt-5">
      <div className="rounded-xl border bg-white">
        <div className="overflow-x-auto">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow>
                <TableCell isHeader>Warehouse</TableCell>
                <TableCell isHeader>Location</TableCell>
                <TableCell isHeader>Purchased</TableCell>
                <TableCell isHeader>Sold</TableCell>
                <TableCell isHeader>Remaining</TableCell>
                <TableCell isHeader>Purchase Value</TableCell>
                <TableCell isHeader>Sale Value</TableCell>
                <TableCell isHeader>Products</TableCell>
                <TableCell isHeader>Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {warehouses ? (
                warehouses.map((item: any) => (
                  <TableRow key={item.warehouse_id} className="border-b">
                    {/* Warehouse Name */}
                    <TableCell>{item.warehouse.name}</TableCell>

                    {/* Location */}
                    <TableCell>{item.warehouse.location}</TableCell>

                    {/* Purchased */}
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
                    <TableCell className=" font-medium">
                      {item.purchase_value?.toLocaleString() || 0}
                    </TableCell>

                    {/* Sale Value */}
                    <TableCell className=" font-medium">
                      {item.sale_value?.toLocaleString() || 0}
                    </TableCell>

                    {/* Product Details */}
                    <TableCell className="table-body">
                      {item.products.map((p: any, index: number) => (
                        <div key={index} className="mb-2">
                          <p className="font-medium">{p.product.name}</p>
                          <p className="text-sm text-gray-500">
                            SKU: {p.product.sku}
                          </p>

                          <p className="text-xs">
                            <span className="text-blue-500">
                              Purchased: {p.purchased_quantity}
                            </span>
                            {" | "}
                            <span className="text-red-500">
                              Sold: {p.sold_quantity}
                            </span>
                            {" | "}
                            <span className="text-green-600">
                              Remaining: {p.remaining_quantity}
                            </span>
                            {" | "}
                            <span>Batch: {p.batch_no}</span>
                          </p>

                          {index < item.products.lengTableCell - 1 && (
                            <hr className="my-2" />
                          )}
                        </div>
                      ))}
                    </TableCell>

                    {/* Action */}
                    <TableCell className="table-body text-right">
                      <button
                        className="p-2 rounded hover:bg-gray-100"
                        onClick={() =>
                          navigate(`/inventory/warehouse/${item.warehouse_id}`)
                        }
                      >
                        <Eye size={18} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <tr>
                  <TableCell
                    colSpan={9}
                    className="py-6 text-center text-gray-500"
                  >
                    No warehouse inventory found
                  </TableCell>
                </tr>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
