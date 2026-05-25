/**
 * PawJakarta — PawMatch Module
 * Tinder-style dog matching for mating / social connections.
 * All data is localStorage-persisted (profile & matches).
 */

// ─── Demo dog profiles ───────────────────────────────────────────────────────
const DEMO_DOGS = [
  { id: "d1", name: "Mochi", breed: "Shiba Inu", age: "2 years", gender: "Female", size: "Medium", area: "Kemang", bio: "Loves zoomies at Como Park. Very friendly with other Shibas. Looking for a calm, healthy male companion. 🍡", emoji: "🐕", color: "#FFF3CD", owner: "@mochithedog_jkt" },
  { id: "d2", name: "Biscuit", breed: "Golden Retriever", age: "3 years", gender: "Male", size: "Large", area: "PIK", bio: "Beach boy living his best life at PIK. Champion fetch player, zero energy for drama. Pure vibes only. 🌊", emoji: "🦮", color: "#D8F3DC", owner: "@biscuit.golden" },
  { id: "d3", name: "Luna", breed: "French Bulldog", age: "1.5 years", gender: "Female", size: "Small", area: "Menteng", bio: "Certified couch potato turned park explorer. Snorts are my love language. Squishy face guaranteed. 🌙", emoji: "🐶", color: "#FAECE7", owner: "@lunabulldogjakarta" },
  { id: "d4", name: "Oreo", breed: "Border Collie", age: "4 years", gender: "Male", size: "Medium", area: "Kelapa Gading", bio: "Herding instincts, incredible intelligence. Can open doors. Needs an equally stimulating partner in crime. 🖤🤍", emoji: "🐕‍🦺", color: "#E6F1FB", owner: "@oreo_bordercollie" },
  { id: "d5", name: "Cinnamon", breed: "Pomeranian", age: "1 year", gender: "Female", size: "Small", area: "Sudirman", bio: "Tiny but LOUD. Fluffiest cloud in South Jakarta. My hobbies: barking at motorcycles and eating treats. 🧡", emoji: "🐩", color: "#FFE8F0", owner: "@cinnamonpom_id" },
  { id: "d6", name: "Titan", breed: "Husky", age: "2.5 years", gender: "Male", size: "Large", area: "Kemang", bio: "Escaped from Siberia, somehow ended up in Jakarta. Dramatically offended by the heat but stays for the food. ❄️", emoji: "🐕", color: "#EEF0FF", owner: "+62812xxxxxxx" },
  { id: "d7", name: "Kopi", breed: "Corgi", age: "3 years", gender: "Female", size: "Small", area: "Senopati", bio: "Short legs, BIG personality. Marathon runner and pancake enthusiast. Certified good girl since 2022. ☕", emoji: "🐶", color: "#FFF0E0", owner: "@kopitheCorgi" },
  { id: "d8", name: "Rex", breed: "Labrador", age: "5 years", gender: "Male", size: "Large", area: "Kelapa Gading", bio: "Distinguished gentleman of Gading Walk. Excellent swimmer, terrible secret-keeper. Will steal your heart and your snacks. 🎩", emoji: "🦮", color: "#E8F5E9", owner: "@rexlabrador_jkt" },
];

// ─── State ───────────────────────────────────────────────────────────────────
let stackIndex = 0;
let matches = [];
let myDog = null;
let isDragging = false;
let startX = 0, startY = 0, currentX = 0;
let selectedEmoji = "🐕";

// ─── LocalStorage helpers ────────────────────────────────────────────────────
function pmSave() {
  try {
    localStorage.setItem("pawmatch_matches", JSON.stringify(matches));
    localStorage.setItem("pawmatch_index", String(stackIndex));
    if (myDog) localStorage.setItem("pawmatch_mydog", JSON.stringify(myDog));
  } catch(e) {}
}

function pmLoad() {
  try {
    const m = localStorage.getItem("pawmatch_matches");
    const i = localStorage.getItem("pawmatch_index");
    const d = localStorage.getItem("pawmatch_mydog");
    if (m) matches = JSON.parse(m);
    if (i) stackIndex = parseInt(i, 10);
    if (d) myDog = JSON.parse(d);
  } catch(e) {}
}

