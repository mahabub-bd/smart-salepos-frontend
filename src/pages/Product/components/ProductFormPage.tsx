import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

import Loading from "../../../components/common/Loading";
import PageHeader from "../../../components/common/PageHeader";
import PageMeta from "../../../components/common/PageMeta";
import {
  FormField,
  SelectField,
} from "../../../components/form/form-elements/SelectFiled";
import FileInput from "../../../components/form/input/FileInput";
import Input from "../../../components/form/input/InputField";
import MultiSelect from "../../../components/form/MultiSelect";

// API hooks
import {
  useUploadMultipleAttachmentsMutation,
  useUploadSingleAttachmentMutation,
} from "../../../features/attachment/attachmentApi";
import { useGetBrandsQuery } from "../../../features/brand/brandApi";
import { useGetCategoryTreeQuery } from "../../../features/category/categoryApi";
import {
  useCreateProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../../features/product/productApi";
import { useGetTagsQuery } from "../../../features/tag/tagApi";
import { useGetUnitsQuery } from "../../../features/unit/unitApi";

import Button from "../../../components/ui/button/Button";
import { ProductRequest } from "../../../types";

// Update your validation schema
const productSchema = z.object({
  name: z.string().min(1, "Product Name is required"),
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional(),
  description: z.string().optional(),
  selling_price: z.number().min(0.01, "Selling price must be greater than 0"), // ✅ Changed
  purchase_price: z.number().min(0.01, "Purchase price must be greater than 0"), // ✅ Changed
  discount_price: z.number().optional(), // ✅ Changed
  brand_id: z.number().min(1, "Brand is required"), // ✅ Changed
  category_id: z.number().min(1, "Category is required"), // ✅ Changed
  unit_id: z.number().min(1, "Unit is required"), // ✅ Changed
  tag_ids: z.array(z.number()).optional(),
  image_ids: z.array(z.number()).optional(),
  status: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // Fetch existing product if editing
  const { data: productData, isLoading: isProductLoading } =
    useGetProductByIdQuery(id!, { skip: !isEditMode });
  const product = productData?.data;

  // Fetch dropdown data
  const { data: brands } = useGetBrandsQuery();
  const { data: categories } = useGetCategoryTreeQuery();
  const { data: units } = useGetUnitsQuery();
  const { data: tags } = useGetTagsQuery();

  // Mutation hooks
  const [createProduct, { isLoading: createLoading }] =
    useCreateProductMutation();
  const [updateProduct, { isLoading: updateLoading }] =
    useUpdateProductMutation();
  const [uploadSingleAttachment] = useUploadSingleAttachmentMutation();
  const [uploadMultipleAttachments] = useUploadMultipleAttachmentsMutation();

  // Image upload handler
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { status: true },
  });

  // Prefill values on edit
  useEffect(() => {
    if (isEditMode && product) {
      reset({
        name: product.name,
        sku: product.sku,
        barcode: product.barcode,
        description: product.description,
        selling_price: Number(product.selling_price),
        purchase_price: Number(product.purchase_price),
        discount_price: product.discount_price
          ? Number(product.discount_price)
          : undefined,
        brand_id: Number(product.brand?.id ?? 0),
        category_id: Number(product.category?.id ?? 0),
        unit_id: Number(product.unit?.id ?? 0),
        tag_ids: product.tags?.map((t) => Number(t.id)) || [],
        image_ids: product.images?.map((img) => Number(img.id)) || [],
        status: product.status,
      });
    }
  }, [isEditMode, product, reset]);

  // Show loading while fetching product
  if (isProductLoading && isEditMode)
    return <Loading message="Loading product..." />;
  // Generate 6-digit random number
  const randomNumber = () => Math.floor(100000 + Math.random() * 900000);

  // SKU Example: PROD-XXXXXX
  const generateSKU = (name?: string) => {
    const prefix = name
      ? name
          .slice(0, 3)
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, "")
      : "PRD";
    return `${prefix}-${randomNumber()}`;
  };

  // Barcode Example: 13-digit EAN (random)
  const generateBarcode = () => {
    return String(Date.now()).slice(-13);
  };
  // Upload only new images
  const handleImageUpload = async () => {
    if (selectedImages.length === 0) return [];

    if (selectedImages.length === 1) {
      const formData = new FormData();
      formData.append("file", selectedImages[0]);
      const res = await uploadSingleAttachment(formData).unwrap();
      return [res.data.id];
    } else {
      const formData = new FormData();
      selectedImages.forEach((file) => formData.append("files", file));
      const res = await uploadMultipleAttachments(formData).unwrap();
      return res.data.map((img: any) => img.id);
    }
  };

  // Submit form
  const onSubmit = async (values: ProductFormValues) => {
    try {
      let image_ids = values.image_ids || [];
      if (selectedImages.length > 0) {
        const uploadedImages = await handleImageUpload();
        image_ids = uploadedImages;
      }

      const payload: ProductRequest = {
        ...values,
        image_ids,
      };

      if (isEditMode && id) {
        await updateProduct({ id, body: payload }).unwrap();
        toast.success("Product updated successfully");
      } else {
        await createProduct(payload).unwrap();
        toast.success("Product created successfully");
      }

      navigate("/products");
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to save product");
    }
  };

  return (
    <div>
      <PageMeta
        title={isEditMode ? "Edit Product" : "Add Product"}
        description={
          isEditMode ? "Edit existing product" : "Create new product"
        }
      />
      <PageHeader title={isEditMode ? "Edit Product" : "Add New Product"} />

      <div className="p-6 bg-white rounded-xl shadow dark:bg-dark-900">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Product Name" error={errors.name?.message}>
              <Input {...register("name")} />
            </FormField>
            <FormField label="Description" error={errors.description?.message}>
              <Input
                {...register("description")}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {/* SKU */}
            <FormField label="SKU" error={errors.sku?.message}>
              <div className="flex items-center gap-2 w-full">
                <Input {...register("sku")} className="flex-1" />
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() =>
                    setValue("sku", generateSKU(getValues("name")))
                  }
                >
                  Generate
                </Button>
              </div>
            </FormField>

            {/* Barcode */}
            <FormField label="Barcode" error={errors.barcode?.message}>
              <div className="flex items-center gap-2 w-full">
                <Input {...register("barcode")} className="flex-1" />
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setValue("barcode", generateBarcode())}
                >
                  Generate
                </Button>
              </div>
            </FormField>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-3 gap-4">
            <FormField label="Selling Price">
              <Input type="number" {...register("selling_price")} />
            </FormField>
            <FormField label="Purchase Price">
              <Input type="number" {...register("purchase_price")} />
            </FormField>
            <FormField label="Discount Price">
              <Input type="number" {...register("discount_price")} />
            </FormField>
          </div>

          {/* Selects */}
          <div className="grid grid-cols-3 gap-4">
            <SelectField
              label="Category"
              data={categories?.data?.map((cat) => ({
                id: typeof cat.id === "string" ? Number(cat.id) : cat.id,
                name: cat.name,
              }))}
              value={product?.category?.id}
              error={errors.category_id?.message}
              onChange={(val) => setValue("category_id", Number(val))}
            />
            <SelectField
              label="Brand"
              data={brands?.data?.map((brand) => ({
                id: typeof brand.id === "string" ? Number(brand.id) : brand.id,
                name: brand.name,
              }))}
              value={product?.brand?.id}
              error={errors.brand_id?.message}
              onChange={(val) => setValue("brand_id", Number(val))}
            />
            <SelectField
              label="Unit"
              data={units?.data}
              value={product?.unit?.id}
              error={errors.unit_id?.message}
              onChange={(val) => setValue("unit_id", Number(val))}
            />
          </div>

          {/* Tags */}
          <MultiSelect
            label="Tags"
            options={
              tags?.data?.map((t) => ({
                value: t.id.toString(),
                text: t.name,
              })) ?? []
            }
            defaultSelected={product?.tags?.map((t) => t.id.toString())}
            onChange={(vals) => setValue("tag_ids", vals.map(Number))}
          />

          {/* Image Upload */}
          <FormField label="Upload Image">
            {isEditMode && product?.images && product.images.length > 0 && (
              <div className="mb-2">
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className=" object-contain w-48 h-27 rounded-md border"
                />
                <p className="text-xs text-gray-500 mt-1">(Current Image)</p>
              </div>
            )}
            <FileInput
              accept="image/*"
              onChange={(e) =>
                setSelectedImages(Array.from(e.target.files || []))
              }
            />
          </FormField>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => navigate("/products")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createLoading || updateLoading}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg disabled:opacity-50"
            >
              {isEditMode ? "Update " : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
