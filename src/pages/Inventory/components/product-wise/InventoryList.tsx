import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../components/common/Loading";
import { useGetProductWiseReportQuery } from "../../../../features/inventory/inventoryApi";

export default function InventoryListProductWise() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetProductWiseReportQuery();

  const inventory = data?.data || [];

  if (isLoading) return <Loading message="Loading Inventory..." />;
  if (isError)
    return <p className="p-6 text-red-500">Failed to load inventory</p>;

  return (
    <div>
      <div className="rounded-xl border bg-white mt-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="table-header">Product</th>
                <th className="table-header">SKU</th>
                <th className="table-header">Total Stock</th>
                <th className="table-header">Warehouses</th>
                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {inventory.length ? (
                inventory.map((item: any) => (
                  <tr key={item.product_id} className="border-b">
                    <td className="table-body font-semibold">
                      {item.product.name}
                    </td>

                    <td className="table-body text-gray-600">
                      {item.product.sku}
                    </td>

                    <td className="table-body font-medium">
                      {item.total_stock}
                    </td>

                    <td className="table-body">
                      {item.warehouses.map((w: any, index: number) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium">
                            {w.warehouse.name}
                          </span>{" "}
                          — {w.quantity} pcs
                          <br />
                          <span className="text-xs text-gray-500">
                            Batch: {w.batch_no}
                          </span>
                        </div>
                      ))}
                    </td>

                    <td className="table-body text-right">
                      <button
                        className="p-2 rounded hover:bg-gray-100"
                        onClick={() =>
                          navigate(`/inventory/product/${item.product_id}`)
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
                    No inventory records found
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
