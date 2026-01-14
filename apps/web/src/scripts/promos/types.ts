export type BusinessSummary = {
  _id: string;
  name: string;
  slug: string;
  categories?: string[];
  instagram?: string;
};

export type Promotion = {
  _id: string;
  businessId: string;
  branchId?: string | null;
  title: string;
  description?: string;
  promoType: string;
  value?: string | number;
  imageUrl?: string | null;
  startDate: string | null;
  endDate: string | null;
  daysOfWeek: string[];
  startHour: string | null;
  endHour: string | null;
  active?: boolean;
  featured?: boolean;
  business?: BusinessSummary | null;
};

export type PromotionsResponse = {
  items: Promotion[];
  total: number;
};

export type Category = {
  _id: string;
  name: string;
  slug: string;
};

export type City = {
  _id: string;
  name: string;
  countryCode: string;
};
