"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { DiscoveryPanel } from "@/components/discovery-panel";
import { DEMO_PLACES } from "@/lib/demo-data";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { type Ad, type Category, type Place } from "@/types";

const MapView = dynamic(() => import("@/components/map-view").then((mod) => mod.MapView), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-slate-200" />
});

export default function HomePage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!isSupabaseConfigured) {
        setPlaces(DEMO_PLACES);
        setAds([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const [placesResult, adsResult] = await Promise.all([
        supabase.from("places").select("*").order("created_at", { ascending: false }),
        supabase.from("ads").select("*").order("display_order", { ascending: true })
      ]);

      if (!placesResult.error && placesResult.data) {
        setPlaces(placesResult.data as Place[]);
      } else {
        setPlaces([]);
      }

      if (!adsResult.error && adsResult.data) {
        setAds(adsResult.data as Ad[]);
      } else {
        setAds([]);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  const filteredPlaces = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return places.filter((place) => {
      const categoryMatch = activeCategory === "All" ? true : place.category === activeCategory;
      const textMatch =
        place.name.toLowerCase().includes(term) ||
        place.category.toLowerCase().includes(term) ||
        place.address.toLowerCase().includes(term) ||
        place.description.toLowerCase().includes(term);

      return categoryMatch && textMatch;
    });
  }, [activeCategory, places, searchTerm]);

  useEffect(() => {
    if (!selectedPlace) {
      return;
    }

    const placeStillVisible = filteredPlaces.some((place) => place.id === selectedPlace.id);

    if (!placeStillVisible) {
      setSelectedPlace(null);
    }
  }, [filteredPlaces, selectedPlace]);

  return (
    <main className="flex h-screen overflow-hidden">
      <DiscoveryPanel
        places={filteredPlaces}
        ads={ads}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        selectedPlaceId={selectedPlace?.id ?? null}
        onPlaceSelect={setSelectedPlace}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
      />

      <section className="relative h-full flex-1 bg-slate-200">
        <MapView places={filteredPlaces} selectedPlace={selectedPlace} onSelectPlace={setSelectedPlace} />

        {!isSupabaseConfigured ? (
          <div className="pointer-events-none absolute left-4 top-4 z-[500]">
            <div className="rounded-xl border border-amber-200 bg-amber-50/95 px-3 py-2 text-xs font-medium text-amber-700 shadow-card backdrop-blur-sm">
              Supabase not configured. Showing demo places around Jinja.
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="pointer-events-none absolute inset-0 z-[450] flex items-center justify-center bg-white/35 backdrop-blur-[1px]">
            <div className="rounded-2xl bg-white px-6 py-4 text-sm font-medium text-slate-600 shadow-card">
              Loading Jinja map data...
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
