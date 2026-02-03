import type { Model } from "mongoose";

type SlugRecord = { slug: string };

export const normalizeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/(^-|-$)/g, "");

export const buildUniqueSlug = async <T extends SlugRecord>(
  model: Model<T>,
  baseValue: string,
) => {
  const base = normalizeSlug(baseValue) || "negocio";
  let slug = base;
  let counter = 2;
  while (await model.exists({ slug })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }
  return slug;
};
