"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";

// import { liteClient as algoliasearch } from "algoliasearch/lite";
import { Session } from "next-auth";
import { ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";
import { useAuth } from "./auth-provider";
import { Button } from "@repo/ui/components/button";

type HeaderProps = {
  classname?: string;
};

export const NavLinks = [
  { navlink: "/", navlabel: "Home" },
  { navlink: "/raw-deals", navlabel: "Raw Deals" },
  { navlink: "/published-deals", navlabel: "Published Deals" },
  { navlink: "/admin", navlabel: "Admin Panel" },
];

const Header = ({ classname }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const auth = useAuth();

  return (
    <>
      <header
        className={clsx(
          " px-2 md:px-4 lg:px-12 py-2 border-b sticky top-0 z-50 bg-background",
          classname
        )}
      >
        <nav aria-label="Main-navigation">
          <ul className="flex flex-col  md:m-4 md:flex-row md:items-center justify-between md:rounded-xl">
            <div className="flex items-center justify-between">
              <NameLogo />
              <button
                aria-label="Open menu"
                className="block text-2xl text-black dark:text-white md:hidden"
                onClick={() => setIsOpen(true)}
              >
                <MdMenu />
              </button>
            </div>
            <div
              className={clsx(
                "fixed bottom-0 left-0 right-0 top-0 z-50 flex flex-col items-end gap-4 bg-black text-white pr-4 pt-14  transition-transform duration-300 ease-in-out md:hidden",
                isOpen ? "translate-x-0" : "translate-x-[100%]"
              )}
            >
              <button
                aria-label="Close menu"
                className="fixed right-4 top-3 block p-2 text-2xl text-white md:hidden "
                onClick={() => setIsOpen(false)}
              >
                <MdClose />
              </button>
              {NavLinks.map((item, index) => {
                return (
                  <Link
                    href={item.navlink}
                    key={index}
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    className={clsx(
                      "",
                      pathname === item.navlink ? "underline" : ""
                    )}
                  >
                    {item.navlabel}
                  </Link>
                );
              })}
            </div>
            <DesktopMenu />
            {auth?.currentUser ? (
              <Button
                onClick={() => {
                  auth
                    ?.logout()
                    .then(() => {
                      console.log("logged out");
                    })
                    .catch(() => {
                      console.log("something went wrong, could not log out");
                    });
                }}
              >
                Logout
              </Button>
            ) : (
              <Button variant={"link"} asChild>
                <Link href={"/auth/login"}>Login</Link>
              </Button>
            )}
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Header;

function NameLogo() {
  return (
    <div className="">
      <Link
        href="/"
        aria-label="Home page"
        className="text-3xl md:text-4xl font-bold text-mainC"
      >
        Deal Sourcing
      </Link>
    </div>
  );
}

function DesktopMenu() {
  const pathname = usePathname();
  return (
    <div className="hidden gap-8 md:flex md:items-center">
      {NavLinks.map((item, index) => {
        return (
          <Link
            href={item.navlink}
            key={index}
            className={clsx(
              "font-bold hover:underline-offset-8 hover:text-mainC hover:underline  hover:decoration-4 hover:decoration-mainC transition",
              pathname === item.navlink
                ? "text-mainC underline-offset-8 underline decoration-4"
                : ""
            )}
          >
            {item.navlabel}
          </Link>
        );
      })}
    </div>
  );
}

function AuthDialogNavs() {
  return (
    <div className="hidden space-x-4 md:flex md:items-center">
      <Link href={"/auth/login"}>Logout</Link>
    </div>
  );
}

function ProfileMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={"https://github.com/shadcn.png"} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="flex items-center font-medium text-baseC">
          Account <ChevronDown />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
