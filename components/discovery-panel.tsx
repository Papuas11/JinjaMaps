"use client";

import Image from "next/image";
import {
  Activity,
  Banknote,
  Car,
  Coffee,
  Fuel,
  HeartPulse,
  Hotel,
  Landmark,
  PackageOpen,
  Pill,
  ShoppingBasket,
  Sparkles,
  UtensilsCrossed
} from "lucide-react";
import { CATEGORIES, type Ad, type Category, type Place } from "@/types";

const categoryIconMap = {
  Restaurants: UtensilsCrossed,
  Hotels: Hotel,
  Grocery: ShoppingBasket,
  Pharmacies: Pill,
  Cafes: Coffee,
  Sport: Activity,
  "Gas Stations": Fuel,
  Banks: Banknote,
  "Auto Services": Car,
  Beauty: Sparkles,
  Services: PackageOpen,
  Hospitals: HeartPulse,
  Museums: Landmark
} as const;

type DiscoveryPanelProps = {
  places: Place[];
  ads: Ad[];
  activeCategory: Category | "All";
  onCategoryChange: (category: Category | "All") => void;
  selectedPlaceId: number | null;
  onPlaceSelect: (place: Place) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
};

export function DiscoveryPanel({
  places,
  ads,
  activeCategory,
  onCategoryChange,
  selectedPlaceId,
  onPlaceSelect,
  searchTerm,
  onSearchTermChange
}: DiscoveryPanelProps) {
  return (
    <aside className="h-screen overflow-y-auto border-r border-slate-200/80 bg-white px-5 py-6 shadow-panel md:w-[420px]">
      <div className="space-y-6">
        <section>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">JINJA MAPS</h1>
          <p className="mt-1 text-sm text-slate-500">Discover standout places around Jinja in one premium map view.</p>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <input
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
              placeholder="Search places, addresses, or categories"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-blue-500 transition focus:ring"
            />
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Category shortcuts</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onCategoryChange("All")}
              className={`rounded-2xl border px-4 py-3 text-left shadow-card transition ${
                activeCategory === "All"
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-brand-300"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-wide">All</p>
              <p className="text-sm font-medium">Every place</p>
            </button>
            {CATEGORIES.map((category) => {
              const Icon = categoryIconMap[category];
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => onCategoryChange(category)}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left shadow-card transition ${
                    isActive
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-slate-200 bg-white text-slate-700 hover:border-brand-300"
                  }`}
                >
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${
                      isActive ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold">{category}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Spotlight ads</h2>
          <div className="mt-3 space-y-3">
            {ads.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                No ads yet. Add a premium ad in /admin.
              </div>
            ) : (
              ads.map((ad) => (
                <article key={ad.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
                  <div className="relative h-36 w-full bg-slate-100">
                    <Image src={ad.image_url} alt={ad.title} fill className="object-cover" unoptimized />
                  </div>
                  <div className="space-y-2 p-4">
                    <h3 className="text-base font-semibold text-slate-900">{ad.title}</h3>
                    <p className="text-sm text-slate-600">{ad.description}</p>
                    <a
                      href={ad.cta_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-brand-700"
                    >
                      {ad.cta_text}
                    </a>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Places in Jinja</h2>
          <div className="mt-3 space-y-3 pb-4">
            {places.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                No places match your filters. Try another category or search term.
              </div>
            ) : (
              places.map((place) => (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => onPlaceSelect(place)}
                  className={`w-full rounded-2xl border p-4 text-left shadow-card transition ${
                    selectedPlaceId === place.id
                      ? "border-brand-500 bg-brand-50"
                      : "border-slate-200 bg-white hover:border-brand-300"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{place.name}</p>
                  <p className="mt-1 inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                    {place.category}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{place.description}</p>
                  <p className="mt-2 text-xs text-slate-500">{place.address}</p>
                </button>
              ))
            )}
          </div>
        </section>
      </div>
    </aside>
  );
}
