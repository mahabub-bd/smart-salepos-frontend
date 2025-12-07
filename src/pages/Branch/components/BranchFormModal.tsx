import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Checkbox from "../../../components/form/input/Checkbox";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import { Modal } from "../../../components/ui/modal";

import {
  useCreateBranchMutation,
  useUpdateBranchMutation,
} from "../../../features/branch/branchApi";
import { useGetWarehousesQuery } from "../../../features/warehouse/warehouseApi";

import { Branch } from "../../../types";
import { BranchFormType, branchSchema } from "./branch.schema";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  branch: Branch | null;
}

export default function BranchFormModal({ isOpen, onClose, branch }: Props) {
  const { data: warehousesData, isLoading: isLoadingWarehouses } =
    useGetWarehousesQuery();

  const warehouses = warehousesData?.data || [];
  const isEdit = !!branch;

  const [createBranch] = useCreateBranchMutation();
  const [updateBranch] = useUpdateBranchMutation();

  // React Hook Form Initialization
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BranchFormType>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      code: "",
      name: "",
      address: "",
      phone: "",
      email: "",
      is_active: true,
      default_warehouse_id: "",
    },
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isEdit && branch) {
      reset({
        code: branch.code,
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        email: branch.email,
        is_active: branch.is_active,
        default_warehouse_id: branch.default_warehouse_id?.toString() || "",
      });
    } else {
      reset({
        code: "",
        name: "",
        address: "",
        phone: "",
        email: "",
        is_active: true,
        default_warehouse_id: "",
      });
    }
  }, [isEdit, branch, reset, isOpen]);

  const onSubmit = async (values: BranchFormType) => {
    const payload = {
      ...values,
      default_warehouse_id: values.default_warehouse_id
        ? Number(values.default_warehouse_id)
        : null,
    };

    try {
      if (isEdit && branch) {
        await updateBranch({ id: branch.id, body: payload }).unwrap();
        toast.success("Branch updated successfully!");
      } else {
        await createBranch(payload).unwrap();
        toast.success("Branch created successfully!");
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
      className="max-w-2xl p-6"
      title={isEdit ? "Update Branch" : "Create New Branch"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Branch Code */}
        <div>
          <Label>Branch Code</Label>
          <Controller
            name="code"
            control={control}
            render={({ field }) => <Input {...field} placeholder="BR-001" />}
          />
          {errors.code && (
            <p className="text-red-500 text-sm">{errors.code.message}</p>
          )}
        </div>

        {/* Branch Name */}
        <div>
          <Label>Branch Name</Label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Main Branch" />
            )}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <Label>Address</Label>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="123 Street, City" />
            )}
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}
        </div>

        {/* Phone + Email */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Phone</Label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="+8801712345678" />
              )}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label>Email</Label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  placeholder="branch@example.com"
                />
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Default Warehouse */}
        <div>
          <Label>Default Warehouse (Optional)</Label>
          {isLoadingWarehouses ? (
            <p className="text-sm text-gray-500">Loading warehouses...</p>
          ) : (
            <Controller
              name="default_warehouse_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value?.toString()}
                  onChange={field.onChange}
                  options={[
                    { value: "", label: "Select a warehouse" },
                    ...warehouses.map((w) => ({
                      value: w.id.toString(),
                      label: `${w.name}${w.location ? ` - ${w.location}` : ""}`,
                    })),
                  ]}
                />
              )}
            />
          )}
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-2">
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <Checkbox
                label="Active"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg"
        >
          {isEdit ? "Update Branch" : "Create Branch"}
        </button>
      </form>
    </Modal>
  );
}
