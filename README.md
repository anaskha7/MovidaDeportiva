# Movida Deportiva TV

Aplicación Next.js con PostgreSQL, Prisma, login propio y acceso con Google.

## Base local con Docker

La base local recomendada para desarrollo está preparada en Docker Compose.

Nota:
El contenedor publica PostgreSQL en `localhost:5433` para no chocar con una instalación local que ya esté usando `5432`.

### 1. Preparar variables de entorno

Usa `.env.example` como base:

```bash
cp .env.example .env
```

Rellena después tus claves reales de Google OAuth si las necesitas.

Para local, `DATABASE_URL` y `DIRECT_URL` pueden apuntar a la misma base Docker.
Para Neon/Vercel:
- `DATABASE_URL`: URL pooled para la app en runtime
- `DIRECT_URL`: URL directa para migraciones y Prisma CLI

### Alternar entre base local y Neon

El proyecto queda preparado para mantener dos perfiles de conexión:

- `.env.db.local`
- `.env.db.neon`

Scripts disponibles:

```bash
npm run db:target
npm run db:use:local
npm run db:use:neon
npm run db:save:local
npm run db:save:neon
```

Uso recomendado:

- `npm run db:use:local` cambia `.env` para usar la base local
- `npm run db:use:neon` cambia `.env` para usar Neon
- `npm run db:save:local` guarda en `.env.db.local` la conexión actual
- `npm run db:save:neon` guarda en `.env.db.neon` la conexión actual
- `npm run db:target` muestra qué perfil está activo

Los archivos `.env.db.local` y `.env.db.neon` no se suben a Git.

### 2. Levantar PostgreSQL

```bash
npm run db:up
```

Ver logs:

```bash
npm run db:logs
```

Parar contenedor:

```bash
npm run db:down
```

Parar y borrar volumen:

```bash
npm run db:down:volumes
```

### 3. Aplicar migraciones

```bash
npm run db:migrate
```

### 4. Cargar datos base de desarrollo

```bash
npm run db:seed
```

Esto crea:
- roles base: `admin`, `user`, `suscriptor`
- géneros base: `masculino`, `femenino`, `mixto`
- usuarios demo

### 5. Arrancar la app

```bash
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)  
Swagger: [http://localhost:3000/swagger](http://localhost:3000/swagger)

### 6. Ver la base de datos

```bash
npm run db:studio
```

## Usuarios de prueba

- `admin@movida.tv` / `Admin12345!`
- `user@movida.tv` / `User12345!`
- `suscriptor@movida.tv` / `Suscriptor12345!`

## Despliegue en Neon + Vercel

### 1. Crear la base de datos en Neon

En Neon crea un proyecto PostgreSQL nuevo y copia dos cadenas de conexión:

- `DATABASE_URL`: conexión pooled para runtime
- `DIRECT_URL`: conexión directa para migraciones y seed

En Prisma CLI ya está preparado este patrón en `prisma.config.ts`.

### 2. Variables de entorno en Vercel

Añade estas variables en el proyecto de Vercel:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require&channel_binding=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require&channel_binding=require"
NEXTAUTH_URL="https://TU-PROYECTO.vercel.app"
NEXTAUTH_SECRET="GENERA_UN_SECRETO_LARGO_Y_ALEATORIO"
GOOGLE_CLIENT_ID="TU_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="TU_GOOGLE_CLIENT_SECRET"
```

Notas:

- `DATABASE_URL` se usa en runtime por la app.
- `DIRECT_URL` se usa para `prisma migrate deploy` y `prisma db seed`.
- Si usas dominio propio, `NEXTAUTH_URL` debe ser ese dominio final.

### 3. Callback de Google OAuth

En Google Cloud Console configura estos valores:

- JavaScript origin:
  - `https://TU-PROYECTO.vercel.app`
- Redirect URI:
  - `https://TU-PROYECTO.vercel.app/api/auth/callback/google`

Si usas dominio propio, sustituye el dominio de Vercel por el dominio final.

### 4. Aplicar migraciones y seed en la base remota

Con las variables cargadas localmente o en CI:

```bash
npm run db:migrate
npm run db:seed
```

Eso deja creados:

- roles base: `admin`, `user`, `suscriptor`
- géneros base: `masculino`, `femenino`, `mixto`
- usuarios demo:
  - `admin@movida.tv` / `Admin12345!`
  - `user@movida.tv` / `User12345!`
  - `suscriptor@movida.tv` / `Suscriptor12345!`

### 5. Qué queda todavía en mock

Aunque la autenticación y varias partes del backoffice ya usan PostgreSQL, todavía quedan datos mock en algunas áreas:

- vídeos
- partidos en directo
- mensajes/chat
- categorías y federaciones

Eso no bloquea el despliegue, pero sí significa que parte del contenido todavía no es administrable desde base de datos.
