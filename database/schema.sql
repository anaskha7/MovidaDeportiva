-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "roles" (
    "admin" SERIAL NOT NULL,
    "rol" VARCHAR(20) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("admin")
);

-- CreateTable
CREATE TABLE "tipos" (
    "id_tipo" SERIAL NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,

    CONSTRAINT "tipos_pkey" PRIMARY KEY ("id_tipo")
);

-- CreateTable
CREATE TABLE "estados" (
    "id_estado" SERIAL NOT NULL,
    "estado" VARCHAR(30) NOT NULL,

    CONSTRAINT "estados_pkey" PRIMARY KEY ("id_estado")
);

-- CreateTable
CREATE TABLE "generos" (
    "id_genero" SERIAL NOT NULL,
    "nombre" VARCHAR(20) NOT NULL,

    CONSTRAINT "generos_pkey" PRIMARY KEY ("id_genero")
);

-- CreateTable
CREATE TABLE "deportes" (
    "id_deporte" SERIAL NOT NULL,
    "nombre_deporte" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(234),

    CONSTRAINT "deportes_pkey" PRIMARY KEY ("id_deporte")
);

-- CreateTable
CREATE TABLE "directos" (
    "id_directo" SERIAL NOT NULL,
    "nombre_directo" VARCHAR(80),
    "descripcion" VARCHAR(160),
    "url_streaming" VARCHAR(255) NOT NULL,
    "estado" VARCHAR(20) NOT NULL,
    "fecha_programada" TIMESTAMP(0),

    CONSTRAINT "directos_pkey" PRIMARY KEY ("id_directo")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "fecha_registro" DATE NOT NULL,
    "admin" INTEGER NOT NULL,
    "bloqueado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "federaciones" (
    "id_federacion" SERIAL NOT NULL,
    "nombre_federacion" VARCHAR(20) NOT NULL,
    "genero_federacion" VARCHAR(20) NOT NULL,
    "id_deporte" INTEGER NOT NULL,

    CONSTRAINT "federaciones_pkey" PRIMARY KEY ("id_federacion")
);

-- CreateTable
CREATE TABLE "equipos" (
    "id_equipo" SERIAL NOT NULL,
    "nombre_equipo" VARCHAR(30) NOT NULL,
    "id_deporte" INTEGER NOT NULL,
    "id_federacion" INTEGER NOT NULL,
    "id_genero" INTEGER NOT NULL,

    CONSTRAINT "equipos_pkey" PRIMARY KEY ("id_equipo")
);

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

-- CreateTable
CREATE TABLE "materiales" (
    "id_material" SERIAL NOT NULL,
    "fecha_inicio" TIMESTAMP(0) NOT NULL,
    "fecha_fin" TIMESTAMP(0) NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_tipo" INTEGER NOT NULL,
    "id_estado" INTEGER NOT NULL,

    CONSTRAINT "materiales_pkey" PRIMARY KEY ("id_material")
);

-- CreateTable
CREATE TABLE "comentarios" (
    "id_comentario" SERIAL NOT NULL,
    "fecha_publicacion" DATE NOT NULL,
    "minuto_video" VARCHAR(20) NOT NULL,
    "contenido" VARCHAR(50) NOT NULL,
    "id_directo" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "comentarios_pkey" PRIMARY KEY ("id_comentario")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_rol_key" ON "roles"("rol");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "ix_usuarios_admin" ON "usuarios"("admin");

-- CreateIndex
CREATE INDEX "ix_federaciones_id_deporte" ON "federaciones"("id_deporte");

-- CreateIndex
CREATE INDEX "ix_equipos_id_deporte" ON "equipos"("id_deporte");

-- CreateIndex
CREATE INDEX "ix_equipos_id_federacion" ON "equipos"("id_federacion");

-- CreateIndex
CREATE INDEX "ix_equipos_id_genero" ON "equipos"("id_genero");

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

-- CreateIndex
CREATE INDEX "ix_materiales_id_usuario" ON "materiales"("id_usuario");

-- CreateIndex
CREATE INDEX "ix_materiales_id_tipo" ON "materiales"("id_tipo");

-- CreateIndex
CREATE INDEX "ix_materiales_id_estado" ON "materiales"("id_estado");

-- CreateIndex
CREATE INDEX "ix_comentarios_id_directo" ON "comentarios"("id_directo");

-- CreateIndex
CREATE INDEX "ix_comentarios_id_usuario" ON "comentarios"("id_usuario");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_admin_fkey" FOREIGN KEY ("admin") REFERENCES "roles"("admin") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "federaciones" ADD CONSTRAINT "federaciones_id_deporte_fkey" FOREIGN KEY ("id_deporte") REFERENCES "deportes"("id_deporte") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipos" ADD CONSTRAINT "equipos_id_deporte_fkey" FOREIGN KEY ("id_deporte") REFERENCES "deportes"("id_deporte") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipos" ADD CONSTRAINT "equipos_id_federacion_fkey" FOREIGN KEY ("id_federacion") REFERENCES "federaciones"("id_federacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipos" ADD CONSTRAINT "equipos_id_genero_fkey" FOREIGN KEY ("id_genero") REFERENCES "generos"("id_genero") ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "solicitudes_servicio" ADD CONSTRAINT "solicitudes_servicio_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_notifications" ADD CONSTRAINT "app_notifications_id_usuario_destino_fkey" FOREIGN KEY ("id_usuario_destino") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_notifications" ADD CONSTRAINT "app_notifications_id_actor_usuario_fkey" FOREIGN KEY ("id_actor_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_id_usuario_actor_fkey" FOREIGN KEY ("id_usuario_actor") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materiales" ADD CONSTRAINT "materiales_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materiales" ADD CONSTRAINT "materiales_id_tipo_fkey" FOREIGN KEY ("id_tipo") REFERENCES "tipos"("id_tipo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materiales" ADD CONSTRAINT "materiales_id_estado_fkey" FOREIGN KEY ("id_estado") REFERENCES "estados"("id_estado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_id_directo_fkey" FOREIGN KEY ("id_directo") REFERENCES "directos"("id_directo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

