import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../../components/common/Loading";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import DatePicker from "../../../components/form/date-picker";
import {
  FormField,
  SelectField,
} from "../../../components/form/form-elements/SelectFiled";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import Button from "../../../components/ui/button";
import {
  useGetComponentProductsQuery,
  useGetProductsQuery,
} from "../../../features/product/productApi";
import {
  useCreateProductionRecipeMutation,
  useGetProductionRecipeByIdQuery,
  useUpdateProductionRecipeMutation,
} from "../../../features/production/productionRecipeApi";
import { useGetUnitsQuery } from "../../../features/unit/unitApi";
import {
  MaterialType,
  materialTypeOptions,
  ProductionRecipeType,
  recipeTypeOptions,
} from "../../../types/production-recipe";
import { ProductionRecipeFormData, productionRecipeSchema } from "./formSchema";

export default function ProductionRecipeFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
    control,
  } = useForm<ProductionRecipeFormData>({
    resolver: zodResolver(productionRecipeSchema),
    defaultValues: {
      name: "",
      recipe_code: "",
      finished_product_id: 1, // Placeholder, will be validated
      description: "",
      version: "1.0",
      recipe_type: ProductionRecipeType.MANUFACTURING,
      standard_quantity: 1,
      unit_of_measure: "units",
      estimated_time_minutes: 0,
      instructions: "",
      quality_requirements: "",
      safety_notes: "",
      yield_percentage: 100,
      effective_date: "",
      expiry_date: "",
      recipe_items: [
        {
          material_product_id: 1, // Placeholder, will be validated
          material_type: MaterialType.COMPONENT,
          required_quantity: 1,
          unit_of_measure: "pcs",
          consumption_rate: 1,
          waste_percentage: 0,
          unit_cost: 0,
          specifications: "",
          supplier_requirements: "",
          storage_requirements: "",
          quality_notes: "",
          priority: 1,
          is_optional: false,
          alternative_materials: "",
          notes: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "recipe_items",
  });

  // API hooks
  const { data: recipeData, isLoading: isLoadingRecipe } =
    useGetProductionRecipeByIdQuery(id as string, { skip: !isEditing });
  const { data: componentProducts } = useGetComponentProductsQuery({
    page: 1,
    limit: 20,
  });

  const { data: finishedGoodProducts } = useGetProductsQuery(
    { product_type: "finished_good" },
    { skip: false }
  );
  const { data: units } = useGetUnitsQuery();
  const unitOptions = units
    ? units.data.map((unit) => ({ id: unit.name, name: unit.name }))
    : [];

  const [createRecipe] = useCreateProductionRecipeMutation();
  const [updateRecipe] = useUpdateProductionRecipeMutation();

  // Load recipe data for editing
  useEffect(() => {
    if (isEditing && recipeData?.data) {
      const recipe = recipeData.data;

      reset({
        name: recipe.name || "",
        recipe_code: recipe.recipe_code || "",
        finished_product_id: recipe.finished_product_id || 0,
        description: recipe.description || "",
        version: recipe.version || "1.0",
        recipe_type: recipe.recipe_type || ProductionRecipeType.MANUFACTURING,
        standard_quantity: recipe.standard_quantity || 1,
        unit_of_measure: recipe.unit_of_measure || "units",
        estimated_time_minutes: recipe.estimated_time_minutes || 0,
        instructions: recipe.instructions || "",
        quality_requirements: recipe.quality_requirements || "",
        safety_notes: recipe.safety_notes || "",
        yield_percentage: recipe.yield_percentage || 100,
        effective_date: recipe.effective_date
          ? new Date(recipe.effective_date).toISOString().split("T")[0]
          : "",
        expiry_date: recipe.expiry_date
          ? new Date(recipe.expiry_date).toISOString().split("T")[0]
          : "",
        recipe_items: recipe.recipe_items?.map((item: any) => ({
          id: item.id,
          material_product_id: item.material_product_id || 0,
          material_type: item.material_type || MaterialType.COMPONENT,
          required_quantity: item.required_quantity || 1,
          unit_of_measure: item.unit_of_measure || "pcs",
          consumption_rate: item.consumption_rate || 1,
          waste_percentage: item.waste_percentage || 0,
          unit_cost: item.unit_cost || 0,
          specifications: item.specifications || "",
          supplier_requirements: item.supplier_requirements || "",
          storage_requirements: item.storage_requirements || "",
          quality_notes: item.quality_notes || "",
          priority: item.priority || 1,
          is_optional: item.is_optional || false,
          alternative_materials: item.alternative_materials || "",
          notes: item.notes || "",
        })) || [
          {
            material_product_id: 1, // Placeholder, will be validated
            material_type: MaterialType.COMPONENT,
            required_quantity: 1,
            unit_of_measure: "pcs",
            consumption_rate: 1,
            waste_percentage: 0,
            unit_cost: 0,
            specifications: "",
            supplier_requirements: "",
            storage_requirements: "",
            quality_notes: "",
            priority: 1,
            is_optional: false,
            alternative_materials: "",
            notes: "",
          },
        ],
      });
    }
  }, [isEditing, recipeData, reset]);

  // Handle form submission
  const onSubmit = async (data: ProductionRecipeFormData) => {
    try {
      // Prepare the payload
      const payload = {
        ...data,
        recipe_items: data.recipe_items.map((item) => ({
          ...item,
          // Only include id for existing items when editing
          ...(isEditing && item.id ? { id: item.id } : {}),
        })),
      };

      if (isEditing && id) {
        await updateRecipe({ id, body: payload }).unwrap();
        toast.success("Production recipe updated successfully");
      } else {
        await createRecipe(payload).unwrap();
        toast.success("Production recipe created successfully");
      }
      navigate("/production/recipes");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to save production recipe");
    }
  };

  // Add new item
  const addItem = () => {
    append({
      material_product_id: 1, // Placeholder, will be validated
      material_type: MaterialType.COMPONENT,
      required_quantity: 1,
      unit_of_measure: "pcs",
      consumption_rate: 1,
      waste_percentage: 0,
      unit_cost: 0,
      specifications: "",
      supplier_requirements: "",
      storage_requirements: "",
      quality_notes: "",
      priority: fields.length + 1,
      is_optional: false,
      alternative_materials: "",
      notes: "",
    });
  };

  // Remove item
  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  // Loading state
  if (isEditing && isLoadingRecipe) {
    return <Loading message="Loading production recipe details..." />;
  }

  return (
    <>
      <PageBreadcrumb
        pageTitle={
          isEditing ? "Edit Production Recipe" : "Create Production Recipe"
        }
      />

      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <FormField label="Recipe Name" error={errors.name?.message}>
                <Input
                  {...register("name")}
                  placeholder="e.g., Samsung Galaxy S24 Manufacturing Recipe"
                />
              </FormField>

              <FormField
                label="Recipe Code"
                error={errors.recipe_code?.message}
              >
                <Input
                  {...register("recipe_code")}
                  placeholder="e.g., RECIPE-SG-S24-001"
                />
              </FormField>

              <SelectField
                label="Finished Product"
                value={watch("finished_product_id")?.toString()}
                onChange={(value) =>
                  setValue("finished_product_id", parseInt(value))
                }
                data={[
                  { id: "", name: "Select Finished Product" },
                  ...(finishedGoodProducts?.data || []).map((p) => ({
                    id: p.id.toString(),
                    name: `${p.name} (${p.sku})`,
                  })),
                ]}
                error={errors.finished_product_id?.message}
              />

              <SelectField
                label="Recipe Type"
                value={watch("recipe_type")}
                onChange={(value) =>
                  setValue("recipe_type", value as ProductionRecipeType)
                }
                data={recipeTypeOptions}
                error={errors.recipe_type?.message}
              />

              <FormField label="Version" error={errors.version?.message}>
                <Input {...register("version")} placeholder="1.0" />
              </FormField>

              <FormField
                label="Standard Quantity"
                error={errors.standard_quantity?.message}
              >
                <Input
                  {...register("standard_quantity", { valueAsNumber: true })}
                  type="number"
                  min="0.0001"
                  step="0.0001"
                  placeholder="1000"
                />
              </FormField>

              <SelectField
                label="Unit of Measure"
                value={watch("unit_of_measure")}
                onChange={(value) => setValue("unit_of_measure", value)}
                data={unitOptions}
                error={errors.unit_of_measure?.message}
              />

              <FormField
                label="Estimated Time (minutes)"
                error={errors.estimated_time_minutes?.message}
              >
                <Input
                  {...register("estimated_time_minutes", {
                    valueAsNumber: true,
                  })}
                  type="number"
                  min="0"
                  placeholder="480"
                />
              </FormField>

              <FormField
                label="Yield Percentage (%)"
                error={errors.yield_percentage?.message}
              >
                <Input
                  {...register("yield_percentage", { valueAsNumber: true })}
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="95.5"
                />
              </FormField>
              <div>
                <DatePicker
                  id="effective_date"
                  label="Effective Date"
                  placeholder="Select effective date"
                  mode="single"
                  disableFuture={false}
                  value={
                    watch("effective_date")
                      ? new Date(watch("effective_date")!)
                      : null
                  }
                  onChange={(date) => {
                    if (date instanceof Date) {
                      setValue(
                        "effective_date",
                        date.toISOString().split("T")[0]
                      );
                    }
                  }}
                  error={!!errors.effective_date}
                  hint={errors.effective_date?.message}
                />
              </div>

              <div>
                <DatePicker
                  id="expiry_date"
                  label="Expiry Date"
                  placeholder="Select expiry date"
                  mode="single"
                  disableFuture={false}
                  value={
                    watch("expiry_date")
                      ? new Date(watch("expiry_date")!)
                      : null
                  }
                  onChange={(date) => {
                    if (date instanceof Date) {
                      setValue("expiry_date", date.toISOString().split("T")[0]);
                    }
                  }}
                  error={!!errors.expiry_date}
                  hint={errors.expiry_date?.message}
                />
              </div>
            </div>

            <div className="mt-3">
              <FormField
                label="Description"
                error={errors.description?.message}
              >
                <TextArea
                  {...register("description")}
                  rows={2}
                  placeholder="Complete manufacturing process for Samsung Galaxy S24"
                />
              </FormField>
            </div>
          </div>

          {/* Instructions & Requirements */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
              Instructions & Requirements
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <FormField
                label="Instructions"
                error={errors.instructions?.message}
              >
                <TextArea
                  {...register("instructions")}
                  rows={3}
                  placeholder="1. Prepare PCB&#10;2. Mount components&#10;3. Test functionality"
                />
              </FormField>

              <FormField
                label="Quality Requirements"
                error={errors.quality_requirements?.message}
              >
                <TextArea
                  {...register("quality_requirements")}
                  rows={3}
                  placeholder="All components must pass QC inspection"
                />
              </FormField>

              <FormField
                label="Safety Notes"
                error={errors.safety_notes?.message}
              >
                <TextArea
                  {...register("safety_notes")}
                  rows={3}
                  placeholder="Use ESD protection when handling components"
                />
              </FormField>
            </div>
          </div>

          {/* Recipe Items */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Recipe Items (Materials)
              </h3>
              <Button
                type="button"
                onClick={addItem}
                variant="primary"
                size="sm"
                className="gap-2"
              >
                <Plus size={16} />
                Add Material
              </Button>
            </div>

            {errors.recipe_items?.message && (
              <p className="text-red-500 text-sm mb-3">
                {errors.recipe_items.message}
              </p>
            )}

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Material {index + 1}
                    </h4>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          {...register(`recipe_items.${index}.is_optional`)}
                          className="rounded border-gray-300"
                        />
                        Optional
                      </label>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeItem(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 p-1 h-auto"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <SelectField
                      label="Material Product"
                      value={watch(
                        `recipe_items.${index}.material_product_id`
                      )?.toString()}
                      onChange={(value) =>
                        setValue(
                          `recipe_items.${index}.material_product_id`,
                          parseInt(value)
                        )
                      }
                      data={[
                        { id: "", name: "Select Material" },
                        ...(componentProducts?.data || []).map((p) => ({
                          id: p.id.toString(),
                          name: `${p.name} (${p.sku})`,
                        })),
                      ]}
                      error={
                        errors.recipe_items?.[index]?.material_product_id
                          ?.message
                      }
                    />

                    <SelectField
                      label="Material Type"
                      value={watch(`recipe_items.${index}.material_type`)}
                      onChange={(value) =>
                        setValue(
                          `recipe_items.${index}.material_type`,
                          value as MaterialType
                        )
                      }
                      data={materialTypeOptions}
                      error={
                        errors.recipe_items?.[index]?.material_type?.message
                      }
                    />

                    <FormField
                      label="Priority"
                      error={errors.recipe_items?.[index]?.priority?.message}
                    >
                      <Input
                        {...register(`recipe_items.${index}.priority`, {
                          valueAsNumber: true,
                        })}
                        type="number"
                        min="1"
                        placeholder="1"
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                    <FormField
                      label="Required Quantity"
                      error={
                        errors.recipe_items?.[index]?.required_quantity?.message
                      }
                    >
                      <Input
                        {...register(
                          `recipe_items.${index}.required_quantity`,
                          {
                            valueAsNumber: true,
                          }
                        )}
                        type="number"
                        min="0.0001"
                        step="0.0001"
                        placeholder="5"
                      />
                    </FormField>

                    <SelectField
                      label="Unit of Measure"
                      value={watch(`recipe_items.${index}.unit_of_measure`)}
                      onChange={(value) =>
                        setValue(`recipe_items.${index}.unit_of_measure`, value)
                      }
                      data={unitOptions}
                      error={
                        errors.recipe_items?.[index]?.unit_of_measure?.message
                      }
                    />

                    <FormField
                      label="Unit Cost"
                      error={errors.recipe_items?.[index]?.unit_cost?.message}
                    >
                      <Input
                        {...register(`recipe_items.${index}.unit_cost`, {
                          valueAsNumber: true,
                        })}
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="15.50"
                      />
                    </FormField>

                    <FormField
                      label="Waste %"
                      error={
                        errors.recipe_items?.[index]?.waste_percentage?.message
                      }
                    >
                      <Input
                        {...register(`recipe_items.${index}.waste_percentage`, {
                          valueAsNumber: true,
                        })}
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="1"
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <FormField
                      label="Consumption Rate (0-1)"
                      error={
                        errors.recipe_items?.[index]?.consumption_rate?.message
                      }
                    >
                      <Input
                        {...register(`recipe_items.${index}.consumption_rate`, {
                          valueAsNumber: true,
                        })}
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        placeholder="2.5"
                      />
                    </FormField>

                    <FormField
                      label="Alternative Materials (comma-separated IDs)"
                      error={
                        errors.recipe_items?.[index]?.alternative_materials
                          ?.message
                      }
                    >
                      <Input
                        {...register(
                          `recipe_items.${index}.alternative_materials`
                        )}
                        placeholder="123,124,125"
                      />
                    </FormField>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <FormField
                        label="Supplier Requirements"
                        error={
                          errors.recipe_items?.[index]?.supplier_requirements
                            ?.message
                        }
                      >
                        <TextArea
                          {...register(
                            `recipe_items.${index}.supplier_requirements`
                          )}
                          rows={2}
                          placeholder="Must source from approved suppliers"
                        />
                      </FormField>

                      <FormField
                        label="Storage Requirements"
                        error={
                          errors.recipe_items?.[index]?.storage_requirements
                            ?.message
                        }
                      >
                        <TextArea
                          {...register(
                            `recipe_items.${index}.storage_requirements`
                          )}
                          rows={2}
                          placeholder="Store in temperature-controlled environment"
                        />
                      </FormField>
                      <FormField
                        label="Specifications"
                        error={
                          errors.recipe_items?.[index]?.specifications?.message
                        }
                      >
                        <TextArea
                          {...register(`recipe_items.${index}.specifications`)}
                          rows={2}
                          placeholder="Grade A electronic components"
                        />
                      </FormField>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        label="Quality Notes"
                        error={
                          errors.recipe_items?.[index]?.quality_notes?.message
                        }
                      >
                        <TextArea
                          {...register(`recipe_items.${index}.quality_notes`)}
                          rows={2}
                          placeholder="Must pass incoming inspection"
                        />
                      </FormField>

                      <FormField
                        label="Notes"
                        error={errors.recipe_items?.[index]?.notes?.message}
                      >
                        <TextArea
                          {...register(`recipe_items.${index}.notes`)}
                          rows={2}
                          placeholder="Handle with care"
                        />
                      </FormField>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              onClick={() => navigate("/production/recipes")}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft size={16} />
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              variant="primary"
              className="gap-2"
            >
              <Save size={16} />
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Recipe"
                : "Create Recipe"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
