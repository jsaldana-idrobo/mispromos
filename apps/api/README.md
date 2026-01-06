# API (NestJS)

Backend NestJS listo para iniciar con MongoDB y validaciones compartidas desde `@mispromos/shared`.

## Scripts

- `pnpm --filter @mispromos/api dev` → `nest start --watch`
- `pnpm --filter @mispromos/api build` → compila a `dist`
- `pnpm --filter @mispromos/api lint` → lint básico (requiere instalar dependencias)

## Endpoints iniciales

- `GET /api/v1/health` → chequeo de salud simple.
- `POST /api/v1/auth/register` → registro (setea cookie auth).
- `POST /api/v1/auth/login` → login (setea cookie auth).
- `POST /api/v1/auth/logout` → logout (limpia cookie).
- `GET /api/v1/auth/me` → retorna id/role desde la cookie.
- `PATCH /api/v1/auth/users/:id/role` → cambia rol (solo ADMIN).
- `POST /api/v1/businesses` → crear negocio.
- `GET /api/v1/businesses` → listar negocios.
- `GET /api/v1/businesses/mine` → listar negocios del dueño autenticado.
- `GET /api/v1/businesses/:id` → detalle de negocio.
- `PATCH /api/v1/businesses/:id` → actualizar negocio.
- `DELETE /api/v1/businesses/:id` → eliminar negocio.
- `POST /api/v1/branches` → crear sede.
- `GET /api/v1/branches` → listar sedes.
- `GET /api/v1/branches?businessId=...` → listar sedes por negocio.
- `GET /api/v1/branches/:id` → detalle de sede.
- `PATCH /api/v1/branches/:id` → actualizar sede.
- `DELETE /api/v1/branches/:id` → eliminar sede.
- `POST /api/v1/promotions` → crear promoción.
- `GET /api/v1/promotions` → listar promociones.
- `GET /api/v1/promotions?businessId=...` → listar promociones por negocio.
- `GET /api/v1/promotions/:id` → detalle de promoción.
- `PATCH /api/v1/promotions/:id` → actualizar promoción.
- `DELETE /api/v1/promotions/:id` → eliminar promoción.
- `GET /api/v1/promotions/active?city=Palmira&at=2025-01-01T20:00:00-05:00` → promociones activas en una ciudad y fecha/hora.
- `GET /api/v1/promotions/active?city=Palmira&promoType=2x1&category=pizza` → promociones activas filtradas.
- `GET /api/v1/promotions/active?city=Palmira&businessType=restaurant&q=pizza` → promos activas con filtros avanzados.
- `GET /api/v1/cities` → listar ciudades.
- `GET /api/v1/categories` → listar categorías.
- `POST /api/v1/cities` → crear ciudad (ADMIN).
- `PATCH /api/v1/cities/:id` → actualizar ciudad (ADMIN).
- `DELETE /api/v1/cities/:id` → eliminar ciudad (ADMIN).
- `POST /api/v1/categories` → crear categoría (ADMIN).
- `PATCH /api/v1/categories/:id` → actualizar categoría (ADMIN).
- `DELETE /api/v1/categories/:id` → eliminar categoría (ADMIN).

## Configuración pendiente

- Crear `.env` (ver `.env.example`) y configurar `MONGODB_URI`.
- Autenticación con JWT en cookies HTTP-only.
- Modelado de entidades (User, Business, Branch, Promotion) alineadas a `@mispromos/shared`.

### Seed opcional

- `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD` crean un usuario ADMIN si no existe.
- `pnpm --filter @mispromos/api seed` → carga ciudades y categorías base.

## Despliegue en Vercel (API)

- Crear un proyecto en Vercel apuntando a `apps/api` como root.
- Variables requeridas:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN_SECONDS`
  - `JWT_COOKIE_MAX_AGE_DAYS`
  - `WEB_ORIGIN` (URL del frontend en Vercel)
  - `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD` (opcional)
- `vercel.json` ya preparado en `apps/api/vercel.json`.
