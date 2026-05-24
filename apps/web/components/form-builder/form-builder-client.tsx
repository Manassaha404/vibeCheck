"use client";

import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { FieldType, FormField, FormBasicInfo } from "./types";
import { FieldPalette } from "./field-palette";
import { FieldCard } from "./field-card";
import { PropertiesPanel } from "./properties-panel";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function FormBuilderClient({ initialData }:any) {
  const formId = initialData?.id;
  const router = useRouter();
  const [basicInfo, setBasicInfo] = useState<FormBasicInfo>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    visibility: (initialData?.visibility && initialData.visibility !== "draft") ? initialData.visibility : "public",
  });

  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const handleAddField = (type: FieldType) => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      type,
      label: `New ${type.replace('_', ' ')}`,
      required: false,
      ...(type === 'single_select' || type === 'multi_select' ? { options: ["Option 1", "Option 2"] } : {}),
    };
    
    setFields([...fields, newField]);
    setSelectedFieldId(newField.id);
  };

  const handleUpdateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleDeleteField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
    if (selectedFieldId === id) {
      setSelectedFieldId(null);
    }
  };
  const { mutateAsync: addFields, isPending: isAddingFields } = trpc.form.addFormFields.useMutation();
  const { mutateAsync: publishForm, isPending: isPublishingForm } = trpc.form.editFormTitleDescriptionVisibility.useMutation();

  const handlePublishForm = async () => {
    try {
      const payloadForAddFields = {
        formId,
        fields: fields.map((field, index) => ({
          orderIndex: index,
          type: field.type,
          label: field.label,
          placeholder: field.placeholder,
          required: field.required,
          options: field.options,
          validation: field.validation,
        })),
      };
      
      const payloadForEditForm = {
        formId,
        ...basicInfo
      };
      
      await addFields(payloadForAddFields);
      await publishForm(payloadForEditForm);
      
      toast.success("Form published successfully!");
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to publish form. Please try again.");
    }
  };

  const isSaving = isAddingFields || isPublishingForm;

  const selectedField = fields.find(f => f.id === selectedFieldId) || null;

  return (
    <div className="min-h-screen bg-background">

      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(226,255,50,0.05),transparent)]" />

      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">VibeCheck</h1>
          <p className="text-sm text-muted-foreground">Draft Mode</p>
        </div>
        <Button onClick={handlePublishForm} disabled={isSaving} className="gap-2">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? "Publishing..." : "Publish"}
        </Button>
      </header>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 lg:grid-cols-[300px_1fr_340px] gap-6 px-6 py-8 items-start relative">
        
        <div className="space-y-6 sticky top-[88px]">
          <div className="bg-card border rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold">Basic Information</h3>
            <div className="space-y-2">
              <Input 
                placeholder="Form Title" 
                value={basicInfo.title}
                onChange={e => setBasicInfo({ ...basicInfo, title: e.target.value })}
                className="font-medium"
              />
              <Textarea 
                placeholder="Description (optional)" 
                value={basicInfo.description}
                onChange={e => setBasicInfo({ ...basicInfo, description: e.target.value })}
                className="resize-none h-24 text-sm"
              />
              <Select 
                value={basicInfo.visibility} 
                onValueChange={v => setBasicInfo({ ...basicInfo, visibility: v as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="unlisted">Unlisted (Link only)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <FieldPalette onAddField={handleAddField} />
        </div>

        <div className="min-h-[500px] bg-muted/20 border border-dashed border-border rounded-xl p-8 relative flex flex-col items-center">
          {fields.length === 0 ? (
            <div className="text-center text-muted-foreground py-20 flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </div>
              <h3 className="font-medium text-foreground">Canvas is empty</h3>
              <p className="text-sm max-w-[250px]">Click on a field type from the left panel to add it to your form.</p>
            </div>
          ) : (
            <Reorder.Group axis="y" values={fields} onReorder={setFields} className="w-full max-w-2xl space-y-4">
              <AnimatePresence mode="popLayout">
                {fields.map((field, index) => (
                  <FieldCard 
                    key={field.id}
                    index={index}
                    field={field}
                    isSelected={selectedFieldId === field.id}
                    onSelect={setSelectedFieldId}
                    onDelete={handleDeleteField}
                  />
                ))}
              </AnimatePresence>
            </Reorder.Group>
          )}
        </div>

        <div className="sticky top-[88px]">
          <PropertiesPanel 
            field={selectedField}
            onUpdate={handleUpdateField}
          />
        </div>

      </div>
    </div>
  );
}
