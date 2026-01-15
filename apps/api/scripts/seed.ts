import { MongoClient, type Collection, type Filter, type ObjectId } from "mongodb";
import { config } from "dotenv";
import path from "node:path";
import bcrypt from "bcryptjs";
import { BusinessType, PromotionType, UserRole, type DayOfWeek } from "@mispromos/shared";

config({ path: path.resolve(__dirname, "..", ".env") });

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI no está configurado");
}

const defaultCities = [
  { name: "Palmira", countryCode: "CO" },
  { name: "Cali", countryCode: "CO" },
  { name: "Bogotá", countryCode: "CO" },
  { name: "Medellín", countryCode: "CO" },
  { name: "Barranquilla", countryCode: "CO" },
  { name: "Cartagena", countryCode: "CO" },
  { name: "Bucaramanga", countryCode: "CO" },
  { name: "Pereira", countryCode: "CO" },
];

const defaultCategories = [
  { name: "Pizza", slug: "pizza" },
  { name: "Hamburguesas", slug: "hamburguesas" },
  { name: "Sushi", slug: "sushi" },
  { name: "Tacos", slug: "tacos" },
  { name: "Parrilla", slug: "parrilla" },
  { name: "Pollo", slug: "pollo" },
  { name: "Comidas rapidas", slug: "comidas-rapidas" },
  { name: "Asiatica", slug: "asiatica" },
  { name: "Mexicana", slug: "mexicana" },
  { name: "Cafetería", slug: "cafeteria" },
  { name: "Postres", slug: "postres" },
  { name: "Panaderia", slug: "panaderia" },
  { name: "Bebidas", slug: "bebidas" },
  { name: "Arepas", slug: "arepas" },
  { name: "Mariscos", slug: "mariscos" },
  { name: "Helados", slug: "helados" },
  { name: "Vegana", slug: "vegana" },
  { name: "Ensaladas", slug: "ensaladas" },
  { name: "Desayunos", slug: "desayunos" },
];

const seedBusinessOwnerPassword = process.env.SEED_BUSINESS_OWNER_PASSWORD;
if (!seedBusinessOwnerPassword) {
  throw new Error("SEED_BUSINESS_OWNER_PASSWORD no está configurado");
}
const seedBusinessOwner = {
  email: process.env.SEED_BUSINESS_OWNER_EMAIL ?? "negocio@demo.com",
  password: seedBusinessOwnerPassword,
};

type SeedBusiness = {
  name: string;
  slug: string;
  type: (typeof BusinessType)[keyof typeof BusinessType];
  categories: string[];
  description: string;
  instagram?: string;
  branches: Array<{
    city: string;
    zone?: string;
    address: string;
    lat?: number;
    lng?: number;
    phone?: string;
  }>;
  promotions: Array<{
    title: string;
    description: string;
    promoType: (typeof PromotionType)[keyof typeof PromotionType];
    value: number | string;
    daysOfWeek: DayOfWeek[];
    startHour: string;
    endHour: string;
    branchIndex?: number;
  }>;
};

type WeeklyPromo = {
  day: DayOfWeek;
  title: (item: string) => string;
  description: (item: string) => string;
  promoType: (typeof PromotionType)[keyof typeof PromotionType];
  value: number | string;
};

const weeklySchedule: WeeklyPromo[] = [
  {
    day: "monday",
    title: (item) => `Lunes 2x1 de ${item}`,
    description: (item) => `Solo por hoy: 2x1 en ${item}.`,
    promoType: PromotionType.TWO_FOR_ONE,
    value: "2x1",
  },
  {
    day: "tuesday",
    title: (item) => `Martes combo de ${item}`,
    description: (item) => `Combo especial con ${item} y bebida.`,
    promoType: PromotionType.COMBO,
    value: "combo",
  },
  {
    day: "wednesday",
    title: (item) => `Miércoles 20% OFF en ${item}`,
    description: (item) => `Descuento solo hoy en ${item} seleccionado.`,
    promoType: PromotionType.DISCOUNT,
    value: 20,
  },
  {
    day: "thursday",
    title: (item) => `Jueves especial ${item}`,
    description: (item) => `Promo especial de la casa en ${item}.`,
    promoType: PromotionType.OTHER,
    value: "especial",
  },
  {
    day: "friday",
    title: (item) => `Viernes familiar de ${item}`,
    description: (item) => `Ideal para compartir en ${item}.`,
    promoType: PromotionType.COMBO,
    value: "combo",
  },
  {
    day: "saturday",
    title: (item) => `Sábado 2x1 en ${item}`,
    description: (item) => `Promo de fin de semana en ${item}.`,
    promoType: PromotionType.TWO_FOR_ONE,
    value: "2x1",
  },
  {
    day: "sunday",
    title: (item) => `Domingo 15% OFF en ${item}`,
    description: (item) => `Cierra la semana con ${item} en descuento.`,
    promoType: PromotionType.DISCOUNT,
    value: 15,
  },
];

