import z from "zod";
import {
  MaterialType,
  ProductionRecipeType,
} from "../../../types/production-recipe";

// Zod schema for recipe items
export const recipeItemSchema = z.object({
  id: z.number().optional(),
  material_product_id: z.number("Material product is required").min(1),
  material_type: z.nativeEnum(MaterialType, {
    message: "Material type is required",
  }),
  required_quantity: z
    .number("Quantity must be greater than 0")
    .min(0.0001, "Quantity must be greater than 0"),
  unit_of_measure: z.string().min(1, "Unit of measure is required"),
  consumption_rate: z.number().min(0).max(1).optional(),
  waste_percentage: z.number().min(0).max(100).optional(),
  unit_cost: z.number().min(0).optional(),
  specifications: z.string().optional(),
  supplier_requirements: z.string().optional(),
  storage_requirements: z.string().optional(),
  quality_notes: z.string().optional(),
  priority: z.number().min(1),
  is_optional: z.boolean(),
  alternative_materials: z.string().optional(),
  notes: z.string().optional(),
});

// Zod schema for form validation
export const productionRecipeSchema = z.object({
  name: z.string().min(1, "Recipe name is required"),
  recipe_code: z.string().min(1, "Recipe code is required"),
  finished_product_id: z.number("Finished product is required").min(1),
  description: z.string().optional(),
  version: z.string().optional(),
  recipe_type: z.nativeEnum(ProductionRecipeType, {
    message: "Recipe type is required",
  }),
  standard_quantity: z
    .number("Standard quantity must be greater than 0")
    .min(0.0001, "Standard quantity must be greater than 0"),
  unit_of_measure: z.string().min(1, "Unit of measure is required"),
  estimated_time_minutes: z.number().min(0).optional(),
  instructions: z.string().optional(),
  quality_requirements: z.string().optional(),
  safety_notes: z.string().optional(),
  yield_percentage: z.number().min(0).max(100).optional(),
  effective_date: z.string().optional(),
  expiry_date: z.string().optional(),
  recipe_items: z
    .array(recipeItemSchema)
    .min(1, "At least one recipe item is required"),
});

export type ProductionRecipeFormData = z.infer<typeof productionRecipeSchema>;
