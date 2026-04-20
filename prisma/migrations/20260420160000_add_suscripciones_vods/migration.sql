CREATE TABLE "suscripciones" (
    "id_suscripcion" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "plan" VARCHAR(40) NOT NULL,
    "estado" VARCHAR(20) NOT NULL,
    "fecha_inicio" TIMESTAMP(0) NOT NULL,
    "fecha_fin" TIMESTAMP(0),
    "fecha_renovacion" TIMESTAMP(0),

    CONSTRAINT "suscripciones_pkey" PRIMARY KEY ("id_suscripcion")
);

CREATE TABLE "vods" (
    "id_vod" SERIAL NOT NULL,
    "id_partido" INTEGER,
    "cloudflare_id" VARCHAR(120) NOT NULL,
    "duracion_segundos" INTEGER,
    "estado" VARCHAR(20) NOT NULL,

    CONSTRAINT "vods_pkey" PRIMARY KEY ("id_vod")
);

CREATE UNIQUE INDEX "vods_cloudflare_id_key" ON "vods"("cloudflare_id");
CREATE INDEX "ix_suscripciones_id_usuario" ON "suscripciones"("id_usuario");
CREATE INDEX "ix_suscripciones_estado" ON "suscripciones"("estado");
CREATE INDEX "ix_vods_id_partido" ON "vods"("id_partido");
CREATE INDEX "ix_vods_estado" ON "vods"("estado");

ALTER TABLE "suscripciones"
ADD CONSTRAINT "suscripciones_id_usuario_fkey"
FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "vods"
ADD CONSTRAINT "vods_id_partido_fkey"
FOREIGN KEY ("id_partido") REFERENCES "partidos"("id_partido")
ON DELETE SET NULL ON UPDATE CASCADE;
