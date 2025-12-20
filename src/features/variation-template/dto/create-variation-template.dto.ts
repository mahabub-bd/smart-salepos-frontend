export interface CreateVariationTemplateDto {
  name: string;
  description?: string;
  values: string[];
  sort_order?: number;
}

export interface UpdateVariationTemplateDto {
  name?: string;
  description?: string;
  values?: string[];
  is_active?: boolean;
  sort_order?: number;
}

export interface VariationTemplateValueDto {
  value: string;
}

export interface VariationTemplateResponseDto {
  id: number;
  name: string;
  description?: string;
  values: VariationTemplateValueDto[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}