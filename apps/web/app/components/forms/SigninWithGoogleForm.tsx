import { Button } from "@repo/ui/components/button";
import { signIn } from "../../../auth";
import { FcGoogle } from "react-icons/fc";

export default function SigninWithGoogleForm() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
      className="flex items-center justify-center"
    >
      <Button type="submit" variant={"outline"}>
        Signin with Google <FcGoogle className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}
