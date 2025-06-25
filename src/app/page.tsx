import { NavigationMenuDemo } from "@/components/navBar";
import { Button } from "@/components/ui/button";
import Link from "@/../node_modules/next/link";
import Script from "../../node_modules/next/script";

export default function Home() {
  return (
    <main className="bg-[#DEE2E6]">
      <NavigationMenuDemo></NavigationMenuDemo>
      <h1 className="flex justify-center italic text-xs">Here goes everythig else</h1>
      <p className="text-base flex justify-center font-semibold">Acá va todo lo demás</p>
      
      <Button variant="green">
        <Link href="@/otherPage">Yippie!</Link>
      </Button>

      <Button variant="green">
        <Link href="@/otherPage">Yay!</Link>
        <Script src="https://example.com/script.js">Yippie!</Script>
      </Button>

      <Button variant="outline">
        <Link href="@/otherPage">Yippie!</Link>
      </Button>
    </main>
  );
}
