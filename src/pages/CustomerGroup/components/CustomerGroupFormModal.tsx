import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import InputField from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import { FormField } from "../../../components/form/form-elements/SelectFiled";
import { Modal } from "../../../components/ui/modal";
import Button from "../../../components/ui/button/Button";

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="p-6 max-w-lg"
      title={isEdit ? "Update Customer Group" : "Create Customer Group"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Group Name *">
          <InputField
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
        </FormField>

        <FormField label="Description">
          <TextArea
            value={formData.description}
            onChange={(value) =>
              setFormData({ ...formData, description: value })
            }
            rows={3}
          />
        </FormField>

        <FormField label="Discount (%)">
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
        </FormField>

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
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
