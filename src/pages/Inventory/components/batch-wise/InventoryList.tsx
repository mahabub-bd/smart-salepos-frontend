import { Eye } from "lucide-react";

import { useNavigate } from "react-router-dom";
import Loading from "../../../../components/common/Loading";
import { useGetInventoryQuery } from "../../../../features/inventory/inventoryApi";

export default function InventoryListBatchWise() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetInventoryQuery();

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
                <th className="table-header">Batch No</th>
                <th className="table-header">Warehouse</th>
                <th className="table-header">Qty</th>
                <th className="table-header">Sold</th>
                <th className="table-header">Remaining</th>
                <th className="table-header">Supplier</th>
                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {inventory.length ? (
                inventory.map((item: any) => (
                  <tr key={item.id} className="border-b">
                    <td className="table-body">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-xs text-gray-500">
                          SKU: {item.product.sku}
                        </p>
                      </div>
                    </td>

                    <td className="table-body">{item.batch_no}</td>

                    <td className="table-body">{item.warehouse.name}</td>

                    <td className="table-body">{item.quantity}</td>

                    <td className="table-body">{item.sold_quantity}</td>

                    <td className="table-body font-semibold">
                      {item.quantity - item.sold_quantity}
                    </td>

                    <td className="table-body">{item.supplier}</td>

                    <td className="table-body text-right">
                      <button
                        className="p-2 rounded hover:bg-gray-100"
                        onClick={() => navigate(`/inventory/${item.id}`)}
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="py-6 text-center text-gray-500 dark:text-gray-300"
                  >
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
