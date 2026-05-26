/**
 * PawJakarta — App Logic
 * Directory: render, filter, search, modal. Form submit.
 */

let allPlaces = [];
let activeFilter = "all";
let activeSort = "default";
let searchTerm = "";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function isLikelyOpen() { const h = new Date().getHours(); return h >= 9 && h < 22; }
function getTypeMeta(t) { return TYPE_META[t] || TYPE_META.other; }
function san(s) { return (s||"").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function rulesArr(s) { return (s||"").split(";").map(r=>r.trim()).filter(Boolean); }

// ─── Filter ───────────────────────────────────────────────────────────────────
function getFiltered() {
  let list = allPlaces.slice();
  if (activeFilter !== "all") {
    if (activeFilter === "small") list = list.filter(p => (p.pet_size||"").toLowerCase().includes("small"));
    else list = list.filter(p => p.type === activeFilter);
  }
  if (searchTerm) {
    const q = searchTerm.toLowerCase();
    list = list.filter(p =>
      (p.name||"").toLowerCase().includes(q) ||
      (p.area||"").toLowerCase().includes(q) ||
      (p.notes||"").toLowerCase().includes(q) ||
      (p.type||"").toLowerCase().includes(q)
    );
  }
  if (activeSort === "alpha") list.sort((a,b)=>(a.name||"").localeCompare(b.name||""));
  if (activeSort === "area")  list.sort((a,b)=>(a.area||"").localeCompare(b.area||""));
  return list;
}

// ─── Render Grid ──────────────────────────────────────────────────────────────
function renderGrid() {
  const grid = document.getElementById("placesGrid");
  const emptyState = document.getElementById("emptyState");
  const filtered = getFiltered();

  document.getElementById("heroCount").textContent = allPlaces.length;

  if (filtered.length === 0) {
    grid.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  grid.innerHTML = filtered.map((p, i) => {
    const meta = getTypeMeta(p.type);
    const rules = rulesArr(p.rules);
    const open = isLikelyOpen();
    const thumb = getThumbnail(p.id);
    const isSmall = (p.pet_size||"").toLowerCase().includes("small");

    return `
    <article class="place-card animate-in" style="animation-delay:${i*45}ms"
      data-id="${san(p.id)}" tabindex="0" role="button" aria-label="View details for ${san(p.name)}">
      ${thumb ? `
      <div class="card-thumb">
        <img src="${thumb}" alt="${san(p.name)}" loading="lazy" onerror="this.parentElement.style.display='none'" />
        <div class="card-thumb-overlay">
          <span class="card-type-badge ${meta.colorClass}">${meta.emoji} ${san(meta.label)}</span>
        </div>
      </div>` : `
      <div class="card-thumb card-thumb-placeholder ${meta.colorClass}">
        <span class="card-thumb-emoji">${meta.emoji}</span>
        <div class="card-thumb-overlay">
          <span class="card-type-badge">${meta.emoji} ${san(meta.label)}</span>
        </div>
      </div>`}
      <div class="card-content">
        <div class="card-header">
          <div class="card-name-wrap">
            <h3 class="card-name">${san(p.name)}</h3>
            <div class="card-area"><i class="ti ti-map-pin"></i>${san(p.area)}</div>
          </div>
          <div class="card-badges">
            <span class="badge badge-open ${open ? "" : "badge-maybe"}">
              <i class="ti ti-clock"></i>${open ? "Open" : "Closed?"}
            </span>
          </div>
        </div>
        ${p.notes ? `<p class="card-notes">${san(p.notes).substring(0,100)}${p.notes.length>100?"…":""}</p>` : ""}
        <div class="card-pills">
          <span class="pill"><i class="ti ti-dog"></i>${san(isSmall ? "Small pets" : "All sizes")}</span>
          ${rules[0] ? `<span class="pill pill-rule"><i class="ti ti-list-check"></i>${san(rules[0].substring(0,36))}${rules[0].length>36?"…":""}</span>` : ""}
        </div>
        <div class="card-footer">
          <span class="card-hours"><i class="ti ti-clock"></i>${san((p.hours||"Check before visiting").split("·")[0].trim().substring(0,40))}</span>
          <button class="card-details-btn">Details <i class="ti ti-arrow-right"></i></button>
        </div>
      </div>
    </article>`;
  }).join("");

  grid.querySelectorAll(".place-card").forEach(card => {
    card.addEventListener("click", () => openModal(card.dataset.id));
    card.addEventListener("keydown", e => { if(e.key==="Enter"||e.key===" ") openModal(card.dataset.id); });
  });
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function openModal(id) {
  const place = allPlaces.find(p => String(p.id) === String(id));
  if (!place) return;
  const meta = getTypeMeta(place.type);
  const rules = rulesArr(place.rules);
  const open = isLikelyOpen();
  const thumb = getThumbnail(place.id);

  document.getElementById("modalBody").innerHTML = `
    ${thumb ? `<div class="modal-thumb"><img src="${thumb}" alt="${san(place.name)}" /></div>` : ""}
    <div class="modal-hero ${meta.colorClass}" style="${thumb ? 'border-radius:0' : ''}">
      <div class="modal-hero-icon">${meta.emoji}</div>
      <div class="modal-hero-text">
        <span class="modal-type">${san(meta.label)}</span>
        <h2 id="modalTitle">${san(place.name)}</h2>
        <div class="modal-area"><i class="ti ti-map-pin"></i>${san(place.area)}</div>
      </div>
    </div>
    <div class="modal-content">
      <div class="modal-badges">
        <span class="badge badge-open ${open?"":"badge-maybe"}"><i class="ti ti-clock"></i>${open?"Likely open now":"May be closed now"}</span>
        <span class="badge badge-size"><i class="ti ti-dog"></i>${san(place.pet_size||"All sizes")}</span>
      </div>
      <div class="modal-section">
        <div class="modal-section-label"><i class="ti ti-clock"></i>Opening hours</div>
        <div class="modal-section-val">${san(place.hours||"Check before visiting")}</div>
      </div>
      <div class="modal-section">
        <div class="modal-section-label"><i class="ti ti-map-pin"></i>Address</div>
        <div class="modal-section-val">${san(place.address||"Jakarta, Indonesia")}</div>
        <a class="modal-map-link" href="https://www.google.com/maps/search/${encodeURIComponent(place.name+" "+place.area)}" target="_blank" rel="noopener">
          <i class="ti ti-map"></i> Open in Google Maps
        </a>
      </div>
      ${rules.length>0?`
      <div class="modal-section">
        <div class="modal-section-label"><i class="ti ti-list-check"></i>Rules & regulations</div>
        <ul class="modal-rules">${rules.map(r=>`<li><i class="ti ti-point"></i>${san(r)}</li>`).join("")}</ul>
      </div>`:""}
      ${place.notes?`
      <div class="modal-section">
        <div class="modal-section-label"><i class="ti ti-info-circle"></i>Notes</div>
        <div class="modal-section-val">${san(place.notes)}</div>
      </div>`:""}
      <div class="modal-cta-row">
        <a class="btn-primary" href="https://www.google.com/maps/search/${encodeURIComponent(place.name+" "+place.area)}" target="_blank" rel="noopener">
          <i class="ti ti-navigation"></i>Get directions
        </a>
        <button class="btn-secondary" onclick="sharePlace('${san(place.name)}','${san(place.area)}')">
          <i class="ti ti-share"></i>Share
        </button>
      </div>
    </div>`;

  document.getElementById("modalOverlay").classList.remove("hidden");
  document.body.style.overflow = "hidden";
  document.getElementById("modalClose").focus();
}

function closeModal() {
  document.getElementById("modalOverlay").classList.add("hidden");
  document.body.style.overflow = "";
}

function sharePlace(name, area) {
  const text = `Check out ${name} in ${area} — pet-friendly in Jakarta! 🐾 via PawJakarta`;
  if (navigator.share) navigator.share({ title:name, text });
  else navigator.clipboard.writeText(text).then(()=>alert("Copied!"));
}

// ─── Live Hero Search Dropdown ────────────────────────────────────────────────
function renderHeroSearchResults(query) {
  const dropdown = document.getElementById("heroSearchResults");
  if (!query || query.length < 2) { dropdown.classList.add("hidden"); return; }
  const q = query.toLowerCase();
  const hits = allPlaces.filter(p =>
    (p.name||"").toLowerCase().includes(q) ||
    (p.area||"").toLowerCase().includes(q) ||
    (p.type||"").toLowerCase().includes(q)
  ).slice(0, 6);

  if (hits.length === 0) {
    dropdown.innerHTML = `<div class="hsr-empty">No results for "<strong>${san(query)}</strong>"</div>`;
  } else {
    dropdown.innerHTML = hits.map(p => {
      const meta = getTypeMeta(p.type);
      return `<div class="hsr-item" data-id="${san(p.id)}">
        <span class="hsr-emoji">${meta.emoji}</span>
        <div class="hsr-info">
          <strong>${san(p.name)}</strong>
          <span>${san(p.area)}</span>
        </div>
        <span class="hsr-type">${san(meta.label)}</span>
      </div>`;
    }).join("");
    dropdown.querySelectorAll(".hsr-item").forEach(item => {
      item.addEventListener("click", () => {
        dropdown.classList.add("hidden");
        document.getElementById("heroSearch").value = "";
        document.getElementById("directory").scrollIntoView({ behavior:"smooth" });
        setTimeout(() => openModal(item.dataset.id), 400);
      });
    });
  }
  dropdown.classList.remove("hidden");
}

// ─── Form ─────────────────────────────────────────────────────────────────────
async function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById("submitBtn");
  const btnText = document.getElementById("submitBtnText");
  const successEl = document.getElementById("formSuccess");
  const errorEl = document.getElementById("formError");
  const errorMsg = document.getElementById("formErrorMsg");
  const successMsg = document.getElementById("formSuccessMsg");
  successEl.classList.add("hidden");
  errorEl.classList.add("hidden");

  const name = document.getElementById("f_name").value.trim();
  const area = document.getElementById("f_area").value.trim();
  const type = document.getElementById("f_type").value;
  if (!name || !area || !type) {
    errorMsg.textContent = "Please fill in name, area, and type.";
    errorEl.classList.remove("hidden"); return;
  }

  btn.disabled = true; btnText.textContent = "Submitting…";
  const result = await submitPlace({
    name, area, type,
    address: document.getElementById("f_address").value.trim(),
    hours:   document.getElementById("f_hours").value.trim(),
    pet_size: document.getElementById("f_petsize").value,
    rules:   document.getElementById("f_rules").value.trim(),
    notes:   document.getElementById("f_notes").value.trim(),
  });
  btn.disabled = false; btnText.textContent = "Submit Place";

  if (result.ok) {
    document.getElementById("submitForm").reset();
    successMsg.textContent = result.message || "Thanks! Your submission has been received.";
    successEl.classList.remove("hidden");
  } else {
    errorMsg.textContent = result.message;
    errorEl.classList.remove("hidden");
  }
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function initNav() {
  window.addEventListener("scroll", () => {
    document.getElementById("nav").classList.toggle("nav-scrolled", window.scrollY > 60);
  }, { passive:true });
  document.getElementById("hamburger").addEventListener("click", () => {
    document.getElementById("navMobile").classList.toggle("open");
  });
  document.querySelectorAll(".nav-mobile a").forEach(a =>
    a.addEventListener("click", () => document.getElementById("navMobile").classList.remove("open"))
  );
}

function initScrollObserver() {
  if (!("IntersectionObserver" in window)) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add("visible"); obs.unobserve(e.target); } });
  }, { threshold:0.1 });
  document.querySelectorAll(".about-grid, .submit-card, .pm-grid, .pawmatch-header").forEach(el => obs.observe(el));
}

