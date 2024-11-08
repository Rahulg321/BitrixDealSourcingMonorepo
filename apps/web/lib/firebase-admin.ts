import { initializeApp } from "firebase-admin/app";
import { App, cert, getApps, ServiceAccount } from "firebase-admin/app";
// import serviceAccount from "../firebase-admin.json";
import { Firestore, getFirestore } from "firebase-admin/firestore";
import { Auth, getAuth } from "firebase-admin/auth";
// import * as serviceAccount from "../firebase-admin.json";
import * as admin from "firebase-admin";

let firestore: Firestore;
let auth: Auth;

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

console.log("service account", serviceAccount);

// Initialize Firebase Admin SDK

const currentApps = getApps();

if (currentApps.length <= 0) {
  const app = initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  });

  firestore = getFirestore(app);
  auth = getAuth(app);
} else {
  firestore = getFirestore(currentApps[0] as App);
  auth = getAuth(currentApps[0]);
}

export { firestore, auth };
