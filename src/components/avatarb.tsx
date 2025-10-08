import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"

export default function Icono({ src }: { src: string }) {
  return (
    <Menubar className="border-none flex justify-center items-center bg-transparent shadow-none">
      <MenubarMenu>
        <MenubarTrigger className="">
            <Avatar>
                <AvatarImage className="w-full h-full" src={src}></AvatarImage>
            </Avatar>
        </MenubarTrigger>
        <MenubarContent className="border-none bg-var2 flex flex-col p-2 rounded-lg">
          <MenubarItem className="hover:bg-background/50">Opcion 1</MenubarItem>
          <MenubarSeparator />
          <MenubarItem className="hover:bg-background/50">Opcion 2</MenubarItem>
          <MenubarSeparator />
          <MenubarItem className="hover:bg-background/50">Opcion 3</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
