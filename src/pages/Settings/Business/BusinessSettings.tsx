import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "react-toastify";
import Loading from "../../../components/common/Loading";
import Button from "../../../components/ui/button/Button";

import FileInput from "../../../components/form/input/FileInput";

import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useUploadSettingsLogoMutation,
} from "../../../features/settings/settingsApi";

// Zod schema for validation
const businessSettingsSchema = z.object({
  business_name: z.string().optional(),
  tagline: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  website: z.string().url().optional().or(z.literal("")),
  currency: z.string().min(1, "Currency is required"),
  currency_symbol: z.string().min(1, "Currency symbol is required"),
  tax_registration: z.string().optional(),
  company_registration: z.string().optional(),
  default_tax_percentage: z.number().min(0).max(100).optional(),
  low_stock_threshold: z.number().min(0).optional(),
  footer_text: z.string().optional(),
  receipt_header: z.string().optional(),
  include_barcode: z.boolean().optional(),
  include_customer_details: z.boolean().optional(),
  enable_auto_backup: z.boolean().optional(),
  backup_retention_days: z.number().min(1).max(365).optional(),
  default_invoice_layout: z.enum(["standard", "detailed"]).optional(),
  show_product_images: z.boolean().optional(),
  show_product_skus: z.boolean().optional(),
  show_item_tax_details: z.boolean().optional(),
  show_payment_breakdown: z.boolean().optional(),
  invoice_paper_size: z.enum(["A4", "A5", "Thermal"]).optional(),
  print_duplicate_copy: z.boolean().optional(),
  invoice_footer_message: z.string().optional(),
  use_thermal_printer: z.boolean().optional(),
});

type BusinessSettingsFormData = z.infer<typeof businessSettingsSchema>;

