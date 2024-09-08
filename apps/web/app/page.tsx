"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { add } from "@repo/math/add";
import { Button } from "@repo/ui/components/button";
import { addDummyData } from "@repo/firebase-client/db";

export default function Home() {
  return (
    <div className="container">
      <h1 className="text-red-400 font-bold underline">Hello World</h1>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Button
        onClick={async (e) => {
          try {
            await addDummyData();
            alert("successfully added to database");
          } catch (error) {
            console.error(error);
          }
        }}
      >
        Add to DB
      </Button>
    </div>
  );
}