// ─── Build a swipe card ──────────────────────────────────────────────────────
function buildCard(dog, position) {
  const card = document.createElement("div");
  card.className = "swipe-card";
  card.dataset.id = dog.id;
  card.style.zIndex = DEMO_DOGS.length - position;
  if (position === 0) {
    card.classList.add("swipe-card-top");
  } else if (position === 1) {
    card.style.transform = "scale(0.97) translateY(10px)";
    card.style.opacity = "0.85";
  } else if (position === 2) {
    card.style.transform = "scale(0.94) translateY(20px)";
    card.style.opacity = "0.6";
  } else {
    card.style.display = "none";
  }

  const genderIcon = dog.gender === "Female" ? "🩷" : "💙";
  const sizeMap = { Small: "🔵 Small", Medium: "🟡 Medium", Large: "🔴 Large" };

  card.innerHTML = `
    <div class="swipe-card-inner" style="background: ${dog.color}">
      <div class="swipe-card-emoji">${dog.emoji}</div>
      <div class="swipe-like-stamp">LIKE 💚</div>
      <div class="swipe-pass-stamp">PASS ❌</div>
      <div class="swipe-card-info">
        <div class="swipe-card-name-row">
          <h3>${dog.name}</h3>
          <span class="swipe-gender">${genderIcon}</span>
        </div>
        <div class="swipe-card-meta">
          <span>${dog.breed} · ${dog.age}</span>
          <span class="swipe-dot">·</span>
          <span>${sizeMap[dog.size] || dog.size}</span>
        </div>
        <div class="swipe-card-area"><i class="ti ti-map-pin"></i> ${dog.area}, Jakarta</div>
        <p class="swipe-card-bio">${dog.bio}</p>
      </div>
    </div>
  `;

  // Touch & mouse drag
  attachDrag(card);
  return card;
}

// ─── Render the stack ────────────────────────────────────────────────────────
function renderStack() {
  const stack = document.getElementById("swipeStack");
  const empty = document.getElementById("swipeEmpty");
  const actions = document.getElementById("swipeActions");

  stack.innerHTML = "";

  const remaining = DEMO_DOGS.slice(stackIndex);

  if (remaining.length === 0) {
    empty.classList.remove("hidden");
    actions.style.opacity = "0.3";
    actions.style.pointerEvents = "none";
    return;
  }

  empty.classList.add("hidden");
  actions.style.opacity = "1";
  actions.style.pointerEvents = "auto";

  // Show up to 3 cards in the stack (back to front)
  const visible = remaining.slice(0, 3).reverse();
  visible.forEach((dog, i) => {
    const pos = visible.length - 1 - i; // 0 = top
    stack.appendChild(buildCard(dog, pos));
  });

  document.getElementById("swipeIdx").textContent = stackIndex + 1;
  document.getElementById("swipeTotal").textContent = DEMO_DOGS.length;
}

// ─── Drag logic ──────────────────────────────────────────────────────────────
function attachDrag(card) {
  card.addEventListener("mousedown", dragStart, { passive: true });
  card.addEventListener("touchstart", dragStart, { passive: true });
  window.addEventListener("mousemove", dragMove, { passive: true });
  window.addEventListener("touchmove", dragMove, { passive: true });
  window.addEventListener("mouseup", dragEnd);
  window.addEventListener("touchend", dragEnd);
}

function dragStart(e) {
  const top = document.querySelector(".swipe-card-top");
  if (!top || !top.contains(e.target)) return;
  isDragging = true;
  const point = e.touches ? e.touches[0] : e;
  startX = point.clientX;
  startY = point.clientY;
  currentX = 0;
  top.style.transition = "none";
}

