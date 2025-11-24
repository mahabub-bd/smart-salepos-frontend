import Loading from "../../../components/common/Loading";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useGetAccountJournalQuery } from "../../../features/accounts/accountsApi";

export default function JournalPage() {
  const { data, isLoading, isError } = useGetAccountJournalQuery();
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
          <Table className="w-full text-sm">
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Transaction ID
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Reference
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Account
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-right text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Debit
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-right text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Credit
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Narration
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {journal.map((tx: any) =>
                tx.entries.map((entry: any, index: number) => (
                  <TableRow key={`${tx.transaction_id}-${index}`}>
                    {index === 0 && (
                      <>
                        <TableCell
                          rowSpan={tx.entries.length}
                          className="px-4 py-3 text-sm text-left text-gray-800 dark:text-gray-100"
                        >
                          {tx.transaction_id}
                        </TableCell>
                        <TableCell
                          rowSpan={tx.entries.length}
                          className="px-4 py-3 text-sm capitalize text-left text-gray-800 dark:text-gray-100"
                        >
                          {tx.reference_type} #{tx.reference_id}
                        </TableCell>
                        <TableCell
                          rowSpan={tx.entries.length}
                          className="px-4 py-3 text-sm text-left text-gray-800 dark:text-gray-100"
                        >
                          {new Date(tx.date).toLocaleDateString()}
                        </TableCell>
                      </>
                    )}

                    <TableCell className="px-4 py-3 text-sm text-left text-gray-800 dark:text-gray-100">
                      {entry.account_name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-right text-gray-800 dark:text-gray-100">
                      {Number(entry.debit).toLocaleString()}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-right text-gray-800 dark:text-gray-100">
                      {Number(entry.credit).toLocaleString()}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-left text-gray-800 dark:text-gray-100">
                      {entry.narration || "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
