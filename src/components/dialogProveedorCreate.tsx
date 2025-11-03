import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DialogProveedorProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting: boolean;
  handleCreate: (e: React.FormEvent) => void;
  handleModalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  modalForm: {
    nombre: string;
    email: string;
    direccion: string;
    contacto: string;
    telefono: string;
  };
};

export function DialogProveedor({
  isOpen, // <-- Nuevo
  onOpenChange, // <-- Nuevo
  isSubmitting, // <-- Nuevo
  handleCreate,
  handleModalChange,
  modalForm,
}: DialogProveedorProps) {
  return (
    // Usamos las props para controlar el estado
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* Ya no hay un <form> exterior ni <DialogTrigger> */}
      <DialogContent className="border-none shadow-lg sm:max-w-lg bg-dark-60">
        <DialogHeader>
          <DialogTitle>Crear Proveedor</DialogTitle>
          <DialogDescription className="">
            Completa los datos para crear un nuevo proveedor.{<br></br>} Al ingresar número de telefono {<b>hagalo sin espacios ni ' - '.</b>}
          </DialogDescription>
        </DialogHeader>
        {/* Este es el ÚNICO formulario */}
        <form onSubmit={handleCreate} className="flex flex-col gap-4 py-4">
          <label className="size-3">Nombre</label>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={modalForm.nombre}
            onChange={handleModalChange}
            className="w-full px-3 py-2 rounded-lg text-sm border-none dark:bg-dark-30"
            required
          />
          <label className="size-3">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={modalForm.email}
            onChange={handleModalChange}
            className="w-full px-3 py-2 rounded-lg text-sm border-none dark:bg-dark-30"
            required
          />
          <label className="size-3">Dirección</label>
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={modalForm.direccion}
            onChange={handleModalChange}
            className="w-full px-3 py-2 rounded-lg text-sm border-none dark:bg-dark-30"
          />
          <div className="flex flex-row">
            <div className="mr-4">
              <label className="size-3 w-fit">Medio de contacto</label>
              <input
                type="text"
                name="contacto"
                placeholder="Contacto"
                value={modalForm.contacto}
                onChange={handleModalChange}
                className="w-full px-3 py-2 rounded-lg text-sm border-none dark:bg-dark-30"
              />
            </div>
            <div className="w-full">
              <label className="size-3">Telefono</label>
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                value={modalForm.telefono}
                onChange={handleModalChange}
                className="w-full px-3 py-2 rounded-lg text-sm border-none dark:bg-dark-30"
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              {/* Usamos type="button" para que no envíe el form */}
              <Button
                type="button"
                className="dark:bg-dark-30 hover:dark:bg-dark-30/70"
              >
                Cancelar
              </Button>
            </DialogClose>
            {/* Este botón SÍ envía el formulario porque está dentro del <form> 
              y su type por defecto es "submit".
            */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="dark:bg-dark-30 hover:dark:bg-dark-30/70"
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
