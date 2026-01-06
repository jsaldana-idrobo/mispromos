export const UserRole = {
  USER: "USER",
  BUSINESS_OWNER: "BUSINESS_OWNER",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const BusinessType = {
  RESTAURANT: "restaurant",
  SHOP: "shop",
  SERVICE: "service",
  BAR: "bar",
} as const;

export type BusinessType = (typeof BusinessType)[keyof typeof BusinessType];

export const PromotionType = {
  DISCOUNT: "discount",
  TWO_FOR_ONE: "2x1",
  COMBO: "combo",
  OTHER: "other",
} as const;

export type PromotionType = (typeof PromotionType)[keyof typeof PromotionType];

export const DayOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type DayOfWeek = (typeof DayOfWeek)[number];
