import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your forms, track responses, and analyze data.
        </p>
      </div>
      <Button className="shrink-0 gap-2 font-medium">
        <Plus className="h-4 w-4" />
        Create New Form
      </Button>
    </div>
  );
}