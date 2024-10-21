import NextAuth, { DefaultSession } from "next-auth";
// import authConfig from "./auth.config";
import Google from "next-auth/providers/google";
import { cert } from "firebase-admin/app";
import { adminFirestore, firestore } from "./lib/firebase-admin";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { db } from "./lib/firebase";
import { Firestore } from "firebase-admin/firestore";
import { UserRole } from "./app/types";

declare module "next-auth" {
  interface User {
    role?: UserRole; // Add role here
  }

  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      role: UserRole;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  //@ts-ignore
  adapter: FirestoreAdapter(db),
  providers: [Google],
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, account }) {
      // If this is the first time the token is created, set the `sub` and other properties
      if (!token.sub) return token;

      if (user) {
        // Assign the role from the user object (if available) or default to "user"
        token.role = user.role || "user"; // Adjust this based on how you're storing roles in your user model
      }

      // const existingUser = await getUserById(token.sub);

      // if (!existingUser) return token;

      // token.name = existingUser.name;
      // token.email = existingUser.email;
      // token.role = existingUser.role;
      // token.id = existingUser.id;
      // token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      // // Check if the user logged in with credentials or OAuth
      // token.isCredentialsLogin = !!existingUser.password;

      return token;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
      }

      return session;
    },
  },
});
