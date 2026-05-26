/**
 * PawJakarta — PawMatch Module (v3)
 * CV/promotional profile directory for dogs seeking companions.
 * No swiping — rich profile cards in a magazine grid, full-page detail modal.
 */

// ─── Dog photo pool (Unsplash, free for display) ─────────────────────────────
const DOG_PHOTOS = {
  d1: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=85",  // Shiba Inu
  d2: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&q=85",  // Golden
  d3: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&q=85",  // Frenchie
  d4: "https://images.unsplash.com/photo-1503256207526-0d5523f31539?w=600&q=85",  // Border Collie
  d5: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&q=85",  // Pomeranian
  d6: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=600&q=85",  // Husky
  d7: "https://images.unsplash.com/photo-1612195583950-b8fd34c87093?w=600&q=85",  // Corgi
  d8: "https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?w=600&q=85",  // Labrador
};

// ─── Dog profiles ─────────────────────────────────────────────────────────────
const DEMO_DOGS = [
  {
    id: "d1",
    name: "Mochi",
    breed: "Shiba Inu",
    age: "2 years",
    gender: "Female",
    size: "Medium",
    area: "Kemang, South Jakarta",
    funFact: "Knows 12 commands in three languages 🌍",
    bio: "I'm a calm, confident Shiba who enjoys weekend mornings at Como Park and long naps in between zoomie sessions. Looking for a healthy, well-tempered male Shiba or similar Spitz breed. My owner takes responsible breeding very seriously — health checks provided.",
    contact: "@mochithedog_jkt",
    contactType: "instagram",
    accentColor: "#FFF3CD",
    accentText: "#92600A",
  },
  {
    id: "d2",
    name: "Biscuit",
    breed: "Golden Retriever",
    age: "3 years",
    gender: "Male",
    size: "Large",
    area: "PIK, North Jakarta",
    funFact: "Holds the unofficial PIK beach fetch record 🏆",
    bio: "Easygoing golden boy who loves everyone he meets. Champion swimmer, certified good boy, zero drama policy. Seeking a gentle, healthy female Golden or Labrador. OFA hip certified, full vaccination history available.",
    contact: "@biscuit.golden",
    contactType: "instagram",
    accentColor: "#D8F3DC",
    accentText: "#2D6A4F",
  },
  {
    id: "d3",
    name: "Luna",
    breed: "French Bulldog",
    age: "1.5 years",
    gender: "Female",
    size: "Small",
    area: "Menteng, Central Jakarta",
    funFact: "Snores louder than the TV at full volume 📺",
    bio: "Don't let the smooshy face fool you — Luna is full of opinions and zero apologies. Loves air conditioning, soft blankets, and strategic face-licking. Looking for a healthy male Frenchie from a reputable breeder. All health testing docs welcome.",
    contact: "@lunabulldogjakarta",
    contactType: "instagram",
    accentColor: "#FAECE7",
    accentText: "#A0422A",
  },
  {
    id: "d4",
    name: "Oreo",
    breed: "Border Collie",
    age: "4 years",
    gender: "Male",
    size: "Medium",
    area: "Kelapa Gading, North Jakarta",
    funFact: "Has memorized the location of every ball in the house 🎾",
    bio: "Highly intelligent, extremely driven, and absolutely incapable of doing nothing. Competing in agility since age 1. Looking for an equally sharp female Border Collie with confirmed herding lineage. Working dog energy is a must.",
    contact: "+6281298760001",
    contactType: "whatsapp",
    accentColor: "#E6F1FB",
    accentText: "#1D4E7C",
  },
  {
    id: "d5",
    name: "Cinnamon",
    breed: "Pomeranian",
    age: "1 year",
    gender: "Female",
    size: "Small",
    area: "Sudirman, Central Jakarta",
    funFact: "Has a dedicated Instagram with 4,200 followers 🌟",
    bio: "Cloud-shaped chaos in the best possible way. Cinnamon is tiny, fluffy, very loud, and completely sure she's the most important being in any room. Seeking a show-quality or pet-quality male Pom. Colour preference: cream or orange sable.",
    contact: "@cinnamonpom_id",
    contactType: "instagram",
    accentColor: "#FFE8F0",
    accentText: "#963060",
  },
  {
    id: "d6",
    name: "Titan",
    breed: "Siberian Husky",
    age: "2.5 years",
    gender: "Male",
    size: "Large",
    area: "Kemang, South Jakarta",
    funFact: "Escapes any leash known to man and always comes back for dinner ❄️",
    bio: "Majestically offended by Jakarta's heat but absolutely thrives in the AC. Titan is sweet, talkative, and deeply dramatic. His family is looking for a female Husky who matches his energy and ideally has a working dog pedigree. Hip and eye certified.",
    contact: "+6281399870002",
    contactType: "whatsapp",
    accentColor: "#EEF0FF",
    accentText: "#3A3A8A",
  },
  {
    id: "d7",
    name: "Kopi",
    breed: "Pembroke Welsh Corgi",
    age: "3 years",
    gender: "Female",
    size: "Small",
    area: "Senopati, South Jakarta",
    funFact: "Speed-runs obstacle courses in under 45 seconds ⚡",
    bio: "Big heart, short legs, zero excuses. Kopi is a happy, bouncy Corgi who could outrun dogs twice her size. Looking for a healthy male Corgi — show or working lines welcome. DNA panel, OFA, and PHPT testing all clear.",
    contact: "@kopitheCorgi",
    contactType: "instagram",
    accentColor: "#FFF0E0",
    accentText: "#8C4A00",
  },
  {
    id: "d8",
    name: "Rex",
    breed: "Labrador Retriever",
    age: "5 years",
    gender: "Male",
    size: "Large",
    area: "Kelapa Gading, North Jakarta",
    funFact: "Has never met a stranger — or a snack he didn't finish 🎩",
    bio: "The distinguished gentleman of Gading Walk. Rex is calm, loyal, and incredibly food-motivated — which means training was easy. Now in his prime, his family is looking for a gentle, health-tested female Lab (yellow, black, or chocolate). EIC and HNPK clear.",
    contact: "@rexlabrador_jkt",
    contactType: "instagram",
    accentColor: "#E8F5E9",
    accentText: "#2E6B3E",
  },
];

