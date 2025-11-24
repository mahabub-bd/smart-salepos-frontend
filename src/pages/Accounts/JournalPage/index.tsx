import Loading from "../../../components/common/Loading";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import { useGetAccountJournalQuery } from "../../../features/accounts/accountsApi";

export default function JournalPage() {
  const { data, isLoading, isError } = useGetAccountJournalQuery(); // No params needed
  const journal = data?.data || [];

  if (isLoading) return <Loading message="Loading journal entries..." />;
  if (isError)
    return <p className="text-red-500 p-4">Failed to load journal entries.</p>;

  return (
    <div>
      <PageMeta
        title="Journal Entries"
        description="View all journal transactions"
      />
      <PageBreadcrumb pageTitle="Journal Entries" />

      <div className="flex flex-col gap-5 min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/5">
        <h1 className="text-xl font-semibold">Journal Entries</h1>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50 dark:bg-white/10">
              <tr>
                <th className="table-header text-left">Transaction ID</th>
                <th className="table-header text-left">Reference</th>
                <th className="table-header text-left">Date</th>
                <th className="table-header text-left">Account</th>
                <th className="table-header text-right">Debit</th>
                <th className="table-header text-right">Credit</th>
                <th className="table-header text-left">Narration</th>
              </tr>
            </thead>

            <tbody>
              {journal.map((tx: any) =>
                tx.entries.map((entry: any, index: number) => (
                  <tr
                    key={`${tx.transaction_id}-${index}`}
                    className="border-b last:border-none"
                  >
                    <td className="table-body">{tx.transaction_id}</td>
                    <td className="table-body capitalize">
                      {tx.reference_type} #{tx.reference_id}
                    </td>
                    <td className="table-body">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="table-body">{entry.account_name}</td>
                    <td className="table-body text-right">{entry.debit}</td>
                    <td className="table-body text-right">{entry.credit}</td>
                    <td className="table-body">{entry.narration}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
