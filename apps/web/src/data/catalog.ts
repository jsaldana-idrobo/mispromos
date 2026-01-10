export const businessTypes = ["restaurant", "shop", "service", "bar"] as const;
export const promoTypes = ["discount", "2x1", "combo", "other"] as const;

export const businessTypeLabels: Record<
  (typeof businessTypes)[number],
  string
> = {
  restaurant: "Restaurante",
  shop: "Tienda",
  service: "Servicio",
  bar: "Bar",
};

export const promoTypeLabels: Record<(typeof promoTypes)[number], string> = {
  discount: "Descuento",
  "2x1": "2x1",
  combo: "Combo",
  other: "Otra",
};
export const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;
