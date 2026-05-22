import { initTRPC, TRPCError } from "@trpc/server";
import { createContext } from "./context";
import { 
  verifyAccessToken, 
  verifyRefreshToken, 
  generateAccessToken, 
  generateRefreshToken
} from "./utils/jwt"; 


export const tRPCContext = initTRPC
  .context<typeof createContext>()
  .create({});

export const router = tRPCContext.router;
export const publicProcedure = tRPCContext.procedure;

const isAuthed = tRPCContext.middleware(({ ctx, next }) => {
  const accessToken = ctx.getCookie("accessToken");
  const refreshToken = ctx.getCookie("refreshToken");

  if (!accessToken && !refreshToken) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  let userId: string;

  try {
    if (accessToken) {
      const decoded = verifyAccessToken(accessToken);
      userId = decoded.userId;
    } else {
      throw new Error("Missing access token");
    }
  } catch (error) {
    if (refreshToken) {
      try {
        const decoded = verifyRefreshToken(refreshToken);
        userId = decoded.userId;

        const newAccessToken = generateAccessToken(userId);
        const newRefreshToken = generateRefreshToken(userId);
        ctx.setCookie("accessToken", newAccessToken);
        ctx.setCookie("refreshToken", newRefreshToken);
      } catch (refreshError) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Session expired. Please log in again.",
        });
      }
    } else {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid or expired token.",
      });
    }
  }

  return next({
    ctx: {
      ...ctx,
      user: {
        id: userId,
      },
    },
  });
});

export const protectedProcedure = tRPCContext.procedure.use(isAuthed);
