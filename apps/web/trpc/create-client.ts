import { httpBatchLink } from "@repo/trpc/client";

export const createTRPCLink = () =>
  httpBatchLink({
    url: "http://localhost:8000/trpc",
    fetch(url, options) {
      return fetch(url, { ...options, credentials: "include" });
    },
  });