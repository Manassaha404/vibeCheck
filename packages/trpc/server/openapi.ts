import { generateOpenApiDocument } from "trpc-to-openapi";
import { authRouter } from "./routes/auth/route";
import { healthRouter } from "./routes/health/route";
import { formRouter } from "./routes/form/route";
import { router } from "./trpc";

const _openApiRouter = router({
  health: healthRouter,
  auth: authRouter,
  form: formRouter,
});

const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000";

export const openApiDocument = generateOpenApiDocument(_openApiRouter, {
  title: "VibeCheck API",
  version: "1.0.0",
  description:
    "REST API documentation for VibeCheck — a form builder and analytics platform.",
  baseUrl: BASE_URL,
  docsUrl: `${BASE_URL}/docs`,
  tags: ["auth", "form", "health"],
});
