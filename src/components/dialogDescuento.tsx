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
import {
  DescuentoPayload,
  TipoDescuento,
} from "@/app/Service/descuento/descuento";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/datePicker";
import { FieldTextarea } from "@/components/textarea";
import { Loader2 } from "lucide-react";

type DialogDescuentoProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (e: React.FormEvent) => void; // Recibe handleCreate o handleUpdate
  isSubmitting: boolean;
  modalForm: DescuentoPayload;
  setModalForm: React.Dispatch<React.SetStateAction<DescuentoPayload>>;
  title: string; // Título (ej: "Crear Descuento" o "Editar Descuento")
};

export function DialogDescuento({
isOpen,
  onOpenChange,
  onSubmit,
  isSubmitting,
  modalForm,
  setModalForm,
  title, // Recibimos el título
}: DialogDescuentoProps) {

  const handleChange = (
    field: keyof DescuentoPayload,
    value: string | boolean | number
  ) => {
    setModalForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (
    field: keyof DescuentoPayload,
    dateString: string | undefined
  ) => {
    setModalForm((prev) => ({ ...prev, [field]: dateString }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border-none shadow-lg sm:max-w-lg bg-light-60 dark:bg-dark-60">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Completa los datos para crear un nuevo descuento.
          </DialogDescription>
        </DialogHeader>
        {/* Este es el ÚNICO formulario */}
        <form onSubmit={onSubmit} className="flex flex-col gap-4 py-4">
          <label className="size-3 w-fit">Nombre del descuento</label>
          <input
            type="text"
            name="nombre"
            placeholder="John Doe"
            value={modalForm.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm border-none bg-light-30 dark:bg-dark-30"
            required
          />
          <div className="w-full flex flex-row gap-4">
            <div className="w-fit flex-col">
              <label className="size-3 w-fit">Tipo</label>
              <Select
                name="tipo"
                value={modalForm.tipo}
                onValueChange={(value: TipoDescuento) => {
                  handleChange("tipo", value);
                }}
              >
                <SelectTrigger className="col-span-3 border-none bg-light-30 dark:bg-dark-30">
                  <SelectValue placeholder="Seleccione un tipo" />
                </SelectTrigger>
                <SelectContent className="bg-light-30 dark:bg-dark-30 border-none">
                  <SelectItem
                    value="MONTOFIJO"
                    className="hover:bg-light-60/70 hover:dark:bg-dark-60/70 my-1"
                  >
                    Monto Fijo
                  </SelectItem>
                  <SelectItem
                    value="PORCENTAJE"
                    className="hover:bg-light-60/70 hover:dark:bg-dark-60/70 my-1"
                  >
                    Porcentaje
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-fit flex-col">
              <label className="size-3 w-fit">Valor del descuento</label>
              <input
                type="number"
                name="valor"
                placeholder="1000"
                value={modalForm.valor}
                onChange={(e) => handleChange("valor", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm border-none bg-light-30 dark:bg-dark-30"
                required
              />
            </div>
          </div>
          <div className="w-full flex flex-row gap-4">
            <div className="w-fit">
              <label>Fecha de inicio</label>
              <DatePicker
                className="w-full bg-light-30 dark:bg-dark-30"
                id="fecha_inicio"
                value={modalForm.fecha_inicio}
                onChange={(dateString) => handleDateChange("fecha_inicio", dateString)}
                placeholder="Seleccionar fecha"
              ></DatePicker>
            </div>
            <div className="w-fit">
              <label>Fecha de fin</label>
              <DatePicker
                className="w-full bg-light-30 dark:bg-dark-30"
                id="fecha_fin"
                value={modalForm.fecha_fin}
                onChange={(dateString) => handleDateChange("fecha_fin", dateString)}
                placeholder="Seleccionar fecha"
              ></DatePicker>
            </div>
          </div>
          <label>Descripción</label>
          <FieldTextarea
            id="descripcion"
            value={modalForm.descripcion ?? ""}
            onChange={(e) => handleChange("descripcion", e.target.value)}
            placeholder="Opcional: detalles sobre el descuento..."
          ></FieldTextarea>
          <DialogFooter className="w-full gap-0">
            <Button className="bg-light-30 dark:bg-dark-30 w-6/12 " type="button" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button className="bg-light-30 dark:bg-dark-30 w-6/12" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
