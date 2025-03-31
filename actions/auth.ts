"use server";

import { signUpSchema } from "@/lib/validation";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AuthError } from "next-auth";
import bcryptjs from "bcryptjs";

export const signOutCredentials = async () => {
  try {
    await signOut({
      redirect: true,
      redirectTo: "/auth/sign-in",
    });
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: "Something went wrong!",
      message: error.message,
    };
  }
};

export const signUp = async (
  values: AuthCredentials
): Promise<AuthActionResult> => {
  const validatedFields = signUpSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid fields!",
    };
  }

  const { name, email, password } = validatedFields.data;
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      success: false,
      error: "Email already in use!",
    };
  }

  const hashedPassword = await bcryptjs.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const result = await signInWithCredential({ email, password });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: "Something went wrong!",
      message: error.message,
    };
  }
};

export const signInWithCredential = async (
  values: Pick<AuthCredentials, "email" | "password">
) => {
  const { email, password } = values;

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error: any) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return {
            success: false,
            error: "Invalid credentials",
          };
        }

        default: {
          return {
            success: false,
            error: "Something went wrong!",
            message: error.message,
          };
        }
      }
    }

    return {
      success: false,
      error: "Something went wrong!",
      message: error.message,
    };
  }
};

export const signInWithGoogle = async () => {
  try {
    await signIn("google", {
      redirectTo: "/",
    });
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: "Something went wrong!",
      message: error.message,
    };
  }
};
