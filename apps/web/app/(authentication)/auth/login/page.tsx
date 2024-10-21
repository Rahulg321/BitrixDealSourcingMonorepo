import Image from "next/image";
import React, { Suspense } from "react";
import SigninWithGoogleForm from "../../../components/forms/SigninWithGoogleForm";
import { auth } from "../../../../auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In to Dark Alpha Capital Deal Sourcing Organization",
  description: "Login to Dark Alpha Capital",
};

const LoginPage = async () => {
  const session = await auth();

  if (session) {
    return redirect("/");
  }

  return (
    <section className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Section: Image */}
      <div className="relative hidden md:block">
        <Image
          src={"/deal-sourcing.avif"}
          alt="Blue background with wavy patterns for authentication pages"
          className="object-cover"
          fill
          priority
        />
      </div>

      {/* Right Section: Content */}
      <div className="flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full px-8 py-12 space-y-6">
          <h2 className="text-center">
            Welcome to Dark Alpha Deal Sourcing Organization
          </h2>
          <p className="text-sm text-gray-600 text-center">
            Please sign in to access deal screening using AI.
          </p>
          <Suspense fallback={<p>Loading...</p>}>
            <div className="justify-center">
              <SigninWithGoogleForm />
            </div>
          </Suspense>
          <p className="text-xs text-gray-500 text-center">
            Only authorized members of the organization can access this
            platform.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
