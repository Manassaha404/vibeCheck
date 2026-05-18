import { publicProcedure, router } from "../../trpc";
import { z, zodUndefinedModel } from "../../schema";

export const healthRouter = router({
  getHealth: publicProcedure
    .input(zodUndefinedModel)
    .output(z.string())
    .query(async () => {
      return "hello from trpc";
    }),
});
