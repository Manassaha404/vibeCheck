import "dotenv/config"
import { authRouter } from "./routes/auth/route";
import { healthRouter } from "./routes/health/route";
import { router } from "./trpc";

export const serverRouter = router({
  health: healthRouter,
  auth: authRouter
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;