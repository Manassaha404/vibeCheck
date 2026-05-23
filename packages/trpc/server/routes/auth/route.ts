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
import { sendVerificationEmail, sendPasswordResetEmail } from "../../utils/email";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import { zodUndefinedModel } from "../../schema";
import { handleRouteError } from "../../utils/error";



export const authRouter = router({
  registerUser: publicProcedure
    .input(SignUpWithEmailPasswordDto)
    .mutation(async ({ input }) => {
      try {
        const user = await authServices.signUpWithEmailPassword(input);
        const verificationOtp = await authServices.sendVerificationEmail(
          user.email,
        );
        await sendVerificationEmail(user.email, verificationOtp);
        return {
          message: "verification email sent successfully",
          user,
        };
      } catch (error) {
        handleRouteError(error);
      }
    }),

  verifyEmail: publicProcedure
    .input(VerifyEmailDto)
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
        return { message, user };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  loginWithEmailPassword: publicProcedure
    .input(LoginWithEmailPasswordDto)
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
        return { message, user };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  forgotPassword: publicProcedure
    .input(sendPasswordVerificationEmailDto)
    .mutation(async ({ input }) => {
      const { email } = input;
      const { user, verificationOtp, message } =
        await authServices.sendPasswordVerificationEmail({ email });
      await sendPasswordResetEmail(email, verificationOtp);
      return { message, user };
    }),
  resetPassword: publicProcedure
    .input(resetPasswordDto)
    .mutation(async ({ input }) => {
      const { id, otp, password } = input;
      const { user, message } = await authServices.resetPassword({
        id,
        otp,
        password,
      });
      return { message };
    }),
  getme:protectedProcedure.input(zodUndefinedModel).query(async({ctx})=>{
    const {user} = await authServices.getme({id:ctx.user.id})
    return {user};
  }),
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      ctx.clearCookie("accessToken");
      ctx.clearCookie("refreshToken");
      return { message: "logout successful" };
    } catch (error) {
      handleRouteError(error);
    }
  }),
});
