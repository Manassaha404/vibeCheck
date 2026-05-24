"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";

import { trpc } from "../trpc/client";
import { createTRPCLink } from "../trpc/create-client";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      staleTime: Infinity,
    },
  },
});

export const GlobalProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [createTRPCLink()],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider queryClient={queryClient} client={trpcClient}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </trpc.Provider>
    </QueryClientProvider>
  );
};
