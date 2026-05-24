"use client";

import { motion } from "framer-motion";
import { 
  Type, 
  AlignLeft, 
  Mail, 
  Hash, 
  CircleDot, 
  CheckSquare, 
  ListOrdered, 
  Star, 
  Calendar 
} from "lucide-react";
import { FieldType } from "./types";
import { Button } from "@/components/ui/button";

interface FieldPaletteProps {
  onAddField: (type: FieldType) => void;
}

const FIELD_TYPES: { type: FieldType; label: string; icon: React.ReactNode }[] = [
  { type: "short_text", label: "Short Text", icon: <Type className="w-4 h-4" /> },
  { type: "long_text", label: "Long Text", icon: <AlignLeft className="w-4 h-4" /> },
  { type: "email", label: "Email", icon: <Mail className="w-4 h-4" /> },
  { type: "number", label: "Number", icon: <Hash className="w-4 h-4" /> },
  { type: "single_select", label: "Single Select", icon: <CircleDot className="w-4 h-4" /> },
  { type: "multi_select", label: "Multi Select", icon: <CheckSquare className="w-4 h-4" /> },
  { type: "checkbox", label: "Checkbox", icon: <ListOrdered className="w-4 h-4" /> }, // could use better icon
  { type: "rating", label: "Rating", icon: <Star className="w-4 h-4" /> },
  { type: "date", label: "Date", icon: <Calendar className="w-4 h-4" /> },
];

export function FieldPalette({ onAddField }: FieldPaletteProps) {
  return (
    <div className="bg-card border rounded-xl p-4 shadow-sm flex flex-col gap-2">
      <h3 className="text-sm font-semibold mb-2">Add Fields</h3>
      <div className="grid grid-cols-2 gap-2">
        {FIELD_TYPES.map((field) => (
          <Button
            key={field.type}
            variant="outline"
            className="flex items-center justify-start gap-2 h-auto py-3 px-3 hover:border-primary/50 transition-colors"
            onClick={() => onAddField(field.type)}
          >
            <span className="text-muted-foreground">{field.icon}</span>
            <span className="text-xs font-medium">{field.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
