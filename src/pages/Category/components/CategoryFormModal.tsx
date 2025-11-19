import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import Label from "../../../components/form/Label";
import FileInput from "../../../components/form/input/FileInput";
import Input from "../../../components/form/input/InputField";
import Switch from "../../../components/form/switch/Switch";
import { Modal } from "../../../components/ui/modal";

import { useUploadSingleAttachmentMutation } from "../../../features/attachment/attachmentApi";
import {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../../features/category/categoryApi";
import { Category } from "../../../types";



const CategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  parent_category_id: z.string().nullable().optional(),
  status: z.boolean(),
});

type FormValues = z.infer<typeof CategorySchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
}

export default function CategoryFormModal({
  isOpen,
  onClose,
  category,
}: Props) {
  const isEdit = !!category;

  const { data } = useGetCategoriesQuery();
  const categories = data?.data || [];

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [uploadLogo] = useUploadSingleAttachmentMutation();

  const [attachmentId, setAttachmentId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
      description: "",
      parent_category_id: null,
      status: true,
    },
  });

  useEffect(() => {
    if (isEdit && category) {
      reset({
        name: category.name,
        description: category.description || "",
        status: category.status,
        parent_category_id: category.parent_category_id
          ? String(category.parent_category_id)
          : null,
      });

      setAttachmentId(
        category.logo_attachment_id ? String(category.logo_attachment_id) : null
      );
      setImageUrl(category.logo_attachment?.url || null);
    } else {
      reset({
        name: "",
        description: "",
        status: true,
        parent_category_id: null,
      });

      setAttachmentId(null);
      setImageUrl(null);
    }
  }, [category, isEdit, reset]);

  // Upload Logo
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      const res = await uploadLogo(formData).unwrap();

      setAttachmentId(String(res.data.id));
      setImageUrl(res.data.url);
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!attachmentId) {
      toast.error("Please upload category logo first.");
      return;
    }

    const payload = {
      ...data,
      logo_attachment_id: attachmentId,
    };

    try {
      if (isEdit && category) {
        await updateCategory({ id: category.id, body: payload }).unwrap();
        toast.success("Category updated successfully");
      } else {
        await createCategory(payload).unwrap();
        toast.success("Category created successfully");
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl p-6">
      <h2 className="text-lg font-semibold mb-4">
        {isEdit ? "Update Category" : "Create Category"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <Label>Name</Label>
          <Input {...register("name")} />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <Label>Description</Label>
          <Input {...register("description")} />
        </div>

        {/* Parent Category */}
        <div>
          <Label>Parent Category</Label>
          <select
            className="w-full border border-gray-300 rounded-lg p-2 dark:bg-white/10"
            {...register("parent_category_id")}
          >
            <option value="">None</option>

            {categories
              .filter((c: Category) => c.id !== category?.id)
              .map((c: Category) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>

        {/* Logo Upload */}
        <div>
          <Label>Category Logo</Label>
          <FileInput
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />

          {isUploading && (
            <p className="text-blue-500 text-sm mt-1">Uploading...</p>
          )}

          {imageUrl && (
            <div className="aspect-video w-28 mt-2">
              <img
                src={imageUrl}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center gap-3">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Switch
                label="Active"
                defaultChecked={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg"
          disabled={isUploading}
        >
          {isEdit ? "Update Category" : "Create Category"}
        </button>
      </form>
    </Modal>
  );
}
