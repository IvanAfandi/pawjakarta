/**
 * PawJakarta — Data Layer
 * Google Sheets CSV fetch + thumbnail images + fallback data.
 */

// Place thumbnails — sourced from Unsplash (free, no attribution required for UI use)
// Keys match place `id` field. Replace with actual venue photos once available.
const PLACE_THUMBNAILS = {
  "1":  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",  // dog park grass
  "2":  "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=600&q=80",  // outdoor mall
  "3":  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", // restaurant outdoor
  "4":  "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&q=80", // mall avenue
  "5":  "https://images.unsplash.com/photo-1600804931749-2da4ce26c869?w=600&q=80", // park sunset
  "6":  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80", // cafe interior
  "7":  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80", // coffee roastery
  "8":  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80", // mall interior
  "9":  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80",  // dog swimming
  "10": "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80", // gelato
};

const FALLBACK_DATA = [
  { id:"1",  name:"Como Park",                        area:"Kemang, South Jakarta",         type:"park",       address:"Jl. Kemang Timur No.15 998, Bangka, Mampang Prapatan, South Jakarta 12730", hours:"Daily, approx. 10:00 AM – 10:00 PM", pet_size:"All sizes",                    rules:"Dogs may go off-leash inside the enclosed dog park;Vaccination recommended;Clean up after your pet;Well-behaved pets only",                                         notes:"Community hub with cafés, pizza, gelato, and an enclosed grassy dog park with iron fencing. Very popular on weekends.", status:"published" },
  { id:"2",  name:"Tribeca Park (Central Park Mall)", area:"Tanjung Duren, West Jakarta",   type:"mall",       address:"Letjen S. Parman Kav.28, Podomoro City, Jakarta 11470",                    hours:"Mon–Sun, 10:00 AM – 2:00 AM",       pet_size:"All sizes",                    rules:"Pets allowed in outdoor park area;Leash required in common areas;Indoor mall areas have separate rules",                                                          notes:"Hosts large-scale dog community meetups and pet festivals. Follow social media for upcoming events.", status:"published" },
  { id:"3",  name:"Cork & Screw Country Club",        area:"Senayan, Central Jakarta",       type:"restaurant", address:"Avenue, Senayan, Jl. Asia Afrika, Central Jakarta",                        hours:"Weekdays 10:00 AM · Weekends 9:00 AM", pet_size:"Small dogs only",             rules:"Dogs allowed Sat & Sun only until 4:00 PM;Fully vaccinated required;Leash required at all times;Outdoor/outside premises only",                                   notes:"Brunch, afternoon tea, lunch and dinner. International menu. Weekend pet visits — plan ahead.", status:"published" },
  { id:"4",  name:"Avenue of the Stars — Lippo Mall", area:"North Cipete, South Jakarta",   type:"mall",       address:"Jl. Pangeran Antasari No.36, North Cipete, South Jakarta 12150",            hours:"Mon–Sun, 10:00 AM – 12:00 AM",      pet_size:"All sizes (outdoor area)",     rules:"Pets allowed in outdoor Avenue of the Stars area;Leash required;Indoor mall access requires carrier",                                                             notes:"Large outdoor area with pop-up markets and open-air dining. Hosts celebrity events and pet festivals.", status:"published" },
  { id:"5",  name:"Senayan Park Dog Park",            area:"Tanah Abang, Central Jakarta",  type:"park",       address:"Jl. Gerbang Pemuda No.3, Gelora, Tanah Abang, Jakarta Pusat 10270",         hours:"Open daily — best at golden hour",   pet_size:"All sizes",                    rules:"Stay within pet-allowed zones;Clean up after your pet;Designated dog park area only",                                                                             notes:"Popular sunset spot with dedicated dog park. Great place to meet other pet owners.", status:"published" },
  { id:"6",  name:"Amyrea Art & Kitchen",             area:"Kelapa Gading, North Jakarta",  type:"cafe",       address:"Jl. Gading Putih Raya CA2, Kelapa Gading, North Jakarta",                  hours:"Check Instagram @amyreacafe",        pet_size:"All sizes (diapers required)", rules:"Dogs allowed inside and outside;Dogs must wear diapers;Well-behaved pets only",                                                                                   notes:"Creative food art café. Colorful and welcoming. Dogs allowed throughout with the diaper rule.", status:"published" },
  { id:"7",  name:"Simetri Coffee Roastery",          area:"Gandaria / Wijaya, South Jakarta", type:"cafe",    address:"Jl. Wijaya & Gandaria, South Jakarta",                                     hours:"Check branch for current hours",     pet_size:"All sizes (outdoor areas)",    rules:"Pets allowed in outdoor/semi-outdoor terrace only;Leash required at all times",                                                                                   notes:"Specialises in coffee + Asian-American-Italian food. Semi-outdoor terrace inside a revamped house.", status:"published" },
  { id:"8",  name:"PIK Avenue Mall",                  area:"Pantai Indah Kapuk, North Jakarta", type:"mall",   address:"Jl. Pantai Indah Kapuk Boulevard, Jakarta Utara 14470",                   hours:"Typically 10:00 AM – 10:00 PM",      pet_size:"All sizes (diapers required)", rules:"Pets allowed G–3F;Pets must wear diapers inside;Keep pets under control",                                                                                         notes:"One of the most pet-inclusive malls in Jakarta. Nearly all floors accessible.", status:"published" },
  { id:"9",  name:"Mall Kelapa Gading — Gading Walk", area:"Kelapa Gading, North Jakarta",  type:"mall",       address:"Summarecon Mall Kelapa Gading, Jl. Boulevard Raya, Klp. Gading 14240",     hours:"Standard mall hours",                pet_size:"All sizes",                    rules:"Pets allowed in Gading Walk outdoor garden area;Pets may swim in designated area;Well-behaved pets only",                                                         notes:"Long-standing dog-friendly mall. Garden and swimming area for pets. Regularly hosts pet events.", status:"published" },
  { id:"10", name:"Vilo Gelato Barito",               area:"Barito, South Jakarta",          type:"cafe",       address:"Barito area, South Jakarta (near Langsat Park)",                           hours:"Check Instagram for current hours",   pet_size:"All sizes",                    rules:"Pet-friendly outdoor area;Overlooks Langsat Park;Well-behaved pets only",                                                                                         notes:"Lovely atmosphere with a view over Langsat Park. Signature, vegan, and sorbet gelato.", status:"published" },
];

