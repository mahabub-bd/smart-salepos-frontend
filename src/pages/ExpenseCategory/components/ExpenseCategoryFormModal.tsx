import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import { Modal } from "../../../components/ui/modal";

import { ExpenseCategory } from "../../../types";
import { useCreateExpenseCategoryMutation, useUpdateExpenseCategoryMutation } from "../../../features/expense-category/expenseCategoryApi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  category: ExpenseCategory | null;
}

export default function ExpenseCategoryFormModal({
  isOpen,
  onClose,
  category,
}: Props) {
  const [createExpenseCategory] = useCreateExpenseCategoryMutation();
  const [updateExpenseCategory] = useUpdateExpenseCategoryMutation();

  const isEdit = !!category;

  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
    is_active: category?.is_active ?? true,
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isEdit && category) {
      setFormData({
        name: category.name,
        description: category.description,
        is_active: category.is_active,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        is_active: true,
      });
    }
  }, [isEdit, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
    };

    console.log("Submitting payload:", payload);

    try {
      if (isEdit && category) {
        await updateExpenseCategory({
          id: category.id,
          body: payload,
        }).unwrap();
        toast.success("Expense category updated successfully!");
      } else {
        await createExpenseCategory(payload).unwrap();
        toast.success("Expense category created successfully!");
      }
      onClose();
    } catch (err: any) {
      console.error("Error submitting expense category:", err);
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl p-6">
      <h2 className="text-lg font-semibold mb-4">
        {isEdit ? "Update Expense Category" : "Create New Expense Category"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Category Name */}
        <div>
          <Label className="text-sm font-medium mb-1 block">
            Category Name
          </Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Office Supplies"
            required
          />
        </div>

        {/* Description */}
        <div>
          <Label className="text-sm font-medium mb-1 block">Description</Label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Expenses related to office items"
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        {/* Status Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) =>
              setFormData({ ...formData, is_active: e.target.checked })
            }
            className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          />
          <Label htmlFor="is_active" className="text-sm font-medium">
            Active Category
          </Label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg disabled:opacity-50"
        >
          {isEdit ? "Update Category" : "Create Category"}
        </button>
      </form>
    </Modal>
  );
}