const buildWeeklyPromos = (
  itemLabel: string,
  branchCount: number
): SeedBusiness["promotions"] =>
  weeklySchedule.map((promo, index) => ({
    title: promo.title(itemLabel),
    description: promo.description(itemLabel),
    promoType: promo.promoType,
    value: promo.value,
    daysOfWeek: [promo.day],
    startHour: "00:00",
    endHour: "23:59",
    branchIndex: branchCount > 1 ? index % branchCount : 0,
  }));
const seedBusinesses: SeedBusiness[] = [
  {
    name: "La Brasa Palmira",
    slug: "la-brasa-palmira",
    type: BusinessType.RESTAURANT,
    categories: ["parrilla", "pollo"],
    description: "Parrilla criolla y pollo asado con combos familiares.",
    instagram: "labrasapalmira",
    branches: [
      {
        city: "Palmira",
        zone: "Centro",
        address: "Cra 28 #30-15",
        lat: 3.5342,
        lng: -76.3037,
        phone: "+57 300 111 2233",
      },
    ],
    promotions: buildWeeklyPromos("parrilla", 1),
  },
  {
    name: "Súper Burger 24",
    slug: "super-burger-24",
    type: BusinessType.RESTAURANT,
    categories: ["hamburguesas", "comidas-rapidas"],
    description: "Hamburguesas artesanales y papas cargadas.",
    instagram: "superburger24",
    branches: [
      {
        city: "Palmira",
        zone: "Llanogrande",
        address: "Av 19 #42-80",
        lat: 3.5359,
        lng: -76.2945,
        phone: "+57 301 555 8899",
      },
    ],
    promotions: buildWeeklyPromos("hamburguesas", 1),
  },
  {
    name: "Sushi Tama",
    slug: "sushi-tama",
    type: BusinessType.RESTAURANT,
    categories: ["sushi", "asiatica"],
    description: "Rolls frescos y bowls con ingredientes locales.",
    instagram: "sushitama",
    branches: [
      {
        city: "Palmira",
        zone: "La Emilia",
        address: "Calle 47 #25-10",
        lat: 3.5415,
        lng: -76.3012,
        phone: "+57 302 777 1122",
      },
    ],
    promotions: buildWeeklyPromos("sushi", 1),
  },
  {
    name: "Taco Express Palmira",
    slug: "taco-express-palmira",
    type: BusinessType.RESTAURANT,
    categories: ["tacos", "mexicana"],
    description: "Tacos callejeros con salsas caseras.",
    instagram: "tacoexpresspalmira",
    branches: [
      {
        city: "Palmira",
        zone: "Parque Bolivar",
        address: "Calle 29 #28-44",
        lat: 3.5366,
        lng: -76.3031,
        phone: "+57 304 333 4455",
      },
    ],
    promotions: buildWeeklyPromos("tacos", 1),
  },
  {
    name: "Pizzeria Torino",
    slug: "pizzeria-torino",
    type: BusinessType.RESTAURANT,
    categories: ["pizza"],
    description: "Pizzas al horno de leña con masa madre.",
    instagram: "pizzeriatorino",
    branches: [
      {
        city: "Cali",
        zone: "San Fernando",
        address: "Calle 5 #32-18",
        lat: 3.4208,
        lng: -76.5476,
        phone: "+57 302 555 1200",
      },
      {
        city: "Bogotá",
        zone: "Chapinero",
        address: "Cra 11 #65-20",
        lat: 4.6476,
        lng: -74.0584,
        phone: "+57 305 444 8822",
      },
    ],
    promotions: buildWeeklyPromos("pizza", 2),
  },
  {
    name: "Parrilla 93",
    slug: "parrilla-93",
    type: BusinessType.RESTAURANT,
    categories: ["parrilla"],
    description: "Cortes premium y guarniciones clásicas.",
    instagram: "parrilla93",
    branches: [
      {
        city: "Bogotá",
        zone: "Zona G",
        address: "Calle 70 #5-32",
        lat: 4.6518,
        lng: -74.0565,
        phone: "+57 301 888 6677",
      },
    ],
    promotions: buildWeeklyPromos("parrilla", 1),
  },
  {
    name: "Pollo Dorado Cali",
    slug: "pollo-dorado-cali",
    type: BusinessType.RESTAURANT,
    categories: ["pollo", "comidas-rapidas"],
    description: "Pollo apanado y broaster con salsas caseras.",
    instagram: "pollodoradocali",
    branches: [
      {
        city: "Cali",
        zone: "Granada",
        address: "Av 6 #17-45",
        lat: 3.4516,
        lng: -76.5363,
        phone: "+57 300 888 9900",
      },
    ],
    promotions: buildWeeklyPromos("pollo", 1),
  },
  {
    name: "Tacos del Sur",
    slug: "tacos-del-sur",
    type: BusinessType.RESTAURANT,
    categories: ["tacos", "mexicana"],
    description: "Tacos y burritos con recetas del norte.",
    instagram: "tacosdelsur",
    branches: [
      {
        city: "Cali",
        zone: "San Antonio",
        address: "Cra 12 #4-55",
        lat: 3.4473,
        lng: -76.5431,
        phone: "+57 320 455 7788",
      },
    ],
    promotions: buildWeeklyPromos("tacos", 1),
  },
  {
    name: "Sushi Sakura",
    slug: "sushi-sakura",
    type: BusinessType.RESTAURANT,
    categories: ["sushi", "asiatica"],
    description: "Rolls creativos y bowls frescos.",
    instagram: "sushisakura",
    branches: [
      {
        city: "Medellín",
        zone: "El Poblado",
        address: "Cra 43A #7-85",
        lat: 6.2089,
        lng: -75.5653,
        phone: "+57 314 332 2200",
      },
    ],
    promotions: buildWeeklyPromos("sushi", 1),
  },
  {
    name: "Café Central",
    slug: "cafe-central",
    type: BusinessType.RESTAURANT,
    categories: ["cafeteria", "postres", "bebidas"],
    description: "Café de especialidad y postres artesanales.",
    instagram: "cafecentral",
    branches: [
      {
        city: "Bogotá",
        zone: "La Macarena",
        address: "Calle 26B #5-13",
        lat: 4.6116,
        lng: -74.0721,
        phone: "+57 311 220 4433",
      },
    ],
    promotions: buildWeeklyPromos("cafe", 1),
  },
  {
    name: "Pan del Valle",
    slug: "pan-del-valle",
    type: BusinessType.RESTAURANT,
    categories: ["panaderia", "cafeteria"],
    description: "Panadería artesanal con hornos tradicionales.",
    instagram: "pandelvalle",
    branches: [
      {
        city: "Palmira",
        zone: "La Italia",
        address: "Calle 40 #30-22",
        lat: 3.5369,
        lng: -76.2984,
        phone: "+57 317 550 3344",
      },
      {
        city: "Cali",
        zone: "Tequendama",
        address: "Calle 9 #43-12",
        lat: 3.4099,
        lng: -76.5482,
        phone: "+57 312 662 1188",
      },
    ],
    promotions: buildWeeklyPromos("pan artesanal", 2),
  },
  {
    name: "Bar La 66",
    slug: "bar-la-66",
    type: BusinessType.RESTAURANT,
    categories: ["bebidas", "comidas-rapidas"],
    description: "Cócteles clásicos y snacks para compartir.",
    instagram: "barla66",
    branches: [
      {
        city: "Medellín",
        zone: "Laureles",
        address: "Av 70 #42-20",
        lat: 6.2518,
        lng: -75.5902,
        phone: "+57 318 909 1010",
      },
    ],
    promotions: buildWeeklyPromos("cocteles", 1),
  },
  {
    name: "Dulce Momento",
    slug: "dulce-momento",
    type: BusinessType.RESTAURANT,
    categories: ["postres", "cafeteria"],
    description: "Postres por porción y tortas personalizadas.",
    instagram: "dulcemomento",
    branches: [
      {
        city: "Barranquilla",
        zone: "Riomar",
        address: "Cra 53 #79-12",
        lat: 11.0098,
        lng: -74.8284,
        phone: "+57 316 707 2323",
      },
    ],
    promotions: buildWeeklyPromos("postres", 1),
  },
  {
    name: "Catering Express",
    slug: "catering-express",
    type: BusinessType.RESTAURANT,
    categories: ["comidas-rapidas"],
    description: "Menús corporativos y eventos rápidos.",
    instagram: "cateringexpress",
    branches: [
      {
        city: "Cali",
        zone: "Chipichape",
        address: "Av 6N #45-60",
        lat: 3.4876,
        lng: -76.5205,
        phone: "+57 319 221 5566",
      },
    ],
    promotions: buildWeeklyPromos("menu del dia", 1),
  },
  {
    name: "Arepa House",
    slug: "arepa-house",
    type: BusinessType.RESTAURANT,
    categories: ["arepas", "desayunos"],
    description: "Arepas rellenas y desayunos típicos.",
    instagram: "arepahouse",
    branches: [
      {
        city: "Medellín",
        zone: "Laureles",
        address: "Calle 44 #78-22",
        lat: 6.2445,
        lng: -75.5885,
        phone: "+57 315 441 2200",
      },
      {
        city: "Cali",
        zone: "Granada",
        address: "Calle 15N #9-24",
        lat: 3.4579,
        lng: -76.5376,
        phone: "+57 316 772 3344",
      },
    ],
    promotions: buildWeeklyPromos("arepas", 2),
  },
  {
    name: "Mar Azul",
    slug: "mar-azul",
    type: BusinessType.RESTAURANT,
    categories: ["mariscos"],
    description: "Mariscos frescos y cocina costeña.",
    instagram: "marazul",
    branches: [
      {
        city: "Cartagena",
        zone: "Bocagrande",
        address: "Av San Martín #7-90",
        lat: 10.4042,
        lng: -75.5584,
        phone: "+57 317 880 1122",
      },
    ],
    promotions: buildWeeklyPromos("mariscos", 1),
  },
  {
    name: "Helados Nube",
    slug: "helados-nube",
    type: BusinessType.RESTAURANT,
    categories: ["helados", "postres", "bebidas"],
    description: "Helados artesanales y malteadas.",
    instagram: "heladosnube",
    branches: [
      {
        city: "Bogotá",
        zone: "Chapinero",
        address: "Calle 60 #9-14",
        lat: 4.6485,
        lng: -74.0613,
        phone: "+57 312 440 9900",
      },
      {
        city: "Cali",
        zone: "San Fernando",
        address: "Calle 3 #34-20",
        lat: 3.4189,
        lng: -76.5487,
        phone: "+57 313 551 1212",
      },
    ],
    promotions: buildWeeklyPromos("helados", 2),
  },
  {
    name: "Verde Vital",
    slug: "verde-vital",
    type: BusinessType.RESTAURANT,
    categories: ["vegana", "ensaladas"],
    description: "Cocina vegana y bowls nutritivos.",
    instagram: "verdevital",
    branches: [
      {
        city: "Bogotá",
        zone: "Teusaquillo",
        address: "Cra 24 #39-10",
        lat: 4.6254,
        lng: -74.0747,
        phone: "+57 314 220 6677",
      },
    ],
    promotions: buildWeeklyPromos("ensaladas", 1),
  },
  {
    name: "Desayunos 7AM",
    slug: "desayunos-7am",
    type: BusinessType.RESTAURANT,
    categories: ["desayunos", "cafeteria"],
    description: "Desayunos rápidos y café colombiano.",
    instagram: "desayunos7am",
    branches: [
      {
        city: "Barranquilla",
        zone: "Alto Prado",
        address: "Cra 54 #76-20",
        lat: 10.9969,
        lng: -74.8028,
        phone: "+57 318 334 5566",
      },
    ],
    promotions: buildWeeklyPromos("desayunos", 1),
  },
  {
    name: "La Huerta",
    slug: "la-huerta",
    type: BusinessType.RESTAURANT,
    categories: ["ensaladas", "vegana"],
    description: "Ensaladas frescas y wraps ligeros.",
    instagram: "lahuerta",
    branches: [
      {
        city: "Pereira",
        zone: "Cerritos",
        address: "Av 30 #14-90",
        lat: 4.8097,
        lng: -75.7396,
        phone: "+57 310 992 4455",
      },
    ],
    promotions: buildWeeklyPromos("ensaladas", 1),
  },
  {
    name: "Arepa & Cafe",
    slug: "arepa-cafe",
    type: BusinessType.RESTAURANT,
    categories: ["arepas", "cafeteria", "desayunos"],
    description: "Arepas tradicionales y café recién molido.",
    instagram: "arepacafe",
    branches: [
      {
        city: "Bucaramanga",
        zone: "Cabecera",
        address: "Cra 35 #45-18",
        lat: 7.1183,
        lng: -73.1169,
        phone: "+57 302 880 7788",
      },
    ],
    promotions: buildWeeklyPromos("arepas", 1),
  },
  {
    name: "Tropical Bowl",
    slug: "tropical-bowl",
    type: BusinessType.RESTAURANT,
    categories: ["bebidas", "postres", "ensaladas"],
    description: "Bowls frutales y smoothies.",
    instagram: "tropicalbowl",
    branches: [
      {
        city: "Cali",
        zone: "Ciudad Jardín",
        address: "Cra 100 #15-60",
        lat: 3.3725,
        lng: -76.5462,
        phone: "+57 320 221 9090",
      },
    ],
    promotions: buildWeeklyPromos("bowls", 1),
  },
];

