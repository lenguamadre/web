const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

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
  if (e.key === "Escape") closeModal();
});
