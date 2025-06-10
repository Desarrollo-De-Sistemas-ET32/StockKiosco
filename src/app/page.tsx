import { NavigationMenuDemo } from "@/components/navBar";

export default function Home() {
  return (
    <main className="bg-[#DEE2E6]">
      <NavigationMenuDemo></NavigationMenuDemo>
      <h1 className="flex justify-center italic text-xs">Here goes everythig else</h1>
      <p className="text-base flex justify-center font-semibold">Acá va todo lo demás</p>
    </main>
  );
}