type CityDoc = { _id?: ObjectId; name: string; countryCode: string; createdAt: Date };
type CategoryDoc = { _id?: ObjectId; name: string; slug: string; createdAt: Date };
type UserDoc = {
  _id?: ObjectId;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
};
type BusinessDoc = {
  _id?: ObjectId;
  name: string;
  slug: string;
  type: string;
  categories: string[];
  description?: string;
  instagram?: string;
  ownerId: string;
  verified: boolean;
  createdAt: Date;
};
type BranchDoc = {
  _id?: ObjectId;
  businessId: string;
  city: string;
  zone?: string;
  address: string;
  lat?: number;
  lng?: number;
  phone?: string;
  createdAt: Date;
};
type PromotionDoc = {
  _id?: ObjectId;
  businessId: string;
  branchId?: string | null;
  title: string;
  description?: string;
  promoType: string;
  value?: number | string;
  startDate: Date;
  endDate: Date;
  daysOfWeek: string[];
  startHour: string;
  endHour: string;
  active: boolean;
  createdAt: Date;
};

const upsertCity = async (collection: Collection<CityDoc>, city: CityDoc) => {
  await collection.updateOne(
    { name: city.name, countryCode: city.countryCode },
    { $setOnInsert: city },
    { upsert: true }
  );
  const found = await collection.findOne({ name: city.name, countryCode: city.countryCode });
  if (!found) {
    throw new Error("No se pudo insertar la ciudad");
  }
  return found;
};

