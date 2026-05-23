import { Skeleton } from "@/components/ui/skeleton"

export default function PageLoader() {
  return (
    <main className="min-h-screen bg-black px-6 py-8 w-full mx-auto">
      <div className="flex items-center justify-between mb-12">
        <Skeleton className="h-8 w-28 rounded-lg bg-[#111]" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-lg bg-[#111]" />
          <Skeleton className="h-8 w-24 rounded-lg bg-[#111]" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 mb-16">
        <Skeleton className="h-4 w-40 rounded-full bg-[#111]" />
        <Skeleton className="h-10 w-96 rounded-lg bg-[#111]" />
        <Skeleton className="h-10 w-72 rounded-lg bg-[#111]" />
        <Skeleton className="h-4 w-80 rounded-lg bg-[#111]" />
        <div className="flex gap-3 mt-2">
          <Skeleton className="h-10 w-36 rounded-lg bg-[#111]" />
          <Skeleton className="h-10 w-36 rounded-lg bg-[#111]" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Skeleton className="h-40 rounded-2xl bg-[#111] md:col-span-2" />
        <Skeleton className="h-40 rounded-2xl bg-[#111]" />
        <Skeleton className="h-40 rounded-2xl bg-[#111]" />
        <Skeleton className="h-40 rounded-2xl bg-[#111] md:col-span-2" />
        <Skeleton className="h-40 rounded-2xl bg-[#111] md:col-span-2" />
        <Skeleton className="h-40 rounded-2xl bg-[#111]" />
      </div>
    </main>
  )
}