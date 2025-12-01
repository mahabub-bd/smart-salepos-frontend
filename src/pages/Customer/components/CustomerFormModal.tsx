import { useEffect } from "react";
import { toast } from "react-toastify";
import Checkbox from "../../../components/form/input/Checkbox";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import { Modal } from "../../../components/ui/modal";
import { useGetCustomerGroupsQuery } from "../../../features/customer-group/customerGroupApi";
import {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
} from "../../../features/customer/customerApi";
import { Customer } from "../../../types";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

// 🔹 Zod Validation Schema
const customerSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(11, "Phone must be at least 11 digits"),
  address: z.string().optional(),
  group_id: z.string().optional(),
  status: z.boolean(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export default function CustomerFormModal({
  isOpen,
  onClose,
  customer,
}: Props) {
  const [createCustomer, { isLoading: isCreating }] =
    useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] =
    useUpdateCustomerMutation();
  const { data: customerGroupsData } = useGetCustomerGroupsQuery({});

  const isEdit = !!customer;
  const isLoading = isCreating || isUpdating;
  const customerGroups = customerGroupsData?.data || [];

  // 🧠 React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      group_id: "",
      status: true,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (isEdit && customer) {
      reset({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address || "",
        group_id: customer.group_id?.toString() || "",
        status: customer.status,
      });
    } else {
      reset();
    }
  }, [isEdit, customer, isOpen, reset]);

  // Submit Handler
  const onSubmit = async (data: CustomerFormData) => {
    try {
      const payload = {
        ...data,
        group_id: data.group_id
          ? Number(data.group_id)
          : undefined,
      };

      if (isEdit && customer) {
        await updateCustomer({ id: customer.id, body: payload }).unwrap();
        toast.success("Customer updated successfully!");
      } else {
        await createCustomer(payload).unwrap();
        toast.success("Customer created successfully!");
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl p-6">
      <h2 className="text-lg font-semibold mb-4">
        {isEdit ? "Update Customer" : "Create New Customer"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Customer Name */}
        <div>
          <Label>
            Customer Name<span className="text-red-500">*</span>
          </Label>
          <Input placeholder="John Doe" {...register("name")} />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>
              Email<span className="text-red-500">*</span>
            </Label>
            <Input
              type="email"
              placeholder="email@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label>
              Phone<span className="text-red-500">*</span>
            </Label>
            <Input placeholder="01700000000" {...register("phone")} />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <Label>Address</Label>
          <textarea
            rows={3}
            {...register("address")}
            placeholder="Dhaka, Bangladesh"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {/* Customer Group */}
        <div>
          <Label>Customer Group</Label>
          <select
            {...register("group_id")}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Select Customer Group (Optional)</option>
            {customerGroups.map((group: any) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <Checkbox
            label="Active"
            checked={!!setValue} // To fix initial checkbox state
            {...register("status")}
            onChange={(checked) => setValue("status", checked)}
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg"
          >
            {isLoading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Customer"
              : "Create Customer"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