const upsertCategory = async (collection: Collection<CategoryDoc>, category: CategoryDoc) => {
  await collection.updateOne({ slug: category.slug }, { $setOnInsert: category }, { upsert: true });
  const found = await collection.findOne({ slug: category.slug });
  if (!found) {
    throw new Error("No se pudo insertar la categoria");
  }
  return found;
};

const upsertUser = async (
  collection: Collection<UserDoc>,
  payload: { email: string; password: string; role: UserRole }
) => {
  const existing = await collection.findOne({ email: payload.email });
  if (existing) {
    if (existing.role !== payload.role) {
      await collection.updateOne({ _id: existing._id }, { $set: { role: payload.role } });
    }
    return existing;
  }
  const hashed = await bcrypt.hash(payload.password, 10);
  const created: UserDoc = {
    email: payload.email,
    password: hashed,
    role: payload.role,
    createdAt: new Date(),
  };
  await collection.insertOne(created);
  const inserted = await collection.findOne({ email: payload.email });
  if (!inserted) {
    throw new Error("No se pudo insertar el usuario");
  }
  return inserted;
};

const upsertBusiness = async (collection: Collection<BusinessDoc>, business: BusinessDoc) => {
  const { instagram, ownerId, ...insertDoc } = business;
  const update: Record<string, unknown> = { $setOnInsert: insertDoc };
  const setDoc: Record<string, unknown> = {};
  if (instagram) {
    setDoc.instagram = instagram;
  }
  if (ownerId) {
    setDoc.ownerId = ownerId;
  }
  if (Object.keys(setDoc).length > 0) {
    update.$set = setDoc;
  }
  await collection.updateOne({ slug: business.slug }, update, { upsert: true });
  const found = await collection.findOne({ slug: business.slug });
  if (!found) {
    throw new Error("No se pudo insertar el negocio");
  }
  return found;
};

