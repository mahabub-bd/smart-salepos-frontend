import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FormField } from "../../../components/form/form-elements/SelectFiled";
import Checkbox from "../../../components/form/input/Checkbox";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import {
  useCreateExpenseCategoryMutation,
  useUpdateExpenseCategoryMutation,
} from "../../../features/expense-category/expenseCategoryApi";
import { ExpenseCategory } from "../../../types/expenses";

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl p-6"
      title={isEdit ? "Update Expense Category" : "Create New Expense Category"}
    >
  

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Category Name */}
        <FormField label="Category Name">
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Office Supplies"
            required
          />
        </FormField>

        {/* Description */}
        <FormField label="Description">
          <TextArea
            value={formData.description}
            onChange={(value) =>
              setFormData({ ...formData, description: value })
            }
            placeholder="Expenses related to office items"
            rows={3}
          />
        </FormField>

        {/* Status Toggle */}
        <div className="flex items-center gap-2">
          <Checkbox
            label="Active"
            checked={formData.is_active}
            onChange={(checked) =>
              setFormData({ ...formData, is_active: checked })
            }
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3 justify-end mt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {isEdit ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
