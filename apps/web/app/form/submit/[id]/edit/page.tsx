import { EditResponseContainer } from "@/components/form-submit/edit-response-container";
import { use } from "react";

export default function EditResponsePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/30">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] mix-blend-screen opacity-50" />
      <div className="pointer-events-none fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[100px] mix-blend-screen opacity-30" />

      {/* Grid pattern */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <main className="relative z-10 pt-16 md:pt-24 px-4 sm:px-6 lg:px-8">
        <EditResponseContainer formId={id} />
      </main>
    </div>
  );
}
