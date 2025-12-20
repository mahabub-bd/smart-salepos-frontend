import { z } from "zod";

export const createVariationTemplateSchema = z.object({
  name: z.string()
    .min(1, "Template name is required")
    .max(100, "Template name must be less than 100 characters"),
  description: z.string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  values: z.array(z.string())
    .min(1, "At least one variation value is required")
    .refine((values) => values.every((value) => value.trim().length > 0), {
      message: "All variation values must be non-empty",
    }),
  sort_order: z.number()
    .int("Sort order must be an integer")
    .min(0, "Sort order must be 0 or greater"),
});

export type CreateVariationTemplateFormData = z.infer<typeof createVariationTemplateSchema>;

export const updateVariationTemplateSchema = createVariationTemplateSchema.extend({
  id: z.number(),
});

export type UpdateVariationTemplateFormData = z.infer<typeof updateVariationTemplateSchema>;