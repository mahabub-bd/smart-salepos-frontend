import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import Input from "../../../../components/form/input/InputField";
import { Modal } from "../../../../components/ui/modal";
import { useAddBankBalanceMutation } from "../../../../features/accounts/accountsApi";
import AccountInfo from "./AccountInfo";

const addBankBalanceSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  narration: z.string().optional(),
});

type AddBalanceFormValues = z.infer<typeof addBankBalanceSchema>;

interface AddBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: any; // contains code, name, balance
}

export default function AddBalanceModal({
  isOpen,
  onClose,
  account,
}: AddBalanceModalProps) {
  const [addBankBalance, { isLoading }] = useAddBankBalanceMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddBalanceFormValues>({
    resolver: zodResolver(addBankBalanceSchema),
    defaultValues: { amount: 0, narration: "" },
  });

  const onSubmit = async (values: AddBalanceFormValues) => {
    try {
      await addBankBalance({
        bankAccountCode: account.code,
        amount: values.amount,
        narration: values.narration || "",
      }).unwrap();

      toast.success(`Balance added to ${account.name}`);
      reset();
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add balance");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-lg p-6 min-h-[300px] max-h-screen overflow-y-auto"
    >
      <h2 className="text-lg font-semibold mb-3">Add Balance</h2>

      <AccountInfo account={account} />

      <form onSubmit={handleSubmit(onSubmit)}>
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
          className="mt-3"
          {...register("narration")}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 bg-green-600 text-white rounded ${
              isLoading && "opacity-50"
            }`}
          >
            {isLoading ? "Saving..." : "Add Balance"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
