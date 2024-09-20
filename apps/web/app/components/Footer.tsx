import React from "react";
import Link from "next/link";

export const NavLinks = [
  { navlink: "/", navlabel: "Home" },
  { navlink: "/raw-deals", navlabel: "Raw Deals" },
  { navlink: "/published-deals", navlabel: "Published Deals" },
];

const Footer = () => {
  return (
    <footer className="border-t-4 py-6 md:py-8 ">
      <div className="container flex flex-col md:flex-row  items-start md:items-center gap-4">
        <div className="mb-4">
          <Link
            href="/"
            aria-label="Home page"
            className="text-2xl md:text-4xl font-bold text-mainC"
          >
            Dark Alpha Capital
          </Link>
        </div>
        <div className="flex items-center gap-4 flex-1 justify-end">
          {NavLinks.map((e, index) => {
            return (
              <Link href={e.navlink} key={index} className="font-bold block">
                {e.navlabel}
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
