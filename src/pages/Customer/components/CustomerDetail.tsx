import Loading from "../../../components/common/Loading";
import { useGetCustomerByIdQuery } from "../../../features/customer/customerApi";

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
          <Info label="Address" value={customer.address || "-"} />
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
  <table className="w-full text-sm">
    <thead className="border-b bg-gray-50">
      <tr>
        <th className="table-header">Invoice</th>
        <th className="table-header">Date</th>
        <th className="table-header">Items</th>
        <th className="table-header">Total</th>
        <th className="table-header">Paid</th>
        <th className="table-header">Due</th>
        <th className="table-header">Status</th>
      </tr>
    </thead>
    <tbody>
      {sales.map((s: any) => (
        <tr key={s.id} className="border-b">
          <td className="table-body">{s.invoice_no}</td>
          <td className="table-body">
            {new Date(s.created_at).toLocaleDateString()}
          </td>
          <td className="table-body">{s.items?.length || 0}</td>
          <td className="table-body">{Number(s.total).toLocaleString()}</td>
          <td className="table-body text-green-600 font-medium">
            {Number(s.paid_amount).toLocaleString()}
          </td>
          <td className="table-body text-red-500 font-medium">
            {(Number(s.total) - Number(s.paid_amount)).toLocaleString()}
          </td>
          <td className="table-body capitalize">{s.status}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
