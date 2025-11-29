import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import Button from "../../../components/ui/button/Button";

import { useGetAccountsQuery } from "../../../features/accounts/accountsApi";
import { useCreatePaymentMutation } from "../../../features/payment/paymentApi";

const paymentSchema = z.object({
  amount: z.number().positive("Amount must be > 0"),
  method: z.enum(["cash", "bank", "bkash"]),
  payment_account_code: z.string({ error: "Payment account required" }),
  note: z.string().optional(),
});

const paymentSchemaWithLimit = (due: number) =>
  paymentSchema.refine((data) => data.amount <= due, {
    message: `Amount cannot exceed ${due}`,
    path: ["amount"],
  });

type PaymentFormValues = z.infer<typeof paymentSchema>;

export default function SalePaymentModal({ isOpen, onClose, sale }: any) {
  const [salePayment, { isLoading }] = useCreatePaymentMutation();
  const dueAmount = Number(sale?.due_amount) || 0;

  const { data: accountsData } = useGetAccountsQuery({
    type: "asset",
    isCash: true,
    isBank: true,
  });
  const accounts = accountsData?.data || [];

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchemaWithLimit(dueAmount)),
    defaultValues: {
      amount: dueAmount, // auto full amount
      method: undefined as any,
      payment_account_code: "",
      note: "",
    },
  });

  const amount = watch("amount");
  const selectedMethod = watch("method");

  // Auto-fill note based on full/partial payment
  useEffect(() => {
    if (!amount) return;
    const isFullPayment = Number(amount) === dueAmount;
    const autoNote = isFullPayment ? "Full payment" : "Partial payment";

    if (
      !watch("note") ||
      ["Full payment", "Partial payment"].includes(watch("note") || "")
    ) {
      setValue("note", autoNote);
    }
  }, [amount, dueAmount, setValue, watch]);

  // Filter accounts based on payment method
  const filteredAccounts = accounts.filter((acc: any) =>
    selectedMethod === "cash" ? acc.isCash : selectedMethod === "bank" ? acc.isBank : false
  );

  // Handle form submit
  const onSubmit = async (values: PaymentFormValues) => {
    try {
      await salePayment({
        type: "customer",
        customer_id: sale.customer_id,
        sale_id: sale.id,
        amount: values.amount,
        method: values.method,
        payment_account_code: values.payment_account_code,
        note: values.note,
      }).unwrap();

      toast.success("Payment successful");
      onClose();
    } catch {
      toast.error("Payment failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box max-w-md p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          Pay Due — Sale #{sale?.invoice_no}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* 💰 Amount */}
          <Input
            type="number"
            placeholder={`Due: ${dueAmount}`}
            error={!!errors.amount}
            hint={errors.amount?.message}
            {...register("amount", { valueAsNumber: true })}
          />

          {/* 💳 Method */}
          <Controller
            name="method"
            control={control}
            render={({ field }) => (
              <Select
                options={[
                  { value: "cash", label: "Cash" },
                  { value: "bank", label: "Bank" },
                  { value: "bkash", label: "Bkash" },
                ]}
                placeholder="Select Method"
                defaultValue={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  setValue("payment_account_code", "");
                }}
              />
            )}
          />

          {/* 🏦 Account */}
          {selectedMethod && (
            <Controller
              name="payment_account_code"
              control={control}
              render={({ field }) => (
                <Select
                  options={filteredAccounts.map((acc: any) => ({
                    value: acc.code,
                    label: `${acc.name} - ${acc.code}${
                      acc.account_number ? ` - ${acc.account_number}` : ""
                    }`,
                  }))}
                  placeholder="Select Account"
                  defaultValue={field.value}
                  onChange={(value) => field.onChange(value)}
                />
              )}
            />
          )}

          {/* 📝 Note */}
          <Input
            type="text"
            placeholder="Note"
            error={!!errors.note}
            hint={errors.note?.message}
            {...register("note")}
          />

          {/* 🔘 Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" disabled={isLoading}>
              {isLoading ? "Processing..." : "Make Payment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
