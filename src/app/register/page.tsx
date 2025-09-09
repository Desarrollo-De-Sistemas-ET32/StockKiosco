import Image from "next/image"
import { Button } from "@/src/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
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
      <Card className="m-5 w-[50vh] border-none bg-var2 xl:h-[60vh] max-h-[60vh]">
        <CardHeader className="flex items-center justify-center">
          <CardTitle className="text-3xl">REGISTRARSE</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center">
          <form id="register-form" className="flex w-full flex-col flex-wrap">
            <div className="flex flex-col gap-12">
              <div className="grid gap-5">
                <Label htmlFor="name">Nombre Completo</Label>
                <div className="relative flex items-center">
                  <Input
                    className="h-12 rounded-lg border-none bg-var1 pl-12 w-screen max-w-[45vh]"
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                  <BiUser
                    className="absolute left-4 text-muted-foreground"
                    size={20}
                  />
                </div>
              </div>
              <div className="grid gap-5">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative flex items-center">
                  <Input
                    className="h-12 rounded-lg border-none bg-var1 pl-12"
                    id="email"
                    type="email"
                    placeholder="john_doe@example.com"
                    required
                  />
                  <BiEnvelope
                    className="absolute left-4 text-muted-foreground"
                    size={20}
                  />
                </div>
              </div>
              <div className="grid gap-5">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative flex items-center">
                  <Input
                    className="h-12 rounded-lg border-none bg-var1 pl-12 w-dvh max-w-fit"
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                  <BiKey
                    className="absolute left-4 text-muted-foreground"
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
            className="h-12 w-full cursor-pointer bg-background"
          >
            Registrarse
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}