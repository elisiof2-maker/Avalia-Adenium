const ADMIN_EMAIL = "elisio@gmail.com";
const ADMIN_PASS = "310705";

let currentUser = JSON.parse(localStorage.getItem("adenium_current_user")) || { 
  nome: "Elísio (Admin)", 
  email: "elisio@gmail.com", 
  role: "admin" 
};

let abaModo = "moderação";
let ordemFiltro = "todos";

let usuariosCadastrados = JSON.parse(localStorage.getItem("adenium_users")) || [];

let avaliacoes = JSON.parse(localStorage.getItem("adenium_reviews_v9")) || [
  {
    id: 1,
    produtor: "Produtor Especialista - Fortaleza/CE",
    notaNumerica: 5,
    nota: "⭐⭐⭐⭐⭐",
    texto: "Excelente atendimento e enxertos perfeitos! Como crítica construtiva: apenas melhorar a embalagem da caixa para viagens longas.",
    status: "aprovado",
    autor: "Cultivador",
    data: "22/08/2026"
  },
  {
    id: 2,
    produtor: "Produtor X - Tailândia",
    notaNumerica: 2,
    nota: "⭐⭐",
    texto: "Alerta: Demorou muito para postar e as sementes de Adenium vieram com taxa de germinação muito baixa.",
    status: "aprovado",
    autor: "Marcos",
    data: "21/08/2026"
  },
  {
    id: 3,
    produtor: "Viveiro Y - Brasil",
    notaNumerica: 3,
    nota: "⭐⭐⭐",
    texto: "Feedback construtivo: O caudex veio saudável, mas o cavalo da enxertia veio meio fraco. Vale a pena prestar atenção no substrato.",
    status: "pendente",
    autor: "João Paulo",
    data: "22/08/2026"
  }
];

function salvarDados() {
  localStorage.setItem("adenium_reviews_v9", JSON.stringify(avaliacoes));
  localStorage.setItem("adenium_users", JSON.stringify(usuariosCadastrados));
  localStorage.setItem("adenium_current_user", JSON.stringify(currentUser));
}

const authArea = document.getElementById("authArea");
const authModal = document.getElementById("authModal");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const reviewsList = document.getElementById("reviewsList");
const feedTitle = document.getElementById("feedTitle");
const feedCount = document.getElementById("feedCount");

function toggleDropdown(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById("myDropdown");
  if (menu) menu.classList.toggle("show");
}

function showFilterMenu() {
  document.getElementById("filterDropdown").classList.add("show");
}

function toggleMobileSearch(open) {
  const searchWrapper = document.getElementById("searchWrapper");
  if (open) {
    searchWrapper.classList.add("active-mobile");
    document.getElementById("searchInput").focus();
  } else {
    searchWrapper.classList.remove("active-mobile");
    document.getElementById("filterDropdown").classList.remove("show");
  }
}

// Fecha menus ao clicar fora
window.onclick = function(event) {
  if (!event.target.closest('.user-dropdown')) {
    const dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      dropdowns[i].classList.remove('show');
    }
  }
  if (!event.target.closest('.nav-search-wrapper') && !event.target.closest('.mobile-search-toggle')) {
    const filterMenu = document.getElementById("filterDropdown");
    if (filterMenu) filterMenu.classList.remove("show");
  }
}

function updateAuthUI() {
  const pendentesCount = avaliacoes.filter(a => a.status === "pendente").length;

  if (currentUser) {
    const isAdmin = currentUser.role === 'admin';
    const primeiroNome = currentUser.nome.split(" ")[0];

    authArea.innerHTML = `
      <div class="user-dropdown">
        <button class="dropdown-btn" onclick="toggleDropdown(event)">
          👤 <span class="user-text-label">${primeiroNome}</span> ${isAdmin ? '🛡️' : ''} ▼
        </button>
        <div id="myDropdown" class="dropdown-content">
          <div class="menu-user-info">
            <small>Logado como:</small>
            <strong>${currentUser.email}</strong>
          </div>
          <hr>
          <button onclick="mudarAba('publicadas')">
            ✅ Feedbacks Aprovados
          </button>
          ${isAdmin ? `
            <button onclick="mudarAba('moderação')" class="btn-highlight-pending">
              ⏳ Moderação Pendente <span class="badge-count">${pendentesCount}</span>
            </button>
          ` : ''}
          <button class="logout-btn" onclick="logout()">
            🚪 Sair da Conta
          </button>
        </div>
      </div>
    `;
    if(authModal) authModal.style.display = "none";
  } else {
    authArea.innerHTML = `<button class="btn btn-sm" style="background:#a5d6a7; color:#0d3b11; font-weight:bold; border-radius:20px;" onclick="toggleAuthModal()">Entrar</button>`;
  }
}

function mudarAba(modo) {
  abaModo = modo;
  renderizar();
}

function setFiltroOrdem(tipo) {
  ordemFiltro = tipo;
  
  document.getElementById("btnAll").classList.toggle("active", tipo === 'todos');
  document.getElementById("btnBest").classList.toggle("active", tipo === 'melhores');
  document.getElementById("btnWorst").classList.toggle("active", tipo === 'piores');

  document.getElementById("filterDropdown").classList.remove("show");
  renderizar();
}

