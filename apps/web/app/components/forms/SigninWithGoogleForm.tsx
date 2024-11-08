"use client";

import { Button } from "@repo/ui/components/button";
import { signIn } from "../../../auth";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../auth-provider";

export default function SigninWithGoogleForm() {
  const auth = useAuth();

  return (
    <Button
      type="submit"
      variant={"outline"}
      onClick={() => {
        auth
          ?.loginGoogle()
          .then((res) => {
            console.log("logged in");
          })
          .catch((err) => {
            console.log("something went wrong, could not log in with google");
          });
      }}
      className="flex items-center justify-center mx-auto"
    >
      Signin with Google <FcGoogle className="ml-2 h-4 w-4" />
    </Button>
  );
}
