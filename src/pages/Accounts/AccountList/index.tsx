import { useState } from "react";
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
import {
  useGetAccountBalancesQuery,
  useGetAccountsQuery,
} from "../../../features/accounts/accountsApi";
import AddBalanceModal from "./components/AddBalanceModal";
import AddCashModal from "./components/AddCashModal";
import FundTransferModal from "./components/FundTransferModal";

export default function AccountListPage() {
  const {
    data: accountsData,
    isLoading,
    isError,
  } = useGetAccountsQuery(undefined);
  const { data: balancesData } = useGetAccountBalancesQuery(undefined);

  const accounts = accountsData?.data || [];
  const balances = balancesData?.data || [];

  const [modalType, setModalType] = useState<
    "cash" | "bank" | "transfer" | null
  >(null);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  if (isLoading) return <Loading message="Loading accounts..." />;
  if (isError || !accounts)
    return <p className="text-red-500 p-4">Failed to load accounts.</p>;

  // 🔹 Open modal and inject current balance
  const openModal = (account: any, type: "cash" | "bank" | "transfer") => {
    const accountWithBalance = {
      ...account,
      balance: balances.find((b) => b.code === account.code)?.balance || 0,
    };
    setSelectedAccount(accountWithBalance);
    setModalType(type);
  };

  return (
    <div>
      <PageMeta title="Account List" description="Chart of Accounts" />
      <PageBreadcrumb pageTitle="Accounts" />

      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5">
        <h2 className="text-lg font-semibold mb-3">Chart of Accounts</h2>

        <Table className="w-full text-sm">
          <TableHeader className="border-b bg-gray-100 dark:bg-gray-700">
            <TableRow>
              <TableCell isHeader className="px-4 py-3 text-left">
                Account Number
              </TableCell>
              <TableCell isHeader className="px-4 py-3 text-left">
                Code
              </TableCell>
              <TableCell isHeader className="px-4 py-3 text-left">
                Name
              </TableCell>
              <TableCell isHeader className="px-4 py-3 text-center">
                Type
              </TableCell>
              <TableCell isHeader className="px-4 py-3 text-center">
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {accounts.map((acc: any) => (
              <TableRow key={acc.id} className="border-b last:border-none">
                <TableCell className="px-4 py-2">
                  {acc.account_number}
                </TableCell>
                <TableCell className="px-4 py-2">{acc.code}</TableCell>
                <TableCell className="px-4 py-2">{acc.name}</TableCell>

                <TableCell className="px-4 py-2 text-center">
                  <AccountBadge
                    color={
                      acc.type === "asset"
                        ? "blue"
                        : acc.type === "liability"
                        ? "orange"
                        : acc.type === "equity"
                        ? "purple"
                        : acc.type === "income"
                        ? "green"
                        : "red"
                    }
                  >
                    {acc.type}
                  </AccountBadge>
                </TableCell>

                {/* Action Buttons */}
                <TableCell className="px-4 py-2 flex justify-center gap-2">
                  {acc.isCash && (
                    <>
                      <button
                        className="px-3 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600"
                        onClick={() => openModal(acc, "cash")}
                      >
                        Add Cash
                      </button>

                      <button
                        className="px-3 py-1 text-xs rounded bg-purple-500 text-white hover:bg-purple-600"
                        onClick={() => openModal(acc, "transfer")}
                      >
                        Fund Transfer
                      </button>
                    </>
                  )}

                  {acc.isBank && (
                    <>
                      <button
                        className="px-3 py-1 text-xs rounded bg-green-500 text-white hover:bg-green-600"
                        onClick={() => openModal(acc, "bank")}
                      >
                        Add Balance
                      </button>

                      <button
                        className="px-3 py-1 text-xs rounded bg-orange-500 text-white hover:bg-orange-600"
                        onClick={() => openModal(acc, "transfer")}
                      >
                        Fund Transfer
                      </button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal Handling */}
      {modalType === "cash" && (
        <AddCashModal isOpen onClose={() => setModalType(null)} />
      )}

      {modalType === "bank" && selectedAccount && (
        <AddBalanceModal
          isOpen
          account={selectedAccount}
          onClose={() => setModalType(null)}
        />
      )}

      {modalType === "transfer" && selectedAccount && (
        <FundTransferModal
          isOpen
          fromAccount={selectedAccount}
          onClose={() => setModalType(null)}
        />
      )}
    </div>
  );
}
