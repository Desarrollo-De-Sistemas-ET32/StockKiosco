# StockKiosco

Aplicación web construida con [Next.js/React], TypeScript, Prisma y NextAuth.js.

## 🚀 Comenzando

### Prerrequisitos

Asegúrate de tener instalado: Node.js, npm, Git, y tu [Base de Datos] (ej. PostgreSQL).

### Instalación
    
1.  **Instala dependencias:**
    
    Bash
    
    ```
    npm i
    
    ```
    
2.  **Configura `.env`:** Crea un archivo `.env` con(NO OLVIDEN PONER LA CONTRASERA EN YOUR PASSWORD):
    
    Fragmento de código
    
    ```
DATABASE_URL="postgresql://postgres.vqkilvejuwcsxufssdvx:[YOUR-PASSWORD]@aws-0-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.vqkilvejuwcsxufssdvx:[YOUR-PASSWORD]@aws-0-us-east-2.pooler.supabase.com:5432/postgres"


    ```
    

### Configuración de la Base de Datos

1.  **Genera el Prisma Client:**
    
    Bash
    
    ```
    npx prisma generate
    
    ```
    
2.  **Sincroniza el esquema (opcional, si partes de una BD existente):**
    
    Bash
    
    ```
    npx prisma db pull
    
    ```
    
    _(Usa `npx prisma db push` o `npx prisma migrate dev` si aplicas cambios de `schema.prisma` a la BD)._

### Generar Secreto de Autenticación

1.  **Genera un `NEXTAUTH_SECRET` para tu `.env`:**
    
    Bash
    
    ```
    npx auth secret
    
    ```
    
    Copia el resultado y pégalo en tu `.env`.

### Ejecutar la Aplicación

Bash

```
npm run dev

```

La aplicación estará disponible en `http://localhost:3000`.

## 🛠️ Tecnologías Clave

-   [Next.js]
-   TypeScript
-   Prisma ORM
-   NextAuth.js
-   [Zod, Tailwind CSS, etc.]