// ─── State ────────────────────────────────────────────────────────────────────
let activeGenderFilter = "all";
let userDogs = [];         // dogs listed by the current user (stored in localStorage)
let selectedPhotoDataUrl = null;

// ─── Persist ──────────────────────────────────────────────────────────────────
function pmSave() {
  try { localStorage.setItem("pawmatch_userdogs", JSON.stringify(userDogs)); } catch(e) {}
}
function pmLoad() {
  try {
    const d = localStorage.getItem("pawmatch_userdogs");
    if (d) userDogs = JSON.parse(d);
  } catch(e) {}
}

// ─── All dogs (demo + user-listed) ───────────────────────────────────────────
function getAllDogs() {
  const ud = userDogs.map(d => ({ ...d, isUserDog: true }));
  return [...DEMO_DOGS, ...ud];
}

// ─── Gender filter ────────────────────────────────────────────────────────────
function getFilteredDogs() {
  const all = getAllDogs();
  if (activeGenderFilter === "all") return all;
  return all.filter(d => d.gender === activeGenderFilter);
}

// ─── Render the profile grid ──────────────────────────────────────────────────
function renderPmGrid() {
  const grid = document.getElementById("pmGrid");
  const dogs = getFilteredDogs();
  const mcEl = document.getElementById("matchCount");
  if (mcEl) mcEl.textContent = getAllDogs().length;

  if (dogs.length === 0) {
    grid.innerHTML = `<div class="pm-empty"><div class="pm-empty-icon">🐾</div><p>No profiles for this filter yet.</p></div>`;
    return;
  }

  grid.innerHTML = dogs.map((dog, i) => buildProfileCard(dog, i)).join("");

  // Click to open detail
  grid.querySelectorAll(".pm-card").forEach(card => {
    card.addEventListener("click", () => openDogProfile(card.dataset.id));
    card.addEventListener("keydown", e => { if (e.key === "Enter") openDogProfile(card.dataset.id); });
  });
}

