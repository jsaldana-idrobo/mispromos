import { MongoClient, type Collection } from "mongodb";
import { config } from "dotenv";
import path from "node:path";
import { defaultCategories, defaultCities } from "./catalog";

config({ path: path.resolve(__dirname, "..", ".env") });

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI no está configurado");
}


type CityDoc = { name: string; countryCode: string; createdAt: Date };

type CategoryDoc = { name: string; slug: string; createdAt: Date };

const upsertCity = async (collection: Collection<CityDoc>, city: CityDoc) => {
  await collection.updateOne(
    { name: city.name, countryCode: city.countryCode },
    { $setOnInsert: city },
    { upsert: true },
  );
  const found = await collection.findOne({
    name: city.name,
    countryCode: city.countryCode,
  });
  if (!found) {
    throw new Error("No se pudo insertar la ciudad");
  }
  return found;
};

const upsertCategory = async (
  collection: Collection<CategoryDoc>,
  category: CategoryDoc,
) => {
  await collection.updateOne(
    { slug: category.slug },
    { $setOnInsert: category },
    { upsert: true },
  );
  const found = await collection.findOne({ slug: category.slug });
  if (!found) {
    throw new Error("No se pudo insertar la categoria");
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

const run = async () => {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  const cities = db.collection<CityDoc>("cities");
  const categories = db.collection<CategoryDoc>("categories");

  try {
    await seedCities(cities);
    await seedCategories(categories);
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
