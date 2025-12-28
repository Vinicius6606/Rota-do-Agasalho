// ===============================
// FORMULÁRIO → SUPABASE
// ===============================
const suggestForm = document.getElementById("suggestForm");
const formMsg = document.getElementById("formMsg");

if (suggestForm) {
  suggestForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fd = new FormData(suggestForm);

    const data = {
      nome: fd.get("nome"),
      bairro: fd.get("bairro"),
      endereco: fd.get("endereco"),
      horario: fd.get("horario") || null,
      contato: fd.get("contato") || null,
      itens_aceitos: fd.get("itens") || null,
      observacoes: fd.get("obs") || null
    };

    const { error } = await supabaseClient
      .from("sugestoes_ponto")
      .insert([data]);

    if (error) {
      console.error(error);
      formMsg.textContent = "Erro ao enviar sugestão 😢";
      formMsg.style.color = "red";
    } else {
      formMsg.textContent = "Sugestão enviada! Obrigado ❤️";
      formMsg.style.color = "green";
      suggestForm.reset();
    }
  });
}

// ===============================
// PONTOS FIXOS (POR ENQUANTO)
// ===============================
const donationPoints = [
  {
    id: "spani",
    nome: "Spani Atacadista — Ponto de Implantação",
    bairro: "Caraguatatuba",
    endereco: "Preencha com o endereço completo do Spani (rua, número, bairro)",
    horario: "Seg–Sáb 08h–22h",
    contato: "Recepção do local",
    itens: ["agasalhos", "cobertores", "meias", "calçados"],
    obs: "Caixa de doação próxima à entrada."
  }
];

// ===============================
// ELEMENTOS
// ===============================
const cardsEl = document.getElementById("cards");
const resultsMetaEl = document.getElementById("resultsMeta");
const searchInput = document.getElementById("searchInput");
const bairroSelect = document.getElementById("bairroSelect");
const itemSelect = document.getElementById("itemSelect");
const clearBtn = document.getElementById("clearBtn");

// Modal
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalBairro = document.getElementById("modalBairro");
const modalEndereco = document.getElementById("modalEndereco");
const modalHorario = document.getElementById("modalHorario");
const modalContato = document.getElementById("modalContato");
const modalItens = document.getElementById("modalItens");
const modalObs = document.getElementById("modalObs");
const mapsLink = document.getElementById("mapsLink");

// ===============================
// HELPERS
// ===============================
function uniq(arr) {
  return [...new Set(arr)].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function normalize(s) {
  return (s || "")
    .toString()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function buildMapsUrl(endereco) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco || "")}`;
}

// ===============================
// UI
// ===============================
function populateFilters() {
  const bairros = uniq(donationPoints.map(p => p.bairro).filter(Boolean));
  const itens = uniq(donationPoints.flatMap(p => p.itens || []).filter(Boolean));

  bairros.forEach(b => {
    const opt = document.createElement("option");
    opt.value = b;
    opt.textContent = b;
    bairroSelect.appendChild(opt);
  });

  itens.forEach(i => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = i;
    itemSelect.appendChild(opt);
  });
}

function renderCards(points) {
  cardsEl.innerHTML = "";

  if (!points.length) {
    resultsMetaEl.textContent = "Nenhum ponto encontrado.";
    return;
  }

  resultsMetaEl.textContent = `Mostrando ${points.length} ponto(s).`;

  points.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${p.nome}</h3>
      <p>${p.endereco}</p>
      <button data-id="${p.id}">Ver detalhes</button>
    `;

    cardsEl.appendChild(card);
  });
}

function applyFilters() {
  renderCards(donationPoints);
}

// ===============================
// MODAL
// ===============================
function openDetails(id) {
  const p = donationPoints.find(x => x.id === id);
  if (!p) return;

  modalTitle.textContent = p.nome;
  modalBairro.textContent = p.bairro;
  modalEndereco.textContent = p.endereco;
  modalHorario.textContent = p.horario;
  modalContato.textContent = p.contato;
  modalItens.textContent = p.itens.join(", ");
  modalObs.textContent = p.obs;
  mapsLink.href = buildMapsUrl(p.endereco);

  modal.showModal();
}

function closeModal() {
  if (modal.open) modal.close();
}

// ===============================
// EVENTOS
// ===============================
cardsEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-id]");
  if (!btn) return;
  openDetails(btn.dataset.id);
});

closeModalBtn.addEventListener("click", closeModal);

// ===============================
// INIT
// ===============================
populateFilters();
applyFilters();