// ─── Profile Card (the "CV thumbnail") ───────────────────────────────────────
function buildProfileCard(dog, i) {
  const photo = dog.photo || DOG_PHOTOS[dog.id] || "";
  const genderPill = dog.gender === "Female"
    ? `<span class="pm-gender pm-gender-f">🩷 Female</span>`
    : `<span class="pm-gender pm-gender-m">💙 Male</span>`;
  const isUserDog = dog.isUserDog ? `<span class="pm-badge-user">My listing</span>` : "";

  return `
  <article class="pm-card pm-card-in" style="animation-delay:${i * 60}ms" data-id="${dog.id}" tabindex="0" role="button" aria-label="View ${dog.name}'s profile">
    <div class="pm-card-photo">
      ${photo
        ? `<img src="${photo}" alt="${dog.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />`
        : ""}
      <div class="pm-card-photo-fallback" style="background:${dog.accentColor || '#D8F3DC'};${photo ? 'display:none' : 'display:flex'}">
        <span>🐾</span>
      </div>
      <div class="pm-card-photo-gradient"></div>
      <div class="pm-card-photo-badges">
        ${genderPill}
        ${isUserDog}
      </div>
    </div>
    <div class="pm-card-body">
      <div class="pm-card-name-row">
        <h3 class="pm-card-name">${dog.name}</h3>
        <span class="pm-card-age">${dog.age}</span>
      </div>
      <p class="pm-card-breed">${dog.breed} · ${dog.size}</p>
      <div class="pm-card-funfact">
        <i class="ti ti-sparkles"></i>
        <span>${dog.funFact}</span>
      </div>
      <div class="pm-card-location">
        <i class="ti ti-map-pin"></i>
        <span>${dog.area}</span>
      </div>
      <button class="pm-card-cta">View Full Profile <i class="ti ti-arrow-right"></i></button>
    </div>
  </article>`;
}

// ─── Full-page dog profile modal ──────────────────────────────────────────────
function openDogProfile(id) {
  const dog = getAllDogs().find(d => d.id === id);
  if (!dog) return;

  const photo = dog.photo || DOG_PHOTOS[dog.id] || "";
  const genderLabel = dog.gender === "Female" ? "🩷 Female" : "💙 Male";
  const isIG = dog.contactType === "instagram" || dog.contact?.startsWith("@");
  const contactHref = isIG
    ? `https://instagram.com/${dog.contact.replace("@", "")}`
    : `https://wa.me/${dog.contact.replace(/\D/g, "")}`;
  const contactIcon = isIG ? "ti-brand-instagram" : "ti-brand-whatsapp";
  const contactLabel = isIG ? "DM on Instagram" : "Message on WhatsApp";

  const sizeMap = { Small: "Small (under 10kg)", Medium: "Medium (10–25kg)", Large: "Large (25kg+)" };

  document.getElementById("dogProfileBody").innerHTML = `
    <div class="dp-hero" style="background: ${dog.accentColor || '#D8F3DC'}">
      ${photo
        ? `<img class="dp-photo" src="${photo}" alt="${dog.name}" onerror="this.style.display='none'" />`
        : `<div class="dp-photo-fallback">🐾</div>`}
      <div class="dp-hero-overlay">
        <div class="dp-hero-name">
          <h2 id="dogProfileTitle">${dog.name}</h2>
          <span class="dp-breed-tag">${dog.breed}</span>
        </div>
      </div>
    </div>

    <div class="dp-body">

      <!-- Identity strip -->
      <div class="dp-identity">
        <div class="dp-id-pill">${genderLabel}</div>
        <div class="dp-id-pill"><i class="ti ti-cake"></i> ${dog.age}</div>
        <div class="dp-id-pill"><i class="ti ti-ruler"></i> ${sizeMap[dog.size] || dog.size}</div>
        <div class="dp-id-pill"><i class="ti ti-map-pin"></i> ${dog.area}</div>
      </div>

      <!-- Fun fact highlight -->
      <div class="dp-funfact-block">
        <div class="dp-funfact-label"><i class="ti ti-sparkles"></i> Fun Fact</div>
        <p class="dp-funfact-text">${dog.funFact}</p>
      </div>

      <!-- About / Bio -->
      ${dog.bio ? `
      <div class="dp-section">
        <div class="dp-section-label"><i class="ti ti-id-badge"></i> About Me</div>
        <p class="dp-bio">${dog.bio}</p>
      </div>` : ""}

      <!-- What I'm looking for -->
      <div class="dp-looking-for">
        <div class="dp-lf-label">Looking for</div>
        <p class="dp-lf-text">A healthy ${dog.gender === "Female" ? "male" : "female"} ${dog.breed} in Jakarta for responsible companionship. Owner-verified health checks welcomed.</p>
      </div>

      <!-- Contact CTA -->
      <div class="dp-contact-block">
        <div class="dp-contact-label">Get to Know Me</div>
        <p class="dp-contact-sub">Reach out to ${dog.name}'s owner to learn more, share health records, or arrange a meet-up at one of Jakarta's pet-friendly parks.</p>
        <a class="dp-contact-btn" href="${contactHref}" target="_blank" rel="noopener">
          <i class="ti ${contactIcon}"></i>
          ${contactLabel}
        </a>
        <p class="dp-contact-note"><i class="ti ti-shield-check"></i> Always meet in a public, pet-friendly space first.</p>
      </div>

    </div>`;

  document.getElementById("dogProfileOverlay").classList.remove("hidden");
  document.body.style.overflow = "hidden";
  document.getElementById("dogProfileClose").focus();
}

