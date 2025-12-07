import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

// API Hooks
import {
  useCreateRoleMutation,
  useUpdateRoleMutation,
} from "../../../features/role/roleApi";

// Types
import { Role } from "../../../types/role";

// UI
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import { Modal } from "../../../components/ui/modal";

// Props
interface Props {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
}

// Validation Schema
const RoleSchema = z.object({
  name: z.string().min(3, "Role name must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
});

type RoleFormState = z.infer<typeof RoleSchema>;

export default function RoleFormModal({ isOpen, onClose, role }: Props) {
  const isEdit = !!role;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleFormState>({
    resolver: zodResolver(RoleSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();

  // Load values when editing
  useEffect(() => {
    if (isEdit && role) {
      reset({
        name: role.name,
        description: role.description,
      });
    } else {
      reset({
        name: "",
        description: "",
      });
    }
  }, [isEdit, role, reset]);

  // Submit Handler
  const onSubmit = async (data: RoleFormState) => {
    try {
      if (isEdit && role) {
        await updateRole({ id: role.id, body: data }).unwrap();
        toast.success("Role updated successfully!");
      } else {
        await createRole(data).unwrap();
        toast.success("Role created successfully!");
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-lg p-6"
      title={isEdit ? "Update Role" : "Create New Role"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div>
          <Label className="text-sm font-medium mb-1 block">Role Name</Label>
          <Input
            {...register("name")}
            placeholder="Enter role name"
            error={!!errors.name}
            hint={errors.name?.message}
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-1 block">Description</Label>
          <Input
            {...register("description")}
            placeholder="Enter description"
            error={!!errors.description}
            hint={errors.description?.message}
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
