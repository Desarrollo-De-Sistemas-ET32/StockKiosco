# 🚀 StockKiosco

**StockKiosco** es una aplicación web para la gestión de stock de kioscos, construida con **Next.js/React**, **TypeScript**, **Prisma** y **NextAuth.js**. Permite administrar inventario de manera **eficiente, segura y moderna**.  

💻 **Prerrequisitos:** Asegúrate de tener instalados **Node.js**, **npm**, **Git** y tu base de datos (ej. PostgreSQL o Supabase).  

📥 **Instalación:**  
Clona el repositorio y accede a la carpeta:  
`git clone [URL-DE-TU-REPOSITORIO]`  
`cd stockkiosco`  

Instala las dependencias:  
`npm install`  

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables (reemplaza `[YOUR-PASSWORD]` por tu contraseña):  
`DATABASE_URL="postgresql://postgres.vqkilvejuwcsxufssdvx:[YOUR-PASSWORD]@aws-0-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"`  
`DIRECT_URL="postgresql://postgres.vqkilvejuwcsxufssdvx:[YOUR-PASSWORD]@aws-0-us-east-2.pooler.supabase.com:5432/postgres"`  

⚙️ **Configuración de Prisma:**  
Genera Prisma Client: `npx prisma generate`  
Sincroniza el esquema de la base de datos si partes de una BD existente: `npx prisma db pull`  
Para aplicar cambios de `schema.prisma` a la base de datos: `npx prisma db push` o `npx prisma migrate dev`  

🔒 **Configuración de NextAuth:**  
Genera un secreto: `npx auth secret`  
Copia el resultado en tu `.env` como `NEXTAUTH_SECRET`.  

🚀 **Ejecutar la aplicación:**  
`npm run dev`  
La aplicación estará disponible en: `http://localhost:3000`  


🛠️ **Tecnologías clave:** Next.js, React, TypeScript, Prisma ORM, NextAuth.js, Zod (validación de datos), Tailwind CSS (estilos modernos y responsivos).  

💡 **Descripción:** StockKiosco permite gestionar inventario de kioscos de manera **eficiente, segura y moderna**, con autenticación robusta y tecnología full-stack actual.
