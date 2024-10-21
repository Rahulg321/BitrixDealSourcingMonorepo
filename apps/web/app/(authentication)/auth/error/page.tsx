import { Button } from "@repo/ui/components/button";
import Link from "next/link";
import React from "react";

const AuthErrorPage = () => {
  return (
    <div className="block-space container">
      <h2>An Error occured in Next Auth</h2>
      <Button asChild>
        <Link href={"/auth/login"}>Try Again</Link>
      </Button>
    </div>
  );
};

export default AuthErrorPage;
