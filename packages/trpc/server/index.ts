import "dotenv/config"
import { authRouter } from "./routes/auth/route";
import { healthRouter } from "./routes/health/route";
import { router } from "./trpc";
import { formRouter } from "./routes/form/route";

export const serverRouter = router({
  health: healthRouter,
  auth: authRouter,
  form: formRouter,
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
export { openApiDocument } from "./openapi";