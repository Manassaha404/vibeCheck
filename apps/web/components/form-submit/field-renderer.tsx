"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { itemVariants } from "./constants";

// Assuming we don't have all complex shadcn components (Radio, Select), 
// we will build simple accessible HTML equivalents styled with Tailwind for the mock.
interface FieldRendererProps {
  field: any;
  value: any;
  onChange: (value: any) => void;
}

export function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
  const renderInput = () => {
    switch (field.type) {
      case "short_text":
      case "email":
      case "number":
      case "date":
        return (
          <Input
            type={field.type === "short_text" ? "text" : field.type}
            placeholder={field.placeholder || "Your answer..."}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="h-12 bg-secondary/30 border-border focus:bg-background transition-colors text-md"
            required={field.required}
          />
        );
      case "long_text":
        return (
          <Textarea
            placeholder={field.placeholder || "Your answer..."}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[120px] bg-secondary/30 border-border focus:bg-background transition-colors resize-y text-md p-4"
            required={field.required}
          />
        );
      case "rating":
        const currentRating = parseInt(value || "0");
        return (
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((rating) => {
              const isSelected = rating <= currentRating;
              return (
                <button
                  key={rating}
                  type="button"
                  onClick={() => onChange(rating.toString())}
                  className="transition-all duration-300 hover:scale-110 p-1"
                >
                  <Star 
                    className={`w-10 h-10 transition-all duration-300 ${
                      isSelected 
                        ? "fill-primary text-primary drop-shadow-[0_0_10px_rgba(226,255,50,0.5)]" 
                        : "text-muted-foreground/30 hover:text-primary/50"
                    }`} 
                  />
                </button>
              );
            })}
          </div>
        );
      case "single_select":
        return (
          <div className="space-y-3">
            {field.options?.map((option: string) => (
              <div
                key={option}
                onClick={() => onChange(option)}
                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                  value === option
                    ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(226,255,50,0.1)]"
                    : "border-border bg-secondary/20 hover:bg-secondary/40 hover:border-border/80"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${
                  value === option ? "border-primary" : "border-muted-foreground"
                }`}>
                  {value === option && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
                <span className={value === option ? "text-foreground font-medium" : "text-muted-foreground"}>
                  {option}
                </span>
              </div>
            ))}
          </div>
        );
      case "checkbox":
      case "multi_select":
        // value may be: an array (from live state), a JSON string (from DB on edit),
        // or undefined/null on a fresh form — normalise to string[]
        const parseMultiValue = (v: any): string[] => {
          if (Array.isArray(v)) return v.map(String);
          if (typeof v === "string" && v.trim().startsWith("[")) {
            try {
              const parsed = JSON.parse(v);
              if (Array.isArray(parsed)) return parsed.map(String);
            } catch {}
          }
          if (typeof v === "string" && v) return [v]; // single plain value
          return [];
        };
        const currentValues = parseMultiValue(value);
        const toggleValue = (opt: string) => {
          if (currentValues.includes(opt)) {
            onChange(currentValues.filter((v) => v !== opt));
          } else {
            onChange([...currentValues, opt]);
          }
        };
        return (
          <div className="space-y-3">
            {field.options?.map((option: string) => {
              const isSelected = currentValues.includes(option);
              return (
                <div
                  key={option}
                  onClick={() => toggleValue(option)}
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(226,255,50,0.1)]"
                      : "border-border bg-secondary/20 hover:bg-secondary/40 hover:border-border/80"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border-2 mr-3 flex items-center justify-center transition-colors ${
                    isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                  }`}>
                    {isSelected && (
                      <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5 text-primary-foreground">
                        <path d="M3 8L6 11L11 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className={isSelected ? "text-foreground font-medium" : "text-muted-foreground"}>
                    {option}
                  </span>
                </div>
              );
            })}
          </div>
        );
      default:
        return <p className="text-destructive text-sm">Unsupported field type: {field.type}</p>;
    }
  };

  return (
    <motion.div variants={itemVariants} className="mb-8 w-full group">
      <div className="p-6 md:p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-500">
        <Label className="text-xl font-medium mb-1.5 block text-foreground group-hover:text-primary transition-colors duration-300">
          {field.label}
          {field.required && <span className="text-destructive ml-1.5">*</span>}
        </Label>
        {field.description && (
          <p className="text-sm text-muted-foreground mb-4">{field.description}</p>
        )}
        <div className="mt-6">
          {renderInput()}
        </div>
      </div>
    </motion.div>
  );
}
