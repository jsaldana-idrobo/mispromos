import { z } from "zod";
import { BusinessType, DayOfWeek, PromotionType, UserRole } from "./enums";

export const idSchema = z.string().trim().min(1, "id requerido");

export const timestampSchema = z.string().datetime({
  offset: true,
  message: "Debe ser una fecha ISO con zona horaria",
});

const dayOfWeekEnum = z.enum(DayOfWeek);

export const userSchema = z.object({
  id: idSchema,
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(UserRole),
  createdAt: timestampSchema,
});

export const businessSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  slug: z.string().min(1),
  type: z.nativeEnum(BusinessType),
  categories: z.array(z.string()).default([]),
  description: z.string().optional(),
  instagram: z.string().optional(),
  ownerId: idSchema,
  verified: z.boolean().default(false),
  createdAt: timestampSchema,
});

export const openingHoursSchema = z.record(
  dayOfWeekEnum,
  z.array(
    z.object({
      start: z.string().regex(/^\d{2}:\d{2}$/),
      end: z.string().regex(/^\d{2}:\d{2}$/),
    })
  )
);

export const branchSchema = z.object({
  id: idSchema,
  businessId: idSchema,
  city: z.string().min(1),
  zone: z.string().optional(),
  address: z.string().min(1),
  lat: z.number().optional(),
  lng: z.number().optional(),
  phone: z.string().optional(),
  openingHours: openingHoursSchema.optional(),
  createdAt: timestampSchema,
});

export const promotionSchema = z.object({
  id: idSchema,
  businessId: idSchema,
  branchId: idSchema.nullable(),
  title: z.string().min(1),
  description: z.string().optional(),
  promoType: z.nativeEnum(PromotionType),
  value: z.union([z.number(), z.string()]).optional(),
  imageUrl: z.string().url().optional().nullable(),
  startDate: timestampSchema.nullable(),
  endDate: timestampSchema.nullable(),
  daysOfWeek: z.array(dayOfWeekEnum).min(1),
  startHour: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  endHour: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  active: z.boolean().default(true),
  createdAt: timestampSchema,
});

export const citySchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  countryCode: z.string().length(2),
  createdAt: timestampSchema,
});

export const categorySchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  slug: z.string().min(1),
  createdAt: timestampSchema,
});

export type User = z.infer<typeof userSchema>;
export type Business = z.infer<typeof businessSchema>;
export type Branch = z.infer<typeof branchSchema>;
export type Promotion = z.infer<typeof promotionSchema>;
export type City = z.infer<typeof citySchema>;
export type Category = z.infer<typeof categorySchema>;
