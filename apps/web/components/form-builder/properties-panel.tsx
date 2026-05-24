"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FormField } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface PropertiesPanelProps {
  field: FormField | null;
  onUpdate: (id: string, updates: Partial<FormField>) => void;
}

export function PropertiesPanel({ field, onUpdate }: PropertiesPanelProps) {
  if (!field) {
    return (
      <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center h-[300px] text-muted-foreground">
        <p className="text-sm">Select a field to edit its properties</p>
      </div>
    );
  }

  const hasOptions = ["single_select", "multi_select"].includes(field.type);
  const options = Array.isArray(field.options) ? field.options : ["Option 1", "Option 2"];

  const handleAddOption = () => {
    onUpdate(field.id, { options: [...options, `Option ${options.length + 1}`] });
  };

  const handleUpdateOption = (index: number, val: string) => {
    const newOptions = [...options];
    newOptions[index] = val;
    onUpdate(field.id, { options: newOptions });
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    onUpdate(field.id, { options: newOptions });
  };

  return (
    <motion.div
      key={field.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-card border rounded-xl p-5 shadow-sm space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold mb-1">Field Properties</h3>
        <p className="text-xs text-muted-foreground uppercase font-mono">{field.type.replace('_', ' ')}</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="field-label">Label</Label>
          <Input 
            id="field-label"
            value={field.label} 
            onChange={(e) => onUpdate(field.id, { label: e.target.value })}
            placeholder="E.g., What is your name?"
          />
        </div>

        {field.type !== "rating" && (
          <div className="space-y-2">
            <Label htmlFor="field-placeholder">
              {field.type === 'checkbox' ? 'Checkbox Text' : 'Placeholder'}
            </Label>
            <Input 
              id="field-placeholder"
              value={field.placeholder || ""} 
              onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
              placeholder={field.type === 'checkbox' ? 'I agree to the terms' : 'Type here...'}
            />
          </div>
        )}

        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/40">
          <div className="space-y-0.5">
            <Label htmlFor="field-required">Required</Label>
            <p className="text-[10px] text-muted-foreground">Make this field mandatory</p>
          </div>
          <Switch 
            id="field-required"
            checked={field.required}
            onCheckedChange={(checked) => onUpdate(field.id, { required: checked })}
          />
        </div>

        {hasOptions && (
          <div className="space-y-3 pt-2">
            <Label>Options</Label>
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {options.map((opt, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Input 
                      value={opt} 
                      onChange={(e) => handleUpdateOption(i, e.target.value)} 
                      className="h-8 text-sm"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                      onClick={() => handleRemoveOption(i)}
                      disabled={options.length <= 1}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <Button variant="outline" size="sm" className="w-full gap-2 mt-2" onClick={handleAddOption}>
              <Plus className="w-4 h-4" />
              Add Option
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
