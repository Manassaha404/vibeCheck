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

import { trpc } from "../../trpc/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
  email: z.string().email({ message: "Please enter a valid email address." }), 
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  
  const { 
    register, 
    handleSubmit, 
    setError,
    formState: { errors } 
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });


  const { mutate, isPending } = trpc.auth.registerUser.useMutation({
    onSuccess: (data) => {
      console.log(data);
      
      router.push(`/signup/verify/${data?.user?.id}`);
    },
    onError: (err) => {
      setError("root", {
        type: "server",
        message: err.message || "An error occurred during registration.",
      });
    }
  });

  const onSubmit = (data: SignupFormData) => {
    mutate({
      fullName: data.name,
      email: data.email,
      password: data.password
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              
              {/* Name Field */}
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="John Doe" 
                  {...register("name")} 
                />
                {errors.name && (
                  <FieldDescription className="text-destructive">
                    {errors.name.message}
                  </FieldDescription>
                )}
              </Field>

              {/* Email Field */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <FieldDescription className="text-destructive">
                    {errors.email.message}
                  </FieldDescription>
                )}
              </Field>

              {/* Password Fields */}
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input 
                      id="password" 
                      type="password" 
                      {...register("password")} 
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      {...register("confirmPassword")} 
                    />
                  </Field>
                </Field>
                
                {errors.password ? (
                  <FieldDescription className="text-destructive">
                    {errors.password.message}
                  </FieldDescription>
                ) : errors.confirmPassword ? (
                  <FieldDescription className="text-destructive">
                    {errors.confirmPassword.message}
                  </FieldDescription>
                ) : (
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                )}
              </Field>

              {/* 5. Root Error Display */}
              {errors.root && (
                <FieldDescription className="text-destructive text-center font-medium">
                  {errors.root.message}
                </FieldDescription>
              )}

              {/* Submit Button */}
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating Account..." : "Create Account"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link href='/signin'>Sign in </Link>
                </FieldDescription>
              </Field>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}