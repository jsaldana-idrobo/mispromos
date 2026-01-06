import mongoose from "mongoose";
import { config } from "dotenv";
import path from "node:path";

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
  { name: "Cafetería", slug: "cafeteria" },
];

const run = async () => {
  await mongoose.connect(uri);
  const db = mongoose.connection;

  const cities = db.collection("cities");
  const categories = db.collection("categories");

  for (const city of defaultCities) {
    await cities.updateOne(
      { name: city.name, countryCode: city.countryCode },
      { $setOnInsert: { ...city, createdAt: new Date() } },
      { upsert: true }
    );
  }

  for (const category of defaultCategories) {
    await categories.updateOne(
      { slug: category.slug },
      { $setOnInsert: { ...category, createdAt: new Date() } },
      { upsert: true }
    );
  }

  await db.close();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
