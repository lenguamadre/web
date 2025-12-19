const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

// --- NAV (mobile) ---
const siteNav = document.getElementById("siteNav");
const navToggle = document.getElementById("navToggle");
const navPanel = document.getElementById("navPanel");

function openNav() {
  if (!siteNav || !navPanel || !navToggle) return;
  siteNav.classList.add("is-open");
  navPanel.classList.add("is-open");
  navPanel.setAttribute("aria-hidden", "false");
  navToggle.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeNav() {
  if (!siteNav || !navPanel || !navToggle) return;
  siteNav.classList.remove("is-open");
  navPanel.classList.remove("is-open");
  navPanel.setAttribute("aria-hidden", "true");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const open = navPanel && navPanel.classList.contains("is-open");
    if (open) closeNav();
    else openNav();
  });
}

const phone = "5491130440510";

function waUrl(message) {
  const msg = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${msg}`;
}

const waLink = document.getElementById("waLink");
const waFab = document.getElementById("waFab");

if (waLink) waLink.href = waUrl("Hola! Quiero consultar por Lengua Madre (Programa El Vacío / Tameana). ¿Me contás cómo se trabaja, cupos y próximos pasos?");
if (waFab) waFab.href = waUrl("Hola! Quiero consultar por Lengua Madre.");

const modal = document.getElementById("consultModal");
const openConsult = document.getElementById("openConsult");
const sendWa = document.getElementById("sendWa");
const consultText = document.getElementById("consultText");

function openModal(prefillKey) {
  if (!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");

  const presets = {
    programa: "Hola! Quiero consultar por el Programa El Vacío. ¿Me contás cupos, próximos inicios y modalidad?",
    sesiones: "Hola! Quiero consultar por sesiones individuales de Tameana online (1h 30m). ¿Me contás disponibilidad y valores?",
    recurso: "Hola! Quiero recibir el recurso gratuito de Lengua Madre. ¿Cómo lo obtengo?"
  };

  consultText.value = presets[prefillKey] || "Hola! Quiero consultar por Lengua Madre.";
  if (sendWa) sendWa.href = waUrl(consultText.value);
  consultText.focus();
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

if (openConsult) openConsult.addEventListener("click", () => openModal("programa"));

document.addEventListener("click", (e) => {
  const t = e.target;

  // Nav close (mobile)
  if (t && t.closest && t.closest("[data-nav-close]")) closeNav();
  // data-nav-link is used without a value in HTML, so dataset.navLink can be "" (falsy).
  // Use closest() so tapping a link always closes the panel.
  if (t && t.closest && t.closest("[data-nav-link]")) closeNav();

  if (t && t.dataset && t.dataset.close) closeModal();
  if (t && t.dataset && t.dataset.consult) openModal(t.dataset.consult);
  if (t && t.dataset && t.dataset.pick) openModal(t.dataset.pick);
});

if (consultText) {
  consultText.addEventListener("input", () => {
    if (sendWa) sendWa.href = waUrl(consultText.value || "Hola! Quiero consultar por Lengua Madre.");
  });
}

const resourceBtn = document.getElementById("resourceBtn");
if (resourceBtn) {
  resourceBtn.addEventListener("click", () => openModal("recurso"));
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
    closeInfoModal();
    closeNav();
  }
});

// --- Ventanas flotantes (solo web) ---
const infoModal = document.getElementById("infoModal");
const infoBody = document.getElementById("infoBody");

// Prevent <details> from toggling inside the modal (desktop floating cards)
if (infoBody){
  infoBody.addEventListener("click", (e)=>{
    const sum = e.target.closest("summary");
    if (sum){ e.preventDefault(); e.stopPropagation(); }
  });
}

let lastFocus = null;

function openInfoModal({ html }) {
  if (!infoModal || !infoBody) return;
  lastFocus = document.activeElement;
  infoBody.innerHTML = html || "";
  infoModal.classList.add("is-open");
  infoModal.setAttribute("aria-hidden", "false");
  // focus close button if present
  const closeBtn = infoModal.querySelector("[data-info-close]");
  if (closeBtn) closeBtn.focus();
}

function closeInfoModal() {
  if (!infoModal) return;
  infoModal.classList.remove("is-open");
  infoModal.setAttribute("aria-hidden", "true");
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

// Close handlers
document.addEventListener("click", (e) => {
  const t = e.target;
  if (!t) return;
  // data-info-close is used without a value in HTML, so dataset.infoClose can be "" (falsy).
  // Use closest() to detect clicks on the close button or backdrop reliably.
  if (t.closest && t.closest("[data-info-close]")) closeInfoModal();
});

// Intercept accordion cards on desktop
const isDesktop = window.matchMedia("(min-width: 900px)");
function bindCardWindows() {
  const cards = document.querySelectorAll("details.accordion--card");
  cards.forEach((d) => {
    const sum = d.querySelector("summary");
    const content = d.querySelector(".accordion__content");
    if (!sum || !content) return;

    // avoid double binding
    if (sum.dataset.boundWindow) return;
    sum.dataset.boundWindow = "1";

    sum.addEventListener("click", (ev) => {
      if (!isDesktop.matches) return; // mobile keeps native
      ev.preventDefault();
      ev.stopPropagation();

      // Keep the exact card style: clone the whole <details> and force it open.
      const clone = d.cloneNode(true);
      clone.setAttribute("open", "");
      // Prevent accidental toggles inside the modal.
      const cSum = clone.querySelector("summary");
      if (cSum) {
        cSum.addEventListener("click", (e2) => {
          e2.preventDefault();
          e2.stopPropagation();
        });
      }
      // detect band theme to match modal accent color
      const band = d.closest(".band");
      let theme = "";
      if (band && band.classList) {
        ["fire","ember","copper","earth","aether"].forEach((k)=>{ if (band.classList.contains("band--"+k)) theme = k; });
      }
      if (infoModal) {
        if (theme) infoModal.setAttribute("data-theme", theme);
        else infoModal.removeAttribute("data-theme");
      }

      openInfoModal({ html: clone.outerHTML });
    });
  });
}

bindCardWindows();

// If the viewport grows to desktop, ensure card details are closed (we use modal instead)
if (isDesktop && isDesktop.addEventListener) {
  isDesktop.addEventListener("change", (e) => {
    if (e.matches) {
      document.querySelectorAll("details.accordion--card[open]").forEach((d) => d.removeAttribute("open"));
    }
  });
}

