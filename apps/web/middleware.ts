import { NextResponse } from "next/server";
import { auth } from "./auth";
import {
  AUTH_ROUTES,
  DEFAULT_LOGIN_REDIRECT,
  PROTECTED_ROUTES,
} from "./routes";

export default auth((req) => {
  // Your custom middleware logic goes here
  const currentPathname = req.nextUrl.pathname;
  //   !! converts the value into its boolean equivalent
  const isLoggedIn = !!req.auth;

  if (AUTH_ROUTES.includes(currentPathname)) {
    // we are accessing an auth route
    if (isLoggedIn) {
      console.log(
        "access denied for accessing auth routes for logged in users"
      );
      // we are already logged in so we cant access the auth routes anymore
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
    }
  }

  if (PROTECTED_ROUTES.includes(currentPathname)) {
    // we are accessing a protected routes
    // check for valid sessions
    // redirect unauthorized users

    if (!isLoggedIn) {
      console.log("access denied for not logged in users");
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return NextResponse.next();
});

// run for all routes
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
