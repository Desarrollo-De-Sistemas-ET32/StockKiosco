/*
  Warnings:

  - You are about to drop the column `codigo_barras` on the `productos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[codigo_barra]` on the table `productos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codigo_barra` to the `productos` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "productos_codigo_barras_key";

-- AlterTable
ALTER TABLE "productos" DROP COLUMN "codigo_barras",
ADD COLUMN     "codigo_barra" BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "productos_codigo_barras_key" ON "productos"("codigo_barra");
