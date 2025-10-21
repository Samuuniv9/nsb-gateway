// === NSB Gateway Script ===
// Auteur : Samuel Nubery
// Objectif : Créer un module dynamique "NSB Gateway" pour Landing Page Pwofeel
// Date : 2025-10-21


// Charger dynamiquement le style NSB
const style = document.createElement("link");
style.rel = "stylesheet";
style.href = "https://samuuniv9.github.io/nsb-gateway/docs/nsb-style.css";
document.head.appendChild(style);



function nsbMount() {
  const config = {
    decouverte: {
      sub: "Je connecte la jeunesse et la data à travers des projets concrets et inspirants.",
      cta1: { label: "Entrer dans l’univers NSB", href: "https://nsb-insight.com/decouvrir" },
      cta2: { label: "Recevoir le Mini-Guide IA local", href: "https://nsb-insight.com/freebie" }
    },
    pro: {
      sub: "Et si la donnée servait votre secteur ? Découvrez nos ateliers et cas collectifs.",
      cta1: { label: "NSB pour les pros (secteurs)", href: "https://nsb-insight.com/pro" },
      cta2: { label: "Proposer un cas d’usage", href: "https://nsb-insight.com/pro/cas" }
    },
    media: {
      sub: "NSB : un laboratoire guadeloupéen d’intelligence collective.",
      cta1: { label: "Découvrir la vision NSB", href: "https://nsb-insight.com/presse" },
      cta2: { label: "Référencer un média local", href: "https://nsb-insight.com/presse/referencer" }
    }
  };

  const state = { aud: 'decouverte' };

  // Attend que la section principale soit chargée
  let tries = 0;
  const wait = setInterval(() => {
    tries++;
    const anchor = document.querySelector(".main-profile") || document.querySelector(".container.main-section");
    if (!anchor) { if (tries > 30) clearInterval(wait); return; }
    if (document.querySelector("#nsb-app")) { clearInterval(wait); return; }

    // Création du bloc principal
    const root = document.createElement('section');
    root.id = "nsb-app";
    root.style = `
      margin-top: 40px;
      padding: 20px;
      border-radius: 16px;
      text-align: center;
      background: rgba(10,25,47,0.03);
      transition: opacity .6s ease;
      opacity: 0;
    `;

    root.innerHTML = `
      <h2 style="font-size:22px;font-weight:700;margin-bottom:10px;">NSB Gateway</h2>
      <p id="nsb-sub" style="opacity:.9;font-size:16px;margin-bottom:15px;"></p>
      <div id="nsb-switch" style="margin-bottom:20px;">
        <button class="chip" data-aud="decouverte">Découvrir</button>
        <button class="chip" data-aud="pro">Pro</button>
        <button class="chip" data-aud="media">Partenaires</button>
      </div>
      <div id="nsb-ctas">
        <a id="nsb-cta1" class="nsb-btn" target="_blank" rel="noopener">Bouton 1</a>
        <a id="nsb-cta2" class="nsb-btn ghost" target="_blank" rel="noopener">Bouton 2</a>
      </div>
    `;

    anchor.insertAdjacentElement('afterbegin', root);
    root.style.opacity = "1";

    // Style minimal des boutons
    const style = document.createElement('style');
    style.textContent = `
      #nsb-switch .chip {
        background:#0a192f;
        color:#00c6ff;
        border:none;
        border-radius:20px;
        padding:6px 14px;
        margin:0 4px;
        cursor:pointer;
        transition:.3s;
      }
      #nsb-switch .chip.active { background:#00c6ff; color:#fff; }
      .nsb-btn {
        display:inline-block;
        margin:6px;
        padding:10px 18px;
        border-radius:10px;
        background:#00c6ff;
        color:#fff;
        text-decoration:none;
        transition:.3s;
      }
      .nsb-btn.ghost {
        background:transparent;
        border:2px solid #00c6ff;
        color:#00c6ff;
      }
      .nsb-btn:hover { transform:scale(1.05); }
    `;
    document.head.appendChild(style);

    // Gestion des boutons d’audience
    root.querySelectorAll('#nsb-switch .chip').forEach(b => {
      b.addEventListener('click', () => setAudience(b.dataset.aud));
    });

    // Initialisation
    setAudience(state.aud);
    clearInterval(wait);
  }, 300);

  // Fonction de mise à jour dynamique
  function setAudience(aud) {
    state.aud = aud in config ? aud : 'decouverte';
    const view = config[state.aud];
    const sub = document.querySelector('#nsb-sub');
    if (sub) { sub.style.opacity = 0; setTimeout(() => { sub.textContent = view.sub; sub.style.opacity = 1; }, 200); }
    const c1 = document.querySelector('#nsb-cta1'), c2 = document.querySelector('#nsb-cta2');
    if (c1) { c1.textContent = view.cta1.label; c1.href = view.cta1.href; }
    if (c2) { c2.textContent = view.cta2.label; c2.href = view.cta2.href; }
    document.querySelectorAll('#nsb-switch .chip').forEach(b => b.classList.toggle('active', b.dataset.aud === state.aud));
  }
}

// Lance après chargement DOM
document.addEventListener("DOMContentLoaded", nsbMount);
