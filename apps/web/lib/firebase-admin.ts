// import { initializeApp } from "firebase-admin";
// import { App, cert, getApps, ServiceAccount } from "firebase-admin/app";
// import serviceAccount from "../firebase-admin.json";
// import { Firestore, getFirestore } from "firebase-admin/firestore";

// let firestore: Firestore;

// const currentApps = getApps();

// if (currentApps.length <= 0) {
//   const app = initializeApp({
//     credential: cert(serviceAccount as ServiceAccount),
//   });

//   firestore = getFirestore(app);
// } else {
//   firestore = getFirestore(currentApps[0] as App);
// }

// export { firestore };
