import Select from "../../../../components/form/Select";
import Input from "../../../../components/form/input/InputField";
import { Modal } from "../../../../components/ui/modal";
import {
  useFundTransferMutation,
  useGetAccountsQuery,
} from "../../../../features/accounts/accountsApi";

interface FundTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromAccount: any;
}

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { fundTransferSchema } from "./formSchema";

export default function FundTransferModal({
  isOpen,
  onClose,
  fromAccount,
}: FundTransferModalProps) {
  const { data } = useGetAccountsQuery(undefined);
  const accounts = data?.data || [];
  const [fundTransfer, { isLoading }] = useFundTransferMutation();

  const filteredAccounts = accounts.filter(
    (acc: any) => acc.code !== fromAccount.code && (acc.isBank || acc.isCash)
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(fundTransferSchema),
    defaultValues: {
      toAccountCode: "",
      amount: 0,
      narration: "",
    },
  });

  const onSubmit = async (values: any) => {
    // 🔐 Prevent insufficient balance
    if (values.amount > fromAccount.balance) {
      toast.error("Insufficient balance for transfer");
      return;
    }

    try {
      await fundTransfer({
        fromAccountCode: fromAccount.code,
        toAccountCode: values.toAccountCode,
        amount: Number(values.amount),
        narration: values.narration || "",
      }).unwrap();

      toast.success("Fund transfer successful!");
      reset();
      onClose();
    } catch (err) {
      toast.error((err as any)?.data?.message || "Failed to transfer");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-lg p-6 min-h-[400px] max-h-screen overflow-y-auto"
    >
      <h2 className="text-lg font-semibold mb-3">Fund Transfer</h2>

      <p className="text-sm mb-3">
        <strong>From:</strong> {fromAccount.name} ({fromAccount.code}) <br />
        <strong>Balance:</strong> {fromAccount.balance.toLocaleString()}
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="toAccountCode"
          control={control}
          render={({ field }) => (
            <Select
              options={filteredAccounts.map(
                (acc: { code: any; name: any }) => ({
                  value: acc.code,
                  label: `${acc.name} (${acc.code})`,
                })
              )}
              placeholder="Select Account"
              defaultValue=""
              onChange={field.onChange}
            />
          )}
        />
        <p className="text-red-500 text-xs mt-1">
          {errors.toAccountCode?.message}
        </p>

        <Input
          type="number"
          placeholder="Amount"
          {...register("amount", { valueAsNumber: true })}
          error={!!errors.amount}
          hint={errors.amount?.message}
          className="mt-3"
        />

        <Input
          type="text"
          placeholder="Narration (Optional)"
          {...register("narration")}
          className="mt-3"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 rounded text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 bg-purple-600 rounded text-white ${isLoading && "opacity-50"
              }`}
          >
            {isLoading ? "Processing..." : "Transfer"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
