import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import type { NextAuthConfig } from "next-auth";
import  { prisma }  from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { config } from "./config";
import { UserRole } from "@prisma/client";
type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  emailVerified?: string | null;
}

export default {
  providers: [
    Google({
      clientId: config.env.google.clientId,
      clientSecret: config.env.google.clientSecret,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          role: 'USER',
          createdAt: new Date().toISOString()
        }
      }
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password as string
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name || '', // Ensure name is not null
          email: user.email,
          role: user.role,
          createdAt: user.createdAt.toISOString() // Add createdAt
        };
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in", // chuyển lỗi về cùng trang
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!profile) {
        return false;
      }
      if (account?.provider !== 'google') {
        return true;
      }

      if (!profile.email || typeof profile.email !== 'string') {
        return false;
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: profile.email },
      });

      if (!existingUser) {
        return true;
      }

      if (!existingUser.googleId) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            googleId: profile.sub
          }
        });
        return "/sign-in?error=GoogleAccountAlreadyLinked";
      }

      if (existingUser.googleId !== profile.sub) {
        return "/sign-in?error=GoogleAccountAlreadyLinked";
      }

      return true;
    },
    async jwt({ token, user, profile }) {
      // Type assertion for user as our custom User type
      const dbUser = user as User | undefined;
      if (dbUser) {
        token.id = dbUser.id;
        token.name = dbUser.name;
        token.role = dbUser.role;
        // Remove the avatar assignment from profile.picture
        console.log('JWT token after update:', token);
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;
  