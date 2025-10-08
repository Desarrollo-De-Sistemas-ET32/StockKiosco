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
import LoginInput from "@/components/loginInput";

export default function Login() {

  return (
    <main className="min-h-screen bg-background flex items-center justify-center overflow-hidden">
      <Image
        src="/background.avif"
        alt="fondo de kiosco"
        fill
        style={{ objectFit: "cover", position: "absolute", top: 0, left: 0, width: "100%", height: "100%", filter: "brightness(50%)"}}
        ></Image>
      <Card className="w-lg max-h-[50rem] h-[30rem] border-none bg-var6 dark:bg-var2 z-1 m-5 flex flex-col justify-evenly drop-shadow-xl/75">
        <CardHeader className="flex justify-center items-center text-center">
          <CardTitle className="text-3xl font-bold text-var text-black dark:text-white">INICIAR SESIÓN</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-[2rem]">
            <LoginInput id="prueba" type="email" placeholder="hola" icon={<BiSolidUser className="text-background"/>} label="Usuario"/>
            <LoginInput id="prueba" type="email" placeholder="Contraseña" icon={<BiSolidUser className="text-background"/>} label="Contraseña"/>
          </form>
        </CardContent>
        <CardFooter className="flex justify-around items-center">
          <button
            type="submit"
            className="bg-foreground dark:bg-background font-bold cursor-pointer w-3/7 py-4 border-none text-white rounded-md drop-shadow-xl/10"
          >
            Iniciar Sesion
          </button>
        </CardFooter>
      </Card>
    </main>
  );
}
