/* =========================================================
   NSB Gateway — v3.0 « Vagues » (boissons, Cycle 1)
   Auteur : Samuel Nubery
   ---------------------------------------------------------
   Ce script remplace la page Pwofeel par la page NSB.
   Pour modifier le contenu, il suffit d'éditer :
     - docs/catalogue.json  → boissons, vague active, infos du stand
     - docs/routes.json     → liens (tests Tally, WhatsApp, TikTok…)
   Un lien vide ("") cache le bouton correspondant.
   ========================================================= */

(function () {
  const BASE = window.NSB_BASE ||
    'https://raw.githubusercontent.com/Samuuniv9/nsb-gateway/main/docs/';
  const BUST = '?t=' + Math.floor(Date.now() / 60000); // évite le cache plus d'1 min

  // Origine du scan : carte NFC par défaut, ou ?src=flyer sur l'URL
  const SOURCE = new URLSearchParams(location.search).get('src') || 'carte';

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  // Ajoute ?source=carte|flyer aux liens Tally (champ caché "source")
  const withSource = (url) => {
    if (!url) return '';
    try {
      const u = new URL(url);
      if (u.hostname.includes('tally')) u.searchParams.set('source', SOURCE);
      return u.toString();
    } catch (e) { return url; }
  };

  const get = (file, type) => fetch(BASE + file + BUST)
    .then((r) => { if (!r.ok) throw new Error(file + ' ' + r.status); return r[type](); });

  function mount() {
    document.body.innerHTML = '';
    document.body.className = 'nb-body';
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1';
    document.head.appendChild(meta);
    const root = document.createElement('main');
    root.id = 'nb-app';
    document.body.appendChild(root);
    return root;
  }

  function slide(b) {
    return `
      <figure class="nb-slide">
        <div class="nb-photo">${b.image
          ? `<img src="${esc(BASE + b.image)}" alt="${esc(b.marque + ' ' + b.nom)}" loading="lazy">`
          : `<span>${esc(b.marque)}</span>`}</div>
        <figcaption><strong>${esc(b.marque)}</strong>${esc(b.nom)}</figcaption>
      </figure>`;
  }

  function render(root, cat, r) {
    const v = cat.vague_active;
    const list = cat.boissons.filter((b) => b.vague === v);
    const total = cat.boissons.length;
    const vagues = Math.max(...cat.boissons.map((b) => b.vague));

    const vote = withSource(r.test_visuel_stock);
    const avis = withSource(r.test_degustation);
    const radar = withSource(r.test_radar);

    root.innerHTML = `
      <header class="nb-header">
        <span class="nb-logo">NSB</span>
        <span class="nb-badge">Vague ${v} / ${vagues} en cours</span>
      </header>

      <section class="nb-hero">
        <p class="nb-kicker">Nouveau à Saint-Claude</p>
        <h1>Des boissons qu'on ne trouve pas ici.</h1>
        <p class="nb-lead">${total} boissons importées en petite quantité, présentées en ${vagues} vagues de 7.
          <strong>C'est toi qui décides lesquelles restent.</strong></p>
      </section>

      <section class="nb-wave">
        <h2>La vague ${v}</h2>
        <div class="nb-carousel" tabindex="0">${list.map(slide).join('')}</div>
        <div class="nb-dots">${list.map((_, i) => `<span class="${i === 0 ? 'is-on' : ''}"></span>`).join('')}</div>
        ${vote
          ? `<a class="nb-cta" href="${esc(vote)}" target="_blank" rel="noopener">🗳️ Choisis tes préférées</a>
             <p class="nb-hint">1 minute · pas besoin de goûter, juste au feeling</p>`
          : `<span class="nb-cta is-off">🗳️ Vote bientôt ouvert</span>`}
      </section>

      <section class="nb-block">
        <h2>📍 Viens goûter</h2>
        <p>${esc(cat.stand)}</p>
      </section>

      ${avis ? `
      <section class="nb-block">
        <h2>Tu as déjà goûté ?</h2>
        <p>Au stand ou chez toi, dis-nous ce que tu en as pensé. Ton avis compte pour la suite.</p>
        <a class="nb-btn" href="${esc(avis)}" target="_blank" rel="noopener">✍️ Donner mon avis</a>
      </section>` : ''}

      ${radar ? `
      <section class="nb-block">
        <h2>🔭 Le radar</h2>
        <p>Des boissons qu'on n'a pas encore importées. Lesquelles devraient venir ?</p>
        <a class="nb-btn" href="${esc(radar)}" target="_blank" rel="noopener">Voter pour la suite</a>
      </section>` : ''}

      ${r.whatsapp_groupe ? `
      <section class="nb-block nb-soft">
        <h2>Être prévenu de la prochaine vague</h2>
        <p>Annonces uniquement : nouvelles vagues et dates du stand.</p>
        <a class="nb-btn nb-btn-ghost" href="${esc(r.whatsapp_groupe)}" target="_blank" rel="noopener">Rejoindre les annonces WhatsApp</a>
      </section>` : ''}

      <footer class="nb-footer">
        <nav>
          ${r.tiktok ? `<a href="${esc(r.tiktok)}" target="_blank" rel="noopener">TikTok</a>` : '<span>TikTok (bientôt)</span>'}
          ${r.instagram ? `<a href="${esc(r.instagram)}" target="_blank" rel="noopener">Instagram</a>` : ''}
        </nav>
        <p>NSB — North Star Business · Guadeloupe · 2026</p>
      </footer>
    `;

    // Carrousel : glisse au doigt + défilement auto toutes les 3 s (pause au toucher)
    const track = root.querySelector('.nb-carousel');
    const dots = root.querySelectorAll('.nb-dots span');
    const slides = track.children;
    let idx = 0, paused = false;
    const show = (i) => {
      idx = (i + slides.length) % slides.length;
      track.scrollTo({ left: slides[idx].offsetLeft - track.offsetLeft, behavior: 'smooth' });
    };
    track.addEventListener('scroll', () => {
      const i = Math.round(track.scrollLeft / slides[0].offsetWidth);
      dots.forEach((d, k) => d.classList.toggle('is-on', k === i));
      idx = i;
    }, { passive: true });
    ['touchstart', 'mousedown'].forEach((e) => track.addEventListener(e, () => { paused = true; }, { passive: true }));
    setInterval(() => { if (!paused && slides.length > 1) show(idx + 1); }, 3000);
  }

  Promise.all([get('catalogue.json', 'json'), get('routes.json', 'json'), get('nsb-style.css', 'text')])
    .then(([cat, routes, css]) => {
      // Le style est injecté en <style> (GitHub sert les .css en text/plain, refusé en <link>)
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
      render(mount(), cat, routes.fr || {});
    })
    .catch((err) => console.error('NSB Gateway :', err));
})();
