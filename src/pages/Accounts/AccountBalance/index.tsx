import AccountBadge from "../../../components/common/AccountBadge";
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
import { useGetAccountBalancesQuery } from "../../../features/accounts/accountsApi";
import { Account } from "../../../types";

export default function AccountBalancePage() {
  const today = new Date().toISOString().split("T")[0];

  const { data, isLoading, isError } = useGetAccountBalancesQuery(today);

  const balances = data?.data || [];

  if (isLoading) return <Loading message="Loading account balances..." />;
  if (isError)
    return (
      <p className="text-red-500 p-4">Failed to fetch account balances.</p>
    );

  return (
    <div>
      <PageMeta
        title="Account Balances"
        description="View all account balances"
      />
      <PageBreadcrumb pageTitle="Account Balances" />

      <div className="flex flex-col gap-5 min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/5">
        <h1 className="text-xl font-semibold">Account Balances</h1>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                {/* Code – left */}
                <TableCell
                  isHeader
                  className="px-4 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Code
                </TableCell>

                <TableCell
                  isHeader
                  className="px-4 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Account Number
                </TableCell>

                {/* Name – left */}
                <TableCell
                  isHeader
                  className="px-4 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Name
                </TableCell>

                {/* Type – center */}
                <TableCell
                  isHeader
                  className="px-4 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Type
                </TableCell>

                {/* Debit – right */}
                <TableCell
                  isHeader
                  className="px-4 py-3 text-right text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Debit
                </TableCell>

                {/* Credit – right */}
                <TableCell
                  isHeader
                  className="px-4 py-3 text-right text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Credit
                </TableCell>

                {/* Balance – right */}
                <TableCell
                  isHeader
                  className="px-4 py-3 text-right text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Balance
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800 mx-auto">
              {balances.map((item: Account) => (
                <TableRow key={item.code} className="border-b last:border-none">
                  {/* Code – left */}
                  <TableCell className="px-4 py-3 text-sm text-left text-gray-800 dark:text-gray-100">
                    {item.account_number}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-left text-gray-800 dark:text-gray-100">
                    {item.code}
                  </TableCell>

                  {/* Name – left */}
                  <TableCell className="px-4 py-3 text-sm text-left text-gray-800 dark:text-gray-100">
                    {item.name}
                  </TableCell>

                  {/* Type – center */}
                  <TableCell className="px-4 py-3 text-sm text-center capitalize">
                    <AccountBadge
                      color={
                        item.type === "asset"
                          ? "blue"
                          : item.type === "liability"
                            ? "orange"
                            : item.type === "equity"
                              ? "purple"
                              : item.type === "income"
                                ? "green"
                                : "red"
                      }
                    >
                      {item.type}
                    </AccountBadge>
                  </TableCell>

                  {/* Debit – right */}
                  <TableCell className="px-4 py-3 text-sm text-right text-gray-800 dark:text-gray-100">
                    {Number(item.debit ?? 0).toFixed(2)}
                  </TableCell>

                  {/* Credit – right */}
                  <TableCell className="px-4 py-3 text-sm text-right text-gray-800 dark:text-gray-100">
                    {Number(item.credit ?? 0).toFixed(2)}
                  </TableCell>

                  {/* Balance – right, colored */}
                  <TableCell
                    className={`px-4 py-3 text-sm text-right font-medium ${(item.balance ?? 0) < 0 ? "text-red-500" : "text-green-600"
                      }`}
                  >
                    {Number(item.balance ?? 0).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
