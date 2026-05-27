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

import { trpc } from "../../trpc/client"
import { useRouter } from "next/navigation"

const signinSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }), 
  password: z.string().min(1, { message: "Password is required." }),
});

type SigninFormData = z.infer<typeof signinSchema>;

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const utils = trpc.useUtils();
  
  const { 
    register, 
    handleSubmit, 
    setError,
    formState: { errors } 
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
  });
  const { mutate, isPending } = trpc.auth.loginWithEmailPassword.useMutation({
    onSuccess: async (data) => {
      console.log("Logged in:", data);
      await utils.auth.getme.invalidate();
      router.push(`/`); 
    },
    onError: (err) => {
      setError("root", {
        type: "server",
        message: err.message || "Invalid email or password.",
      });
    }
  });

  const onSubmit = (data: SigninFormData) => {
    mutate({
      email: data.email,
      password: data.password
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-border shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-foreground">Welcome back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your email and password to sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
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
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password" className="text-foreground">Password</FieldLabel>
                  <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  className="border-input focus-visible:ring-ring"
                  {...register("password")} 
                />
                {errors.password && (
                  <FieldDescription className="text-destructive">
                    {errors.password.message}
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
                  {isPending ? "Signing in..." : "Sign in"}
                </Button>
                <FieldDescription className="text-center mt-4 text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-primary hover:underline font-medium">
                    Create account
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