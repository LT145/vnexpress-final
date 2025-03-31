import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import type { NextAuthConfig } from "next-auth";
import  prisma  from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { config } from "./config";
import { UserRole } from "@prisma/client";
type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export default {
  providers: [
    Google({
      clientId: config.env.google.clientId,
      clientSecret: config.env.google.clientSecret,
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
    signIn: "/auth/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Type assertion for user as our custom User type
      const dbUser = user as User | undefined;
      if (dbUser) {
        token.id = dbUser.id;
        token.name = dbUser.name;
        token.role = dbUser.role;
        console.log('JWT token after update:', token);
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        console.log('Session after update:', session);
      }

      return session;
    },
  },
} satisfies NextAuthConfig;