const upsertBranch = async (
  collection: Collection<BranchDoc>,
  filter: Filter<BranchDoc>,
  branch: BranchDoc
) => {
  await collection.updateOne(filter, { $setOnInsert: branch }, { upsert: true });
  const found = await collection.findOne(filter);
  if (!found) {
    throw new Error("No se pudo insertar la sede");
  }
  return found;
};

const seedCities = async (cities: Collection<CityDoc>) => {
  for (const city of defaultCities) {
    await upsertCity(cities, { ...city, createdAt: new Date() });
  }
};

const seedCategories = async (categories: Collection<CategoryDoc>) => {
  for (const category of defaultCategories) {
    await upsertCategory(categories, { ...category, createdAt: new Date() });
  }
};

const getSeedOwnerId = async (users: Collection<UserDoc>) => {
  const seedOwner = await upsertUser(users, {
    email: seedBusinessOwner.email,
    password: seedBusinessOwner.password,
    role: UserRole.BUSINESS_OWNER,
  });
  return seedOwner?._id ? String(seedOwner._id) : "seed-owner-palmira";
};

const getSeedDateRange = () => {
  const today = new Date();
  const startDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 1
  );
  const endDate = new Date(
    today.getFullYear(),
    today.getMonth() + 3,
    today.getDate()
  );
  return { startDate, endDate };
};

