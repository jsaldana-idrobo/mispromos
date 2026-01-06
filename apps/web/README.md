# Web (Astro)

Frontend Astro + Tailwind listo para comenzar el MVP público.

## Scripts

- `pnpm --filter @mispromos/web dev` → servidor de desarrollo
- `pnpm --filter @mispromos/web build` → build estático
- `pnpm --filter @mispromos/web preview` → sirve el build

## Qué incluye

- Astro configurado con Tailwind (`astro.config.mjs` + `tailwind.config.mjs`).
- Path alias a `@mispromos/shared` para reutilizar enums y esquemas.
- Landing en `src/pages/index.astro`.
- Listado público en `src/pages/promos.astro`.
- Login y registro en `src/pages/login.astro` y `src/pages/register.astro`.
- Dashboard de negocios en `src/pages/dashboard.astro`.
- Panel admin de ciudades/categorías en `src/pages/dashboard.astro` (solo ADMIN).
- Acciones rápidas para editar/eliminar negocios, sedes y promociones desde el dashboard.

## Pendientes siguientes

- Mejoras de UX en dashboard (edición).
- Filtros avanzados en promos (categorías, tipo de negocio, búsqueda).

## Despliegue en Vercel (Web)

- Crear un proyecto en Vercel apuntando a `apps/web` como root.
- Variables requeridas:
  - `PUBLIC_API_BASE` (URL del API en Vercel, ej: `https://api-mispromos.vercel.app/api/v1`)
- `vercel.json` ya preparado en `apps/web/vercel.json`.
