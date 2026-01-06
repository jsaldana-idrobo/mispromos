# @mispromos/shared

Tipos, enums y esquemas Zod compartidos entre el frontend y backend.

## Modelos incluidos
- Usuarios con roles (`USER`, `BUSINESS_OWNER`, `ADMIN`).
- Negocios con tipos (`restaurant`, `shop`, `service`, `bar`).
- Sedes (branches) separadas del negocio para escalar a múltiples ciudades.
- Promociones con soporte para promos globales (sin `branchId`) y por sede.
- Catálogo de ciudades y categorías.

## Uso

Instalar dependencias y compilar declaraciones:

```bash
pnpm install
pnpm --filter @mispromos/shared build
```

Importar los esquemas y tipos:

```ts
import { promotionSchema, type Promotion } from "@mispromos/shared";
```
