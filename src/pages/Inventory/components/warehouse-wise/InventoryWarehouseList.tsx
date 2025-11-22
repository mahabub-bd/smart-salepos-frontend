import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../components/common/Loading";
import { useGetWarehouseWiseReportQuery } from "../../../../features/inventory/inventoryApi";

export default function InventoryWarehouseList() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetWarehouseWiseReportQuery();

  const warehouses = data?.data || [];

  if (isLoading) return <Loading message="Loading warehouse inventory..." />;
  if (isError)
    return <p className="p-6 text-red-500">Failed to load inventory</p>;

  return (
    <div className="mt-5">
      <div className="rounded-xl border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="table-header">Warehouse</th>
                <th className="table-header">Location</th>
                <th className="table-header">Total Stock</th>
                <th className="table-header">Products</th>
                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {warehouses.length ? (
                warehouses.map((item: any) => (
                  <tr key={item.warehouse_id} className="border-b">
                    {/* Warehouse Name */}
                    <td className="table-body font-semibold">
                      {item.warehouse.name}
                    </td>

                    {/* Location */}
                    <td className="table-body">{item.warehouse.location}</td>

                    {/* Total Stock */}
                    <td className="table-body font-medium">
                      {item.total_stock}
                    </td>

                    {/* Products List */}
                    <td className="table-body">
                      {item.products.map((p: any, index: number) => (
                        <div key={index} className="mb-2">
                          <p className="font-medium">{p.product.name}</p>
                          <p className="text-sm text-gray-500">
                            SKU: {p.product.sku}
                          </p>
                          <p className="text-xs">
                            Qty: {p.quantity} — Batch: {p.batch_no}
                          </p>
                          {index < item.products.length - 1 && (
                            <hr className="my-2" />
                          )}
                        </div>
                      ))}
                    </td>

                    {/* Actions */}
                    <td className="table-body text-right">
                      <button
                        className="p-2 rounded hover:bg-gray-100"
                        onClick={() =>
                          navigate(`/inventory/warehouse/${item.warehouse_id}`)
                        }
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    No warehouse inventory found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
