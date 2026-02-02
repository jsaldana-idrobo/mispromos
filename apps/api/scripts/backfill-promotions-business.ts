import { config } from "dotenv";
import { MongoClient } from "mongodb";

type BusinessDoc = {
  _id: string;
  name: string;
  slug: string;
  categories?: string[];
  instagram?: string;
  website?: string;
};

type PromotionDoc = {
  _id: string;
  businessId: string;
  businessName?: string | null;
  businessSlug?: string | null;
  businessCategories?: string[] | null;
  businessInstagram?: string | null;
  businessWebsite?: string | null;
};

config({ path: ".env" });

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI no está configurado");
}

const BATCH_SIZE = 500;

const run = async () => {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  const promotions = db.collection<PromotionDoc>("promotions");
  const businesses = db.collection<BusinessDoc>("businesses");

  try {
    const businessList = await businesses
      .find(
        {},
        {
          projection: {
            _id: 1,
            name: 1,
            slug: 1,
            categories: 1,
            instagram: 1,
            website: 1,
          },
        },
      )
      .toArray();
    const businessMap = new Map(
      businessList.map((business) => [String(business._id), business]),
    );

    const cursor = promotions.find({
      $or: [
        { businessName: { $exists: false } },
        { businessName: null },
        { businessSlug: { $exists: false } },
        { businessCategories: { $exists: false } },
        { businessInstagram: { $exists: false } },
        { businessWebsite: { $exists: false } },
      ],
    });

    let ops = [];
    let scanned = 0;
    let updated = 0;
    let missingBusiness = 0;

    for await (const promo of cursor) {
      scanned += 1;
      const business = businessMap.get(String(promo.businessId));
      if (!business) {
        missingBusiness += 1;
        continue;
      }
      ops.push({
        updateOne: {
          filter: { _id: promo._id },
          update: {
            $set: {
              businessName: business.name,
              businessSlug: business.slug,
              businessCategories: business.categories ?? [],
              businessInstagram: business.instagram,
              businessWebsite: business.website,
            },
          },
        },
      });

      if (ops.length >= BATCH_SIZE) {
        const result = await promotions.bulkWrite(ops);
        updated += result.modifiedCount;
        ops = [];
      }
    }

    if (ops.length > 0) {
      const result = await promotions.bulkWrite(ops);
      updated += result.modifiedCount;
    }

    console.log(
      `Backfill completo. Promos escaneadas: ${scanned}. Actualizadas: ${updated}. Sin negocio: ${missingBusiness}.`,
    );
  } finally {
    await client.close();
  }
};

try {
  await run();
} catch (error) {
  console.error(error);
  process.exit(1);
}
