import  Link  from "next/link";

export default function NotFound() {
  return (
    <main className="w-screen h-[80vh] flex flex-col justify-center items-center overflow-hidden">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-medium mt-4">Página no encontrada</h2>

      <Link
        href={"/main"}
        className="mt-6 px-6 py-3 bg-light-30 dark:bg-dark-30 text-black dark:text-white rounded-lg hover:bg-light-10 hover:dark:bg-dark-10 transition-colors"
      >
        Volver al inicio
      </Link>
    </main>
  );
}