function closeDogProfile() {
  document.getElementById("dogProfileOverlay").classList.add("hidden");
  document.body.style.overflow = "";
}

// ─── List My Dog modal ────────────────────────────────────────────────────────
function openListDogModal() {
  // reset form
  document.getElementById("dog_name").value = "";
  document.getElementById("dog_breed").value = "";
  document.getElementById("dog_age").value = "";
  document.getElementById("dog_gender").value = "Female";
  document.getElementById("dog_size").value = "Small";
  document.getElementById("dog_area").value = "";
  document.getElementById("dog_funfact").value = "";
  document.getElementById("dog_bio").value = "";
  document.getElementById("owner_contact").value = "";
  document.getElementById("dogPhotoImg").style.display = "none";
  document.getElementById("dogPhotoPlaceholder").style.display = "block";
  selectedPhotoDataUrl = null;

  document.getElementById("dogModalOverlay").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeListDogModal() {
  document.getElementById("dogModalOverlay").classList.add("hidden");
  document.body.style.overflow = "";
}

function saveUserDog() {
  const name = document.getElementById("dog_name").value.trim();
  const breed = document.getElementById("dog_breed").value.trim();
  const area = document.getElementById("dog_area").value.trim();
  const contact = document.getElementById("owner_contact").value.trim();
  const funFact = document.getElementById("dog_funfact").value.trim();

  if (!name || !breed || !area || !contact) {
    alert("Please fill in Name, Breed, Area, and Contact.");
    return;
  }

  const isIG = contact.startsWith("@") || (!contact.startsWith("+") && !contact.match(/^\d/));

  const newDog = {
    id: "u_" + Date.now(),
    name,
    breed,
    age: document.getElementById("dog_age").value.trim() || "Unknown",
    gender: document.getElementById("dog_gender").value,
    size: document.getElementById("dog_size").value,
    area,
    funFact: funFact || "Full of surprises!",
    bio: document.getElementById("dog_bio").value.trim(),
    contact,
    contactType: isIG ? "instagram" : "whatsapp",
    photo: selectedPhotoDataUrl || null,
    accentColor: "#D8F3DC",
    accentText: "#2D6A4F",
  };

  userDogs.push(newDog);
  pmSave();
  closeListDogModal();
  renderPmGrid();

  // Scroll to the new card
  setTimeout(() => {
    const grid = document.getElementById("pmGrid");
    const last = grid.lastElementChild;
    if (last) last.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 200);
}

// ─── Photo upload ─────────────────────────────────────────────────────────────
function handlePhotoUpload(file) {
  if (!file || !file.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    selectedPhotoDataUrl = e.target.result;
    const img = document.getElementById("dogPhotoImg");
    img.src = selectedPhotoDataUrl;
    img.style.display = "block";
    document.getElementById("dogPhotoPlaceholder").style.display = "none";
  };
  reader.readAsDataURL(file);
}

// ─── Init ─────────────────────────────────────────────────────────────────────
function initPawMatch() {
  pmLoad();
  renderPmGrid();

  // Gender filter chips
  document.getElementById("pmFilterChips").addEventListener("click", e => {
    const chip = e.target.closest(".pm-chip");
    if (!chip) return;
    document.querySelectorAll(".pm-chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    activeGenderFilter = chip.dataset.gender;
    renderPmGrid();
  });

  // List my dog
  document.getElementById("listMyDogBtn").addEventListener("click", openListDogModal);
  document.getElementById("dogModalClose").addEventListener("click", closeListDogModal);
  document.getElementById("saveDogBtn").addEventListener("click", saveUserDog);
  document.getElementById("dogModalOverlay").addEventListener("click", e => {
    if (e.target === document.getElementById("dogModalOverlay")) closeListDogModal();
  });

  // Profile modal close
  document.getElementById("dogProfileClose").addEventListener("click", closeDogProfile);
  document.getElementById("dogProfileOverlay").addEventListener("click", e => {
    if (e.target === document.getElementById("dogProfileOverlay")) closeDogProfile();
  });

  // Photo upload
  document.getElementById("dogPhotoInput").addEventListener("change", e => {
    handlePhotoUpload(e.target.files[0]);
  });
  const preview = document.getElementById("dogPhotoPreview");
  preview.addEventListener("dragover", e => { e.preventDefault(); preview.classList.add("drag-over"); });
  preview.addEventListener("dragleave", () => preview.classList.remove("drag-over"));
  preview.addEventListener("drop", e => {
    e.preventDefault();
    preview.classList.remove("drag-over");
    handlePhotoUpload(e.dataTransfer.files[0]);
  });

  // Escape key
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeDogProfile();
      closeListDogModal();
    }
  });
}
