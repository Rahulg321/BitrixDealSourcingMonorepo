import Image from "next/image";
import styles from "./page.module.css";
import { add } from "@repo/math/add";
import { Button } from "@repo/ui/components/button";
import { addDummyData } from "@repo/firebase-client/db";
import { addDeal } from "./actions";
import AddDealButton from "./components/AddDealButton";
import axios from "axios";
import AddCompanyButton from "./components/AddCompanyButton";

export default async function Home() {
  // const response = await axios("http://localhost:3000/api/deal-fields");
  return (
    <section className="container">
      <AddDealButton />
      <AddCompanyButton />
    </section>
  );
}
