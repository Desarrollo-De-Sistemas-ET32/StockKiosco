import "../styles/EditarProducto.css";

const EditarProducto = () => {
  return (
    <div id="fondo">
      <form id="tarjeta">
        <h1>Editar Producto</h1>

        <input type="text" id="nombre" placeholder="Nombre" />
        <input type="text" id="codigoBarra" placeholder="Código de barra" />

        <div id="fila1">
          <input type="text" id="distribuidor" placeholder="Distribuidor" />
          <input type="text" id="categoria" placeholder="Categoría" />
        </div>

        <div id="fila2">
          <input type="number" id="precio" placeholder="Precio" />
          <input type="number" id="precioVenta" placeholder="Precio de venta" />
        </div>

        <input type="date" id="fechaExpiracion" />

        <div id="imagenContainer">
          <div id="imagenSubida">
            <img src="/usuario-ejemplo.jpg" alt="Subir imagen" />
          </div>
        </div>

        <button type="submit" id="botonVerde">
          APLICAR CAMBIOS
        </button>
      </form>
    </div>
  );
};

export default EditarProducto;