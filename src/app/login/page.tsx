import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { BiKey } from "react-icons/bi";
import { BiSolidUser } from "react-icons/bi";
import Image from "next/image";

export default function Login() {

  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <Image
        src="/background.avif"
        alt="fondo de kiosco"
        width={1920}
        height={1080}
        style={{ objectFit: "cover", position: "absolute", top: 0, left: 0, width: "100%", height: "100%", filter: "brightness(50%)"}}
        ></Image>
      <Card className="w-lg max-h-[50rem] h-[30rem] border-none bg-var7 dark:bg-var2 z-1 m-5 flex flex-col justify-evenly drop-shadow-xl/75">
        <CardHeader className="flex justify-center items-center text-center">
          <CardTitle className="text-3xl font-bold text-var text-black dark:text-white">INICIAR SESIÓN</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-[2rem]">
            <div>
              <label
                htmlFor="username"
                className="block mb-1 text-sm font-medium text-black dark:text-white"
              >
                Nombre de Usuario
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none bg-foreground p-1 rounded-4xl">
                  <BiSolidUser className="text-background" />
                </div>
                <input
                  type="text"
                  id="username"
                  className="w-full pl-12 pr-10 py-2 border rounded-4xl border-white text-neutral-300"
                  placeholder=""
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-sm font-medium text-black dark:text-white"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none bg-foreground p-1 rounded-4xl">
                  <BiKey className="text-background" />
                </div>
                <input
                  type="text"
                  id="username"
                  className="w-full pl-12 pr-10 py-2 border rounded-4xl border-white"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-around items-center">
          <button
            type="submit"
            className="bg-background font-bold cursor-pointer hover:text-background w-full py-2 px-4 dark:text-white rounded-md hover:bg-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-var3 drop-shadow-xl/10"
          >
            Iniciar Sesion
          </button>
        </CardFooter>
      </Card>
    </main>
  );
}
