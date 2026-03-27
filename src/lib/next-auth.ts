import { getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { syncGoogleUser } from "@/lib/auth";
import type { Rol } from "@/lib/types";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const isGoogleAuthConfigured = Boolean(
  googleClientId &&
    googleClientSecret &&
    process.env.NEXTAUTH_SECRET,
);

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: isGoogleAuthConfigured
    ? [
        GoogleProvider({
          clientId: googleClientId!,
          clientSecret: googleClientSecret!,
        }),
      ]
    : [],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) {
        return false;
      }

      const appUser = await syncGoogleUser({
        email: user.email,
        name: user.name,
      });

      (
        user as typeof user & {
          appUserId: number;
          role: Rol;
          appName: string;
        }
      ).appUserId = appUser.id;
      (user as typeof user & { role: Rol; appName: string }).role = appUser.role;
      (user as typeof user & { role: Rol; appName: string }).appName =
        appUser.name;

      return true;
    },
    async jwt({ token, user }) {
      const authUser = user as (typeof user & {
        appUserId?: number;
        role?: Rol;
        appName?: string;
      }) | undefined;

      if (typeof authUser?.appUserId === "number") {
        token.appUserId = authUser.appUserId;
      }

      if (authUser?.role) {
        token.role = authUser.role;
      }

      if (authUser?.appName) {
        token.name = authUser.appName;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (typeof token.appUserId === "number") {
          (session.user as typeof session.user & { id?: number }).id = token.appUserId;
        }

        if (typeof token.name === "string") {
          session.user.name = token.name;
        }

        if (typeof token.role === "string") {
          (
            session.user as typeof session.user & {
              role?: Rol;
            }
          ).role = token.role as Rol;
        }
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      try {
        const parsed = new URL(url);
        if (parsed.origin === baseUrl) {
          return url;
        }
      } catch {
        return baseUrl;
      }

      return baseUrl;
    },
  },
};

export function getAuthSession() {
  return getServerSession(authOptions);
}
