-- AlterTable
ALTER TABLE "directos" ADD COLUMN     "descripcion" VARCHAR(160),
ADD COLUMN     "fecha_programada" TIMESTAMP(0),
ADD COLUMN     "nombre_directo" VARCHAR(80),
ALTER COLUMN "url_streaming" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "bloqueado" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "solicitudes_servicio" (
    "id_solicitud" SERIAL NOT NULL,
    "id_usuario" INTEGER,
    "nombre_contacto" VARCHAR(80) NOT NULL,
    "email_contacto" VARCHAR(255) NOT NULL,
    "servicios" VARCHAR(255) NOT NULL,
    "fecha_servicio" DATE NOT NULL,
    "horas_servicio" INTEGER NOT NULL,
    "detalles" VARCHAR(500),
    "extras" VARCHAR(255),
    "total_estimado" DECIMAL(10,2) NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    "fecha_creacion" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "solicitudes_servicio_pkey" PRIMARY KEY ("id_solicitud")
);

-- CreateTable
CREATE TABLE "app_notifications" (
    "id_notificacion" SERIAL NOT NULL,
    "titulo" VARCHAR(80),
    "mensaje" VARCHAR(255) NOT NULL,
    "tipo" VARCHAR(20) NOT NULL DEFAULT 'info',
    "actor" VARCHAR(80),
    "id_usuario_destino" INTEGER,
    "rol_destino" VARCHAR(20),
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "enlace" VARCHAR(255),
    "fecha_creacion" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_actor_usuario" INTEGER,

    CONSTRAINT "app_notifications_pkey" PRIMARY KEY ("id_notificacion")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id_log" SERIAL NOT NULL,
    "accion" VARCHAR(40) NOT NULL,
    "entidad" VARCHAR(40) NOT NULL,
    "entidad_id" INTEGER,
    "descripcion" VARCHAR(255) NOT NULL,
    "metadata" JSONB,
    "fecha_creacion" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario_actor" INTEGER,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id_log")
);

-- CreateIndex
CREATE INDEX "ix_solicitudes_servicio_id_usuario" ON "solicitudes_servicio"("id_usuario");

-- CreateIndex
CREATE INDEX "ix_solicitudes_servicio_estado" ON "solicitudes_servicio"("estado");

-- CreateIndex
CREATE INDEX "ix_solicitudes_servicio_fecha_creacion" ON "solicitudes_servicio"("fecha_creacion");

-- CreateIndex
CREATE INDEX "ix_app_notifications_id_usuario_destino" ON "app_notifications"("id_usuario_destino");

-- CreateIndex
CREATE INDEX "ix_app_notifications_rol_destino" ON "app_notifications"("rol_destino");

-- CreateIndex
CREATE INDEX "ix_app_notifications_leida" ON "app_notifications"("leida");

-- CreateIndex
CREATE INDEX "ix_app_notifications_fecha_creacion" ON "app_notifications"("fecha_creacion");

-- CreateIndex
CREATE INDEX "ix_audit_logs_id_usuario_actor" ON "audit_logs"("id_usuario_actor");

-- CreateIndex
CREATE INDEX "ix_audit_logs_entidad" ON "audit_logs"("entidad");

-- CreateIndex
CREATE INDEX "ix_audit_logs_fecha_creacion" ON "audit_logs"("fecha_creacion");

-- AddForeignKey
ALTER TABLE "solicitudes_servicio" ADD CONSTRAINT "solicitudes_servicio_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_notifications" ADD CONSTRAINT "app_notifications_id_usuario_destino_fkey" FOREIGN KEY ("id_usuario_destino") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_notifications" ADD CONSTRAINT "app_notifications_id_actor_usuario_fkey" FOREIGN KEY ("id_actor_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_id_usuario_actor_fkey" FOREIGN KEY ("id_usuario_actor") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;
