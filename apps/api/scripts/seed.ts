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
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
      {
        title: "Combo pizza + bebida",
        description: "Combo para 2 personas.",
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
    promotions: [
      {
        title: "Arepas rellenas 2x1",
        description: "Aplica en arepas de pollo y carne.",
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
        title: "Combo arepa + jugo",
        description: "Incluye jugo natural.",
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
        branchIndex: 1,
      },
      {
        title: "Desayuno paisa 20% OFF",
        description: "Aplica en bandeja pequeña.",
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
    promotions: [
      {
        title: "Paella 25% OFF",
        description: "Aplica en paella tradicional.",
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
        startHour: "00:00",
        endHour: "23:59",
        branchIndex: 0,
      },
      {
        title: "Ceviche 2x1",
        description: "Aplica en ceviche mixto.",
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
        title: "Combo marino",
        description: "Incluye entrada y bebida.",
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
    promotions: [
      {
        title: "Helado doble 2x1",
        description: "Aplica en conos dobles.",
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
        title: "Combo helado + brownie",
        description: "Incluye porción de brownie.",
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
        branchIndex: 1,
      },
      {
        title: "Malteada 15% OFF",
        description: "Aplica en malteadas clásicas.",
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
    promotions: [
      {
        title: "Ensalada power 20% OFF",
        description: "Aplica en ensaladas grandes.",
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
        title: "Combo vegano",
        description: "Incluye bowl + bebida.",
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
        title: "Bowl verde 2x1",
        description: "Aplica en bowl de quinoa.",
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
    promotions: [
      {
        title: "Desayuno caribe 15% OFF",
        description: "Incluye arepa de huevo.",
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
      {
        title: "Combo arepa de huevo",
        description: "Arepa de huevo + café.",
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
        title: "Café + pan 2x1",
        description: "Aplica en combo pequeño.",
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
    promotions: [
      {
        title: "Wrap verde 2x1",
        description: "Aplica en wrap vegetal.",
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
        title: "Ensalada del día 20% OFF",
        description: "Aplica en ensalada especial.",
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
        title: "Combo vegano + bebida",
        description: "Incluye jugo natural.",
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
    promotions: [
      {
        title: "Arepa santandereana 2x1",
        description: "Aplica en arepa tradicional.",
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
        title: "Combo arepa + café",
        description: "Incluye café americano.",
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
        title: "Chorizo con arepa 15% OFF",
        description: "Aplica en combo tradicional.",
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
    promotions: [
      {
        title: "Bowl tropical 20% OFF",
        description: "Aplica en bowl de frutas.",
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
        title: "Smoothie 2x1",
        description: "Aplica en smoothies clásicos.",
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
        title: "Combo bowl + smoothie",
        description: "Incluye bebida natural.",
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

const upsertBusiness = async (collection: Collection<BusinessDoc>, business: BusinessDoc) => {
  const insertDoc = { ...business };
  const update: Record<string, unknown> = { $setOnInsert: insertDoc };
  if (business.instagram) {
    update.$set = { instagram: business.instagram };
    delete insertDoc.instagram;
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
      instagram: business.instagram,
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
