import { useState } from "react";
import Loading from "../../../../components/common/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { useGetAccountJournalQuery, useGetAccountsQuery } from "../../../../features/accounts/accountsApi";

export default function JournalList() {
  const [selectedAccountCode, setSelectedAccountCode] = useState<string>("");
  const { data, isLoading, isError } = useGetAccountJournalQuery(selectedAccountCode || undefined);
  const { data: accountsData } = useGetAccountsQuery();
  const journal = data?.data || [];
  const accounts = accountsData?.data || [];

  if (isLoading) return <Loading message="Loading journal entries..." />;
  if (isError)
    return <p className="text-red-500 p-4">Failed to load journal entries.</p>;
  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <label htmlFor="accountFilter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Filter by Account:
        </label>
        <select
          id="accountFilter"
          value={selectedAccountCode}
          onChange={(e) => setSelectedAccountCode(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Accounts</option>
          {accounts.map((account: any) => (
            <option key={account.code} value={account.code}>
              {account.name} ({account.code})
            </option>
          ))}
        </select>
      </div>
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
