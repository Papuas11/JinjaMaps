"use client";

import { FormEvent, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { CATEGORIES, type Ad, type Category, type Place } from "@/types";

type PlaceFormState = {
  name: string;
  category: Category;
  description: string;
  phone: string;
  address: string;
  latitude: string;
  longitude: string;
  image_url: string;
};

type AdFormState = {
  title: string;
  image_url: string;
  description: string;
  cta_text: string;
  cta_link: string;
  display_order: string;
};

const defaultPlaceForm: PlaceFormState = {
  name: "",
  category: "Restaurants",
  description: "",
  phone: "",
  address: "",
  latitude: "",
  longitude: "",
  image_url: ""
};

const defaultAdForm: AdFormState = {
  title: "",
  image_url: "",
  description: "",
  cta_text: "Learn more",
  cta_link: "",
  display_order: "1"
};

export default function AdminPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [placeForm, setPlaceForm] = useState<PlaceFormState>(defaultPlaceForm);
  const [adForm, setAdForm] = useState<AdFormState>(defaultAdForm);
  const [editingPlaceId, setEditingPlaceId] = useState<number | null>(null);
  const [editingAdId, setEditingAdId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    if (!isSupabaseConfigured) {
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
    }

    if (!adsResult.error && adsResult.data) {
      setAds(adsResult.data as Ad[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handlePlaceSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isSupabaseConfigured) return;

    const payload = {
      name: placeForm.name,
      category: placeForm.category,
      description: placeForm.description,
      phone: placeForm.phone,
      address: placeForm.address,
      latitude: Number(placeForm.latitude),
      longitude: Number(placeForm.longitude),
      image_url: placeForm.image_url || null
    };

    if (editingPlaceId) {
      await supabase.from("places").update(payload).eq("id", editingPlaceId);
    } else {
      await supabase.from("places").insert(payload);
    }

    setPlaceForm(defaultPlaceForm);
    setEditingPlaceId(null);
    await loadData();
  }

  async function handleAdSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isSupabaseConfigured) return;

    const payload = {
      title: adForm.title,
      image_url: adForm.image_url,
      description: adForm.description,
      cta_text: adForm.cta_text,
      cta_link: adForm.cta_link,
      display_order: Number(adForm.display_order)
    };

    if (editingAdId) {
      await supabase.from("ads").update(payload).eq("id", editingAdId);
    } else {
      await supabase.from("ads").insert(payload);
    }

    setAdForm(defaultAdForm);
    setEditingAdId(null);
    await loadData();
  }

  async function deletePlace(id: number) {
    if (!isSupabaseConfigured) return;
    await supabase.from("places").delete().eq("id", id);
    await loadData();
  }

  async function deleteAd(id: number) {
    if (!isSupabaseConfigured) return;
    await supabase.from("ads").delete().eq("id", id);
    await loadData();
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl bg-white p-6 shadow-panel">
          <p className="text-sm uppercase tracking-wide text-brand-600">Demo admin panel</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Manage JINJA MAPS content</h1>
          <p className="mt-2 text-sm text-slate-600">
            This page has no login by design for demo speed. Everything here updates Supabase directly.
          </p>
        </header>

        {!isSupabaseConfigured && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 shadow-card">
            Supabase is not configured. Add values in <code className="font-mono">.env.local</code> to enable create,
            edit, and delete actions.
          </div>
        )}

        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-card">Loading data…</div>
        )}

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl bg-white p-6 shadow-panel">
            <h2 className="text-xl font-semibold text-slate-900">Places</h2>
            <p className="mt-1 text-sm text-slate-500">Create, edit, and delete map points.</p>
            <form onSubmit={handlePlaceSubmit} className="mt-4 space-y-3">
              <input required placeholder="Company Name" value={placeForm.name} onChange={(e) => setPlaceForm((prev) => ({ ...prev, name: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              <select value={placeForm.category} onChange={(e) => setPlaceForm((prev) => ({ ...prev, category: e.target.value as Category }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <textarea required placeholder="What it does / Description" value={placeForm.description} onChange={(e) => setPlaceForm((prev) => ({ ...prev, description: e.target.value }))} className="h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              <input required placeholder="Phone Number" value={placeForm.phone} onChange={(e) => setPlaceForm((prev) => ({ ...prev, phone: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              <input required placeholder="Exact Address" value={placeForm.address} onChange={(e) => setPlaceForm((prev) => ({ ...prev, address: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="number" step="any" placeholder="Latitude" value={placeForm.latitude} onChange={(e) => setPlaceForm((prev) => ({ ...prev, latitude: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                <input required type="number" step="any" placeholder="Longitude" value={placeForm.longitude} onChange={(e) => setPlaceForm((prev) => ({ ...prev, longitude: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              </div>
              <input placeholder="Image URL (optional)" value={placeForm.image_url} onChange={(e) => setPlaceForm((prev) => ({ ...prev, image_url: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              <div className="flex gap-2">
                <button type="submit" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">{editingPlaceId ? "Update place" : "Add place"}</button>
                {editingPlaceId && <button type="button" onClick={() => { setEditingPlaceId(null); setPlaceForm(defaultPlaceForm); }} className="rounded-xl border border-slate-300 px-4 py-2 text-sm">Cancel</button>}
              </div>
            </form>
            <div className="mt-5 space-y-2">
              {places.map((place) => (
                <div key={place.id} className="rounded-xl border border-slate-200 p-3">
                  <p className="text-sm font-semibold text-slate-900">{place.name}</p>
                  <p className="text-xs text-slate-500">{place.category} • {place.address}</p>
                  <div className="mt-2 flex gap-2">
                    <button type="button" onClick={() => { setEditingPlaceId(place.id); setPlaceForm({ name: place.name, category: place.category, description: place.description, phone: place.phone, address: place.address, latitude: String(place.latitude), longitude: String(place.longitude), image_url: place.image_url ?? "" }); }} className="rounded-lg bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">Edit</button>
                    <button type="button" onClick={() => deletePlace(place.id)} className="rounded-lg bg-red-100 px-3 py-1 text-xs font-medium text-red-700">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl bg-white p-6 shadow-panel">
            <h2 className="text-xl font-semibold text-slate-900">Advertising blocks</h2>
            <p className="mt-1 text-sm text-slate-500">Manage premium ad cards for the discovery panel.</p>
            <form onSubmit={handleAdSubmit} className="mt-4 space-y-3">
              <input required placeholder="Title" value={adForm.title} onChange={(e) => setAdForm((prev) => ({ ...prev, title: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              <input required placeholder="Image URL" value={adForm.image_url} onChange={(e) => setAdForm((prev) => ({ ...prev, image_url: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              <textarea required placeholder="Description" value={adForm.description} onChange={(e) => setAdForm((prev) => ({ ...prev, description: e.target.value }))} className="h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="CTA Text" value={adForm.cta_text} onChange={(e) => setAdForm((prev) => ({ ...prev, cta_text: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                <input required placeholder="CTA Link" value={adForm.cta_link} onChange={(e) => setAdForm((prev) => ({ ...prev, cta_link: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              </div>
              <input required type="number" placeholder="Display Order" value={adForm.display_order} onChange={(e) => setAdForm((prev) => ({ ...prev, display_order: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              <div className="flex gap-2">
                <button type="submit" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">{editingAdId ? "Update ad" : "Add ad"}</button>
                {editingAdId && <button type="button" onClick={() => { setEditingAdId(null); setAdForm(defaultAdForm); }} className="rounded-xl border border-slate-300 px-4 py-2 text-sm">Cancel</button>}
              </div>
            </form>

            <div className="mt-5 space-y-2">
              {ads.map((ad) => (
                <div key={ad.id} className="rounded-xl border border-slate-200 p-3">
                  <p className="text-sm font-semibold text-slate-900">#{ad.display_order} {ad.title}</p>
                  <p className="text-xs text-slate-500">{ad.cta_text} • {ad.cta_link}</p>
                  <div className="mt-2 flex gap-2">
                    <button type="button" onClick={() => { setEditingAdId(ad.id); setAdForm({ title: ad.title, image_url: ad.image_url, description: ad.description, cta_text: ad.cta_text, cta_link: ad.cta_link, display_order: String(ad.display_order) }); }} className="rounded-lg bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">Edit</button>
                    <button type="button" onClick={() => deleteAd(ad.id)} className="rounded-lg bg-red-100 px-3 py-1 text-xs font-medium text-red-700">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
