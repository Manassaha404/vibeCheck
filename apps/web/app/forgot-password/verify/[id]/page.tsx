"use client"

import React, { use } from "react"
import { ResetPasswordForm } from "@/components/forgot-password/reset-password-form"
import { ShieldCheck } from "lucide-react"

export default function ResetPasswordPage({
  params,
}: {
  params: Promise<{ id:string }>;
}) {
  const { id } = use(params);
  
  

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        
        {/* Logo / Header Section */}
        <div className="flex items-center gap-2 self-center font-medium text-foreground">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ShieldCheck className="size-4" />
          </div>
          Vibe Check
        </div>
        
        {/* Render the form component with the URL parameter */}
        <ResetPasswordForm id={id} />
        
      </div>
    </div>
  )
}