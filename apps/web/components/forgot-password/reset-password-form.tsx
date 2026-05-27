"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { trpc } from "@/trpc/client"
import { useRouter } from "next/navigation"

const resetPasswordSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be exactly 6 digits." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps extends React.ComponentProps<"div"> {
  id: string;
}

export function ResetPasswordForm({
  id,
  className,
  ...props
}: ResetPasswordFormProps) {
  const router = useRouter();
  
  const { 
    register, 
    control,
    handleSubmit, 
    setError,
    formState: { errors } 
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    }
  });
  const { mutate, isPending } = trpc.auth.resetPassword.useMutation({
    onSuccess: () => {
      console.log("Password reset successfully!");
      router.push(`/signin?reset=success`); 
    },
    onError: (err) => {
      setError("root", {
        type: "server",
        message: err.message || "Failed to reset password. The OTP may be invalid or expired.",
      });
    }
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    mutate({
      id,
      otp: data.otp,
      password: data.password
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-border shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-foreground">Set new password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel className="text-foreground text-center block w-full mb-2">
                  Verification Code
                </FieldLabel>
                <div className="flex justify-center">
                  <Controller
                    control={control}
                    name="otp"
                    render={({ field }) => (
                      <InputOTP maxLength={6} {...field} disabled={isPending}>
                        <InputOTPGroup className="gap-2">
                          {[...Array(6)].map((_, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className={cn(
                                "h-12 w-10 sm:h-14 sm:w-12 text-lg font-medium rounded-md border",
                                errors.otp ? "border-destructive text-destructive focus-visible:ring-destructive" : "border-input focus-visible:ring-ring"
                              )}
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    )}
                  />
                </div>
                {errors.otp && (
                  <FieldDescription className="text-destructive text-center mt-2">
                    {errors.otp.message}
                  </FieldDescription>
                )}
              </Field>
              <Field className="mt-4">
                <FieldLabel htmlFor="password" className="text-foreground">New Password</FieldLabel>
                <Input 
                  id="password" 
                  type="password" 
                  className="border-input focus-visible:ring-ring"
                  disabled={isPending}
                  {...register("password")} 
                />
                {errors.password && (
                  <FieldDescription className="text-destructive">
                    {errors.password.message}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword" className="text-foreground">Confirm New Password</FieldLabel>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  className="border-input focus-visible:ring-ring"
                  disabled={isPending}
                  {...register("confirmPassword")} 
                />
                {errors.confirmPassword && (
                  <FieldDescription className="text-destructive">
                    {errors.confirmPassword.message}
                  </FieldDescription>
                )}
              </Field>
              {errors.root && (
                <FieldDescription className="text-destructive text-center font-medium">
                  {errors.root.message}
                </FieldDescription>
              )}
              <Field className="mt-2">
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? "Resetting Password..." : "Reset Password"}
                </Button>
              </Field>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}