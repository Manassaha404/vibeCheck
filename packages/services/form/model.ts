import { z } from "zod"

export const getAllCreatedFormsDto = z.object({
    userId: z.uuid().describe('id of the user'),
})

export const createFormDto = z.object({
    userId: z.uuid().describe('id of the user'),
    title: z.string().min(3).max(255).describe('title of the form'),
    slug: z.string().min(3).max(150).describe('slug of the form'),
    description: z.string().max(1000).optional().describe('description of the form'),
    visibility: z.enum(['public', 'unlisted', 'draft']).default('draft').describe('visibility of the form'),
    allowResponseEdit: z.boolean().describe('allow response edit'),
    responseLimit: z.number().int().positive().optional().describe('response limit'),
    expiresAt: z.string().datetime().optional().describe('expires at'),
    passwordNeeded: z.boolean().describe('password needed'),
    password: z.string().max(255).optional().describe('password'),
}).refine(
    (data) => {
        if (data.passwordNeeded && (!data.password || data.password.trim() === "")) {
            return false;
        }
        return true;
    },
    {
        message: "A password is required when password protection is enabled",
        path: ["password"],
    }
)

export const getFormByIdDto = z.object({
    userId: z.uuid().describe('id of the user'),
    formId: z.string().uuid().describe('id of the form'),
})



export const addFormFieldsDto = z.object({
    formId: z.string().uuid().describe('id of the form'),
    fields: z.array(z.object({
        orderIndex: z.number().int().describe("order index of the field"),
        type: z.enum(['short_text', 'long_text', 'email', 'number', 'single_select', 'multi_select', 'checkbox', 'rating', 'date']).describe('type of the field'),
        label: z.string().max(255).describe('label of the field'),
        placeholder: z.string().max(255).optional().describe('placeholder of the field'),
        required: z.boolean().default(false).describe('is the field required'),
        options: z.any().optional().describe('options for the field'),
        validation: z.any().optional().describe('validation rules for the field'),
    }))
})

export const editFormTitleDescriptionVisibilityDto = z.object({
    formId: z.string().uuid().describe("id of the form"),
    title: z.string().min(3).max(255).optional().describe('title of the form'),
    description: z.string().max(1000).optional().describe('description of the form'),
    visibility: z.enum(['public', 'unlisted', 'draft']).default('public').describe('visibility of the form'),
})


export type getAllCreatedFormsType = z.infer<typeof getAllCreatedFormsDto>
export type createFormType = z.infer<typeof createFormDto>
export type getFormByIdType = z.infer<typeof getFormByIdDto>
export type addFormFieldsType = z.infer<typeof addFormFieldsDto>
export type editFormTitleDescriptionVisibilityType = z.infer<typeof editFormTitleDescriptionVisibilityDto>
