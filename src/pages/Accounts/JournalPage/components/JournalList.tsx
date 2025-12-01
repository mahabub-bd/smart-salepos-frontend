import Loading from "../../../../components/common/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { useGetAccountJournalQuery } from "../../../../features/accounts/accountsApi";

export default function JournalList() {
  const { data, isLoading, isError } = useGetAccountJournalQuery();
  const journal = data?.data || [];

  if (isLoading) return <Loading message="Loading journal entries..." />;
  if (isError)
    return <p className="text-red-500 p-4">Failed to load journal entries.</p>;
  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-[#1e1e1e]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell isHeader>Transaction ID</TableCell>
                <TableCell isHeader>Reference</TableCell>
                <TableCell isHeader>Date</TableCell>
                <TableCell isHeader>Account</TableCell>
                <TableCell isHeader>Debit</TableCell>
                <TableCell isHeader>Credit</TableCell>
                <TableCell isHeader>Narration</TableCell>
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
    </>
  );
}
