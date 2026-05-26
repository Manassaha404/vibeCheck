import { z } from "zod";

export const createFormModel = z.object({
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

export const getFormByIdModel = z.object({
    id: z.string().uuid().describe('id of the form')
})

export const submitFormResponseWithoutGuestTokenDto = z.object({
    formId: z.string().uuid().describe('id of the form'),
    answers: z.array(z.object({
        fieldId: z.string().uuid().describe('id of the field'),
        value: z.string().describe('value of the answer')
    })).describe('array of answers'),
});

export const updateFormResponseWithoutGuestTokenDto = submitFormResponseWithoutGuestTokenDto;

export const formActionDto = z.object({
    formId: z.string().uuid().describe('id of the form'),
});