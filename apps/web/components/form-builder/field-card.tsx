"use client";

import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, Trash2, Star } from "lucide-react";
import { FormField } from "./types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FieldCardProps {
  field: FormField;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
}

export function FieldCard({ field, isSelected, onSelect, onDelete, index }: FieldCardProps) {
  const isMultiSelect = field.type === "multi_select";
  const isSingleSelect = field.type === "single_select";
  
  const options = Array.isArray(field.options) ? field.options : ["Option 1", "Option 2", "Option 3"];
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={field}
      id={field.id}
      dragListener={false}
      dragControls={dragControls}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ 
        layout: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
      className="relative group"
    >
      <Card 
        className={`p-5 transition-all border-2 ${
          isSelected ? "border-primary shadow-md ring-4 ring-primary/10" : "border-transparent hover:border-border cursor-pointer shadow-sm"
        }`}
        onClick={() => onSelect(field.id)}
      >
        <div className="flex gap-4">
          <div 
            className="flex-none pt-2 text-muted-foreground/40 group-hover:text-muted-foreground cursor-grab active:cursor-grabbing touch-none"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <GripVertical className="w-5 h-5" />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-start">
              <Label className="text-base font-medium flex items-center gap-1">
                {field.label || "Untitled Field"}
                {field.required && <span className="text-destructive">*</span>}
              </Label>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(field.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Field UI Preview based on type */}
            <div className="pointer-events-none opacity-80">
              {field.type === "short_text" && (
                <Input placeholder={field.placeholder || "Short text answer"} readOnly />
              )}
              
              {field.type === "long_text" && (
                <Textarea placeholder={field.placeholder || "Long text answer"} readOnly className="resize-none" />
              )}
              
              {field.type === "email" && (
                <Input type="email" placeholder={field.placeholder || "Email address"} readOnly />
              )}

              {field.type === "number" && (
                <Input type="number" placeholder={field.placeholder || "Numeric value"} readOnly />
              )}

              {field.type === "date" && (
                <Input type="date" className="w-[200px]" readOnly />
              )}

              {isSingleSelect && (
                <RadioGroup defaultValue={options[0]}>
                  {options.map((opt, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt} id={`${field.id}-opt-${i}`} />
                      <Label htmlFor={`${field.id}-opt-${i}`}>{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {isMultiSelect && (
                <div className="space-y-2">
                  {options.map((opt, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Checkbox id={`${field.id}-mopt-${i}`} />
                      <Label htmlFor={`${field.id}-mopt-${i}`}>{opt}</Label>
                    </div>
                  ))}
                </div>
              )}

              {field.type === "checkbox" && (
                <div className="flex items-center space-x-2">
                  <Checkbox id={`${field.id}-check`} />
                  <Label htmlFor={`${field.id}-check`}>{field.placeholder || "I agree"}</Label>
                </div>
              )}

              {field.type === "rating" && (
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-6 h-6 text-muted-foreground/30 fill-muted-foreground/10" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Reorder.Item>
  );
}
