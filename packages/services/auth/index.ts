import { z } from "zod";
import {
  getMeDto,
  getMetype,
  resetPasswordtype,
  sendPasswordVerificationEmailDto,
  sendPasswordVerificationEmailType,
  SignUpWithEmailPasswordDto,
  SignUpWithEmailPasswordType,
} from "./model";
import db, { eq } from "@repo/database";
import { authTable, userTable } from "@repo/database/schema";
import * as bcrypt from "bcrypt";
import { AppError } from "@repo/error";
import * as crypto from "node:crypto"

export class AuthServices {
  public async signUpWithEmailPassword(payload: SignUpWithEmailPasswordType) {
    const { fullName, email, password } = await SignUpWithEmailPasswordDto.parseAsync(payload);

    const existingUsers = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));

    if (existingUsers.length > 0) {
      throw new AppError("CONFLICT", "email already exists"); // FIXED typo
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const {user} = await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(userTable)
        .values({
          fullName,
          email,
        })
        .returning();

      const [auth] = await tx
        .insert(authTable)
        .values({
          userId: user?.id as string,
          password: hashedPassword,
        })
        .returning();

      return { user };
    });
    if(!user){
      throw new AppError('INTERNAL_SERVER_ERROR' , "something went wrong when signup user!!")
    }
    return user
  }

  public async sendVerificationEmail(email: string) {
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));

    if (!user) {
      throw new AppError("NOT_FOUND", "user not found");
    }
    const verificationOtp = crypto.randomInt(100000, 1000000).toString();
    const verificationOtpHashed = await bcrypt.hash(verificationOtp, 10);
    const verificationOtpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await db
      .update(authTable)
      .set({ verificationOtp: verificationOtpHashed, verificationOtpExpiresAt })
      .where(eq(authTable.userId, user.id));

    return verificationOtp;
  }

  public async verifyEmail(
    id: string,
    otp: string,
  ): Promise<{ user: typeof userTable.$inferSelect; message: string }> {
    const [user] = await db
      .select({
        id: userTable.id,
        fullName: userTable.fullName,
        email: userTable.email,
        createdAt: userTable.createdAt,
        updatedAt: userTable.updatedAt,
      })
      .from(userTable)
      .where(eq(userTable.id, id));

    if (!user) {
      throw new AppError("NOT_FOUND", "user not found");
    }

    const [auth] = await db
      .select({
        verificationOtp: authTable.verificationOtp,
        verificationOtpExpiresAt: authTable.verificationOtpExpiresAt,
      })
      .from(authTable)
      .where(eq(authTable.userId, user.id));

    if (!auth) {
      throw new AppError("NOT_FOUND", "auth not found");
    }



    if (auth.verificationOtp && await bcrypt.compare(otp, auth.verificationOtp)) {
      throw new AppError("BAD_REQUEST", "invalid OTP");
    }

    if (
      auth.verificationOtpExpiresAt &&
      auth.verificationOtpExpiresAt < new Date()
    ) {
      throw new AppError("BAD_REQUEST", "OTP has expired"); 
    }
    await db
      .update(authTable)
      .set({ 
        isVerified: true, 
        verificationOtp: null, 
        verificationOtpExpiresAt: null 
      })
      .where(eq(authTable.userId, user.id));

    return { user, message: "email verified successfully" };
  }

  public async loginWithEmailPassword(
    email: string,
    password: string,
  ): Promise<{ user: typeof userTable.$inferSelect; message: string }> {
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));

    if (!user) {
      throw new AppError("NOT_FOUND", "user not found");
    }

    const [auth] = await db
      .select({
        password: authTable.password,
        isVerified: authTable.isVerified,
      })
      .from(authTable)
      .where(eq(authTable.userId, user.id));

    if (!auth) {
      throw new AppError("NOT_FOUND", "auth not found");
    }

    if (!auth.isVerified) {
        throw new AppError("FORBIDDEN", "Please verify your email before logging in");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      auth.password,
    );

    if (!isPasswordValid) {
      throw new AppError("BAD_REQUEST", "invalid password or email");
    }

    return { user, message: "login successful" };
  }

  public async sendPasswordVerificationEmail(payload: sendPasswordVerificationEmailType){
    const {email} = await sendPasswordVerificationEmailDto.parseAsync(payload);
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));

    if (!user) {
      throw new AppError("NOT_FOUND", "user not found");
    }
    const verificationOtp = crypto.randomInt(100000, 1000000).toString();
    const verificationOtpHashed = await bcrypt.hash(verificationOtp, 10);
    const verificationOtpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await db.update(authTable).set({
      passwordResetOtp: verificationOtpHashed,
      passwordResetExpiresAt: verificationOtpExpiresAt
    }).where(eq(authTable.userId, user.id));

    return {user, verificationOtp, message: "verification otp send to email!!"};
  }

  public async resetPassword({id, otp, password}:resetPasswordtype){
    const [user] = await db
      .select({
        id: userTable.id,
        fullName: userTable.fullName,
        email: userTable.email,
        createdAt: userTable.createdAt,
        updatedAt: userTable.updatedAt,
      })
      .from(userTable)
      .where(eq(userTable.id, id));

    if (!user) {
      throw new AppError("NOT_FOUND", "user not found");
    }

    const [auth] = await db
      .select({
        verificationOtp: authTable.passwordResetOtp,
        verificationOtpExpiresAt: authTable.passwordResetExpiresAt,
      })
      .from(authTable)
      .where(eq(authTable.userId, user.id));

    if (!auth) {
      throw new AppError("NOT_FOUND", "auth not found");
    }
    if(auth.verificationOtp && await bcrypt.compare(otp, auth.verificationOtp)){
      throw new AppError("BAD_REQUEST", "invalid OTP");
    }
    if (
      auth.verificationOtpExpiresAt &&
      auth.verificationOtpExpiresAt < new Date()
    ) {
      throw new AppError("BAD_REQUEST", "OTP has expired"); 
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.update(authTable).set({
      passwordResetOtp:null,
      passwordResetExpiresAt:null,
      password:hashedPassword
    })
    return {user, message:"password is changed"}
  }

  public async getme(payload:getMetype){
    const {id} = await getMeDto.parseAsync(payload);
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, id));

    if (!user) {
      throw new AppError("NOT_FOUND", "user not found");
    }
    return {user};
  }
}

export default AuthServices;
