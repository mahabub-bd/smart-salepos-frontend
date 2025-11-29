import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Checkbox from "../../../components/form/input/Checkbox";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import { Modal } from "../../../components/ui/modal";
import {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
} from "../../../features/customer/customerApi";
import { Customer } from "../../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export default function CustomerFormModal({
  isOpen,
  onClose,
  customer,
}: Props) {
  const [createCustomer, { isLoading: isCreating }] =
    useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] =
    useUpdateCustomerMutation();

  const isEdit = !!customer;
  const isLoading = isCreating || isUpdating;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: true,
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isEdit && customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address || "",
        status: customer.status,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        status: true,
      });
    }
  }, [isEdit, customer, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && customer) {
        await updateCustomer({ id: customer.id, body: formData }).unwrap();
        toast.success("Customer updated successfully!");
      } else {
        await createCustomer(formData).unwrap();
        toast.success("Customer created successfully!");
      }
      onClose();
    } catch (err: any) {
      console.error("Error submitting customer:", err);
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl p-6">
      <h2 className="text-lg font-semibold mb-4">
        {isEdit ? "Update Customer" : "Create New Customer"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Customer Name */}
        <div>
          <Label className="text-sm font-medium mb-1 block">
            Customer Name <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            required
          />
        </div>

        {/* Email & Phone - Side by Side */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium mb-1 block">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="email@example.com"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-1 block">
              Phone <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="01700000000"
              required
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <Label className="text-sm font-medium mb-1 block">Address</Label>
          <textarea
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            placeholder="Dhaka, Bangladesh"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        {/* Status Toggle */}
        <div className="flex items-center gap-2">
          <Checkbox
            label="Active"
            checked={formData.status}
            onChange={(checked) =>
              setFormData({ ...formData, status: checked })
            }
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Customer"
              : "Create Customer"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
