# mispromos

Plataforma para centralizar promociones activas de negocios locales. El foco inicial es Palmira (Colombia) y restaurantes, pero la arquitectura busca escalar a múltiples ciudades, países y tipos de negocio.

## Estructura del monorepo (pnpm workspaces)

```
mispromos/
├── apps/
│   ├── api/      → Backend (NestJS + TS + MongoDB)
│   └── web/      → Frontend (Astro + Tailwind + TS)
├── packages/
│   └── shared/   → Tipos, enums y esquemas compartidos (Zod + TS)
├── pnpm-workspace.yaml
└── package.json
```

## Decisiones base

- TypeScript estricto en todo el stack.
- Validaciones compartidas con Zod desde `packages/shared`.
- API versionada desde `/api/v1/...` y auth con JWT en cookies HTTP-only.
- Arquitectura lista para múltiples ciudades, países y tipos de negocio, con soporte para promociones globales (sin `branchId`).

## Workspaces y scripts

- `packages/shared`: enums y esquemas Zod compartidos. `pnpm --filter @mispromos/shared build`
- `apps/api`: NestJS. `pnpm --filter @mispromos/api dev`
- `apps/web`: Astro + Tailwind. `pnpm --filter @mispromos/web dev`

> Nota: se requiere pnpm (via corepack) para instalar dependencias. Si hay restricciones de red, instala manualmente la versión `9.12.0` o configura el mirror corporativo.

## Próximos pasos sugeridos

1. Inicializar los proyectos en `apps/api` (NestJS) y `apps/web` (Astro) usando pnpm.
2. Conectar `packages/shared` como dependencia local en ambos proyectos.
3. Definir flujos de CI/CD y verificación (lint, tests, type-check).
4. Implementar los primeros endpoints y vistas del MVP (CRUD de negocios, sedes y promociones; consulta de promociones activas por ciudad).
