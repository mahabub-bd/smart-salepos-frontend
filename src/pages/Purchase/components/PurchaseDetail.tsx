import { FileCheck, Wallet } from "lucide-react";
import { useState } from "react";
import IconButton from "../../../components/common/IconButton";
import Loading from "../../../components/common/Loading";
import { useGetPurchaseByIdQuery } from "../../../features/purchases/purchasesApi";
import { PaymentHistory, PurchaseItem } from "../../../types";
import PurchasePaymentModal from "./PurchasePaymentModal";
import PurchaseReceiveModal from "./PurchaseReceiveModal";
import PurchaseStatusBadge from "./PurchaseStatusBadge";

interface Props {
  purchaseId: string;
}

export default function PurchaseDetail({ purchaseId }: Props) {
  const { data, isLoading, isError } = useGetPurchaseByIdQuery(purchaseId);
  const purchase = data?.data;

  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  if (isLoading) return <Loading message="Loading Purchase..." />;
  if (isError || !purchase) return <ErrorMessage />;

  const totalPaid =
    purchase.payment_history?.reduce((sum, p) => sum + Number(p.amount), 0) ||
    0;

  return (
    <>
      <HeaderSection
        purchase={purchase}
        openReceive={() => setIsReceiveModalOpen(true)}
        openPayment={() => setIsPaymentModalOpen(true)}
      />

      <DetailCard title="Purchase Information">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <Info label="PO Number" value={purchase.po_no} />
          <Info label="Supplier" value={purchase.supplier?.name || "-"} />
          <Info label="Warehouse" value={purchase.warehouse?.name || "-"} />
          <Info
            label="Status"
            value={<PurchaseStatusBadge status={purchase.status} />}
          />
          <Info
            label="Created At"
            value={new Date(purchase.created_at).toLocaleDateString()}
          />
          <Info label="Total" value={<Amount>{purchase.total}</Amount>} />
        </div>
      </DetailCard>

      <MetricsCard
        paid={purchase.paid_amount}
        due={purchase.due_amount}
        total={purchase.total}
      />

      <TableCard title="Purchased Items">
        <ItemTable items={purchase.items} total={purchase.total} />
      </TableCard>

      {purchase.payment_history?.length > 0 && (
        <TableCard title="Payment History">
          <PaymentTable
            history={purchase.payment_history}
            totalPaid={totalPaid}
          />
        </TableCard>
      )}

      <PurchaseReceiveModal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
        purchase={purchase}
      />
      <PurchasePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        purchase={purchase}
      />
    </>
  );
}

/* ---------------------- Reusable Components ---------------------- */

const ErrorMessage = () => (
  <p className="p-6 text-red-500">Failed to load purchase details.</p>
);

const HeaderSection = ({ purchase, openReceive, openPayment }: any) => (
  <div className="flex flex-wrap justify-between items-center mb-4">
    <h1 className="text-xl font-semibold">Purchase Details</h1>
    <div className="flex gap-3">
      {purchase.status === "ordered" && (
        <IconButton
          icon={FileCheck}
          color="green"
          tooltip="Receive Items"
          onClick={openReceive}
        >
          Receive
        </IconButton>
      )}
      {Number(purchase.due_amount) > 0 && (
        <IconButton
          icon={Wallet}
          color="purple"
          tooltip="Make Payment"
          onClick={openPayment}
        >
          Pay
        </IconButton>
      )}
    </div>
  </div>
);

const DetailCard = ({ title, children }: any) => (
  <div className="bg-white shadow-sm rounded-xl border p-4 mb-4">
    <SectionHeader title={title} />
    {children}
  </div>
);

const TableCard = ({ title, children }: any) => (
  <DetailCard title={title}>
    <div className="overflow-x-auto">{children}</div>
  </DetailCard>
);

const SectionHeader = ({ title }: { title: string }) => (
  <h2 className="text-lg font-medium mb-3">{title}</h2>
);

const Info = ({ label, value }: { label: string; value: any }) => (
  <div>
    <p className="text-gray-500 text-xs uppercase">{label}</p>
    <p className="mt-1 font-medium">{value}</p>
  </div>
);

const Amount = ({ children }: any) => (
  <span className="font-semibold text-gray-800">
    {Number(children).toLocaleString()}
  </span>
);

/* Metrics Summary */
const MetricsCard = ({ paid, due, total }: any) => (
  <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4 flex justify-around text-center">
    <Metric label="Paid" value={paid} color="text-green-600" />
    <Metric label="Due" value={due} color="text-red-500" />
    <Metric label="Total" value={total} color="text-gray-800" />
  </div>
);

const Metric = ({ label, value, color }: any) => (
  <div>
    <p className="text-xs text-gray-500 uppercase">{label}</p>
    <p className={`text-lg font-bold ${color}`}>
      {Number(value).toLocaleString()}
    </p>
  </div>
);

/* Tables */

const ItemTable = ({ items, total }: any) => (
  <table className="w-full text-sm">
    <thead className="border-b bg-gray-50">
      <tr>
        <th className="table-header">Product</th>
        <th className="table-header">SKU</th>
        <th className="table-header">Qty</th>
        <th className="table-header">Price</th>
        <th className="table-header">Subtotal</th>
      </tr>
    </thead>
    <tbody>
      {items.map((item: PurchaseItem) => (
        <tr key={item.id} className="border-b">
          <td className="table-body">{item.product?.name || "-"}</td>
          <td className="table-body">{item.product?.sku || "-"}</td>
          <td className="table-body">{item.quantity}</td>
          <td className="table-body">{item.price}</td>
          <td className="table-body">
            {(Number(item.price) * item.quantity).toLocaleString()}
          </td>
        </tr>
      ))}
    </tbody>
    <tfoot>
      <tr className="font-semibold">
        <td colSpan={4} className="px-4 py-3">
          Total
        </td>
        <td className="px-4 py-3">{Number(total).toLocaleString()}</td>
      </tr>
    </tfoot>
  </table>
);

const PaymentTable = ({ history, totalPaid }: any) => (
  <table className="w-full text-sm">
    <thead className="border-b bg-gray-50">
      <tr>
        <th className="table-header">Date</th>
        <th className="table-header">Amount</th>
        <th className="table-header">Method</th>
        <th className="table-header">Note</th>
      </tr>
    </thead>
    <tbody>
      {history.map((p: PaymentHistory) => (
        <tr key={p.id} className="border-b">
          <td className="table-body">
            {new Date(p.created_at).toLocaleDateString()}
          </td>
          <td className="table-body text-green-600 font-medium">
            {Number(p.amount).toLocaleString()}
          </td>
          <td className="table-body capitalize">{p.method}</td>
          <td className="table-body">{p.note || "-"}</td>
        </tr>
      ))}
    </tbody>
    <tfoot>
      <tr className="font-semibold">
        <td colSpan={3} className="px-4 py-3">
          Total Paid
        </td>
        <td className="px-4 py-3 text-green-600">
          {totalPaid.toLocaleString()}
        </td>
      </tr>
    </tfoot>
  </table>
);
