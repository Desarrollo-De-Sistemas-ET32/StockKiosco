-- Crear la base de datos
CREATE DATABASE retail_db;
\c retail_db;

-- Tabla: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario SERIAL PRIMARY KEY,
  nombre VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL UNIQUE,
  contraseña VARCHAR(45) NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: roles
CREATE TABLE IF NOT EXISTS roles (
  id_rol INT PRIMARY KEY,
  nombre_rol VARCHAR(45) NOT NULL
);

-- Tabla: usuarios_roles
CREATE TABLE IF NOT EXISTS usuarios_roles (
  id_usuario INT NOT NULL,
  id_rol INT NOT NULL,
  PRIMARY KEY (id_usuario, id_rol),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- Tabla: marcas
CREATE TABLE IF NOT EXISTS marcas (
  id_marca SERIAL PRIMARY KEY,
  nombre_marca VARCHAR(45) NOT NULL
);

-- Tabla: proveedores
CREATE TABLE IF NOT EXISTS proveedores (
  id_proveedor SERIAL PRIMARY KEY,
  nombre VARCHAR(45) NOT NULL,
  contacto VARCHAR(45),
  telefono VARCHAR(45),
  email VARCHAR(45),
  direccion VARCHAR(45),
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: productos
CREATE TABLE IF NOT EXISTS productos (
  id_producto SERIAL PRIMARY KEY,
  nombre VARCHAR(36) NOT NULL,
  id_proveedor INT NOT NULL,
  codigo_barra BIGINT UNIQUE,
  precio NUMERIC(10,2) NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_marca INT,
  FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor),
  FOREIGN KEY (id_marca) REFERENCES marcas(id_marca)
);

-- Tabla: stock
CREATE TABLE IF NOT EXISTS stock (
  id_stock SERIAL PRIMARY KEY,
  id_producto INT NOT NULL,
  cantidad INT,
  fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- Tabla: ventas
CREATE TABLE IF NOT EXISTS ventas (
  id_venta SERIAL PRIMARY KEY,
  id_usuario INT NOT NULL,
  fecha_venta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total NUMERIC(10,2),
  descuento NUMERIC(10,2),
  pagado BOOLEAN DEFAULT FALSE,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Tabla: detalles_venta
CREATE TABLE IF NOT EXISTS detalles_venta (
  id_detalle SERIAL PRIMARY KEY,
  id_venta INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad INT,
  precio_unitario NUMERIC(10,2),
  subtotal NUMERIC(10,2),
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_venta) REFERENCES ventas(id_venta),
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- Tabla: pagos
CREATE TABLE IF NOT EXISTS pagos (
  id_pago SERIAL PRIMARY KEY,
  monto NUMERIC(10,2) NOT NULL,
  id_venta INT NOT NULL,
  metodo_pago VARCHAR(20) NOT NULL CHECK (metodo_pago IN ('efectivo', 'tarjeta', 'transferencia')),
  fecha_pago TIMESTAMP,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_venta) REFERENCES ventas(id_venta)
);
