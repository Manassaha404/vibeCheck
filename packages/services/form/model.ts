import {z} from "zod"

export const getAllCreatedFormsDto = z.object({
    userId: z.uuid().describe('id of the user'),
})

export type getAllCreatedFormsType = z.infer<typeof getAllCreatedFormsDto>

