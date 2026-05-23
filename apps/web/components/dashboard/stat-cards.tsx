"use client"
import { FileText, Globe, Link2, FileEdit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormCardProps {
  forms: {
    title: string;
    id: string;
    visibility: "public" | "unlisted" | "draft";
    description: string | null;
    createdAt: string;
    updatedAt: string | null;
    slug: string;
    isPublished: boolean;
    allowResponseEdit: boolean;
    responseLimit: number | null;
    expiresAt: string | null;
    totalResponses: number
  }[];
}



export function StatCards({ forms }: FormCardProps) {
  const publicForms = forms?.filter((form) => form.visibility === "public");
  const unlistedForms = forms?.filter((form) => form.visibility === "unlisted");
  const draftForms = forms?.filter((form) => form.visibility === "draft");
  const stats = [
    { title: "Total Forms", value: forms.length, icon: FileText },
    { title: "Public", value: publicForms.length, icon: Globe },
    { title: "Unlisted", value: unlistedForms.length, icon: Link2 },
    { title: "Drafts", value: draftForms.length, icon: FileEdit },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="bg-background border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}