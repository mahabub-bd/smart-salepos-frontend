import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

// API hooks
import { useGetRolesQuery } from "../../../features/role/roleApi";
import {
  useCreateUserMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../../features/user/userApi";

// Types
import { User } from "../../../types/auth.ts/auth";
import { Role } from "../../../types/role";

// UI
import { toast } from "react-toastify";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import { Modal } from "../../../components/ui/modal";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

// Base schema
const BaseUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  full_name: z.string().min(3, "Full name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  roles: z.array(z.string()).min(1, "Select at least one role"),
  status: z.enum(["pending", "active", "suspend", "deactive"]),
});

// Create schema (password required)
const CreateUserSchema = BaseUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Update schema (password optional)
const UpdateUserSchema = BaseUserSchema.extend({
  password: z.string().optional(),
});

type FormState =
  | z.infer<typeof CreateUserSchema>
  | z.infer<typeof UpdateUserSchema>;

export default function UserFormModal({
  isOpen,
  onClose,
  user,
}: UserFormModalProps) {
  const isEdit = !!user;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormState>({
    resolver: zodResolver(isEdit ? UpdateUserSchema : CreateUserSchema),
    defaultValues: {
      username: "",
      email: "",
      full_name: "",
      phone: "",
      password: "",
      roles: [],
      status: "active",
    } as FormState,
  });

  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const { data: singleUserRes, isLoading: isUserLoading } = useGetUserByIdQuery(
    user?.id!,
    { skip: !isEdit }
  );

  const { data: rolesData } = useGetRolesQuery();
  const roles: Role[] = rolesData?.data || [];
  const singleUser = singleUserRes?.data;

  useEffect(() => {
    if (isEdit && singleUser) {
      reset({
        username: singleUser.username,
        email: singleUser.email,
        full_name: singleUser.full_name,
        phone: singleUser.phone,
        password: "",
        roles: singleUser.roles?.map((r: Role) => r.name) || [],
        status: singleUser.status,
      } as FormState);
    } else {
      reset();
    }
  }, [singleUser, isEdit, reset]);

  const onSubmit = async (data: FormState) => {
    try {
      if (isEdit && user) {
        const updatePayload = { ...data };
        delete (updatePayload as any).password; // 👈 remove undefined to satisfy API type

        await updateUser({ id: user.id, body: updatePayload }).unwrap();
        toast.success("User updated successfully!");
      } else {
        const createPayload = {
          ...data,
          password: data.password || "", // 👈 ensure password exists
        };

        await createUser(createPayload).unwrap();
        toast.success("User created successfully!");
      }

      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

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

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Username */}
        <Input
          {...register("username")}
          placeholder="Username"
          error={!!errors.username}
          hint={errors.username?.message}
        />

        {/* Email */}
        <Input
          type="email"
          {...register("email")}
          placeholder="Email Address"
          error={!!errors.email}
          hint={errors.email?.message}
        />

        {/* Full Name */}
        <Input
          {...register("full_name")}
          placeholder="Full Name"
          error={!!errors.full_name}
          hint={errors.full_name?.message}
        />

        {/* Phone */}
        <Input
          {...register("phone")}
          placeholder="Phone Number"
          error={!!errors.phone}
          hint={errors.phone?.message}
        />

        {/* Password (only for create) */}
        {!isEdit && (
          <Input
            type="password"
            {...register("password")}
            placeholder="Password"
            error={!!errors.password}
            hint={errors.password?.message}
          />
        )}

        {/* User Status */}
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              options={[
                { value: "pending", label: "Pending" },
                { value: "active", label: "Active" },
                { value: "suspend", label: "Suspend" },
                { value: "deactive", label: "Deactive" },
              ]}
              defaultValue={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {/* Roles */}
        <Controller
          name="roles"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {roles.map((r: Role) => (
                <label
                  key={r.id}
                  className={`cursor-pointer px-3 py-1 capitalize rounded-lg border ${
                    field.value.includes(r.name)
                      ? "bg-brand-600 text-white border-brand-600"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={field.value.includes(r.name)}
                    onChange={() =>
                      field.onChange(
                        field.value.includes(r.name)
                          ? field.value.filter((role) => role !== r.name)
                          : [...field.value, r.name]
                      )
                    }
                  />
                  {r.name}
                </label>
              ))}
            </div>
          )}
        />
        {errors.roles && (
          <p className="text-red-500 text-sm">{errors.roles.message}</p>
        )}

        {/* Submit button */}
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
