"use client";

import { Controller, type UseFormReturn, useWatch } from "react-hook-form";
import {
  Users,
  CalendarClock,
  PenLine,
  Settings2,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { CreateFormValues } from "./types";
import { useState } from "react";

interface FormSettingsSectionProps {
  form: UseFormReturn<CreateFormValues>;
}

interface SettingsRowProps {
  icon: React.ElementType;
  label: string;
  description: string;
  tooltip?: string;
  children: React.ReactNode;
}

function SettingsRow({
  icon: Icon,
  label,
  description,
  tooltip,
  children,
}: SettingsRowProps) {
  return (
    <div className="flex items-center justify-between gap-6 py-3.5">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted/60">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium text-foreground">{label}</p>
            {tooltip && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-default text-[10px] text-muted-foreground/50">
                    ⓘ
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px] text-xs">
                  {tooltip}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function FormSettingsSection({ form }: FormSettingsSectionProps) {
  const { control, formState: { errors } } = form;
  const [showPassword, setShowPassword] = useState(false);
  const passwordNeeded = useWatch({ control, name: "passwordNeeded" });

  return (
    <Card className="border-border/50 bg-card/60 shadow-sm backdrop-blur-sm">
      <CardHeader className="pb-4 pt-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Settings2 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Form Settings
            </h2>
            <p className="text-xs text-muted-foreground">
              Configure access and response rules
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="divide-y divide-border/50 pb-2">
        <SettingsRow
          icon={PenLine}
          label="Allow Response Editing"
          description="Let respondents edit their submissions"
          tooltip="Respondents can update their answers after submitting"
        >
          <Controller
            name="allowResponseEdit"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-primary"
              />
            )}
          />
        </SettingsRow>
        <div className="py-3.5">
          <SettingsRow
            icon={Lock}
            label="Password Protection"
            description="Require a password to access and submit this form"
            tooltip="Respondents must enter the password before they can view or submit the form"
          >
            <Controller
              name="passwordNeeded"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-primary"
                />
              )}
            />
          </SettingsRow>
          {passwordNeeded && (
            <div className="mt-2 ml-10 flex flex-col gap-1">
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter form password"
                      autoComplete="new-password"
                      className={cn(
                        "h-9 rounded-xl pr-9 text-sm",
                        errors.password &&
                          "border-destructive/60 focus-visible:border-destructive focus-visible:ring-destructive/20"
                      )}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                )}
              />
              {errors.password && (
                <p className="text-[11px] text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
          )}
        </div>
        <SettingsRow
          icon={Users}
          label="Response Limit"
          description="Max number of responses (leave blank for unlimited)"
          tooltip="Once the limit is reached, the form will stop accepting responses"
        >
          <Controller
            name="responseLimit"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col items-end gap-1">
                <Input
                  type="number"
                  min={1}
                  placeholder="∞"
                  className={cn(
                    "h-9 w-24 rounded-xl text-center text-sm tabular-nums",
                    errors.responseLimit &&
                      "border-destructive/60 focus-visible:border-destructive"
                  )}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? undefined : Number(e.target.value)
                    )
                  }
                />
                {errors.responseLimit && (
                  <p className="text-[10px] text-destructive">
                    {errors.responseLimit.message}
                  </p>
                )}
              </div>
            )}
          />
        </SettingsRow>
        <SettingsRow
          icon={CalendarClock}
          label="Expiry Date"
          description="Form will close automatically on this date"
          tooltip="After this date, the form will stop accepting new submissions"
        >
          <Controller
            name="expiresAt"
            control={control}
            render={({ field }) => (
              <Input
                type="datetime-local"
                className="h-9 w-[200px] rounded-xl text-xs"
                value={
                  field.value
                    ? new Date(field.value).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? new Date(e.target.value) : undefined
                  )
                }
              />
            )}
          />
        </SettingsRow>
      </CardContent>
    </Card>
  );
}
