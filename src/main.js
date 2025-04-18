import "./styles/index.css";
import { links } from "./data/links.js";
import { translations } from "./data/language.js";
import { renderHeroIcon } from "./utils/icons";

// Seletores globais
const container = document.getElementById("links");
const nameEl = document.querySelector("h1");
const descEl = document.querySelector("p");
const copyEl = document.querySelector("footer p");
const languageButtons = document.querySelectorAll("header button");

let currentLang = "PT";

// Função principal de inicialização
function init() {
  bindLanguageSwitcher();
  renderContent();
}

// Alternar os idiomas
function bindLanguageSwitcher() {
  languageButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      if (lang !== currentLang) {
        currentLang = lang;
        renderContent(lang);
      }
    });
  });
}

// Renderiza os links com base na linguagem atual
function renderContent(lang = "PT") {
  const {
    name,
    description,
    links: translatedLinks,
    copyright,
  } = translations[lang];
  nameEl.textContent = name;
  descEl.textContent = description;

  // Atualiza o texto do copyright com ano e idioma corretos
  const year = new Date().getFullYear();
  copyEl.innerHTML = `&copy; ${year} Misla Wislaine. ${copyright}`;

  container.innerHTML = "";

  links.forEach((link, index) => {
    const translation = translatedLinks[index] || {};
    const label = translation.label || link.label;
    const desc = translation.description || link.description;

    const li = document.createElement("li");
    li.className = "group w-full max-w-4xl";

    li.innerHTML = `
      <div class="flex items-center bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-all duration-200 group-hover:border-zinc-600 w-full">
        <a href="${link.url}" target="_blank" class="flex-1 p-4">
          <div class="flex items-center gap-3">
            ${renderHeroIcon(link.icon || "Link")}
            <div class="flex-1">
              <h3 class="text-white font-medium">${label}</h3>
              <p class="text-zinc-400 text-sm">${desc}</p>
            </div>
          </div>
        </a>
        ${link.share ? renderShareButton(link.url, label) : ""}
      </div>
    `;

    container.appendChild(li);
  });

  updateActiveLanguageButton(lang);
}

// Atualiza visualmente qual idioma está ativo
function updateActiveLanguageButton(lang) {
  languageButtons.forEach((btn) => {
    const isActive = btn.dataset.lang === lang;

    if (isActive) {
      btn.setAttribute("aria-current", "page");
      btn.classList.add("bg-zinc-600", "text-white", "font-semibold");
      btn.classList.remove("text-zinc-300");
    } else {
      btn.removeAttribute("aria-current");
      btn.classList.remove("bg-zinc-600", "text-white", "font-semibold");
      btn.classList.add("text-zinc-300");
    }
  });
}

// Botão de compartilhamento
function renderShareButton(url, label) {
  return `
    <button onclick="shareLink('${url}', '${label}')" 
            class="p-4 border-l border-zinc-700 hover:bg-zinc-700 rounded-r-lg transition-colors duration-200 flex items-center justify-center" 
            title="Compartilhar">
      ${renderHeroIcon("Share")}
    </button>
  `;
}

// Compartilhamento
window.shareLink = function (url, title) {
  // Verifica se o URL é do tipo mailto
  if (url.startsWith("mailto:")) {
    // Extrai o endereço de e-mail após o "mailto:"
    const email = url.substring(7).split("?")[0]; // Pega o endereço de e-mail até o início dos parâmetros

    // Define o assunto como "Contato com [email]"
    const emailSubject = encodeURIComponent(`Contato com ${email}`);

    // Define o corpo do e-mail com uma mensagem padrão
    const emailBody = encodeURIComponent(`Mensagem a ser enviada para ${email}:`);

    // Cria o link do mailto com o endereço de e-mail e parâmetros
    window.open(
      `mailto:${email}?subject=${emailSubject}&body=${emailBody}`,
      "Compartilhar por E-mail"
    );
    return; // Sai da função para evitar que o código posterior seja executado
  }

  // Verifica se o URL é relativo e o transforma em absoluto
  if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
    url = window.location.origin + url; // Concatena o domínio atual
  }

  // Verifica se o navegador suporta a API share
  if (navigator.share) {
    // Verifica se a URL é válida
    try {
      new URL(url); // Tenta criar um novo objeto URL para verificar a validade
      navigator.share({ title, url }).catch(console.error);
    } catch (error) {
      console.error("URL inválido para compartilhamento:", error);
    }
  } else {
    // Se a API share não estiver disponível, tenta o compartilhamento via WhatsApp
    const width = 600,
      height = 400;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;

    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${title} - ${url}`
      )}`,
      "Compartilhar",
      `width=${width},height=${height},top=${top},left=${left}`
    );
  }
};


// Inicializa tudo
init();
