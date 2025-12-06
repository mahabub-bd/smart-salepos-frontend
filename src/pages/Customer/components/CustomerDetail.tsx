import { Link } from "react-router";
import Loading from "../../../components/common/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useGetCustomerByIdQuery } from "../../../features/customer/customerApi";
import { Sale } from "../../../types";

interface Props {
  customerId: string;
}

export default function CustomerDetail({ customerId }: Props) {
  const { data, isLoading, isError } = useGetCustomerByIdQuery(customerId);
  const customer = data?.data;

  if (isLoading) return <Loading message="Loading Customer..." />;

  if (isError || !customer)
    return <p className="p-6 text-red-500">Failed to load customer details.</p>;

  const sales = customer.sales || [];

  const summary = {
    totalSales: sales.length,
    totalAmount: sales.reduce((s: number, v: any) => s + Number(v.total), 0),
    totalPaid: sales.reduce(
      (s: number, v: any) => s + Number(v.paid_amount),
      0
    ),
    totalDue: sales.reduce(
      (s: number, v: any) => s + (Number(v.total) - Number(v.paid_amount)),
      0
    ),
  };

  return (
    <>
      <HeaderSection customer={customer} />

      <DetailCard title="Customer Information">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <Info label="Name" value={customer.name} />
          <Info label="Phone" value={customer.phone || "-"} />
          <Info label="Email" value={customer.email || "-"} />

          <Info label="Customer Group" value={customer.group?.name || "-"} />
          <Info label="Reward Points" value={customer.reward_points || 0} />
          <Info
            label="Status"
            value={
              <span
                className={`px-2 py-1 text-xs rounded ${
                  customer.status
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {customer.status ? "Active" : "Inactive"}
              </span>
            }
          />
          <Info
            label="Created At"
            value={new Date(customer.created_at).toLocaleDateString()}
          />
        </div>
      </DetailCard>

      {/* Billing Address */}
      <DetailCard title="Billing Address">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Info
            label="Contact Name"
            value={customer.billing_address?.contact_name || "-"}
          />
          <Info label="Phone" value={customer.billing_address?.phone || "-"} />
          <Info
            label="Street"
            value={customer.billing_address?.street || "-"}
          />
          <Info label="City" value={customer.billing_address?.city || "-"} />
          <Info
            label="Country"
            value={customer.billing_address?.country || "-"}
          />
        </div>
      </DetailCard>

      {/* Shipping Address */}
      <DetailCard title="Shipping Address">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Info
            label="Contact Name"
            value={customer.shipping_address?.contact_name || "-"}
          />
          <Info label="Phone" value={customer.shipping_address?.phone || "-"} />
          <Info
            label="Street"
            value={customer.shipping_address?.street || "-"}
          />
          <Info label="City" value={customer.shipping_address?.city || "-"} />
          <Info
            label="Country"
            value={customer.shipping_address?.country || "-"}
          />
        </div>
      </DetailCard>

      <DetailCard title="Account Information">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <Info label="Account Code" value={customer.account?.code} />
          <Info
            label="Account Number"
            value={customer.account?.account_number}
          />
          <Info label="Account Name" value={customer.account?.name} />
        </div>
      </DetailCard>

      <MetricsCard
        sales={summary.totalSales}
        paid={summary.totalPaid}
        due={summary.totalDue}
        total={summary.totalAmount}
      />

      <TableCard title="Sales History">
        <SalesTable sales={sales} />
      </TableCard>
    </>
  );
}

/* ---------------------- Reusable Components ---------------------- */

const HeaderSection = ({ customer }: any) => (
  <div className="flex justify-between mb-4">
    <h1 className="text-xl font-semibold">Customer Details {customer?.name}</h1>
  </div>
);

const DetailCard = ({ title, children }: any) => (
  <div className="bg-white shadow-sm rounded-xl border p-4 mb-4">
    <h2 className="text-lg font-medium mb-3">{title}</h2>
    {children}
  </div>
);

const TableCard = ({ title, children }: any) => (
  <DetailCard title={title}>
    <div className="overflow-x-auto">{children}</div>
  </DetailCard>
);

const Info = ({ label, value }: { label: string; value: any }) => (
  <div>
    <p className="text-gray-500 text-xs uppercase">{label}</p>
    <p className="mt-1 font-medium">{value}</p>
  </div>
);

const MetricsCard = ({ sales, paid, due, total }: any) => (
  <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4 grid grid-cols-4 gap-4 text-center">
    <Metric label="Sales" value={sales} color="text-blue-600" />
    <Metric label="Total Amount" value={total} color="text-gray-800" />
    <Metric label="Paid" value={paid} color="text-green-600" />
    <Metric label="Due" value={due} color="text-red-600" />
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

/* ---------------- Sales History Table ---------------- */

const SalesTable = ({ sales }: any) => (
  <div className="max-w-full overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell isHeader>Invoice</TableCell>
          <TableCell isHeader>Date</TableCell>
          <TableCell isHeader>Items</TableCell>
          <TableCell isHeader>Total</TableCell>
          <TableCell isHeader>Paid</TableCell>
          <TableCell isHeader>Due</TableCell>
          <TableCell isHeader>Sale Type</TableCell>
          <TableCell isHeader>Status</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.map((s: Sale) => (
          <TableRow key={s.id} className="border-b">
            <TableCell className="table-body">
              <Link
                to={`/sales/${s.id}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {s.invoice_no}
              </Link>
            </TableCell>

            <TableCell className="table-body">
              {new Date(s.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell className="table-body">{s.items?.length || 0}</TableCell>
            <td className="table-body">{Number(s.total).toLocaleString()}</td>
            <TableCell className="table-body text-green-600 font-medium">
              {Number(s.paid_amount).toLocaleString()}
            </TableCell>
            <TableCell className="table-body text-red-500 font-medium">
              {(Number(s.total) - Number(s.paid_amount)).toLocaleString()}
            </TableCell>
            <TableCell className="capitalize flex items-center gap-1">
              {s.sale_type === "pos" ? "POS" : "Regular"}
            </TableCell>
            <TableCell className="table-body capitalize">{s.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
