import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Button from "../../../components/ui/button/Button";

import { FormField } from "../../../components/form/form-elements/SelectFiled";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import { Modal } from "../../../components/ui/modal";
import {
  CreateVariationTemplateFormData,
  createVariationTemplateSchema
} from "../../../features/variation-template/schema";
import { useCreateVariationTemplateMutation } from "../../../features/variation-template/variationTemplateApi";

interface CreateVariationTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateVariationTemplateModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateVariationTemplateModalProps) {
  const [currentValue, setCurrentValue] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
  } = useForm<CreateVariationTemplateFormData>({
    resolver: zodResolver(createVariationTemplateSchema),
    defaultValues: {
      name: "",
      description: "",
      values: [],
      sort_order: 0,
    },
  });

  const [createVariationTemplate, { isLoading }] =
    useCreateVariationTemplateMutation();

  const onSubmit = async (data: CreateVariationTemplateFormData) => {
    try {
      const templateData = {
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        values: data.values
          .map((value) => value.trim())
          .filter((value) => value.length > 0),
        sort_order: data.sort_order || 0,
      };

      await createVariationTemplate(templateData).unwrap();
      toast.success("Variation template created successfully");
      onSuccess();
      handleClose();
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to create variation template");
    }
  };

  const handleClose = () => {
    reset();
    setCurrentValue("");
    onClose();
  };

  const addValue = () => {
    if (currentValue.trim()) {
      const currentValues = getValues("values") || [];
      setValue("values", [...currentValues, currentValue.trim()]);
      setCurrentValue("");
    }
  };

  const removeValue = (index: number) => {
    const currentValues = getValues("values") || [];
    setValue("values", currentValues.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentValue.trim()) {
      e.preventDefault();
      addValue();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Variation Template"
      description="Add a new variation template with multiple values"
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Template Name */}
        <FormField label="Template Name" error={errors.name?.message}>
          <Input
            type="text"
            {...register("name")}
            placeholder="e.g., Color, Size, Material"
          />
        </FormField>

        {/* Description */}
        <FormField label="Description (Optional)">
          <input type="hidden" {...register("description")} />
          <TextArea
            value={watch("description") || ""}
            onChange={(value) => setValue("description", value)}
            placeholder="Brief description of this variation template"
            rows={3}
            error={!!errors.description}
          />
        </FormField>

        {/* Sort Order */}
        <FormField label="Sort Order" error={errors.sort_order?.message}>
          <Input
            type="number"
            {...register("sort_order", { valueAsNumber: true })}
            placeholder="Enter sort order (0-999)"
            min="0"
            max="999"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Templates will be displayed in ascending order based on this value
          </p>
        </FormField>

        {/* Variation Values */}
        <FormField label="Variation Values" error={errors.values?.message}>
          <div className="space-y-3">
            {/* Hidden input to register the values field */}
            <input type="hidden" {...register("values")} />

            {/* Add new value */}
            <div className="flex gap-2">
              <Input
                type="text"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter variation value (e.g., Red, Medium, Cotton)"
                className="w-full"
              />
              <Button
                type="button"
                size="sm"
                onClick={addValue}
                disabled={!currentValue.trim()}
                startIcon={<Plus size={16} />}
                variant="primary"
              >
                Add
              </Button>
            </div>

            {/* Display added values */}
            {watch("values") && watch("values")!.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {watch("values")?.map((value, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {value}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeValue(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FormField>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            onClick={handleClose}
            variant="outline"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} variant="primary">
            {isLoading ? "Creating..." : "Create Template"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