// ─── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  initNav();

  // Hero search — live dropdown
  const heroInput = document.getElementById("heroSearch");
  heroInput.addEventListener("input", e => renderHeroSearchResults(e.target.value));
  heroInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      searchTerm = heroInput.value;
      document.getElementById("dirSearch").value = searchTerm;
      document.getElementById("heroSearchResults").classList.add("hidden");
      document.getElementById("directory").scrollIntoView({ behavior:"smooth" });
    }
  });
  document.getElementById("heroSearchBtn").addEventListener("click", () => {
    searchTerm = heroInput.value;
    document.getElementById("dirSearch").value = searchTerm;
    document.getElementById("heroSearchResults").classList.add("hidden");
    document.getElementById("directory").scrollIntoView({ behavior:"smooth" });
    renderGrid();
  });
  document.addEventListener("click", e => {
    if (!e.target.closest(".hero-search-wrap")) {
      document.getElementById("heroSearchResults").classList.add("hidden");
    }
  });

  // Directory search
  document.getElementById("dirSearch").addEventListener("input", e => {
    searchTerm = e.target.value;
    renderGrid();
  });

  // Chips
  document.getElementById("chips").addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    activeFilter = chip.dataset.filter;
    renderGrid();
  });

  // Sort
  document.getElementById("sortSelect").addEventListener("change", e => {
    activeSort = e.target.value;
    renderGrid();
  });

  // Modal
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalOverlay").addEventListener("click", e => {
    if (e.target === document.getElementById("modalOverlay")) closeModal();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });

  // Form
  document.getElementById("submitForm").addEventListener("submit", handleFormSubmit);

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const t = document.querySelector(a.getAttribute("href"));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior:"smooth" }); }
    });
  });

  // Data + render
  allPlaces = await fetchPlaces();
  renderGrid();
  initScrollObserver();

  // PawMatch
  initPawMatch();
}

document.addEventListener("DOMContentLoaded", init);
