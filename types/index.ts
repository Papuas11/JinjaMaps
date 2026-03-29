export const CATEGORIES = [
  "Restaurants",
  "Hotels",
  "Grocery",
  "Pharmacies",
  "Cafes",
  "Sport",
  "Gas Stations",
  "Banks",
  "Auto Services",
  "Beauty",
  "Services",
  "Hospitals",
  "Museums"
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Place = {
  id: number;
  name: string;
  category: Category;
  description: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  image_url: string | null;
  created_at: string;
};

export type Ad = {
  id: number;
  title: string;
  image_url: string;
  description: string;
  cta_text: string;
  cta_link: string;
  display_order: number;
  created_at: string;
};
