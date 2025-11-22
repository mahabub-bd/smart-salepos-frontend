import { Eye, FileCheck, Pencil, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import IconButton from "../../../components/common/IconButton";
import Loading from "../../../components/common/Loading";
import PageHeader from "../../../components/common/PageHeader";
import { useGetPurchasesQuery } from "../../../features/purchases/purchasesApi";

export default function PurchaseList() {
  const { data, isLoading, isError } = useGetPurchasesQuery();
  const navigate = useNavigate();

  const purchases = data?.data || [];

  if (isLoading) return <Loading message="Loading Purchases..." />;
  if (isError)
    return <p className="p-6 text-red-500">Failed to fetch purchases.</p>;

  return (
    <>
      <PageHeader
        title="Purchase Management"
        icon={<Plus size={16} />}
        addLabel="Add Purchase"
        onAdd={() => navigate("/purchases/create")} // 🚀 Go to Create Page
        permission="purchase.create"
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="table-header">PO No</th>
                <th className="table-header">Supplier</th>
                <th className="table-header">Warehouse</th>
                <th className="table-header">Total</th>
                <th className="table-header">Status</th>
                <th className="table-header">Created At</th>
                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {purchases.length > 0 ? (
                purchases.map((p) => (
                  <tr key={p.id} className="border-b">
                    <td className="table-body font-medium">{p.po_no}</td>
                    <td className="table-body">
                      {p.supplier?.name || `Supplier #${p.supplier_id}`}
                    </td>
                    <td className="table-body">
                      {p.warehouse?.name || `Warehouse #${p.warehouse_id}`}
                    </td>
                    <td className="table-body">{p.total}</td>
                    <td className="table-body capitalize">{p.status}</td>
                    <td className="table-body">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>

                    <td className="table-body text-right">
                      <div className="flex justify-end gap-2">
                        {/* View Details */}
                        <IconButton
                          icon={Eye}
                          color="gray"
                          onClick={() => navigate(`/purchases/${p.id}`)}
                        />

                        {/* Receive */}
                        <IconButton
                          icon={FileCheck}
                          color="green"
                          onClick={() =>
                            navigate(`/purchases/${p.id}?receive=true`)
                          } // optional
                        />

                        {/* Edit */}
                        <IconButton
                          icon={Pencil}
                          color="blue"
                          onClick={() => navigate(`/purchases/edit/${p.id}`)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500">
                    No purchases found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
