-- AlterTable
ALTER TABLE "materiales" ALTER COLUMN "fecha_inicio" SET DATA TYPE TIMESTAMP(0),
ALTER COLUMN "fecha_fin" SET DATA TYPE TIMESTAMP(0);

-- CreateTable
CREATE TABLE "competiciones" (
    "id_competicion" SERIAL NOT NULL,
    "nombre_competicion" VARCHAR(80) NOT NULL,
    "tipo_competicion" VARCHAR(20) NOT NULL,
    "temporada" VARCHAR(20) NOT NULL,
    "id_deporte" INTEGER NOT NULL,
    "id_federacion" INTEGER NOT NULL,
    "id_genero" INTEGER NOT NULL,
    "categoria_edad" VARCHAR(30),
    "ambito" VARCHAR(20),

    CONSTRAINT "competiciones_pkey" PRIMARY KEY ("id_competicion")
);

-- CreateTable
CREATE TABLE "partidos" (
    "id_partido" SERIAL NOT NULL,
    "id_competicion" INTEGER NOT NULL,
    "id_equipo_local" INTEGER,
    "id_equipo_visitante" INTEGER,
    "equipo_local_nombre" VARCHAR(60) NOT NULL,
    "equipo_visitante_nombre" VARCHAR(60) NOT NULL,
    "fecha_partido" TIMESTAMP(0) NOT NULL,
    "jornada" VARCHAR(20),
    "grupo" VARCHAR(30),
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "emitido" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "partidos_pkey" PRIMARY KEY ("id_partido")
);

-- CreateIndex
CREATE INDEX "ix_competiciones_id_deporte" ON "competiciones"("id_deporte");

-- CreateIndex
CREATE INDEX "ix_competiciones_id_federacion" ON "competiciones"("id_federacion");

-- CreateIndex
CREATE INDEX "ix_competiciones_id_genero" ON "competiciones"("id_genero");

-- CreateIndex
CREATE INDEX "ix_competiciones_temporada" ON "competiciones"("temporada");

-- CreateIndex
CREATE INDEX "ix_partidos_id_competicion" ON "partidos"("id_competicion");

-- CreateIndex
CREATE INDEX "ix_partidos_id_equipo_local" ON "partidos"("id_equipo_local");

-- CreateIndex
CREATE INDEX "ix_partidos_id_equipo_visitante" ON "partidos"("id_equipo_visitante");

-- CreateIndex
CREATE INDEX "ix_partidos_fecha_partido" ON "partidos"("fecha_partido");

-- RenameForeignKey
ALTER TABLE "comentarios" RENAME CONSTRAINT "fk_directos_comentarios" TO "comentarios_id_directo_fkey";

-- RenameForeignKey
ALTER TABLE "comentarios" RENAME CONSTRAINT "fk_usuarios_comentarios" TO "comentarios_id_usuario_fkey";

-- RenameForeignKey
ALTER TABLE "equipos" RENAME CONSTRAINT "fk_deportes_equipos" TO "equipos_id_deporte_fkey";

-- RenameForeignKey
ALTER TABLE "equipos" RENAME CONSTRAINT "fk_federaciones_equipos" TO "equipos_id_federacion_fkey";

-- RenameForeignKey
ALTER TABLE "equipos" RENAME CONSTRAINT "fk_genero_equipos" TO "equipos_id_genero_fkey";

-- RenameForeignKey
ALTER TABLE "federaciones" RENAME CONSTRAINT "fk_deporte_federaciones" TO "federaciones_id_deporte_fkey";

-- RenameForeignKey
ALTER TABLE "materiales" RENAME CONSTRAINT "fk_estados_materiales" TO "materiales_id_estado_fkey";

-- RenameForeignKey
ALTER TABLE "materiales" RENAME CONSTRAINT "fk_tipos_materiales" TO "materiales_id_tipo_fkey";

-- RenameForeignKey
ALTER TABLE "materiales" RENAME CONSTRAINT "fk_usuarios_materiales" TO "materiales_id_usuario_fkey";

-- RenameForeignKey
ALTER TABLE "usuarios" RENAME CONSTRAINT "fk_roles_usuarios" TO "usuarios_admin_fkey";

-- AddForeignKey
ALTER TABLE "competiciones" ADD CONSTRAINT "competiciones_id_deporte_fkey" FOREIGN KEY ("id_deporte") REFERENCES "deportes"("id_deporte") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competiciones" ADD CONSTRAINT "competiciones_id_federacion_fkey" FOREIGN KEY ("id_federacion") REFERENCES "federaciones"("id_federacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competiciones" ADD CONSTRAINT "competiciones_id_genero_fkey" FOREIGN KEY ("id_genero") REFERENCES "generos"("id_genero") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partidos" ADD CONSTRAINT "partidos_id_competicion_fkey" FOREIGN KEY ("id_competicion") REFERENCES "competiciones"("id_competicion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partidos" ADD CONSTRAINT "partidos_id_equipo_local_fkey" FOREIGN KEY ("id_equipo_local") REFERENCES "equipos"("id_equipo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partidos" ADD CONSTRAINT "partidos_id_equipo_visitante_fkey" FOREIGN KEY ("id_equipo_visitante") REFERENCES "equipos"("id_equipo") ON DELETE SET NULL ON UPDATE CASCADE;
