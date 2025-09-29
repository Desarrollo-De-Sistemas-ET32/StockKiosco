import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BiEnvelope, BiKey, BiUser } from "react-icons/bi"

export default function RegisterPage() {
  return (
    <main className="flex h-screen items-center justify-center bg-blend-darken">
      <Image
        src={`/andamoactivo.jpg`}
        layout="fill"
        objectFit="cover"
        alt="Background"
        className="absolute -z-10 opacity-50"
      />
      <Card className="flex flex-col justify-center m-5 w-[28rem] [@media(max-height:550px)]:grow max-w-[50rem] border-none bg-var7 dark:bg-var2 drop-shadow-xl/75 ">
        <CardHeader className="flex items-center justify-center">
          <CardTitle className="text-3xl text-black dark:text-white cursor-default">REGISTRARSE</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 items-center justify-center flex-wrap">
          <form id="register-form" className="flex w-full flex-col flex-wrap">
            <div className="flex flex-col gap-12">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-black dark:text-white font-semibold">Nombre Completo</Label>
                <div className="relative">
                  <Input
                    className="h-12 rounded-lg border-none bg-var5 pl-12  dark:text-white dark:bg-var1"
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                  <BiUser
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={20}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-black dark:text-white font-semibold">Correo electrónico</Label>
                <div className="relative">
                  <Input
                    className="h-12 rounded-lg border-none bg-var5 pl-12 text-white dark:bg-var1"
                    id="email"
                    type="email"
                    placeholder="john_doe@example.com"
                    required
                  />
                  <BiEnvelope
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={20}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-black dark:text-white font-semibold">Contraseña</Label>
                <div className="relative">
                  <Input
                    className="h-12 rounded-lg border-none bg-var5 pl-12 text-white dark:bg-var1"
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                  <BiKey
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={20}
                  />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex h-full items-center justify-center">
          <Button
            form="register-form"
            type="submit"
            className="h-12 w-3/4 cursor-pointer bg-white text-black dark:text-var4 font-semibold transition-colors border border-transparent hover:border-white hover:text-white duration:350 hover:border-1 ease-in-out dark:bg-var1"
          >
            Registrarse
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
