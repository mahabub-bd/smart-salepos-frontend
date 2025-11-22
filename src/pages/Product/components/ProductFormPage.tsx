import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
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
import { useGetCategoriesQuery } from "../../../features/category/categoryApi";
import {
  useCreateProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../../features/product/productApi";
import { useGetTagsQuery } from "../../../features/tag/tagApi";
import { useGetUnitsQuery } from "../../../features/unit/unitApi";

import Button from "../../../components/ui/button/Button";
import { useGetSuppliersQuery } from "../../../features/suppliers/suppliersApi";
import { ProductRequest } from "../../../types";

// Update your validation schema
const productSchema = z.object({
  name: z.string().min(1, "Product Name is required"),
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional(),
  description: z.string().optional(),

  selling_price: z.coerce
    .number()
    .min(0.01, "Selling price must be greater than 0"),
  purchase_price: z.coerce
    .number()
    .min(0.01, "Purchase price must be greater than 0"),
  discount_price: z.coerce.number().optional(),

  brand_id: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce.number({ error: "Brand is required" }).min(1, "Brand is required")
  ),

  category_id: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce
      .number({ error: "Category is required" })
      .min(1, "Category is required")
  ),

  unit_id: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce.number({ error: "Unit is required" }).min(1, "Unit is required")
  ),

  supplier_id: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.coerce.number().optional()
  ),

  tag_ids: z.array(z.coerce.number()).optional(),
  image_ids: z.array(z.coerce.number()).optional(),

  status: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { data: productData, isLoading: isProductLoading } =
    useGetProductByIdQuery(id!, { skip: !isEditMode });
  const product = productData?.data;

  const { data: brands } = useGetBrandsQuery();
  const { data: categories } = useGetCategoriesQuery();
  const { data: units } = useGetUnitsQuery();
  const { data: tags } = useGetTagsQuery();
  const { data: suppliers } = useGetSuppliersQuery();

  const [createProduct, { isLoading: createLoading }] =
    useCreateProductMutation();
  const [updateProduct, { isLoading: updateLoading }] =
    useUpdateProductMutation();
  const [uploadSingleAttachment] = useUploadSingleAttachmentMutation();
  const [uploadMultipleAttachments] = useUploadMultipleAttachmentsMutation();

  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
    defaultValues: {
      name: "",
      sku: "",
      barcode: "",
      description: "",
      selling_price: 0,
      purchase_price: 0,
      discount_price: undefined,
      brand_id: undefined,
      category_id: undefined,
      unit_id: undefined,
      supplier_id: undefined,
      tag_ids: [],
      image_ids: [],
      status: true,
    },
  });

  // Watch form values
  const categoryId = watch("category_id");


  const [mainCategoryId, setMainCategoryId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (isEditMode && product && categories?.data) {
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
        supplier_id: product.supplier?.id ? Number(product.supplier.id) : undefined,

        tag_ids: product.tags?.map((t) => Number(t.id)) || [],
        image_ids: product.images?.map((img) => Number(img.id)) || [],
        status: product.status,
      });

      // Set main category ID
      if (product.category) {
        if (product.category.parent_category_id) {
          // It's a subcategory, so parent_category_id is the main category
          setMainCategoryId(Number(product.category.parent_category_id));
        } else {
          // It's a main category
          setMainCategoryId(Number(product.category.id));
        }
      }
    }
  }, [isEditMode, product, categories?.data, reset]);

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
            <FormField label="Selling Price" error={errors.selling_price?.message}>
              <Input type="number" {...register("selling_price")} />
            </FormField>
            <FormField label="Purchase Price" error={errors.purchase_price?.message}>
              <Input type="number" {...register("purchase_price")} />
            </FormField>
            <FormField label="Discount Price" error={errors.discount_price?.message}>
              <Input type="number" {...register("discount_price")} />
            </FormField>
          </div>

          {/* Selects */}
          <div className="grid grid-cols-5 gap-4">
            <SelectField
              label="Main Category"
              data={categories?.data
                ?.filter((cat) => !cat.parent_category_id)
                .map((cat) => ({
                  id: typeof cat.id === "string" ? Number(cat.id) : cat.id,
                  name: cat.name,
                }))}
              value={product?.category?.parent_category_id?.toString()}
              onChange={(val) => {
                const id = Number(val);
                setMainCategoryId(id);
                const hasSub = categories?.data?.some(
                  (c) => c.parent_category_id == id
                );
                if (!hasSub) {
                  // Main category has no subcategories, set it as the category_id
                  setValue("category_id", id, { shouldValidate: true });
                } else {
                  // Main category has subcategories, reset subcategory selection
                  setValue("category_id", 0, { shouldValidate: false });
                }
              }}
            />
            {mainCategoryId &&
              categories?.data?.some(
                (c) => c.parent_category_id == mainCategoryId
              ) && (
                <SelectField
                  label="Sub Category"
                  data={categories?.data
                    ?.filter((cat) => cat.parent_category_id == mainCategoryId)
                    .map((cat) => ({
                      id: typeof cat.id === "string" ? Number(cat.id) : cat.id,
                      name: cat.name,
                    }))}
                  value={categoryId}
                  error={errors.category_id?.message}
                  onChange={(val) =>
                    setValue("category_id", Number(val), { shouldValidate: true })
                  }
                />
              )}



            <SelectField
              label="Brand"
              data={brands?.data?.map((brand) => ({
                id: typeof brand.id === "string" ? Number(brand.id) : brand.id,
                name: brand.name,
              }))}
              value={product?.brand?.id}
              error={errors.brand_id?.message}
              onChange={(val) => setValue("brand_id", Number(val), { shouldValidate: true })}
            />
            <SelectField
              label="Unit"
              data={units?.data?.map((unit) => ({
                id: typeof unit.id === "string" ? Number(unit.id) : unit.id,
                name: unit.name,
              }))}
              value={product?.unit?.id}
              error={errors.unit_id?.message}
              onChange={(val) => setValue("unit_id", Number(val), { shouldValidate: true })}
            />
            <SelectField
              label="Suppliers"
              data={suppliers?.data?.map((supplier) => ({
                id: typeof supplier.id === "string" ? Number(supplier.id) : supplier.id,
                name: supplier.name,
              }))}
              value={product?.supplier?.id}
              error={errors.supplier_id?.message}
              onChange={(val) => setValue("supplier_id", Number(val), { shouldValidate: true })}
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
                  className="object-contain w-48 h-27 rounded-md border"
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
              type="button"
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
              {isEditMode ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}