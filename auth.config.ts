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
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Missing credentials');
          }

          const email = credentials.email as string; // Explicit type assertion
          const user = await prisma.user.findUnique({
            where: { email: email }, // Use the typed email variable
          });

          if (!user) {
            throw new Error('User not found');
          }

          if (!user.password) {
            throw new Error('User has no password set');
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password as string
          );

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user.id,
            name: user.name || '',
            email: user.email,
            role: user.role,
            createdAt: user.createdAt.toISOString()
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in?error=AuthenticationFailed", // Updated error page
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // For email/password authentication
        if (account?.provider === 'credentials') {
          if (!user) {
            return false;
          }
          return true;
        }
    
        // For Google authentication
        if (account?.provider === 'google') {
          if (!profile) {
            return false;
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
            return true;
          }
    
          if (existingUser.googleId !== profile.sub) {
            return false;
          }
    
          return true;
        }
    
        // Default case for other providers
        return false;
      } catch (error) {
        console.error('SignIn error:', error);
        return false;
      }
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
  