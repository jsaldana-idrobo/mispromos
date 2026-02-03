import { MongoClient, type Collection } from "mongodb";
import { config } from "dotenv";
import path from "node:path";
import bcrypt from "bcryptjs";
import { UserRole } from "@mispromos/shared";
import { defaultCategories, defaultCities } from "./catalog";

config({ path: path.resolve(__dirname, "..", ".env") });

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI no está configurado");
}

const adminEmail =
  process.env.SEED_ADMIN_EMAIL ?? "admin@mispromos.com";
const adminPassword =
  process.env.SEED_ADMIN_PASSWORD ?? "admin-change-me";

type CityDoc = { name: string; countryCode: string; createdAt: Date };
type CategoryDoc = { name: string; slug: string; createdAt: Date };
type UserDoc = {
  email: string;
  password: string;
  role: string;
  createdAt: Date;
};

const run = async () => {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  const cities = db.collection<CityDoc>("cities");
  const categories = db.collection<CategoryDoc>("categories");
  const users = db.collection<UserDoc>("users");
  const businesses = db.collection("businesses");
  const branches = db.collection("branches");
  const promotions = db.collection("promotions");

  try {
    await Promise.all([
      cities.deleteMany({}),
      categories.deleteMany({}),
      users.deleteMany({}),
      businesses.deleteMany({}),
      branches.deleteMany({}),
      promotions.deleteMany({}),
    ]);

    const hashed = await bcrypt.hash(adminPassword, 10);
    await users.insertOne({
      email: adminEmail,
      password: hashed,
      role: UserRole.ADMIN,
      createdAt: new Date(),
    });

    await cities.insertMany(
      defaultCities.map((city) => ({ ...city, createdAt: new Date() })),
    );
    await categories.insertMany(
      defaultCategories.map((category) => ({
        ...category,
        createdAt: new Date(),
      })),
    );
  } finally {
    await client.close();
  }
};

const runReset = async () => {
  try {
    await run();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void runReset();
