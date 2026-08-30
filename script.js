const AVALIACOES_INICIAIS = [
  {
    id: 101,
    autor: "Sérgio M. - Fortaleza/CE",
    produtor: "PEAN Flores",
    nota: 5,
    relato: "Adquiri mudas de arabicum bem formadas. Caudex bem trabalhado e raízes perfeitas.",
    data: "Há 2 horas",
    status: "aprovado"
  },
  {
    id: 102,
    autor: "Cláudia R. - Caucaia/CE",
    produtor: "Orquidário & Viveiro M.A.",
    nota: 4,
    relato: "Chegou dentro do prazo e as plantas vieram bem embaladas.",
    data: "Ontem",
    status: "aprovado"
  }
];

const BLOG_INICIAIS = [
  {
    id: 1,
    titulo: "Como saber se o viveiro é confiável antes de comprar?",
    resumo: "Aprenda a identificar sinais de verificação e evite fraudes em compras online de matrizes."
  },
  {
    id: 2,
    titulo: "Direitos do Comprador no Código de Defesa do Consumidor (CDC)",
    resumo: "Entenda a garantia de 7 dias para compras na internet e como proceder em atrasos de entrega."
  },
  {
    id: 3,
    titulo: "Como usar o Reclamar / Avaliar para resolver problemas",
    resumo: "Passo a passo de como dialogar diretamente com o produtor com apoio da plataforma."
  }
];

let modoAdmin = true;

function verificarStatusApp() {
  const baixouApp = localStorage.getItem("adenium_app_baixado");
  const banner = document.getElementById("appPromotionalBanner");
  if (baixouApp === "true" && banner) {
    banner.style.display = "none";
  }
}

function fecharBannerApp() {
  const banner = document.getElementById("appPromotionalBanner");
  if (banner) {
    banner.style.display = "none";
  }
}

function registrarDownloadApp(loja) {
  localStorage.setItem("adenium_app_baixado", "true");
  alert(`Redirecionando para download na ${loja}... O banner será ocultado automaticamente.`);
  fecharBannerApp();
}

function obterAvaliacoes() {
  const dados = localStorage.getItem("adenium_avaliacoes");
  if (!dados) {
    localStorage.setItem("adenium_avaliacoes", JSON.stringify(AVALIACOES_INICIAIS));
    return AVALIACOES_INICIAIS;
  }
  return JSON.parse(dados);
}

function salvarAvaliacoes(lista) {
  localStorage.setItem("adenium_avaliacoes", JSON.stringify(lista));
  renderizarPlataforma();
}

function enviarNovoFeedback() {
  const autor = document.getElementById("inputAutor").value.trim();
  const produtor = document.getElementById("inputProdutor").value.trim();
  const nota = parseInt(document.getElementById("selectNota").value);
  const relato = document.getElementById("inputRelato").value.trim();

  if (!autor || !produtor || !relato) return;

  const novaSubmissao = {
    id: Date.now(),
    autor: autor,
    produtor: produtor,
    nota: nota,
    relato: relato,
    data: "Agora mesmo",
    status: "pendente"
  };

  const lista = obterAvaliacoes();
  lista.unshift(novaSubmissao);
  salvarAvaliacoes(lista);

  document.getElementById("inputAutor").value = "";
  document.getElementById("inputProdutor").value = "";
  document.getElementById("inputRelato").value = "";
  alert("Sua avaliação foi enviada com sucesso para a fila de moderação!");
}

function aprovarAvaliacao(id) {
  const lista = obterAvaliacoes();
  const item = lista.find(a => a.id === id);
  if (item) {
    item.status = "aprovado";
    salvarAvaliacoes(lista);
  }
}

function rejeitarAvaliacao(id) {
  let lista = obterAvaliacoes();
  lista = lista.filter(a => a.id !== id);
  salvarAvaliacoes(lista);
}