const BusinessSettings = () => {
  const { data: settingsData, isLoading: settingsLoading } =
    useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateSettingsMutation();
  const [uploadLogo, { isLoading: isUploadingLogo }] =
    useUploadSettingsLogoMutation();
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue,
  } = useForm<BusinessSettingsFormData>({
    resolver: zodResolver(businessSettingsSchema),
    mode: "onChange",
  });

  const watchedCurrency = watch("currency");

  // Populate form with existing data
  useEffect(() => {
    if (settingsData?.data) {
      const data = settingsData.data;
      reset({
        business_name: data.business_name || "",
        tagline: data.tagline || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        country: data.country || "",
        website: data.website || "",
        currency: data.currency || "",
        currency_symbol: data.currency_symbol || "",
        tax_registration: data.tax_registration || "",
        company_registration: data.company_registration || "",
        default_tax_percentage: parseFloat(data.default_tax_percentage) || 0,
        low_stock_threshold: parseFloat(data.low_stock_threshold) || 0,
        footer_text: data.footer_text || "",
        receipt_header: data.receipt_header || "",
        include_barcode: data.include_barcode || false,
        include_customer_details: data.include_customer_details || false,
        enable_auto_backup: data.enable_auto_backup || false,
        backup_retention_days: data.backup_retention_days || 30,
        default_invoice_layout: (data.default_invoice_layout as "standard" | "detailed") || "standard",
        show_product_images: data.show_product_images || false,
        show_product_skus: data.show_product_skus || true,
        show_item_tax_details: data.show_item_tax_details || false,
        show_payment_breakdown: data.show_payment_breakdown || true,
        invoice_paper_size: (data.invoice_paper_size as "A4" | "A5" | "Thermal") || "A4",
        print_duplicate_copy: data.print_duplicate_copy || false,
        invoice_footer_message: data.invoice_footer_message || "",
        use_thermal_printer: data.use_thermal_printer || false,
      });
      setLogoPreview(data.logo_attachment?.url || null);
    }
  }, [settingsData, reset]);

  // Currency options
  const currencyOptions = [
    { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
  ];

  useEffect(() => {
    if (watchedCurrency) {
      const selectedCurrency = currencyOptions.find(
        (c) => c.code === watchedCurrency
      );
      if (selectedCurrency) {
        setValue("currency_symbol", selectedCurrency.symbol);
      }
    }
  }, [watchedCurrency, setValue]);

  // Handle logo selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Logo size must be less than 5MB");
        return;
      }
      setSelectedLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload logo
  const handleLogoUpload = async () => {
    if (!selectedLogo || !settingsData?.data?.id) return;

    try {
      await uploadLogo({
        id: settingsData.data.id,
        logo: selectedLogo,
      }).unwrap();
      toast.success("Logo uploaded successfully");
      setSelectedLogo(null);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to upload logo");
    }
  };

  // Form submission
  const onSubmit = async (data: BusinessSettingsFormData) => {
    try {
      await updateSettings(data).unwrap();
      toast.success("Business settings updated successfully");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to update settings");
    }
  };

  if (settingsLoading) {
    return <Loading message="Loading Settings" />;
  }

  return (
    <div className="p-6">
      <div className=" mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Business Settings
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Configure your business information and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Logo Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Business Logo
            </h2>
            <div className="flex items-start space-x-6">
              <div className="shrink-0">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Business Logo"
                    className="h-24 w-24 object-contain border-2 border-gray-200 dark:border-gray-700 rounded-lg"
                  />
                ) : (
                  <div className="h-24 w-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Label>Upload Logo</Label>
                <FileInput
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="mb-3"
                />
                {selectedLogo && (
                  <Button
                    size="sm"
                    disabled={isUploadingLogo}
                    onClick={handleLogoUpload}
                    type="button"
                  >
                    {isUploadingLogo ? "Uploading..." : "Upload"}
                  </Button>
                )}
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Business Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="business_name">Business Name</Label>
                <Input
                  {...register("business_name")}
                  id="business_name"
                  type="text"
                  placeholder="Enter business name"
                  error={!!errors.business_name}
                />
                {errors.business_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.business_name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  {...register("tagline")}
                  id="tagline"
                  type="text"
                  placeholder="Enter business tagline"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="contact@business.com"
                  error={!!errors.email}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  {...register("phone")}
                  id="phone"
                  type="tel"
                  placeholder="+1-234-567-8900"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <TextArea
                  placeholder="Enter business address"
                  rows={3}
                  value={watch("address") || ""}
                  onChange={(value) => setValue("address", value)}
                />
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  {...register("country")}
                  id="country"
                  type="text"
                  placeholder="Enter country"
                  error={!!errors.country}
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  {...register("website")}
                  id="website"
                  type="url"
                  placeholder="https://business.com"
                  error={!!errors.website}
                />
                {errors.website && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.website.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="tax_registration">Tax Registration</Label>
                <Input
                  {...register("tax_registration")}
                  id="tax_registration"
                  type="text"
                  placeholder="Tax registration number"
                />
              </div>

              <div>
                <Label htmlFor="company_registration">
                  Company Registration
                </Label>
                <Input
                  {...register("company_registration")}
                  id="company_registration"
                  type="text"
                  placeholder="Company registration number"
                />
              </div>
            </div>
          </div>

          {/* Currency & Tax Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Currency & Tax Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="currency">Currency</Label>
                <select
                  {...register("currency")}
                  id="currency"
                  className="h-10 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                >
                  {currencyOptions.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
                {errors.currency && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.currency.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="currency_symbol">Currency Symbol</Label>
                <Input
                  {...register("currency_symbol")}
                  id="currency_symbol"
                  type="text"
                  placeholder="৳"
                  error={!!errors.currency_symbol}
                />
                {errors.currency_symbol && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.currency_symbol.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="default_tax_percentage">
                  Default Tax Percentage
                </Label>
                <Input
                  {...register("default_tax_percentage", {
                    valueAsNumber: true,
                  })}
                  id="default_tax_percentage"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="0"
                  error={!!errors.default_tax_percentage}
                />
                {errors.default_tax_percentage && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.default_tax_percentage.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
                <Input
                  {...register("low_stock_threshold", { valueAsNumber: true })}
                  id="low_stock_threshold"
                  type="number"
                  min="0"
                  placeholder="20"
                />
              </div>
            </div>
          </div>

          {/* Invoice Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Invoice Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="default_invoice_layout">Invoice Layout</Label>
                <select
                  {...register("default_invoice_layout")}
                  id="default_invoice_layout"
                  className="h-10 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                >
                  <option value="standard">Standard</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>

              <div>
                <Label htmlFor="invoice_paper_size">Paper Size</Label>
                <select
                  {...register("invoice_paper_size")}
                  id="invoice_paper_size"
                  className="h-10 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                >
                  <option value="A4">A4</option>
                  <option value="A5">A5</option>
                  <option value="Thermal">Thermal</option>
                </select>
              </div>

              <div>
                <Label htmlFor="receipt_header">Receipt Header</Label>
                <Input
                  {...register("receipt_header")}
                  id="receipt_header"
                  type="text"
                  placeholder="Original Receipt"
                />
              </div>

              <div>
                <Label htmlFor="invoice_footer_message">Invoice Footer Message</Label>
                <Input
                  {...register("invoice_footer_message")}
                  id="invoice_footer_message"
                  type="text"
                  placeholder="Thank you for your business!"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="footer_text">Footer Text</Label>
                <TextArea
                  placeholder="Additional footer text for receipts"
                  rows={2}
                  value={watch("footer_text") || ""}
                  onChange={(value) => setValue("footer_text", value)}
                />
              </div>

              <div className="md:col-span-2 space-y-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Display Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3">
                    <input
                      {...register("show_product_images")}
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Show Product Images
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      {...register("show_product_skus")}
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Show Product SKUs
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      {...register("show_item_tax_details")}
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Show Item Tax Details
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      {...register("show_payment_breakdown")}
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Show Payment Breakdown
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      {...register("include_barcode")}
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Include Barcode on Receipt
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      {...register("include_customer_details")}
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Include Customer Details
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      {...register("print_duplicate_copy")}
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Print Duplicate Copy
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      {...register("use_thermal_printer")}
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Use Thermal Printer
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Backup Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Backup Settings
            </h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  {...register("enable_auto_backup")}
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Enable Automatic Backup
                </span>
              </label>

              <div>
                <Label htmlFor="backup_retention_days">
                  Backup Retention Days
                </Label>
                <Input
                  {...register("backup_retention_days", {
                    valueAsNumber: true,
                  })}
                  id="backup_retention_days"
                  type="number"
                  min="1"
                  max="365"
                  placeholder="30"
                  error={!!errors.backup_retention_days}
                />
                {errors.backup_retention_days && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.backup_retention_days.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => reset()} type="button">
              Reset
            </Button>
            <Button disabled={!isDirty || isUpdating} type="submit">
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessSettings;