const TYPE_META = {
  park:       { label:"Park",       emoji:"🌳", colorClass:"type-park" },
  cafe:       { label:"Café",       emoji:"☕", colorClass:"type-cafe" },
  mall:       { label:"Mall",       emoji:"🏬", colorClass:"type-mall" },
  restaurant: { label:"Restaurant", emoji:"🍽️", colorClass:"type-resto" },
  other:      { label:"Other",      emoji:"📍", colorClass:"type-other" },
};

let _cache = null;
let _cacheTime = 0;

function parseCSV(csv) {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h => h.replace(/"/g,"").trim());
  return lines.slice(1).map(line => {
    const cols = [];
    let cur = ""; let inQ = false;
    for (let ch of line) {
      if (ch === '"') { inQ = !inQ; continue; }
      if (ch === "," && !inQ) { cols.push(cur.trim()); cur=""; continue; }
      cur += ch;
    }
    cols.push(cur.trim());
    const obj = {};
    headers.forEach((h,i) => { obj[h] = cols[i] ?? ""; });
    return obj;
  }).filter(r => !r.status || r.status === "published");
}

async function fetchPlaces() {
  if (_cache && (Date.now() - _cacheTime) < CONFIG.CACHE_TTL) return _cache;

  showLoading(true);
  const isPlaceholder = CONFIG.SHEET_CSV_URL.includes("YOUR_SHEET_ID");

  if (!isPlaceholder) {
    try {
      const res = await fetch(CONFIG.SHEET_CSV_URL);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = parseCSV(await res.text());
      if (data.length > 0) {
        _cache = data; _cacheTime = Date.now();
        showLoading(false);
        return data;
      }
    } catch(e) {
      console.warn("Sheet fetch failed:", e.message);
      if (!CONFIG.USE_FALLBACK_ON_ERROR) { showLoading(false); showError(true); return []; }
    }
  }

  showLoading(false);
  _cache = FALLBACK_DATA; _cacheTime = Date.now();
  return FALLBACK_DATA;
}

async function submitPlace(formData) {
  const isPlaceholder = CONFIG.APPS_SCRIPT_URL.includes("YOUR_SCRIPT_ID");
  if (isPlaceholder) {
    await new Promise(r => setTimeout(r, 900));
    return { ok:true, message:"Demo: submission would go to your Google Sheet for review!", demo:true };
  }
  try {
    const params = new URLSearchParams({ action:"submitPlace", ...formData, status:"pending", submitted_at: new Date().toISOString() });
    const res = await fetch(CONFIG.APPS_SCRIPT_URL + "?" + params.toString());
    const json = await res.json();
    return { ok:true, message: json.message || "Submitted!" };
  } catch(e) {
    return { ok:false, message:"Network error. Please try again." };
  }
}

function getThumbnail(id) {
  return PLACE_THUMBNAILS[String(id)] || null;
}

function showLoading(show) {
  document.getElementById("loadingState").classList.toggle("hidden", !show);
  document.getElementById("placesGrid").classList.toggle("hidden", show);
}

function showError(show) {
  document.getElementById("errorState").classList.toggle("hidden", !show);
}
