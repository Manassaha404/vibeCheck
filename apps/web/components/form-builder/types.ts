export type FieldType = 
  | 'short_text' 
  | 'long_text' 
  | 'email' 
  | 'number'
  | 'single_select' 
  | 'multi_select' 
  | 'checkbox'
  | 'rating' 
  | 'date';

export interface FormField {
  id: string; // client-side only UUID
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: any; // e.g. string array for selects
  validation?: any;
}

export interface FormBasicInfo {
  title: string;
  description: string;
  visibility: 'public' | 'unlisted' | 'draft';
}
