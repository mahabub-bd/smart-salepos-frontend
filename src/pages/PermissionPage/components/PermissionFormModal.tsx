import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import Input from "../../../components/form/input/InputField";
import { Modal } from "../../../components/ui/modal";
import {
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
} from "../../../features/permissions/permissionsApi";
import { Permission } from "../../../types/role";

// Props Interface
interface PermissionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  permission: Permission | null;
}

// 🛡 Validation Schema
const PermissionSchema = z.object({
  key: z.string().min(3, "Permission key must be at least 3 characters"),
  description: z.string().min(3, "Description is required"),
});

type PermissionFormState = z.infer<typeof PermissionSchema>;

export default function PermissionFormModal({
  isOpen,
  onClose,
  permission,
}: PermissionFormModalProps) {
  const isEdit = !!permission;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PermissionFormState>({
    resolver: zodResolver(PermissionSchema),
    defaultValues: {
      key: "",
      description: "",
    },
  });

  const [createPermission] = useCreatePermissionMutation();
  const [updatePermission] = useUpdatePermissionMutation();

  // Load form values if editing
  useEffect(() => {
    if (isEdit && permission) {
      reset({
        key: permission.key,
        description: permission.description,
      });
    } else {
      reset({
        key: "",
        description: "",
      });
    }
  }, [permission, isEdit, reset]);

  // 🚀 Submit Handler
  const onSubmit = async (data: PermissionFormState) => {
    try {
      if (isEdit && permission) {
        const response = await updatePermission({
          id: permission.id,
          body: data,
        }).unwrap();
        toast.success(response.message || "Permission updated successfully!");
      } else {
        const response = await createPermission(data).unwrap();
        toast.success(response.message || "Permission created successfully!");
      }

      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg p-6">
      <h2 className="text-lg font-semibold mb-5">
        {isEdit ? "Update Permission" : "Create Permission"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Permission Key */}
        <Input
          {...register("key")}
          placeholder="permission.create"
          error={!!errors.key}
          hint={errors.key?.message}
        />

        {/* Description */}
        <Input
          {...register("description")}
          placeholder="Allow creating new permissions"
          error={!!errors.description}
          hint={errors.description?.message}
        />

        {/* Submit Button */}
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
