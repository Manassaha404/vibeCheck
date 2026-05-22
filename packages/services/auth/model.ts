import {z} from "zod"

export const SignUpWithEmailPasswordDto = z.object({
    fullName: z.string().max(200).describe('full name of the user'),
    email: z.email().describe('email of the user'),
    password: z.string().describe('password of the user')
})
export const VerifyEmailDto = z.object({
    id: z.uuid().describe('id of the user'),
    otp: z.string().length(6).describe('otp of the user')
})


export const LoginWithEmailPasswordDto = z.object({
    email: z.email().describe('email of the user'),
    password: z.string().describe('password of the user')
})




export const sendPasswordVerificationEmailDto = z.object({
    email: z.string().email().describe('email of the user'),
})
export const resetPasswordDto = z.object({
    id: z.uuid().describe('id of the user'),
    otp: z.string().length(6).describe('otp of the user'),
    password: z.string().describe('password of the user'),
})



export const getMeDto = z.object({
    id: z.uuid().describe('id of the user'),
})
export type SignUpWithEmailPasswordType = z.infer<typeof SignUpWithEmailPasswordDto>;
export type VerifyEmailType = z.infer<typeof VerifyEmailDto>;
export type LoginWithEmailPasswordType = z.infer<typeof LoginWithEmailPasswordDto>;
export type sendPasswordVerificationEmailType = z.infer<typeof sendPasswordVerificationEmailDto>
export type resetPasswordtype = z.infer<typeof resetPasswordDto>
export type getMetype = z.infer<typeof getMeDto>