import Image from "next/image";
import styles from "./page.module.css";
import { add } from "@repo/math/add";
import { Button } from "@repo/ui/components/button";

export default function Home() {
  return (
    <div className="container">
      <h1 className="text-red-400 font-bold underline">Hello World</h1>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Button>Desctructive Button</Button>
    </div>
  );
}
