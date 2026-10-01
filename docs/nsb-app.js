/* =========================================================
   NSB Gateway — v3.1 « Vagues » (boissons, Cycle 1)
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

  // Pictogrammes (traits, couleur héritée du thème)
  const ICONS = {
    sparkle: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z"/><path d="M19 3v4M21 5h-4"/>',
    waves: '<path d="M2 7c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/><path d="M2 13c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/><path d="M2 19c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/>',
    cup: '<path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8"/><path d="M5 8h14"/><path d="M7 15a6.5 6.5 0 0 1 5 0 6.5 6.5 0 0 0 5 0"/><path d="m12 8 1-6h2"/>',
    vote: '<path d="m9 12 2 2 4-4"/><path d="M5 7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12H5V7Z"/><path d="M22 19H2"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    radar: '<circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3Z"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
    chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'
  };
  const ico = (n) => `<svg class="nb-ico" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;

  function mount() {
    document.body.innerHTML = '';
    document.body.className = 'nb-body';
    document.body.dataset.nbTheme = THEME;
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

  let THEME = 'tropique';

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
        <span class="nb-badge">${ico('waves')} Vague ${v} / ${vagues} en cours</span>
      </header>

      <section class="nb-hero">
        <p class="nb-kicker">${ico('sparkle')} Nouveau à Saint-Claude</p>
        <h1>Des boissons qu'on ne trouve pas ici.</h1>
        <p class="nb-lead">${total} boissons importées en petite quantité, présentées en ${vagues} vagues de 7.
          <strong>C'est toi qui décides lesquelles restent.</strong></p>
      </section>

      <section class="nb-wave">
        <h2>${ico('cup')} La vague ${v}</h2>
        <div class="nb-carousel" tabindex="0">${list.map(slide).join('')}</div>
        <div class="nb-dots">${list.map((_, i) => `<span class="${i === 0 ? 'is-on' : ''}"></span>`).join('')}</div>
        ${vote
          ? `<a class="nb-cta" href="${esc(vote)}" target="_blank" rel="noopener">${ico('vote')} Choisis tes préférées</a>
             <p class="nb-hint">1 minute · pas besoin de goûter, juste au feeling</p>`
          : `<span class="nb-cta is-off">${ico('vote')} Vote bientôt ouvert</span>`}
      </section>

      <section class="nb-block">
        <h2>${ico('pin')} Viens goûter</h2>
        <p>${esc(cat.stand)}</p>
      </section>

      ${avis ? `
      <section class="nb-block">
        <h2>${ico('pen')} Tu as déjà goûté ?</h2>
        <p>Au stand ou chez toi, dis-nous ce que tu en as pensé. Ton avis compte pour la suite.</p>
        <a class="nb-btn" href="${esc(avis)}" target="_blank" rel="noopener">Donner mon avis</a>
      </section>` : ''}

      ${radar ? `
      <section class="nb-block">
        <h2>${ico('radar')} Le radar</h2>
        <p>Des boissons qu'on n'a pas encore importées. Lesquelles devraient venir ?</p>
        <a class="nb-btn" href="${esc(radar)}" target="_blank" rel="noopener">Voter pour la suite</a>
      </section>` : ''}

      ${r.whatsapp_groupe ? `
      <section class="nb-block nb-soft">
        <h2>${ico('bell')} Être prévenu de la prochaine vague</h2>
        <p>Annonces uniquement : nouvelles vagues et dates du stand.</p>
        <a class="nb-btn nb-btn-ghost" href="${esc(r.whatsapp_groupe)}" target="_blank" rel="noopener">${ico('chat')} Rejoindre les annonces WhatsApp</a>
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
      // Thème : catalogue.json → "theme" (ou ?theme=… pour tester)
      THEME = new URLSearchParams(location.search).get('theme') || cat.theme || 'tropique';
      render(mount(), cat, routes.fr || {});
    })
    .catch((err) => console.error('NSB Gateway :', err));
})();
