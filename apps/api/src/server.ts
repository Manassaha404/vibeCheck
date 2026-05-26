import express from "express";
import cors from "cors";

import * as trpcExpress from "@trpc/server/adapters/express";

import { serverRouter, createContext } from "@repo/trpc/server";

import { env } from "./env";
import cookieParser from "cookie-parser";

export const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials:true
  }),
);

app.use(cookieParser())
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "server is running.." });
});

app.get("/health", (req, res) => {
  return res.json({ message: "Streamyst server is healthy", healthy: true });
});

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

export default app;
