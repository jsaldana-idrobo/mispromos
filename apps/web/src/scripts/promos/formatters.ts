type PromoVisual = {
  emoji: string;
  tone: string;
};

const promoTypeLabels: Record<string, string> = {
  discount: "Descuento",
  "2x1": "2x1",
  combo: "Combo",
  other: "Otra",
};

const toneMap: Record<string, PromoVisual> = {
  pizza: { emoji: "🍕", tone: "promo-tone-sunset" },
  hamburguesas: { emoji: "🍔", tone: "promo-tone-berry" },
  sushi: { emoji: "🍣", tone: "promo-tone-sage" },
  tacos: { emoji: "🌮", tone: "promo-tone-sunrise" },
  parrilla: { emoji: "🥩", tone: "promo-tone-ember" },
  pollo: { emoji: "🍗", tone: "promo-tone-honey" },
  "comidas-rapidas": { emoji: "🍟", tone: "promo-tone-sunset" },
  asiatica: { emoji: "🥢", tone: "promo-tone-sage" },
  mexicana: { emoji: "🌶️", tone: "promo-tone-ember" },
  cafeteria: { emoji: "☕️", tone: "promo-tone-honey" },
  postres: { emoji: "🍰", tone: "promo-tone-berry" },
  panaderia: { emoji: "🥐", tone: "promo-tone-honey" },
  bebidas: { emoji: "🥤", tone: "promo-tone-sky" },
  arepas: { emoji: "🫓", tone: "promo-tone-sunrise" },
  mariscos: { emoji: "🦐", tone: "promo-tone-sky" },
  helados: { emoji: "🍦", tone: "promo-tone-berry" },
  vegana: { emoji: "🥗", tone: "promo-tone-lime" },
  ensaladas: { emoji: "🥬", tone: "promo-tone-lime" },
  desayunos: { emoji: "🥞", tone: "promo-tone-honey" },
};

const defaultTone: PromoVisual = { emoji: "✨", tone: "promo-tone-sunrise" };

const dayLabels: Record<string, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

const orderedDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const getPromoVisual = (category?: string) => {
  if (!category) return defaultTone;
  return toneMap[category] ?? defaultTone;
};

export const formatPromoType = (type: string) => promoTypeLabels[type] ?? type;

export const formatDaysShort = (days: string[]) =>
  orderedDays
    .filter((day) => days.includes(day))
    .map((day) => dayLabels[day] ?? day)
    .join(" · ");

export const formatDaysFull = (days: string[]) => {
  const daySet = new Set(days);
  const hasWeekdays =
    ["monday", "tuesday", "wednesday", "thursday", "friday"].every((day) =>
      daySet.has(day),
    ) && daySet.size === 5;
  const hasWeekend =
    ["friday", "saturday", "sunday"].every((day) => daySet.has(day)) &&
    daySet.size === 3;
  if (daySet.size === 7) {
    return "Todos los días";
  }
  if (hasWeekdays) {
    return "Entre semana";
  }
  if (hasWeekend) {
    return "Fin de semana";
  }
  return orderedDays
    .filter((day) => daySet.has(day))
    .map((day) => dayLabels[day] ?? day)
    .join(", ");
};
