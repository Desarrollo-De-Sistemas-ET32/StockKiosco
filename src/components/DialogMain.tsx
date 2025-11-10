import { Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader
 } from "@/components/ui/dialog";
import { Button } from "./ui/button";

export default function DialogMainUpdate() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="dark:bg-dark-10 bg-light-10 hover:bg-light-10/70 hover:dark:bg-dark-10/70">Actualizar Inventario</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