function dragMove(e) {
  if (!isDragging) return;
  const top = document.querySelector(".swipe-card-top");
  if (!top) return;
  const point = e.touches ? e.touches[0] : e;
  currentX = point.clientX - startX;
  const currentY = point.clientY - startY;
  const rotate = currentX * 0.08;

  top.style.transform = `translate(${currentX}px, ${currentY * 0.3}px) rotate(${rotate}deg)`;

  const like = top.querySelector(".swipe-like-stamp");
  const pass = top.querySelector(".swipe-pass-stamp");
  if (like) like.style.opacity = Math.max(0, Math.min(1, currentX / 80));
  if (pass) pass.style.opacity = Math.max(0, Math.min(1, -currentX / 80));
}

function dragEnd() {
  if (!isDragging) return;
  isDragging = false;
  const top = document.querySelector(".swipe-card-top");
  if (!top) return;

  top.style.transition = "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

  const threshold = 100;
  if (currentX > threshold) {
    animateOut(top, "right");
  } else if (currentX < -threshold) {
    animateOut(top, "left");
  } else {
    top.style.transform = "";
    const like = top.querySelector(".swipe-like-stamp");
    const pass = top.querySelector(".swipe-pass-stamp");
    if (like) like.style.opacity = 0;
    if (pass) pass.style.opacity = 0;
  }
}

function animateOut(card, direction) {
  const dog = DEMO_DOGS[stackIndex];
  const dx = direction === "right" ? window.innerWidth + 200 : -window.innerWidth - 200;
  card.style.transform = `translateX(${dx}px) rotate(${direction === "right" ? 30 : -30}deg)`;
  card.style.opacity = "0";

  setTimeout(() => {
    if (direction === "right") likeDog(dog);
    else passDog();
  }, 350);
}

// ─── Like / Pass actions ─────────────────────────────────────────────────────
function likeDog(dog) {
  if (!matches.find(m => m.id === dog.id)) {
    matches.push(dog);
    renderMatches();
    showMatchToast(dog);
  }
  stackIndex++;
  pmSave();
  renderStack();
}

function passDog() {
  stackIndex++;
  pmSave();
  renderStack();
}

function resetStack() {
  stackIndex = 0;
  matches = [];
  pmSave();
  renderStack();
  renderMatches();
}

