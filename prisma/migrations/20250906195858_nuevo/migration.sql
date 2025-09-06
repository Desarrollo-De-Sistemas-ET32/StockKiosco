-- AlterTable
ALTER TABLE "productos" ALTER COLUMN "codigo_barras" SET DATA TYPE BIGINT;

-- RenameIndex
ALTER INDEX "productos_codigo_barra_key" RENAME TO "productos_codigo_barras_key";
