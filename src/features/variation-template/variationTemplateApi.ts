import { ApiResponse } from "../../types";
import { apiSlice } from "../apiSlice";
import {
  CreateVariationTemplateDto,
  UpdateVariationTemplateDto,
} from "./dto/create-variation-template.dto";

// Types for Variation Template
export interface VariationTemplateValue {
  id: number;
  template_id: number;
  value: string;
  created_at: string;
  updated_at: string;
}

// Actual API response type (API returns values as comma-separated string)
export interface VariationTemplate {
  id: number;
  name: string;
  description?: string;
  values: string | VariationTemplateValue[];
  is_active: boolean;
  sort_order?: number;
  created_by_id?: number;
  created_at: string;
  updated_at: string;
}

export interface VariationTemplateFilters {
  search?: string;
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export interface DataTableResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: VariationTemplate[];
}

export interface UpdateVariationTemplatePayload {
  id: string | number;
  body: UpdateVariationTemplateDto;
}

export const variationTemplateApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 GET ALL VARIATION TEMPLATES (with pagination and filtering)
    getVariationTemplates: builder.query<
      ApiResponse<VariationTemplate[]>,
      VariationTemplateFilters
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.search) searchParams.append("search", params.search);
        if (params.isActive !== undefined)
          searchParams.append("isActive", params.isActive.toString());

        return {
          url: `/variation?${searchParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["VariationTemplates"],
    }),

    // 🔹 GET ACTIVE VARIATION TEMPLATES
    getActiveVariationTemplates: builder.query<VariationTemplate[], void>({
      query: () => ({
        url: "/variation/active",
        method: "GET",
      }),
      providesTags: ["VariationTemplates"],
    }),

    // 🔹 GET TEMPLATE VALUES BY NAME
    getTemplateValuesByName: builder.query<string[], string>({
      query: (name) => ({
        url: `/variation-templates/values/${encodeURIComponent(name)}`,
        method: "GET",
      }),
      providesTags: ["VariationTemplates"],
    }),

    // 🔹 GET VARIATION TEMPLATE BY ID
    getVariationTemplateById: builder.query<VariationTemplate, string | number>(
      {
        query: (id) => ({
          url: `/variation/${id}`,
          method: "GET",
        }),
        providesTags: (_result, _error, id) => [
          { type: "VariationTemplates", id },
        ],
      }
    ),

    // 🔹 CREATE VARIATION TEMPLATE
    createVariationTemplate: builder.mutation<
      ApiResponse<VariationTemplate>,
      CreateVariationTemplateDto
    >({
      query: (body) => ({
        url: "/variation",
        method: "POST",
        body,
      }),
      invalidatesTags: ["VariationTemplates"],
    }),

    // 🔹 UPDATE VARIATION TEMPLATE
    updateVariationTemplate: builder.mutation<
      ApiResponse<VariationTemplate>,
      UpdateVariationTemplatePayload
    >({
      query: ({ id, body }) => ({
        url: `/variation/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "VariationTemplates",
        { type: "VariationTemplates", id },
      ],
    }),

    // 🔹 DELETE VARIATION TEMPLATE
    deleteVariationTemplate: builder.mutation<
      ApiResponse<{ message: string }>,
      string | number
    >({
      query: (id) => ({
        url: `/variation/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["VariationTemplates"],
    }),
  }),
});

// 🔥 Export hooks
export const {
  useGetVariationTemplatesQuery,

  useGetActiveVariationTemplatesQuery,
  useGetTemplateValuesByNameQuery,
  useGetVariationTemplateByIdQuery,
  useCreateVariationTemplateMutation,
  useUpdateVariationTemplateMutation,
  useDeleteVariationTemplateMutation,
} = variationTemplateApi;
