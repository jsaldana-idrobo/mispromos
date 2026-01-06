import { MongoClient, type Collection, type Filter, type ObjectId } from "mongodb";
import { config } from "dotenv";
import path from "node:path";
import { BusinessType, PromotionType, type DayOfWeek } from "@mispromos/shared";

config({ path: path.resolve(__dirname, "..", ".env") });

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI no está configurado");
}

const defaultCities = [
  { name: "Palmira", countryCode: "CO" },
  { name: "Cali", countryCode: "CO" },
  { name: "Bogotá", countryCode: "CO" },
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
];

type SeedBusiness = {
  name: string;
  slug: string;
  type: (typeof BusinessType)[keyof typeof BusinessType];
  categories: string[];
  description: string;
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

const seedBusinesses: SeedBusiness[] = [
  {
    name: "La Brasa Palmira",
    slug: "la-brasa-palmira",
    type: BusinessType.RESTAURANT,
    categories: ["parrilla", "pollo"],
    description: "Parrilla criolla y pollo asado con combos familiares.",
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
    promotions: [
      {
        title: "Combo parrillero 20% OFF",
        description: "Aplica en combo de 2 personas con bebida.",
        promoType: PromotionType.DISCOUNT,
        value: 20,
        daysOfWeek: ["friday", "saturday", "sunday"],
        startHour: "12:00",
        endHour: "21:00",
        branchIndex: 0,
      },
    ],
  },
  {
    name: "Súper Burger 24",
    slug: "super-burger-24",
    type: BusinessType.RESTAURANT,
    categories: ["hamburguesas", "comidas-rapidas"],
    description: "Hamburguesas artesanales y papas cargadas.",
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
    promotions: [
      {
        title: "2x1 en hamburguesa clásica",
        description: "Válido en la clásica de 150g.",
        promoType: PromotionType.TWO_FOR_ONE,
        value: "2x1",
        daysOfWeek: ["monday", "tuesday", "wednesday"],
        startHour: "18:00",
        endHour: "22:00",
        branchIndex: 0,
      },
    ],
  },
  {
    name: "Sushi Tama",
    slug: "sushi-tama",
    type: BusinessType.RESTAURANT,
    categories: ["sushi", "asiatica"],
    description: "Rolls frescos y bowls con ingredientes locales.",
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
    promotions: [
      {
        title: "Combo roll + bebida",
        description: "Escoge cualquier roll del menú básico.",
        promoType: PromotionType.COMBO,
        value: "combo",
        daysOfWeek: ["thursday", "friday", "saturday"],
        startHour: "17:00",
        endHour: "21:30",
        branchIndex: 0,
      },
    ],
  },
  {
    name: "Taco Express Palmira",
    slug: "taco-express-palmira",
    type: BusinessType.RESTAURANT,
    categories: ["tacos", "mexicana"],
    description: "Tacos callejeros con salsas caseras.",
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
    promotions: [
      {
        title: "Martes de tacos 3x2",
        description: "Aplica en tacos al pastor y pollo.",
        promoType: PromotionType.OTHER,
        value: "3x2",
        daysOfWeek: ["tuesday"],
        startHour: "11:30",
        endHour: "20:30",
        branchIndex: 0,
      },
    ],
  },
];

type CityDoc = { _id?: ObjectId; name: string; countryCode: string; createdAt: Date };
type CategoryDoc = { _id?: ObjectId; name: string; slug: string; createdAt: Date };
type BusinessDoc = {
  _id?: ObjectId;
  name: string;
  slug: string;
  type: string;
  categories: string[];
  description?: string;
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

const upsertBusiness = async (collection: Collection<BusinessDoc>, business: BusinessDoc) => {
  await collection.updateOne({ slug: business.slug }, { $setOnInsert: business }, { upsert: true });
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

const run = async () => {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  const cities = db.collection<CityDoc>("cities");
  const categories = db.collection<CategoryDoc>("categories");
  const businesses = db.collection<BusinessDoc>("businesses");
  const branches = db.collection<BranchDoc>("branches");
  const promotions = db.collection<PromotionDoc>("promotions");

  for (const city of defaultCities) {
    await upsertCity(cities, { ...city, createdAt: new Date() });
  }

  for (const category of defaultCategories) {
    await upsertCategory(categories, { ...category, createdAt: new Date() });
  }

  const ownerId = "seed-owner-palmira";
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  const endDate = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());

  for (const business of seedBusinesses) {
    const savedBusiness = await upsertBusiness(businesses, {
      name: business.name,
      slug: business.slug,
      type: business.type,
      categories: business.categories,
      description: business.description,
      ownerId,
      verified: true,
      createdAt: new Date(),
    });

    if (!savedBusiness._id) {
      throw new Error("Negocio guardado sin _id");
    }

    const branchIds: ObjectId[] = [];
    for (const branch of business.branches) {
      const savedBranch = await upsertBranch(
        branches,
        { businessId: savedBusiness._id.toString(), address: branch.address },
        {
          businessId: savedBusiness._id.toString(),
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

    for (const promo of business.promotions) {
      const branchId =
        typeof promo.branchIndex === "number" ? branchIds[promo.branchIndex] : undefined;
      await promotions.updateOne(
        { businessId: savedBusiness._id.toString(), title: promo.title },
        {
          $setOnInsert: {
            businessId: savedBusiness._id.toString(),
            branchId: branchId ? branchId.toString() : null,
            title: promo.title,
            description: promo.description,
            promoType: promo.promoType,
            value: promo.value,
            startDate,
            endDate,
            daysOfWeek: promo.daysOfWeek,
            startHour: promo.startHour,
            endHour: promo.endHour,
            active: true,
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
    }
  }

  await client.close();
};

run().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
