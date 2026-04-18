-- CreateTable
CREATE TABLE "email_otps" (
    "id_otp" SERIAL NOT NULL,
    "id_usuario" INTEGER,
    "email" VARCHAR(255) NOT NULL,
    "codigo_hash" VARCHAR(255) NOT NULL,
    "intent" VARCHAR(20) NOT NULL DEFAULT 'login',
    "expires_at" TIMESTAMP(0) NOT NULL,
    "consumed_at" TIMESTAMP(0),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_otps_pkey" PRIMARY KEY ("id_otp")
);

-- CreateIndex
CREATE INDEX "ix_email_otps_email" ON "email_otps"("email");

-- CreateIndex
CREATE INDEX "ix_email_otps_expires_at" ON "email_otps"("expires_at");

-- CreateIndex
CREATE INDEX "ix_email_otps_consumed_at" ON "email_otps"("consumed_at");

-- AddForeignKey
ALTER TABLE "email_otps" ADD CONSTRAINT "email_otps_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;
