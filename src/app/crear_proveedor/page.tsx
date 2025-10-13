import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BiUser } from "react-icons/bi";

export default function crearProveedor() {
  return (
    <main className="flex h-screen items-center justify-center bg-blend-darken">
      <Image
        src={`/paquete.jpg`}
        layout="fill"
        objectFit="cover"
        alt="Background"
        className="absolute -z-10 opacity-50"
      />
      <Card className="m-5 w-[35rem] border-none bg-var6 dark:bg-var2 xl:h-[35rem]">
        <CardHeader className="flex items-center justify-center">
          <CardTitle className="text-3xl">CREAR PROVEEDOR</CardTitle>
        </CardHeader>
        <CardContent className="flex h-full w-full">
          <form
            id="register-form"
            className="flex w-full flex-col justify-center items-center"
          >
            <div className="flex flex-col gap-12">
              <div className="grid gap-5">
                <div className="flex flex-col sm:flex-row gap-5 w-full">
                  <div className="grid gap-5">
                    <Label htmlFor="name">Nombre</Label>
                    <div className="relative flex items-center">
                      <Input
                        className="h-[3rem] rounded-4xl border-none bg-var5 dark:bg-var1 pl-12 w-full"
                        id="name"
                        type="text"
                        placeholder="John"
                        required
                      />
                      <BiUser
                        className="absolute left-4 text-muted-foreground"
                        size={20}
                      />
                    </div>
                  </div>
                  <div className="grid gap-5">
                    <Label htmlFor="name">Apellido</Label>
                    <div className="relative flex items-center">
                      <Input
                        className="h-[3rem] rounded-4xl border-none bg-var5 dark:bg-var1 pl-12 w-full"
                        id="surname"
                        type="text"
                        placeholder="Doe"
                        required
                      />
                      <BiUser
                        className="absolute left-4 text-muted-foreground"
                        size={20}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5 w-full">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  className="h-12 rounded-4xl border-none bg-var5 pl-5 dark:bg-var1"
                  id="email"
                  type="email"
                  placeholder="john_doe@example.com"
                  required
                />
              </div>
              <div className="flex flex-col gap-5 h-full">
                <Label htmlFor="text">Dirección de la distribuidora</Label>
                <Input
                  className="h-12 rounded-4xl border-none bg-var5 pl-5 dark:bg-var1"
                  id="address"
                  type="text"
                  placeholder="Corrientes 1234, CABA"
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex h-full items-center justify-center">
          <Button
            form="register-form"
            type="submit"
            className="h-12 w-fit cursor-pointer bg-var4 px-15 hover:bg-var1/50 dark:bg-var1"
          >
            Crear Proveedor
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
