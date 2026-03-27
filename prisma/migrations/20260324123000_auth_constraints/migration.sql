ALTER TABLE roles
  ADD CONSTRAINT roles_rol_key UNIQUE (rol);

ALTER TABLE usuarios
  ALTER COLUMN password TYPE VARCHAR(255);

ALTER TABLE usuarios
  ADD CONSTRAINT usuarios_email_key UNIQUE (email);
