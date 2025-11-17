import { useEffect, useState } from "react";

import {
  useCreateRoleMutation,
  useUpdateRoleMutation,
} from "../../../features/role/roleApi";

import { toast } from "react-toastify";
import Input from "../../../components/form/input/InputField";
import { Modal } from "../../../components/ui/modal";
import { Role } from "../../../types/role";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null; // null means create mode
}

export default function RoleFormModal({ isOpen, onClose, role }: Props) {
  const isEdit = !!role;

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();

  useEffect(() => {
    if (role) {
      setForm({
        name: role.name,
        description: role.description,
      });
    } else {
      setForm({ name: "", description: "" });
    }
  }, [role]);

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (isEdit) {
      await updateRole({ id: role!.id, body: form });
      toast.success("Role Updated Sucessfully");
    } else {
      await createRole(form);
      toast.success("Role Created Sucessfully");
    }

    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg p-6">
      <h2 className="text-lg font-semibold mb-5">
        {isEdit ? "Update Role" : "Create New Role"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="text-sm font-medium mb-1 block">Role Name</label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter role name"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Description</label>
          <Input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter description"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg"
        >
          {isEdit ? "Update Role" : "Create Role"}
        </button>
      </form>
    </Modal>
  );
}
