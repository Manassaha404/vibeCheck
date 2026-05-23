import { AppError } from "@repo/error";
import { TRPCError } from "@trpc/server/unstable-core-do-not-import";

export const handleRouteError = (error: unknown) => {
  if (error instanceof AppError) {
    throw new TRPCError({
      code: error.code,
      message: error.message,
    });
  }
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred",
  });
};