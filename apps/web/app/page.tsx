import { Button } from "@repo/ui/components/button";
import Link from "next/link";

export default async function Home() {
  // const response = await axios("http://localhost:3000/api/deal-fields");
  return (
    <section className="container block-space">
      <div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore neque
          suscipit quidem accusantium perferendis fugiat, ex sunt culpa pariatur
          magnam eius earum et doloremque minima recusandae laborum voluptatum
          nihil odio.
        </p>
        <Button size={"lg"} asChild>
          <Link href="/deals">View Deals</Link>
        </Button>
      </div>
    </section>
  );
}
