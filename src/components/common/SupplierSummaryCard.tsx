import {
  ArrowLeft,
  Building,
  Calendar,
  Hash,
  Mail,
  Phone,
  TrendingDown,
  TrendingUp,
  User,
} from "lucide-react";
import Button from "../ui/button";

interface SupplierSummaryCardProps {
  supplier: {
    name: string;
    supplier_code: string;
    contact_person?: string;
    phone?: string;
    email?: string;
  };
  ledger: {
    account_code: string;
    opening_balance: number;
    closing_balance: number;
  };
  totalTransactions: number;
  selectedDate: string;
  onDateChange: (value: string) => void;
  onBack: () => void;
  formatCurrency: (value: number) => string;
}

export default function SupplierSummaryCard({
  supplier,
  ledger,
  totalTransactions,
  selectedDate,
  onDateChange,
  onBack,
  formatCurrency,
}: SupplierSummaryCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Header Section */}
      <div className="flex items-start justify-between gap-4 p-6 pb-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {supplier.name}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="text-gray-500 dark:text-gray-400">
                Supplier:
              </span>
              <span className="font-semibold text-gray-900 dark:text-white truncate">
                {supplier.supplier_code}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="text-gray-500 dark:text-gray-400">Account:</span>
              <span className="font-semibold text-gray-900 dark:text-white truncate">
                {ledger.account_code}
              </span>
            </div>
            {supplier.contact_person && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="font-medium text-gray-700 dark:text-gray-300 truncate">
                  {supplier.contact_person}
                </span>
              </div>
            )}
            {supplier.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="font-medium text-gray-700 dark:text-gray-300 truncate">
                  {supplier.phone}
                </span>
              </div>
            )}
            {supplier.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="font-medium text-gray-700 dark:text-gray-300 truncate">
                  {supplier.email}
                </span>
              </div>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Date Filter Section */}
      <div className="flex items-center justify-between px-6 py-4 border-y border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white dark:bg-gray-900 p-2 border border-gray-200 dark:border-gray-700">
            <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Statement as of
          </span>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium shadow-sm hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-500"
        />
      </div>

      {/* Balance Summary Cards */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Opening Balance */}
        <div className="rounded-xl bg-gray-50 p-5 border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
            Opening Balance
          </p>
          <p
            className={`text-2xl font-bold ${
              ledger.opening_balance >= 0
                ? "text-gray-900 dark:text-white"
                : "text-gray-900 dark:text-white"
            }`}
          >
            {formatCurrency(Math.abs(ledger.opening_balance))}
          </p>
          {ledger.opening_balance !== 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              {ledger.opening_balance < 0 ? (
                <>
                  <TrendingUp className="h-3.5 w-3.5 text-orange-500" />
                  <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                    Payable
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3.5 w-3.5 text-green-500" />
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                    Advance
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Current Balance - Highlighted */}
        <div className="rounded-xl bg-linear-to-br from-orange-50 to-amber-50 p-5 border-2 border-orange-200 dark:from-orange-950/50 dark:to-amber-950/50 dark:border-orange-800">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium uppercase tracking-wide text-orange-700 dark:text-orange-300">
              Current Balance
            </p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 font-semibold">
              Primary
            </span>
          </div>
          <p
            className={`text-2xl font-bold ${
              ledger.closing_balance < 0
                ? "text-orange-600 dark:text-orange-400"
                : "text-green-600 dark:text-green-400"
            }`}
          >
            {formatCurrency(Math.abs(ledger.closing_balance))}
          </p>
          {ledger.closing_balance !== 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              {ledger.closing_balance < 0 ? (
                <>
                  <TrendingUp className="h-3.5 w-3.5 text-orange-500" />
                  <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                    Payable
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3.5 w-3.5 text-green-500" />
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                    Advance
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Total Transactions */}
        <div className="rounded-xl bg-gray-50 p-5 border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
            Total Transactions
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalTransactions.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Up to selected date
          </p>
        </div>
      </div>
    </div>
  );
}
