import { Navbar } from "@/components/landing/Navbar";
import { PublicFormsList } from "@/components/public-forms/public-forms-list";

export const metadata = {
  title: "Public Forms - Vibe Check",
  description: "Discover and participate in public forms on Vibe Check.",
};

export default function PublicFormsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20">
      {/* Decorative gradient backgrounds */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px]" />
      </div>

      <Navbar />

      <main className="flex-1 container mx-auto px-6 pt-32 pb-24 relative z-10">
        <div className="max-w-2xl mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Public Forms
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore forms shared by the community. Participate, share your thoughts, and see what others are asking.
          </p>
        </div>

        <PublicFormsList />
      </main>
    </div>
  );
}