const upsertBranchesForBusiness = async (
  branches: Collection<BranchDoc>,
  businessId: string,
  branchList: SeedBusiness["branches"]
) => {
  const branchIds: ObjectId[] = [];
  for (const branch of branchList) {
    const savedBranch = await upsertBranch(
      branches,
      { businessId, address: branch.address },
      {
        businessId,
        city: branch.city,
        zone: branch.zone,
        address: branch.address,
        lat: branch.lat,
        lng: branch.lng,
        phone: branch.phone,
        createdAt: new Date(),
      }
    );

    if (!savedBranch._id) {
      throw new Error("Sede guardada sin _id");
    }

    branchIds.push(savedBranch._id);
  }
  return branchIds;
};

const buildPromoInsert = (
  promo: SeedBusiness["promotions"][number],
  businessId: string,
  branchId: ObjectId | undefined,
  dates: { startDate: Date; endDate: Date }
) => ({
  businessId,
  branchId: branchId ? branchId.toString() : null,
  title: promo.title,
  description: promo.description,
  promoType: promo.promoType,
  value: promo.value,
  startDate: dates.startDate,
  endDate: dates.endDate,
  daysOfWeek: promo.daysOfWeek,
  startHour: promo.startHour,
  endHour: promo.endHour,
  active: true,
  createdAt: new Date(),
});

const upsertPromosForBusiness = async (
  promotions: Collection<PromotionDoc>,
  businessId: string,
  branchIds: ObjectId[],
  promoList: SeedBusiness["promotions"],
  dates: { startDate: Date; endDate: Date }
) => {
  for (const promo of promoList) {
    const branchId =
      typeof promo.branchIndex === "number" ? branchIds[promo.branchIndex] : undefined;
    await promotions.updateOne(
      { businessId, title: promo.title },
      { $setOnInsert: buildPromoInsert(promo, businessId, branchId, dates) },
      { upsert: true }
    );
  }
};

const seedBusinessesData = async (
  businesses: Collection<BusinessDoc>,
  branches: Collection<BranchDoc>,
  promotions: Collection<PromotionDoc>,
  ownerId: string,
  dates: { startDate: Date; endDate: Date }
) => {
  for (const business of seedBusinesses) {
    const savedBusiness = await upsertBusiness(businesses, {
      name: business.name,
      slug: business.slug,
      type: business.type,
      categories: business.categories,
      description: business.description,
      instagram: business.instagram,
      ownerId,
      verified: true,
      createdAt: new Date(),
    });

    if (!savedBusiness._id) {
      throw new Error("Negocio guardado sin _id");
    }

    const businessId = savedBusiness._id.toString();
    const branchIds = await upsertBranchesForBusiness(
      branches,
      businessId,
      business.branches
    );
    await upsertPromosForBusiness(
      promotions,
      businessId,
      branchIds,
      business.promotions,
      dates
    );
  }
};

const run = async () => {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  const cities = db.collection<CityDoc>("cities");
  const categories = db.collection<CategoryDoc>("categories");
  const users = db.collection<UserDoc>("users");
  const businesses = db.collection<BusinessDoc>("businesses");
  const branches = db.collection<BranchDoc>("branches");
  const promotions = db.collection<PromotionDoc>("promotions");

  try {
    await seedCities(cities);
    await seedCategories(categories);
    const ownerId = await getSeedOwnerId(users);
    const dates = getSeedDateRange();
    await seedBusinessesData(businesses, branches, promotions, ownerId, dates);
  } finally {
    await client.close();
  }
};

const runSeed = async () => {
  try {
    await run();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void runSeed();
