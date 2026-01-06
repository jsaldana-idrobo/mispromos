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
  { name: "Medellín", countryCode: "CO" },
  { name: "Barranquilla", countryCode: "CO" },
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
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
      {
        title: "Alitas criollas 2x1",
        description: "Solo para comer en el local.",
        promoType: PromotionType.TWO_FOR_ONE,
        value: "2x1",
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
      {
        title: "Parrilla familiar combo",
        description: "Incluye 2 bebidas y guarniciones.",
        promoType: PromotionType.COMBO,
        value: "combo",
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
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
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
      {
        title: "Combo burger + papas",
        description: "Combo personal con bebida.",
        promoType: PromotionType.COMBO,
        value: "combo",
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
      {
        title: "Papas cargadas 15% OFF",
        description: "Aplica en tamaño grande.",
        promoType: PromotionType.DISCOUNT,
        value: 15,
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
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
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
      {
        title: "Sushi clásico 20% OFF",
        description: "Aplica en rolls tradicionales.",
        promoType: PromotionType.DISCOUNT,
        value: 20,
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
      {
        title: "Nigiri 2x1",
        description: "2x1 en porciones seleccionadas.",
        promoType: PromotionType.TWO_FOR_ONE,
        value: "2x1",
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
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
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
      {
        title: "Combo tacos + bebida",
        description: "Incluye 3 tacos al pastor.",
        promoType: PromotionType.COMBO,
        value: "combo",
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
      {
        title: "Nachos 15% OFF",
        description: "Aplica en nachos tradicionales.",
        promoType: PromotionType.DISCOUNT,
        value: 15,
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
    ],
  },
  {
    name: "Pizzeria Torino",
    slug: "pizzeria-torino",
    type: BusinessType.RESTAURANT,
    categories: ["pizza"],
    description: "Pizzas al horno de leña con masa madre.",
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
    promotions: [
      {
        title: "Pizza familiar 25% OFF",
        description: "Válido en pizzas clásicas.",
        promoType: PromotionType.DISCOUNT,
        value: 25,
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "11:00",
        endHour: "22:30",
        branchIndex: 0,
      },
      {
        title: "Combo pizza + bebida",
        description: "Combo para 2 personas.",
        promoType: PromotionType.COMBO,
        value: "combo",
        daysOfWeek: ["friday", "saturday", "sunday"],
        startHour: "12:00",
        endHour: "23:00",
        branchIndex: 1,
      },
      {
        title: "2x1 en porción personal",
        description: "Solo para llevar.",
        promoType: PromotionType.TWO_FOR_ONE,
        value: "2x1",
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
      {
        title: "Pasta del día 20% OFF",
        description: "Aplica en pastas clásicas.",
        promoType: PromotionType.DISCOUNT,
        value: 20,
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 1,
      },
    ],
  },
  {
    name: "Parrilla 93",
    slug: "parrilla-93",
    type: BusinessType.RESTAURANT,
    categories: ["parrilla"],
    description: "Cortes premium y guarniciones clásicas.",
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
    promotions: [
      {
        title: "Parrillada para dos",
        description: "Incluye bebida y acompañamientos.",
        promoType: PromotionType.COMBO,
        value: "combo",
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
      {
        title: "Corte premium 30% OFF",
        description: "Válido en cortes seleccionados.",
        promoType: PromotionType.DISCOUNT,
        value: 30,
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
    ],
  },
  {
    name: "Pollo Dorado Cali",
    slug: "pollo-dorado-cali",
    type: BusinessType.RESTAURANT,
    categories: ["pollo", "comidas-rapidas"],
    description: "Pollo apanado y broaster con salsas caseras.",
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
    promotions: [
      {
        title: "2x1 en presas mixtas",
        description: "Aplica de lunes a miércoles.",
        promoType: PromotionType.TWO_FOR_ONE,
        value: "2x1",
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
      {
        title: "Combo familiar 20% OFF",
        description: "Incluye 8 presas y bebidas.",
        promoType: PromotionType.DISCOUNT,
        value: 20,
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
    ],
  },
  {
    name: "Tacos del Sur",
    slug: "tacos-del-sur",
    type: BusinessType.RESTAURANT,
    categories: ["tacos", "mexicana"],
    description: "Tacos y burritos con recetas del norte.",
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
    promotions: [
      {
        title: "Combo tacos + bebida",
        description: "Combo de 3 tacos a elección.",
        promoType: PromotionType.COMBO,
        value: "combo",
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
      {
        title: "Burrito 2x1",
        description: "Aplica en burrito clásico.",
        promoType: PromotionType.TWO_FOR_ONE,
        value: "2x1",
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
      {
        title: "Tazón mexicano 15% OFF",
        description: "Aplica en bowls especiales.",
        promoType: PromotionType.DISCOUNT,
        value: 15,
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
    ],
  },
  {
    name: "Sushi Sakura",
    slug: "sushi-sakura",
    type: BusinessType.RESTAURANT,
    categories: ["sushi", "asiatica"],
    description: "Rolls creativos y bowls frescos.",
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
    promotions: [
      {
        title: "Sushi night 20% OFF",
        description: "Aplica en rolls clásicos y tempura.",
        promoType: PromotionType.DISCOUNT,
        value: 20,
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
      {
        title: "Ramen 2x1",
        description: "Aplica en ramen clásico.",
        promoType: PromotionType.TWO_FOR_ONE,
        value: "2x1",
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
    ],
  },
  {
    name: "Café Central",
    slug: "cafe-central",
    type: BusinessType.BAR,
    categories: ["cafeteria", "postres", "bebidas"],
    description: "Café de especialidad y postres artesanales.",
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
    promotions: [
      {
        title: "Capuccino 2x1",
        description: "Disponible en bebidas calientes medianas.",
        promoType: PromotionType.TWO_FOR_ONE,
        value: "2x1",
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
      {
        title: "Combo postre + café",
        description: "Incluye porción de torta.",
        promoType: PromotionType.COMBO,
        value: "combo",
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
    ],
  },
  {
    name: "Pan del Valle",
    slug: "pan-del-valle",
    type: BusinessType.SHOP,
    categories: ["panaderia", "cafeteria"],
    description: "Panadería artesanal con hornos tradicionales.",
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
    promotions: [
      {
        title: "Desayuno pan + café",
        description: "Pan artesanal y café filtrado.",
        promoType: PromotionType.COMBO,
        value: "combo",
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
      {
        title: "Combo merienda 15% OFF",
        description: "Válido en pan dulce y bebidas frías.",
        promoType: PromotionType.DISCOUNT,
        value: 15,
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 1,
      },
      {
        title: "Pan artesanal 2x1",
        description: "Aplica en panes seleccionados.",
        promoType: PromotionType.TWO_FOR_ONE,
        value: "2x1",
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
    ],
  },
  {
    name: "Bar La 66",
    slug: "bar-la-66",
    type: BusinessType.BAR,
    categories: ["bebidas", "comidas-rapidas"],
    description: "Cócteles clásicos y snacks para compartir.",
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
    promotions: [
      {
        title: "Happy hour 2x1",
        description: "Aplica en cócteles seleccionados.",
        promoType: PromotionType.TWO_FOR_ONE,
        value: "2x1",
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
      {
        title: "Nachos bar 20% OFF",
        description: "Aplica en entradas para compartir.",
        promoType: PromotionType.DISCOUNT,
        value: 20,
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
    ],
  },
  {
    name: "Dulce Momento",
    slug: "dulce-momento",
    type: BusinessType.SHOP,
    categories: ["postres", "cafeteria"],
    description: "Postres por porción y tortas personalizadas.",
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
    promotions: [
      {
        title: "Cheesecake 15% OFF",
        description: "Aplica en porciones individuales.",
        promoType: PromotionType.DISCOUNT,
        value: 15,
        daysOfWeek: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
      {
        title: "Brownie 2x1",
        description: "Aplica en brownie clásico.",
        promoType: PromotionType.TWO_FOR_ONE,
        value: "2x1",
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
    ],
  },
  {
    name: "Catering Express",
    slug: "catering-express",
    type: BusinessType.SERVICE,
    categories: ["comidas-rapidas"],
    description: "Menús corporativos y eventos rápidos.",
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
    promotions: [
      {
        title: "Menú corporativo 20% OFF",
        description: "Paquetes para equipos de 10 personas.",
        promoType: PromotionType.DISCOUNT,
        value: 20,
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
      {
        title: "Servicio express 15% OFF",
        description: "Aplica en eventos pequeños.",
        promoType: PromotionType.DISCOUNT,
        value: 15,
        daysOfWeek: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        startHour: "00:00",
        endHour: "23:59",
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
