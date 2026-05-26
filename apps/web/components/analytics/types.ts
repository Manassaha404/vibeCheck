export type FieldType =
  | "short_text"
  | "long_text"
  | "email"
  | "number"
  | "single_select"
  | "multi_select"
  | "checkbox"
  | "rating"
  | "date";

export type ChartType = "bar" | "pie" | "text";

export interface FieldAnalytics {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  totalResponses: number;
  chartType: ChartType;
  chartData?: Array<{ name: string; value: number; fill?: string }> | null;
  recentAnswers?: string[];
  domains?: Array<{ name: string; value: number }>;
  avgRating?: number;
  avg?: number;
}
