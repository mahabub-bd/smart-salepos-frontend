import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import InputField from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import { Modal } from "../../../components/ui/modal";

import Checkbox from "../../../components/form/input/Checkbox";
import {
  useCreateCustomerGroupMutation,
  useUpdateCustomerGroupMutation,
} from "../../../features/customer-group/customerGroupApi";
import { CustomerGroup } from "../../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  group: CustomerGroup | null;
}

export default function CustomerGroupFormModal({
  isOpen,
  onClose,
  group,
}: Props) {
  const [createGroup, { isLoading: isCreating }] =
    useCreateCustomerGroupMutation();
  const [updateGroup, { isLoading: isUpdating }] =
    useUpdateCustomerGroupMutation();

  const isEdit = !!group;
  const isLoading = isCreating || isUpdating;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discount_percentage: 0,
    is_active: true,
  });

  useEffect(() => {
    if (isEdit && group) {
      setFormData({
        name: group.name,
        description: group.description || "",
        discount_percentage: Number(group.discount_percentage) || 0,
        is_active: group.is_active,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        discount_percentage: 0,
        is_active: true,
      });
    }
  }, [isEdit, group]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && group) {
        await updateGroup({ id: group.id, body: formData }).unwrap();
        toast.success("Customer group updated successfully!");
      } else {
        await createGroup(formData).unwrap();
        toast.success("Customer group created successfully!");
      }
      onClose();
    } catch {
      toast.error("Failed to save group");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-6 max-w-lg">
      <h2 className="text-lg font-semibold mb-4">
        {isEdit ? "Update Customer Group" : "Create Customer Group"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Label>Group Name *</Label>
        <InputField
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <Label>Description</Label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="border rounded-lg p-2"
          rows={3}
        />

        <Label>Discount (%)</Label>
        <InputField
          type="number"
          value={formData.discount_percentage}
          onChange={(e) =>
            setFormData({
              ...formData,
              discount_percentage: Number(e.target.value),
            })
          }
        />

        <div className="flex items-center gap-2">
          <Checkbox
            label="Active"
            checked={formData.is_active}
            onChange={(checked) =>
              setFormData({ ...formData, is_active: checked })
            }
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg"
          >
            {isLoading ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
