import { useEffect, useState } from "react";

// API hooks
import {
  useCreateUserMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../../features/user/userApi";

import { useGetRolesQuery } from "../../../features/role/roleApi";

// Types
import { User } from "../../../types/auth.ts/auth";
import { Role } from "../../../types/role";

// UI
import { toast } from "react-toastify";
import Input from "../../../components/form/input/InputField";

import Select from "../../../components/form/Select";
import { Modal } from "../../../components/ui/modal";

// Props interface
interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null; // null = create mode
}

// Form values interface
interface FormState {
  username: string;
  email: string;
  full_name: string;
  phone: string;
  password: string;
  roles: string[];
  status: string;
}

export default function UserFormModal({
  isOpen,
  onClose,
  user,
}: UserFormModalProps) {
  const isEdit = !!user;

  const [form, setForm] = useState<FormState>({
    username: "",
    email: "",
    full_name: "",
    phone: "",
    password: "",
    roles: [],
    status: "active",
  });

  // Create & Update API
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();

  // Fetch user (edit mode)
  const { data: singleUserRes, isLoading: isUserLoading } = useGetUserByIdQuery(
    user?.id!,
    { skip: !isEdit }
  );
  const singleUser = singleUserRes?.data;

  // Fetch roles for multiselect
  const { data: rolesData } = useGetRolesQuery();
  const roles: Role[] = rolesData?.data || [];

  // Load form values when editing
  useEffect(() => {
    if (isEdit && singleUser) {
      setForm({
        username: singleUser.username,
        email: singleUser.email,
        full_name: singleUser.full_name,
        phone: singleUser.phone,
        password: "",
        roles: singleUser.roles?.map((r: Role) => r.name) || [],
        status: singleUser.status,
      });
    }

    if (!isEdit) {
      setForm({
        username: "",
        email: "",
        full_name: "",
        phone: "",
        password: "",
        roles: [],
        status: "active",
      });
    }
  }, [singleUser, isEdit]);

  // Input handler
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Toggle roles
  function toggleRole(roleName: string) {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(roleName)
        ? prev.roles.filter((r) => r !== roleName)
        : [...prev.roles, roleName],
    }));
  }

  // Submit handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (isEdit && user) {
        await updateUser({ id: user.id, body: form }).unwrap();
        toast.success("User updated successfully!");
      } else {
        await createUser(form).unwrap();
        toast.success("User created successfully!");
      }

      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  }

  // Loading UI for edit mode
  if (isEdit && isUserLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg p-6">
        <p className="text-gray-500 dark:text-gray-300">
          Loading user details...
        </p>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg p-6">
      <h2 className="text-lg font-semibold mb-5">
        {isEdit ? "Update User" : "Create New User"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
        />

        <Input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email Address"
        />

        <Input
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          placeholder="Full Name"
        />

        <Input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
        />

        {!isEdit && (
          <Input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
          />
        )}

        {/* ⭐ STATUS SELECT (Custom Component) */}
        <div>
          <label className="text-sm font-medium mb-1 block">User Status</label>

          <Select
            options={[
              { value: "pending", label: "Pending" },
              { value: "active", label: "Active" },
              { value: "suspend", label: "Suspend" },
              { value: "deactive", label: "Deactive" },
            ]}
            defaultValue={form.status}
            placeholder="Select User Status"
            onChange={(value) => setForm({ ...form, status: value })}
          />
        </div>

        {/* Roles Multi-select */}
        <div>
          <label className="text-sm font-medium mb-1 block">Assign Roles</label>

          <div className="flex flex-wrap gap-2">
            {roles.map((r: Role) => (
              <label
                key={r.id}
                className={`cursor-pointer px-3 py-1 capitalize rounded-lg border 
                ${
                  form.roles.includes(r.name)
                    ? "bg-brand-600 text-white border-brand-600"
                    : "border-gray-300 dark:border-gray-700"
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={form.roles.includes(r.name)}
                  onChange={() => toggleRole(r.name)}
                />
                {r.name}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg"
        >
          {isEdit ? "Update User" : "Create User"}
        </button>
      </form>
    </Modal>
  );
}
