# Web (Astro)

Frontend Astro + Tailwind listo para comenzar el MVP público.

## Scripts

- `pnpm --filter @mispromos/web dev` → servidor de desarrollo
- `pnpm --filter @mispromos/web build` → build estático
- `pnpm --filter @mispromos/web preview` → sirve el build

## Qué incluye

- Astro configurado con Tailwind (`astro.config.mjs` + `tailwind.config.mjs`).
- Path alias a `@mispromos/shared` para reutilizar enums y esquemas.
- Página inicial en `src/pages/index.astro`.

## Pendientes siguientes

- Maquetar la landing y selector de ciudad.
- Listado de promociones activas consumiendo la API.
- Flujo de auth y dashboard para negocios.
