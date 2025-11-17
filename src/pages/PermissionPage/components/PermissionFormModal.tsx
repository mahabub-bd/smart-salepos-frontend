import { useEffect, useState } from "react";

import { toast } from "react-toastify";
import Input from "../../../components/form/input/InputField";
import { Modal } from "../../../components/ui/modal";
import {
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
} from "../../../features/permissions/permissionsApi";
import { Permission } from "../../../types/role";

// Props for the modal
interface PermissionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  permission: Permission | null;
}

interface FormState {
  key: string;
  description: string;
}

export default function PermissionFormModal({
  isOpen,
  onClose,
  permission,
}: PermissionFormModalProps) {
  const isEdit = !!permission;

  const [form, setForm] = useState<FormState>({
    key: "",
    description: "",
  });

  const [createPermission] = useCreatePermissionMutation();
  const [updatePermission] = useUpdatePermissionMutation();

  // Load form values when editing
  useEffect(() => {
    if (isEdit && permission) {
      setForm({
        key: permission.key,
        description: permission.description,
      });
    } else {
      setForm({ key: "", description: "" });
    }
  }, [isEdit, permission]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (isEdit && permission) {
        const response = await updatePermission({
          id: permission.id,
          body: form,
        }).unwrap();
        toast.success(response.message || "Permission updated successfully!");
      } else {
        const response = await createPermission(form).unwrap();
        toast.success(response.message || "Permission created successfully!");
      }

      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg p-6">
      <h2 className="text-lg font-semibold mb-5">
        {isEdit ? "Update Permission" : "Create Permission"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          name="key"
          value={form.key}
          onChange={handleChange}
          placeholder="permission.create"
        />

        <Input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Allow creating new permissions"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg"
        >
          {isEdit ? "Update" : "Create"}
        </button>
      </form>
    </Modal>
  );
}