// ─── Match toast notification ────────────────────────────────────────────────
function showMatchToast(dog) {
  const existing = document.querySelector(".match-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "match-toast";
  toast.innerHTML = `
    <span class="toast-emoji">💞</span>
    <div>
      <strong>It's a Match!</strong>
      <p>You liked ${dog.name} the ${dog.breed}!</p>
    </div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("toast-show"), 10);
  setTimeout(() => {
    toast.classList.remove("toast-show");
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

// ─── Render matches list ─────────────────────────────────────────────────────
function renderMatches() {
  const list = document.getElementById("matchesList");
  const count = document.getElementById("matchesCount");
  count.textContent = matches.length;
  document.getElementById("matchCount").textContent = DEMO_DOGS.length + matches.length;

  if (matches.length === 0) {
    list.innerHTML = '<div class="matches-empty">Like a dog to get your first match!</div>';
    return;
  }

  list.innerHTML = matches.map(dog => `
    <div class="match-item">
      <div class="match-emoji" style="background:${dog.color}">${dog.emoji}</div>
      <div class="match-info">
        <strong>${dog.name}</strong>
        <span>${dog.breed} · ${dog.area}</span>
      </div>
      <a class="match-contact" href="${dog.owner.startsWith('+') ? 'https://wa.me/' + dog.owner.replace(/\D/g,'') : 'https://instagram.com/' + dog.owner.replace('@','')}" target="_blank" rel="noopener" title="Contact owner">
        <i class="ti ti-message-circle"></i>
      </a>
    </div>
  `).join("");
}

// ─── My Dog Profile ──────────────────────────────────────────────────────────
function renderMyDog() {
  const body = document.getElementById("myDogBody");
  if (!myDog) {
    body.innerHTML = `
      <div class="mydog-empty">
        <div class="mydog-empty-emoji">🐾</div>
        <p>Set up your dog's profile so others can match with you!</p>
        <button class="btn-setup-dog" onclick="openDogModal()">Create Profile</button>
      </div>`;
    return;
  }
  body.innerHTML = `
    <div class="mydog-profile">
      <div class="mydog-avatar" style="background:${myDog.color || '#D8F3DC'}">${myDog.emoji || '🐕'}</div>
      <div class="mydog-details">
        <h4>${myDog.name}</h4>
        <p>${myDog.breed} · ${myDog.age} · ${myDog.gender}</p>
        <p class="mydog-area"><i class="ti ti-map-pin"></i> ${myDog.area}, Jakarta</p>
        ${myDog.bio ? `<p class="mydog-bio">${myDog.bio}</p>` : ''}
        <p class="mydog-contact"><i class="ti ti-at"></i> ${myDog.contact}</p>
      </div>
    </div>`;
}

// ─── Dog Modal ───────────────────────────────────────────────────────────────
function openDogModal() {
  if (myDog) {
    document.getElementById("dog_name").value = myDog.name || "";
    document.getElementById("dog_breed").value = myDog.breed || "";
    document.getElementById("dog_age").value = myDog.age || "";
    document.getElementById("dog_gender").value = myDog.gender || "Female";
    document.getElementById("dog_size").value = myDog.size || "Small";
    document.getElementById("dog_area").value = myDog.area || "";
    document.getElementById("dog_bio").value = myDog.bio || "";
    document.getElementById("owner_contact").value = myDog.contact || "";
    selectedEmoji = myDog.emoji || "🐕";
    document.getElementById("dogAvatarPreview").textContent = selectedEmoji;
  }
  document.getElementById("dogModalOverlay").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeDogModal() {
  document.getElementById("dogModalOverlay").classList.add("hidden");
  document.body.style.overflow = "";
}

function saveDogProfile() {
  const name = document.getElementById("dog_name").value.trim();
  const breed = document.getElementById("dog_breed").value.trim();
  if (!name || !breed) { alert("Please enter your dog's name and breed."); return; }

  myDog = {
    name,
    breed,
    age: document.getElementById("dog_age").value.trim(),
    gender: document.getElementById("dog_gender").value,
    size: document.getElementById("dog_size").value,
    area: document.getElementById("dog_area").value.trim(),
    bio: document.getElementById("dog_bio").value.trim(),
    contact: document.getElementById("owner_contact").value.trim(),
    emoji: selectedEmoji,
    color: "#D8F3DC",
  };

  pmSave();
  renderMyDog();
  closeDogModal();
}

// ─── Init PawMatch ────────────────────────────────────────────────────────────
function initPawMatch() {
  pmLoad();
  renderStack();
  renderMatches();
  renderMyDog();

  // Button controls
  document.getElementById("swipeNoBtn").addEventListener("click", () => {
    const top = document.querySelector(".swipe-card-top");
    if (top) animateOut(top, "left");
  });
  document.getElementById("swipeYesBtn").addEventListener("click", () => {
    const top = document.querySelector(".swipe-card-top");
    if (top) animateOut(top, "right");
  });

  // My dog edit
  document.getElementById("editDogBtn").addEventListener("click", openDogModal);
  document.getElementById("dogModalClose").addEventListener("click", closeDogModal);
  document.getElementById("saveDogBtn").addEventListener("click", saveDogProfile);

  document.getElementById("dogModalOverlay").addEventListener("click", e => {
    if (e.target === document.getElementById("dogModalOverlay")) closeDogModal();
  });

  // Emoji picker
  document.getElementById("dogAvatarOptions").addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn) return;
    selectedEmoji = btn.dataset.emoji;
    document.getElementById("dogAvatarPreview").textContent = selectedEmoji;
    document.querySelectorAll(".dog-avatar-options button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });

  // Keyboard swipe support
  document.addEventListener("keydown", e => {
    if (document.getElementById("dogModalOverlay").classList.contains("hidden") &&
        document.getElementById("modalOverlay").classList.contains("hidden")) {
      if (e.key === "ArrowRight") document.getElementById("swipeYesBtn").click();
      if (e.key === "ArrowLeft") document.getElementById("swipeNoBtn").click();
    }
  });
}