function filtrarEBuscar() {
  renderizar();
}

function toggleAuthModal() {
  authModal.style.display = authModal.style.display === "flex" ? "none" : "flex";
}

function switchTab(tab) {
  document.getElementById("tabLoginBtn").classList.toggle("active", tab === 'login');
  document.getElementById("tabRegisterBtn").classList.toggle("active", tab === 'register');
  loginForm.style.display = tab === 'login' ? "block" : "none";
  registerForm.style.display = tab === 'register' ? "block" : "none";
}

loginForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;

  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    currentUser = { nome: "Elísio (Admin)", email: email, role: "admin" };
    abaModo = "moderação";
  } else {
    const user = usuariosCadastrados.find(u => u.email === email && u.password === password);
    if (user) {
      currentUser = { nome: user.nome, email: user.email, role: "client" };
      abaModo = "publicadas";
    } else {
      alert("E-mail ou senha incorretos.");
      return;
    }
  }

  salvarDados();
  updateAuthUI();
  renderizar();
});

function logout() {
  currentUser = null;
  localStorage.removeItem("adenium_current_user");
  abaModo = "publicadas";
  updateAuthUI();
  renderizar();
}

function aprovarAvaliacao(id) {
  avaliacoes = avaliacoes.map(a => a.id === id ? { ...a, status: "aprovado" } : a);
  salvarDados();
  updateAuthUI();
  renderizar();
}

function rejeitarAvaliacao(id) {
  avaliacoes = avaliacoes.filter(a => a.id !== id);
  salvarDados();
  updateAuthUI();
  renderizar();
}

document.getElementById("reviewForm").addEventListener("submit", function(e) {
  e.preventDefault();
  if (!currentUser) {
    alert("Por favor, faça login para enviar.");
    toggleAuthModal();
    return;
  }

  const produtor = document.getElementById("producerName").value;
  const ratingValue = parseInt(document.getElementById("rating").value);
  const texto = document.getElementById("reviewText").value;

  avaliacoes.unshift({
    id: Date.now(),
    produtor,
    notaNumerica: ratingValue,
    nota: "⭐".repeat(ratingValue),
    texto,
    status: "pendente",
    autor: currentUser.nome,
    data: new Date().toLocaleDateString("pt-BR")
  });

  salvarDados();
  updateAuthUI();
  renderizar();
  this.reset();
  alert("Feedback registrado! Enviado para a moderação.");
});

function renderizar() {
  reviewsList.innerHTML = "";
  const termoBusca = document.getElementById("searchInput").value.toLowerCase();

  let lista = avaliacoes.filter(a => {
    const matchStatus = (abaModo === "moderação" && currentUser?.role === "admin") ? a.status === "pendente" : a.status === "aprovado";
    const matchTexto = a.produtor.toLowerCase().includes(termoBusca) || a.texto.toLowerCase().includes(termoBusca);
    return matchStatus && matchTexto;
  });

  if (ordemFiltro === "melhores") {
    lista.sort((a, b) => b.notaNumerica - a.notaNumerica);
  } else if (ordemFiltro === "piores") {
    lista.sort((a, b) => a.notaNumerica - b.notaNumerica);
  }

  const pendentesCount = avaliacoes.filter(a => a.status === "pendente").length;

  if (abaModo === "moderação" && currentUser?.role === "admin") {
    feedTitle.innerHTML = `⏳ Moderação: Pendentes (${pendentesCount})`;
  } else {
    feedTitle.innerHTML = `Feedbacks Verificados`;
  }

  feedCount.innerText = `${lista.length} exibidos`;

  if (lista.length === 0) {
    reviewsList.innerHTML = `<div style="background:white; padding:1.5rem; border-radius:12px; text-align:center; color:#64748b;">
      ${abaModo === "moderação" ? "🎉 Nenhum feedback pendente no momento!" : "Nenhum feedback encontrado."}
    </div>`;
    return;
  }

  lista.forEach(item => {
    reviewsList.innerHTML += `
      <article class="review-item ${item.status === 'pendente' ? 'pending' : ''}">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.3rem;">
          <strong>${item.produtor}</strong>
          <span class="status-badge ${item.status === 'aprovado' ? 'badge-success' : 'badge-warning'}">
            ${item.status === 'aprovado' ? 'Aprovado' : 'Pendente'}
          </span>
        </div>
        <div style="margin-bottom:0.3rem;">${item.nota}</div>
        <p style="font-size:0.88rem; color:#1e293b; margin:0.4rem 0;">${item.texto}</p>
        <small style="color:#64748b; display:block; margin-top:0.4rem;">Enviado por ${item.autor} em ${item.data}</small>
        
        ${item.status === 'pendente' && currentUser?.role === 'admin' ? `
          <div style="margin-top:0.8rem; display:flex; gap:0.5rem; padding-top:0.6rem; border-top:1px solid #f1f5f9;">
            <button class="btn btn-sm btn-approve" onclick="aprovarAvaliacao(${item.id})">Aprovar e Publicar</button>
            <button class="btn btn-sm btn-reject" onclick="rejeitarAvaliacao(${item.id})">Recusar</button>
          </div>
        ` : ''}
      </article>
    `;
  });
}

updateAuthUI();
renderizar();
