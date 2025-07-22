import { Button } from "@/components/ui/button";
import Link from "@/../node_modules/next/link";
import Script from "../../node_modules/next/script";

export default function Home() {
  return (
    <main className="bg-foreground">
      <h1 className="flex justify-center italic text-xs">Here goes everythig else</h1>
      <p className="text-base flex justify-center font-semibold">Acá va todo lo demás</p>
      
      <Button variant="filled">
        <Link href="@/otherPage">Yippie!</Link>
      </Button>

      <Button variant="gray">
        <Link href="@/otherPage">Yay!</Link>
        <Script src="https://example.com/script.js">Yippie!</Script>
      </Button>

      <Button>
        <Link href="@/otherPage">Yippie!</Link>
      </Button>
    </main>
  );
}
