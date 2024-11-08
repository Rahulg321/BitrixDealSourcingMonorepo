import * as functions from "firebase-functions/v1";
import { initializeApp } from "firebase-admin/app";
import { firestore } from "firebase-admin";

import { getAuth } from "firebase-admin/auth";

initializeApp();

export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  if (user.email && user.email === "admin@example.com") {
    await firestore().doc(`users/${user.uid}`).create({
      isPro: true,
    });

    const customClaims = {
      role: "admin",
    };

    try {
      await getAuth().setCustomUserClaims(user.uid, customClaims);
    } catch (error) {
      console.log(error);
    }
    return;
  }

  if (user.email && user.email === "pro@example.com") {
    await firestore().doc(`users/${user.uid}`).create({
      isPro: true,
    });
    return;
  }

  await firestore().doc(`users/${user.uid}`).create({
    isPro: false,
  });
});
