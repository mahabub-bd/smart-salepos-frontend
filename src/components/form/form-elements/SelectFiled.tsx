import Label from "../Label";
import Select from "../Select";
// FormField helper
export function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
export function SelectField({
  label,
  data,
  value,
  onChange,
  error,
  disabled,
}: {
  label: string;
  data?: { id: number | string; name: string }[];
  value?: number | string;
  error?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <FormField label={label} error={error}>
      <Select
        options={
          data?.map((item) => ({
            value: item.id.toString(),
            label: item.name,
          })) ?? []
        }
        value={value?.toString()}
        onChange={(val) => {
          onChange(val);
        }}
        disabled={disabled}
      />
    </FormField>
  );
}
