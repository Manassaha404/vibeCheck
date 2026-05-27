import { protectedProcedure, publicProcedure, router } from "../../trpc";
import {
  getMeDto,
  LoginWithEmailPasswordDto,
  resetPasswordDto,
  sendPasswordVerificationEmailDto,
  SignUpWithEmailPasswordDto,
  VerifyEmailDto,
} from "@repo/services/auth/model";
import { authServices } from "../../services";
import { TRPCError } from "@trpc/server";
import { AppError } from "@repo/error";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../../utils/email";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import { zodUndefinedModel } from "../../schema";
import { handleRouteError } from "../../utils/error";
import { z } from "zod";
import { authResponseSchema, messageSchema, userSchema } from "./model";
import { OpenApiMeta } from "trpc-to-openapi";


const createAuthOpenApiMeta = (
  method: "GET" | "POST",
  path: string,
  summary: string,
  description: string,
  protect?: boolean
): { openapi: NonNullable<OpenApiMeta["openapi"]> } => ({
  openapi: {
    method,
    path: `/auth${path}`,
    tags: ["auth"],
    summary,
    description,
    ...(protect && { protect }),
  },
});



export const authRouter = router({
  registerUser: publicProcedure
    .meta(
      createAuthOpenApiMeta(
        "POST",
        "/register",
        "Register a new user",
        "Creates a new user account and sends a verification OTP email."
      )
    )
    .input(SignUpWithEmailPasswordDto)
    .output(authResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const user = await authServices.signUpWithEmailPassword(input);
        const verificationOtp = await authServices.sendVerificationEmail(
          user.email,
        );
        await sendVerificationEmail(user.email, verificationOtp);
        return {
          message: "verification email sent successfully",
          user: {
            ...user,
            createdAt: user.createdAt?.toISOString(),
            updatedAt: user.updatedAt?.toISOString(),
          },
        };
      } catch (error) {
        return handleRouteError(error);
      }
    }),

  verifyEmail: publicProcedure
    .meta(
      createAuthOpenApiMeta(
        "POST",
        "/verify-email",
        "Verify email with OTP",
        "Verifies the user's email address using a 6-digit OTP. Sets auth cookies on success."
      )
    )
    .input(VerifyEmailDto)
    .output(authResponseSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { user, message } = await authServices.verifyEmail(
          input.id,
          input.otp,
        );
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);
        ctx.setCookie("accessToken", accessToken);
        ctx.setCookie("refreshToken", refreshToken);
        return {
          message,
          user: {
            ...user,
            createdAt: user.createdAt?.toISOString(),
            updatedAt: user.updatedAt?.toISOString(),
          },
        };
      } catch (error) {
        return handleRouteError(error);
      }
    }),

  loginWithEmailPassword: publicProcedure
    .meta(
      createAuthOpenApiMeta(
        "POST",
        "/login",
        "Login with email and password",
        "Authenticates a user and sets HTTP-only cookie tokens (accessToken, refreshToken)."
      )
    )
    .input(LoginWithEmailPasswordDto)
    .output(authResponseSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { user, message } = await authServices.loginWithEmailPassword(
          input.email,
          input.password,
        );
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);
        ctx.setCookie("accessToken", accessToken);
        ctx.setCookie("refreshToken", refreshToken);
        return {
          message,
          user: {
            ...user,
            createdAt: user.createdAt?.toISOString(),
            updatedAt: user.updatedAt?.toISOString(),
          },
        };
      } catch (error) {
        return handleRouteError(error);
      }
    }),

  forgotPassword: publicProcedure
    .meta(
      createAuthOpenApiMeta(
        "POST",
        "/forgot-password",
        "Request a password reset email",
        "Sends a password reset OTP to the specified email address."
      )
    )
    .input(sendPasswordVerificationEmailDto)
    .output(authResponseSchema)
    .mutation(async ({ input }) => {
      const { email } = input;
      const { user, verificationOtp, message } =
        await authServices.sendPasswordVerificationEmail({ email });
      await sendPasswordResetEmail(email, verificationOtp);
      return { 
        message,
        user: {
          ...user,
          createdAt: user.createdAt?.toISOString(),
          updatedAt: user.updatedAt?.toISOString(),
        }
      };
    }),

  resetPassword: publicProcedure
    .meta(
      createAuthOpenApiMeta(
        "POST",
        "/reset-password",
        "Reset password using OTP",
        "Resets the user password after validating the OTP from the reset email."
      )
    )
    .input(resetPasswordDto)
    .output(messageSchema)
    .mutation(async ({ input }) => {
      const { id, otp, password } = input;
      const { user, message } = await authServices.resetPassword({
        id,
        otp,
        password,
      });
      return { message };
    }),

  getme: protectedProcedure
    .meta(
      createAuthOpenApiMeta(
        "GET",
        "/me",
        "Get current authenticated user",
        "Returns the profile of the currently authenticated user. Requires valid session cookies.",
        true
      )
    )
    .input(zodUndefinedModel)
    .output(z.object({ user: userSchema }))
    .query(async ({ ctx }) => {
      const { user } = await authServices.getme({ id: ctx.user.id });
      return {
        user: {
          ...user,
          createdAt: user.createdAt?.toISOString(),
          updatedAt: user.updatedAt?.toISOString(),
        },
      };
    }),

  logout: protectedProcedure
    .meta(
      createAuthOpenApiMeta(
        "POST",
        "/logout",
        "Logout",
        "Clears the authentication cookies and invalidates the session.",
        true
      )
    )
    .input(zodUndefinedModel)
    .output(messageSchema)
    .mutation(async ({ ctx }) => {
      try {
        ctx.clearCookie("accessToken");
        ctx.clearCookie("refreshToken");
        return { message: "logout successful" };
      } catch (error) {
        return handleRouteError(error);
      }
    }),
});