function renderizarPlataforma() {
  const lista = obterAvaliacoes();
  const pendentes = lista.filter(a => a.status === "pendente");
  const aprovadas = lista.filter(a => a.status === "aprovado");

  document.getElementById("badgeModeracaoCount").innerText = `${pendentes.length} Pendentes`;
  document.getElementById("countPendentesBadge").innerText = pendentes.length;
  document.getElementById("countPendentes").innerText = pendentes.length;
  document.getElementById("badgeAprovadasCount").innerText = `${aprovadas.length} Publicadas`;

  const containerMod = document.getElementById("listaModeracaoPendentes");
  if (pendentes.length === 0) {
    containerMod.innerHTML = `<div class="card-subtitle">Nenhuma avaliação pendente no momento.</div>`;
  } else {
    containerMod.innerHTML = pendentes.map(item => `
      <div class="moderacao-card" style="background:#fff7ed; border:1px solid #fed7aa; padding:10px; border-radius:6px; margin-bottom:8px;">
        <strong>${item.produtor}</strong>
        <p style="font-size: 0.82rem; margin: 4px 0;">"${item.relato}"</p>
        <small style="color: #666;">Por: ${item.autor} (${item.nota}/5 ⭐)</small>
        <div style="margin-top:8px; display:flex; gap:6px;">
          <button style="background:#16a34a; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:0.75rem; cursor:pointer;" onclick="aprovarAvaliacao(${item.id})">✓ Aprovar</button>
          <button style="background:#dc2626; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:0.75rem; cursor:pointer;" onclick="rejeitarAvaliacao(${item.id})">✕ Rejeitar</button>
        </div>
      </div>
    `).join('');
  }

  const containerFeed = document.getElementById("feedList");
  if (aprovadas.length === 0) {
    containerFeed.innerHTML = `<div class="card-subtitle">Nenhuma avaliação aprovada ainda.</div>`;
  } else {
    containerFeed.innerHTML = aprovadas.map(item => `
      <article class="review-card">
        <div style="display: flex; justify-content: space-between;">
          <strong>${item.autor}</strong>
          <span style="font-size: 0.82rem;">${'⭐'.repeat(item.nota)}</span>
        </div>
        <div style="font-size: 0.8rem; color: #1b8a3b; margin: 4px 0;"><strong>Avaliado:</strong> ${item.produtor}</div>
        <p style="font-size: 0.85rem; color: #444; margin-bottom: 6px;">"${item.relato}"</p>
        <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: #888;">
          <small>${item.data}</small>
          <span style="color: #16a34a; font-weight: bold;">✓ Avaliação Auditada</span>
        </div>
      </article>
    `).join('');
  }
}

function filtrarAvaliacoes() {
  const termo = document.getElementById("searchInput").value.toLowerCase();
  const cards = document.querySelectorAll(".review-card");

  cards.forEach(card => {
    const texto = card.innerText.toLowerCase();
    card.style.display = texto.includes(termo) ? "block" : "none";
  });
}

function toggleAdminMenu() {
  document.getElementById("adminDropdown").classList.toggle("active");
}

function alternarSessao() {
  modoAdmin = !modoAdmin;
  const painelAdmin = document.getElementById("painelAdminSection");

  if (modoAdmin) {
    painelAdmin.style.display = "block";
    alert("Visão alterada para Administrador.");
  } else {
    painelAdmin.style.display = "none";
    alert("Visão alterada para Comprador/Visitante.");
  }
  document.getElementById("adminDropdown").classList.remove("active");
}

function focarPainelAdmin() {
  document.getElementById("painelAdminSection").scrollIntoView({ behavior: 'smooth' });
  document.getElementById("adminDropdown").classList.remove("active");
}

function abrirModalAuth(tipo) {
  alert(`Tela de ${tipo === 'login' ? 'Login' : 'Cadastro'} em processamento.`);
}

function carregarBlog() {
  const grid = document.getElementById("fiqueGrid");
  if (!grid) return;

  grid.innerHTML = BLOG_INICIAIS.map(item => `
    <article class="blog-card hover-lift">
      <h3 style="font-size: 0.9rem; margin-bottom: 6px;">${item.titulo}</h3>
      <p style="font-size: 0.78rem; color: #666; margin-bottom: 8px;">${item.resumo}</p>
      <a href="#" style="color: #1b8a3b; font-weight: bold; font-size: 0.78rem; text-decoration: none;">Ler artigo completo →</a>
    </article>
  `).join('');
}

document.addEventListener("DOMContentLoaded", () => {
  verificarStatusApp();
  renderizarPlataforma();
  carregarBlog();
});
