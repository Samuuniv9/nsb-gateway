console.log("✅ NSB Gateway script loaded");
document.body.innerHTML = "<h1>Bienvenue sur NSB Gateway</h1>";


/* =========================================================
   NSB Gateway — Moteur principal (v2.0)
   Auteur : Samuel Nubery
   ========================================================= */

/* === CONFIGURATION === */
const REPLACE_MODE = true; // passe à false pour tester sans effacer le template Pwofeel
const LANG_DEFAULT = 'fr';
const COPY_URL = 'https://raw.githubusercontent.com/Samuuniv9/nsb-gateway/main/docs/COPY.fr.md';
const ROUTES_URL = 'https://raw.githubusercontent.com/Samuuniv9/nsb-gateway/main/docs/routes.json';
const STYLE_URL = 'https://raw.githubusercontent.com/Samuuniv9/nsb-gateway/main/docs/nsb-style.css';

/* === 1️⃣ Injection du style === */
(function injectStyle() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = STYLE_URL;
  document.head.appendChild(link);
})();

/* === 2️⃣ Chargement des fichiers === */
async function loadCopy() {
  const res = await fetch(COPY_URL);
  return await res.text();
}

async function loadRoutes() {
  const res = await fetch(ROUTES_URL);
  return await res.json();
}

/* === 3️⃣ Construction du conteneur === */
function mountApp() {
  const shell = document.querySelector('.container.main-section') || document.body;
  if (REPLACE_MODE) shell.innerHTML = '';
  const root = document.createElement('div');
  root.id = 'nsb-app';
  shell.prepend(root);
  return root;
}

/* === 4️⃣ Génération du HTML === */
function renderApp(copy, routes) {
  const root = document.querySelector('#nsb-app');
  if (!root) return;

  root.innerHTML = `
    <header class="nsb-header">
      <div class="nsb-logo">NSB</div>
      <div class="nsb-badge">✔︎ Vérifié</div>
    </header>

    <section class="nsb-hero">
      <h1>NORTH★STAR // GATE </h1>
      <p>Point d’entrée individuel vers une culture collective.</p>
      <blockquote>
        Tu as croisé ma route — et ce n’est sans doute pas un hasard.<br>
        Nous aidons une nouvelle génération à apprendre, créer et agir ensemble grâce aux nouvelles technologies et à l’intelligence collective.<br>
        Parce que nous ne pouvons pas bâtir notre avenir avec des systèmes qui ne nous comprennent pas.
      </blockquote>
      <a class="nsb-cta" href="${routes.fr.cta_univers}" target="_blank">🌠 Entrer dans l’univers NSB</a>
    </section>

    <section class="nsb-social">
      <a href="${routes.fr.linkedin}" target="_blank">LinkedIn</a>
      <a href="${routes.fr.instagram}" target="_blank">Instagram</a>
      <span class="muted">Twitch (bientôt)</span>
    </section>

    <footer class="nsb-footer">
      <em>La donnée devient culture. La culture devient action.</em>
      <p>© 2025 North Star Business — Guadeloupe.</p>
    </footer>
  `;
}

/* === 5️⃣ Lancement de l’app === */
(async function init() {
  try {
    const [copy, routes] = await Promise.all([loadCopy(), loadRoutes()]);
    mountApp();
    renderApp(copy, routes);
    console.log('✅ NSB Gateway chargée avec succès');
  } catch (err) {
    console.error('Erreur lors du chargement de la NSB Gateway:', err);
  }
})();
