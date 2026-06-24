import hero from "@/assets/hero-chargers.jpg";
import bannerCharger from "@/assets/banner-charger.jpg";
import bannerCable from "@/assets/banner-cable.jpg";
import pPower from "@/assets/product-powerbank.jpg";
import p30 from "@/assets/product-charger-30w.jpg";
import p65 from "@/assets/product-charger-65w.jpg";
import pCable from "@/assets/product-cable.jpg";
import pCar from "@/assets/product-car.jpg";

export const heroImages = [hero, bannerCharger, bannerCable];

export type Spec = { label: string; value: string };
export type Product = {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  oldPrice?: number;
  image: string;
  collection: string;
  badge?: string;
  description: string;
  specs: Spec[];
};

export type Collection = { slug: string; name: string; count: number };

export const seedProducts: Product[] = [
  {
    slug: "dot-gan-30w",
    name: "Dot GaN 30W Charger",
    tagline: "Compact dual-port fast charger",
    price: 3499,
    oldPrice: 4299,
    image: p30,
    collection: "chargers",
    badge: "Bestseller",
    description:
      "A pocket-sized 30W GaN charger built for everyday devices. Smart power delivery to phones, earbuds and tablets.",
    specs: [
      { label: "Output", value: "30W PD" },
      { label: "Ports", value: "1× USB-C" },
      { label: "Tech", value: "GaN III" },
      { label: "Warranty", value: "12 Months" },
    ],
  },
  {
    slug: "dot-gan-40w",
    name: "Dot GaN 40W Dual",
    tagline: "Dual USB-C 40W travel charger",
    price: 4799,
    image: p30,
    collection: "chargers",
    description:
      "Charge two devices at once with full PD support. Foldable pins for travel-ready convenience.",
    specs: [
      { label: "Output", value: "40W PD" },
      { label: "Ports", value: "2× USB-C" },
      { label: "Tech", value: "GaN III" },
      { label: "Warranty", value: "12 Months" },
    ],
  },
  {
    slug: "dot-gan-65w",
    name: "Dot GaN 65W Pro",
    tagline: "Laptop-grade triple-port charger",
    price: 7499,
    oldPrice: 8999,
    image: p65,
    collection: "chargers",
    badge: "New",
    description:
      "Power your MacBook, iPad and phone simultaneously. 65W of intelligent GaN power in a palm-sized brick.",
    specs: [
      { label: "Output", value: "65W PD" },
      { label: "Ports", value: "2× USB-C, 1× USB-A" },
      { label: "Tech", value: "GaN III" },
      { label: "Warranty", value: "12 Months" },
    ],
  },
  {
    slug: "thread-usb-c-cable",
    name: "Thread USB-C Cable",
    tagline: "Braided 100W USB-C to USB-C",
    price: 1299,
    image: pCable,
    collection: "cables",
    description:
      "Tangle-free braided nylon, certified for 100W PD and 480Mbps data. Built to outlast your devices.",
    specs: [
      { label: "Power", value: "100W PD" },
      { label: "Length", value: "1.5m" },
      { label: "Data", value: "USB 2.0 480Mbps" },
      { label: "Warranty", value: "12 Months" },
    ],
  },
  {
    slug: "stack-10000-powerbank",
    name: "Stack 10,000 Power Bank",
    tagline: "Slim 22.5W power bank with display",
    price: 5499,
    image: pPower,
    collection: "powerbanks",
    badge: "Limited",
    description:
      "10,000mAh of pocketable power with a digital display. PD 22.5W input/output keeps everything topped up fast.",
    specs: [
      { label: "Capacity", value: "10,000mAh" },
      { label: "Output", value: "22.5W PD" },
      { label: "Display", value: "Yes" },
      { label: "Warranty", value: "12 Months" },
    ],
  },
  {
    slug: "magnet-car-mount",
    name: "Magnet Car Wireless Mount",
    tagline: "15W magnetic wireless car charger",
    price: 4299,
    image: pCar,
    collection: "car",
    description:
      "Snap your phone in place and start charging — 15W Qi wireless with a precision air-vent grip.",
    specs: [
      { label: "Output", value: "15W Wireless" },
      { label: "Mount", value: "Air Vent" },
      { label: "Compatible", value: "MagSafe phones" },
      { label: "Warranty", value: "12 Months" },
    ],
  },
];

export const seedCollections: Collection[] = [
  { slug: "chargers", name: "Chargers", count: seedProducts.filter((p) => p.collection === "chargers").length },
  { slug: "cables", name: "Cables", count: seedProducts.filter((p) => p.collection === "cables").length },
  { slug: "powerbanks", name: "Power Banks", count: seedProducts.filter((p) => p.collection === "powerbanks").length },
  { slug: "car", name: "Car Accessories", count: seedProducts.filter((p) => p.collection === "car").length },
];

export const formatPrice = (n: number) =>
  `Rs. ${n.toLocaleString("en-PK")}.00 PKR`;
