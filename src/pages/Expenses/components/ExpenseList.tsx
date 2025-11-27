import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import IconButton from "../../../components/common/IconButton";
import Loading from "../../../components/common/Loading";
import PageHeader from "../../../components/common/PageHeader";
import Badge from "../../../components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import { formatDate } from "@fullcalendar/core/index.js";
import {
  useDeleteExpenseMutation,
  useGetExpensesQuery,
} from "../../../features/expenses/expensesApi";
import { useHasPermission } from "../../../hooks/useHasPermission";
import { Expense } from "../../../types";
import ExpenseFormModal from "./ExpenseFormModal";

export default function ExpenseList() {
  const { data, isLoading, isError } = useGetExpensesQuery({});
  const [deleteExpense] = useDeleteExpenseMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const canCreate = useHasPermission("expense.create");
  const canUpdate = useHasPermission("expense.update");
  const canDelete = useHasPermission("expense.delete");

  const expenses = data?.data || [];

  const openCreateModal = () => {
    setEditExpense(null);
    setIsModalOpen(true);
  };

  const openEditModal = (expense: Expense) => {
    setEditExpense(expense);
    setIsModalOpen(true);
  };

  const openDeleteDialog = (expense: Expense) => {
    setExpenseToDelete(expense);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!expenseToDelete) return;
    try {
      await deleteExpense(expenseToDelete.id).unwrap();
      toast.success("Expense deleted successfully");
    } catch {
      toast.error("Failed to delete expense");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) return <Loading message="Loading Expenses" />;

  if (isError)
    return <p className="p-6 text-red-500">Failed to fetch expenses.</p>;

  return (
    <>
      <PageHeader
        title="Expenses Management"
        icon={<Plus size={16} />}
        addLabel="Add"
        onAdd={openCreateModal}
        permission="expense.create"
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-[#1e1e1e]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                <TableCell isHeader className="table-header">
                  Title
                </TableCell>
                <TableCell isHeader className="table-header">
                  Description
                </TableCell>
                <TableCell isHeader className="table-header">
                  Category
                </TableCell>
                <TableCell isHeader className="table-header">
                  Amount
                </TableCell>
                <TableCell isHeader className="table-header">
                  Payment Method
                </TableCell>
                <TableCell isHeader className="table-header">
                  Branch
                </TableCell>
                <TableCell isHeader className="table-header">
                  Created By
                </TableCell>
                <TableCell isHeader className="table-header">
                  Date
                </TableCell>
                <TableCell isHeader className="table-header text-right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {expenses.length > 0 ? (
                expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="table-body font-medium">
                      {expense.title}
                    </TableCell>

                    <TableCell className="table-body">
                      {expense.description}
                    </TableCell>

                    <TableCell className="table-body">
                      <Badge size="sm" color="primary">
                        {expense.category.name}
                      </Badge>
                    </TableCell>

                    <TableCell className="table-body font-semibold text-gray-900 dark:text-white">
                      {expense.amount}
                    </TableCell>

                    <TableCell className="table-body">
                      {expense.payment_method ? (
                        <Badge size="sm" color="info">
                          {expense.payment_method}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>

                    <TableCell className="table-body">
                      {expense.branch ? (
                        expense.branch.name
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>

                    <TableCell className="table-body">
                      {expense.created_by.full_name}
                    </TableCell>

                    <TableCell className="table-body">
                      {formatDate(expense.created_at)}
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {canUpdate && (
                          <IconButton
                            icon={Pencil}
                            tooltip="Edit"
                            onClick={() => openEditModal(expense)}
                            color="blue"
                          />
                        )}
                        {canDelete && (
                          <IconButton
                            icon={Trash2}
                            tooltip="Delete"
                            onClick={() => openDeleteDialog(expense)}
                            color="red"
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No expenses found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {(canCreate || canUpdate) && (
        <ExpenseFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          expense={editExpense}
        />
      )}

      {canDelete && (
        <ConfirmDialog
          isOpen={isDeleteModalOpen}
          title="Delete Expense"
          message={`Are you sure you want to delete "${expenseToDelete?.title}"?`}
          confirmLabel="Yes, Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </>
  );
}
