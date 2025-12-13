import { FileCheck, Wallet } from "lucide-react";
import { useState } from "react";
import IconButton from "../../../components/common/IconButton";
import Loading from "../../../components/common/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/common/Table";
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
  <div className="flex flex-wrap justify-between items-center mb-2">
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
  <div className="bg-white shadow-sm rounded-xl border p-3 mb-3">
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
    <p className="font-medium">{value}</p>
  </div>
);

const Amount = ({ children }: any) => (
  <span className="font-semibold text-gray-800">
    {Number(children).toLocaleString()}
  </span>
);

/* Metrics Summary */
const MetricsCard = ({ paid, due, total }: any) => (
  <div className="bg-gray-50 p-2 rounded-lg shadow-sm mb-3 flex justify-around text-center">
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
  <Table className="text-sm">
    <TableHeader className="bg-gray-50">
      <TableRow>
        <TableCell isHeader className="py-2">Product</TableCell>
        <TableCell isHeader className="py-2">SKU</TableCell>
        <TableCell isHeader className="py-2">Qty</TableCell>
        <TableCell isHeader className="py-2">Price</TableCell>
        <TableCell isHeader className="py-2">Subtotal</TableCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      {items.map((item: PurchaseItem) => (
        <TableRow key={item.id} className="border-b">
          <TableCell className="py-1">{item.product?.name || "-"}</TableCell>
          <TableCell className="py-1">{item.product?.sku || "-"}</TableCell>
          <TableCell className="py-1">{item.quantity}</TableCell>
          <TableCell className="py-1">{item.price}</TableCell>
          <TableCell className="py-1">
            {(Number(item.price) * item.quantity).toLocaleString()}
          </TableCell>
        </TableRow>
      ))}
      <TableRow className="font-semibold bg-gray-50/50">
        <TableCell colSpan={4} className="py-2">
          Total
        </TableCell>
        <TableCell className="py-2">{Number(total).toLocaleString()}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

const PaymentTable = ({ history, totalPaid }: any) => (
  <Table className="text-sm">
    <TableHeader className="bg-gray-50">
      <TableRow>
        <TableCell isHeader className="py-2">Date</TableCell>
        <TableCell isHeader className="py-2">Amount</TableCell>
        <TableCell isHeader className="py-2">Method</TableCell>
        <TableCell isHeader className="py-2">Note</TableCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      {history.map((p: PaymentHistory) => (
        <TableRow key={p.id} className="border-b">
          <TableCell className="py-1">
            {new Date(p.created_at).toLocaleDateString()}
          </TableCell>
          <TableCell className="py-1 text-green-600 font-medium">
            {Number(p.amount).toLocaleString()}
          </TableCell>
          <TableCell className="capitalize py-1">{p.method}</TableCell>
          <TableCell className="py-1">{p.note || "-"}</TableCell>
        </TableRow>
      ))}
      <TableRow className="font-semibold bg-gray-50/50">
        <TableCell colSpan={3} className="py-2">
          Total Paid
        </TableCell>
        <TableCell className="text-green-600 py-2">
          {totalPaid.toLocaleString()}
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
);
