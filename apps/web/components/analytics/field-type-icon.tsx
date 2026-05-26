import {
  Star,
  MessageSquare,
  Hash,
  Mail,
  AlignLeft,
  CheckSquare,
  List,
  Calendar,
} from "lucide-react";
import type { FieldType } from "./types";

export function FieldTypeIcon({ type }: { type: FieldType }) {
  const map: Record<FieldType, React.ReactNode> = {
    rating: <Star className="h-3.5 w-3.5" />,
    single_select: <List className="h-3.5 w-3.5" />,
    multi_select: <CheckSquare className="h-3.5 w-3.5" />,
    short_text: <MessageSquare className="h-3.5 w-3.5" />,
    long_text: <AlignLeft className="h-3.5 w-3.5" />,
    email: <Mail className="h-3.5 w-3.5" />,
    number: <Hash className="h-3.5 w-3.5" />,
    checkbox: <CheckSquare className="h-3.5 w-3.5" />,
    date: <Calendar className="h-3.5 w-3.5" />,
  };
  return (
    <span className="text-muted-foreground">{map[type] ?? <MessageSquare className="h-3.5 w-3.5" />}</span>
  );
}
