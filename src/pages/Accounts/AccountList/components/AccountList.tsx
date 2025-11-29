import { ArrowRightLeft, DollarSign, PlusCircle, Shuffle } from "lucide-react";
import { useState } from "react";
import AccountBadge from "../../../../components/common/AccountBadge";
import IconButton from "../../../../components/common/IconButton";
import Loading from "../../../../components/common/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import {
  useGetAccountBalancesQuery,
  useGetAccountsQuery,
} from "../../../../features/accounts/accountsApi";
import AddBalanceModal from "./AddBalanceModal";
import AddCashModal from "./AddCashModal";
import FundTransferModal from "./FundTransferModal";

interface AccountListPageProps {
  isCashBank?: boolean; // If true → show only cash & bank accounts
}

export default function AccountListPage({
  isCashBank = false,
}: AccountListPageProps) {
  const {
    data: accountsData,
    isLoading,
    isError,
  } = useGetAccountsQuery(undefined);
  const { data: balancesData } = useGetAccountBalancesQuery(undefined);

  const accounts = accountsData?.data || [];
  const balances = balancesData?.data || [];

  // 👉 Filter logic based on props
  const displayedAccounts = isCashBank
    ? accounts.filter((acc: any) => acc.isCash || acc.isBank)
    : accounts;

  const [modalType, setModalType] = useState<
    "cash" | "bank" | "transfer" | null
  >(null);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  if (isLoading) return <Loading message="Loading accounts..." />;
  if (isError || !accounts)
    return <p className="text-red-500 p-4">Failed to load accounts.</p>;

  const openModal = (account: any, type: "cash" | "bank" | "transfer") => {
    setSelectedAccount({
      ...account,
      balance: balances.find((b) => b.code === account.code)?.balance || 0,
    });
    setModalType(type);
  };

  return (
    <div>
      <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800 dark:bg-white/5">
        <h2 className="text-lg font-semibold mb-3">
          {isCashBank ? "Cash & Bank Accounts" : "Chart of Accounts"}
        </h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader >
              <TableRow>
                <TableCell
                  isHeader

                >
                  Account Number
                </TableCell>
                <TableCell
                  isHeader

                >
                  Code
                </TableCell>
                <TableCell
                  isHeader

                >
                  Name
                </TableCell>
                <TableCell
                  isHeader

                >
                  Action
                </TableCell>
                <TableCell
                  isHeader

                >
                  Type
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800 mx-auto">
              {displayedAccounts.map((acc: any) => (
                <TableRow key={acc.id} className="border-b last:border-none">
                  <TableCell className="px-4 py-2">
                    {acc.account_number}
                  </TableCell>
                  <TableCell >
                    {acc.code}
                  </TableCell>
                  <TableCell >
                    {acc.name}
                  </TableCell>

                  {/* Action Buttons */}
                  <TableCell className="px-4 py-2 flex justify-center gap-2">
                    {acc.isCash && (
                      <>
                        <IconButton
                          icon={DollarSign}
                          color="blue"
                          size={16}
                          tooltip="Add Cash"
                          onClick={() => openModal(acc, "cash")}
                        />
                        <IconButton
                          icon={ArrowRightLeft}
                          color="purple"
                          size={16}
                          tooltip="Fund Transfer"
                          onClick={() => openModal(acc, "transfer")}
                        />
                      </>
                    )}

                    {acc.isBank && (
                      <>
                        <IconButton
                          icon={PlusCircle}
                          color="green"
                          size={16}
                          tooltip="Add Balance"
                          onClick={() => openModal(acc, "bank")}
                        />
                        <IconButton
                          icon={Shuffle}
                          size={16}
                          tooltip="Fund Transfer"
                          onClick={() => openModal(acc, "transfer")}
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                        />
                      </>
                    )}
                  </TableCell>

                  {/* Account Type Badge */}
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 🔹 Modal Manager */}
      {modalType &&
        selectedAccount &&
        (modalType === "cash" ? (
          <AddCashModal
            isOpen
            account={selectedAccount}
            onClose={() => setModalType(null)}
          />
        ) : modalType === "bank" ? (
          <AddBalanceModal
            isOpen
            account={selectedAccount}
            onClose={() => setModalType(null)}
          />
        ) : (
          <FundTransferModal
            isOpen
            fromAccount={selectedAccount}
            onClose={() => setModalType(null)}
          />
        ))}
    </div>
  );
}
