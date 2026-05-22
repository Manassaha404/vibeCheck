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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"

import { trpc } from "@/trpc/client"
import { useRouter } from "next/navigation"

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  
  const { 
    register, 
    handleSubmit, 
    setError,
    formState: { errors } 
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const { mutate, isPending } = trpc.auth.forgotPassword.useMutation({
    onSuccess: ({user}) => {
      router.replace(`/forgot-password/verify/${user.id}`)
    },
    onError: (err) => {
      setError("root", {
        type: "server",
        message: err.message || "Failed to send reset email. Please try again.",
      });
    }
  });
  const onSubmit = (data: ForgotPasswordFormData) => {
    mutate({
      email: data.email,
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-border shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-foreground">Reset Password</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your email address and we'll send you a 6-digit OTP to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              
              {/* Email Field */}
              <Field>
                <FieldLabel htmlFor="email" className="text-foreground">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="border-input focus-visible:ring-ring"
                  {...register("email")}
                />
                {errors.email && (
                  <FieldDescription className="text-destructive">
                    {errors.email.message}
                  </FieldDescription>
                )}
              </Field>

              {/* Root Error Display */}
              {errors.root && (
                <FieldDescription className="text-destructive text-center font-medium">
                  {errors.root.message}
                </FieldDescription>
              )}

              {/* Submit Button */}
              <Field className="mt-2">
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? "Sending OTP..." : "Send Verification Code"}
                </Button>
                
                {/* Back to Sign in */}
                <FieldDescription className="text-center mt-4 text-muted-foreground">
                  Remember your password?{" "}
                  <Link href="/signin" className="text-primary hover:underline font-medium">
                    Back to Sign in
                  </Link>
                </FieldDescription>
              </Field>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}