# API (NestJS)

Backend NestJS listo para iniciar con MongoDB y validaciones compartidas desde `@mispromos/shared`.

## Scripts

- `pnpm --filter @mispromos/api dev` → `nest start --watch`
- `pnpm --filter @mispromos/api build` → compila a `dist`
- `pnpm --filter @mispromos/api lint` → lint básico (requiere instalar dependencias)

## Endpoints iniciales

- `GET /api/v1/health` → chequeo de salud simple.

## Configuración pendiente

- Conectar a MongoDB (Mongoose) y cargar variables desde `.env`.
- Autenticación con JWT en cookies HTTP-only.
- Modelado de entidades (User, Business, Branch, Promotion) alineadas a `@mispromos/shared`.
