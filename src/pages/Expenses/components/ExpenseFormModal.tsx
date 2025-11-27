import { Expense } from "../../../types";




interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense | null;
}

export default function ExpenseFormModal({
  isOpen,
  onClose,
  expense,
}: ExpenseFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-800">
        <h2 className="text-xl font-semibold">
          {expense ? "Edit Expense" : "Create Expense"}
        </h2>
        {/* Add your form here */}
        <button
          onClick={onClose}
          className="mt-4 rounded bg-gray-500 px-4 py-2 text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}
