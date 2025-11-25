import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import Input from "../../../../components/form/input/InputField";
import { Modal } from "../../../../components/ui/modal";
import { useAddCashMutation } from "../../../../features/accounts/accountsApi";
import AccountInfo from "./AccountInfo";

// Validation Schema
const addCashSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  narration: z.string().optional(),
});

type AddCashFormValues = z.infer<typeof addCashSchema>;

interface AddCashModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: any; // contains code, name, balance
}

export default function AddCashModal({
  isOpen,
  onClose,
  account,
}: AddCashModalProps) {
  const [addCash, { isLoading }] = useAddCashMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddCashFormValues>({
    resolver: zodResolver(addCashSchema),
    defaultValues: { amount: 0, narration: "" },
  });

  const onSubmit = async (values: AddCashFormValues) => {
    try {
      await addCash({ ...values, narration: values.narration || "" }).unwrap();
      toast.success("Cash added successfully!");
      reset();
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add cash");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-lg p-6 min-h-[300px] max-h-screen overflow-y-auto"
    >
      <h2 className="text-xl font-semibold text-center mb-5 flex items-center justify-center gap-2">
        💵 Add Cash
      </h2>
      <AccountInfo account={account} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          type="number"
          placeholder="Enter Amount"
          {...register("amount", { valueAsNumber: true })}
          error={!!errors.amount}
          hint={errors.amount?.message}
        />

        <Input
          type="text"
          placeholder="Narration (Optional)"
          {...register("narration")}
        />

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition ${
              isLoading && "opacity-50 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Processing..." : "Add Cash"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
