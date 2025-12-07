import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod"; // 🔹 FIXED import

import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Switch from "../../../components/form/switch/Switch";
import { Modal } from "../../../components/ui/modal";

import Button from "../../../components/ui/button/Button";
import {
  useCreateWarehouseMutation,
  useUpdateWarehouseMutation,
} from "../../../features/warehouse/warehouseApi";
import { Warehouse } from "../../../types";

const warehouseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().optional(),
  address: z
    .string()
    .max(200, "Address cannot exceed 200 characters")
    .optional(),
  status: z.boolean().default(true).optional(),
});

export type WarehouseFormValues = z.infer<typeof warehouseSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  warehouse: Warehouse | null;
}

export default function WarehouseFormModal({
  isOpen,
  onClose,
  warehouse,
}: Props) {
  const isEdit = !!warehouse;

  const [createWarehouse] = useCreateWarehouseMutation();
  const [updateWarehouse] = useUpdateWarehouseMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: "",
      location: "",
      address: "",
      status: true,
    },
  });

  const statusValue = watch("status");
  useEffect(() => {
    if (isEdit && warehouse) {
      reset({
        name: warehouse.name,
        location: warehouse.location || "",
        address: warehouse.address || "",
        status: warehouse.status ?? true,
      });
    } else {
      reset({ name: "", location: "", address: "", status: true });
    }
  }, [warehouse, isEdit, reset]);

  const onSubmit = async (data: WarehouseFormValues) => {
    try {
      if (isEdit && warehouse) {
        await updateWarehouse({ id: warehouse.id, body: data }).unwrap();
        toast.success("Warehouse updated");
      } else {
        await createWarehouse(data).unwrap();
        toast.success("Warehouse created");
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-lg p-6"
      title={isEdit ? "Update Warehouse" : "Create New Warehouse"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <Label>Name</Label>
          <Input {...register("name")} />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label>Location</Label>
          <Input {...register("location")} />
        </div>

        <div>
          <Label>Address</Label>
          <Input {...register("address")} />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Label>Status</Label>
          <Switch
            label="Active"
            defaultChecked={statusValue}
            onChange={(checked) =>
              setValue("status", checked, { shouldValidate: true })
            }
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="button"
            className="px-4 py-2 border rounded"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
