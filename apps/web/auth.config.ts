// import type { NextAuthConfig } from "next-auth";
// import { FirestoreAdapter } from "@auth/firebase-adapter";
// import { adminFirestore } from "./firebase-admin";
// import { cert } from "firebase-admin/app";
// import Google from "next-auth/providers/google";

// export default {
//   providers: [Google],
//   adapter: FirestoreAdapter({
//     credential: cert({
//       projectId: process.env.AUTH_FIREBASE_PROJECT_ID!,
//       clientEmail: process.env.AUTH_FIREBASE_CLIENT_EMAIL!,
//       privateKey: process.env.AUTH_FIREBASE_PRIVATE_KEY!,
//     }),
//   }),
// } satisfies NextAuthConfig;
// // export default {
// //   providers: [Google],
// //   adapter: FirestoreAdapter(adminFirestore),
// // } satisfies NextAuthConfig;
