import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { useCreatePaymentMutation } from "../../../features/payment/paymentApi";

const paymentSchema = z.object({
  amount: z
    .number({
      error: "Amount is required",
    })
    .positive("Amount must be greater than 0"),
  method: z.enum(["cash", "bank", "bkash"], {
    errorMap: () => ({ message: "Please select a valid payment method" }),
  }),
  note: z.string().optional(),
});
const paymentSchemaWithLimit = (due: number) =>
  paymentSchema.refine((data) => data.amount <= due, {
    message: `Amount cannot exceed due amount (${due})`,
    path: ["amount"],
  });

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  purchase: any;
}

export default function PurchasePaymentModal({
  isOpen,
  onClose,
  purchase,
}: Props) {
  const [purchasePayment, { isLoading }] = useCreatePaymentMutation();

  const dueAmount = Number(purchase?.due_amount) || 0;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchemaWithLimit(dueAmount)),
  });
  const amount = watch("amount");

  useEffect(() => {
    if (!amount) return;

    const isFullPayment = Number(amount) === dueAmount;
    const autoNote = isFullPayment ? "Full payment" : "Partial payment";

    if (
      !watch("note") ||
      watch("note") === "Full payment" ||
      watch("note") === "Partial payment"
    ) {
      setValue("note", autoNote);
    }
  }, [amount, dueAmount, setValue, watch]);
  if (!isOpen) return null;

  const onSubmit = async (values: PaymentFormValues) => {
    const isFullPayment = values.amount === dueAmount;
    const finalNote =
      values.note || (isFullPayment ? "Full payment" : "Partial payment");
    try {
      await purchasePayment({
        type: "supplier",
        supplier_id: purchase.supplier_id,
        purchase_id: purchase.id,
        amount: values.amount,
        method: values.method,
        note: finalNote,
      }).unwrap();

      toast.success("Payment successful");
      onClose();
    } catch {
      toast.error("Payment failed");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box w-full max-w-md p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Make Payment</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* 💰 Amount */}
          <div>
            <Input
              type="number"
              placeholder={`Due: ${dueAmount}`}
              error={!!errors.amount}
              hint={errors.amount?.message}
              {...register("amount", { valueAsNumber: true })}
            />
          </div>

          {/* 💳 Payment Method */}
          <div>
            <select
              {...register("method")}
              className={`form-input h-11 w-full rounded-lg border px-4 ${
                errors.method ? "border-error-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Method</option>
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
              <option value="bkash">Bkash</option>
            </select>
            {errors.method && (
              <p className="text-xs text-error-500 mt-1">
                {errors.method.message}
              </p>
            )}
          </div>

          {/* 📝 Note */}
          <div>
            <Input
              type="text"
              placeholder="Note"
              success={!errors.note}
              error={!!errors.note}
              hint={errors.note?.message}
              {...register("note")}
            />
          </div>

          {/* 🔘 Buttons */}
          <div className="flex justify-end gap-2 mt-2">
            <Button size="sm" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" disabled={isLoading}>
              {isLoading ? "Processing..." : "Pay"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
