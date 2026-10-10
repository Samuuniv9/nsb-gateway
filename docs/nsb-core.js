/* =========================================================
   NSB Gateway (cœur) — v3.5 « Mystère » (boissons, Cycle 1) + stats GoatCounter + vague dans Tally
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

  // Drop en cours, lu dans catalogue.json au chargement
  let VAGUE = '';

  // Ajoute ?source=carte|flyer&vague=N aux liens Tally (champs cachés "source" et "vague")
  const withSource = (url) => {
    if (!url) return '';
    try {
      const u = new URL(url);
      if (u.hostname.includes('tally')) {
        u.searchParams.set('source', SOURCE);
        // Numéro du drop en cours (catalogue.json → vague_active), rempli dans le champ caché "vague"
        if (VAGUE !== '') u.searchParams.set('vague', String(VAGUE));
      }
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
    chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    drop: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5S12.5 5 12 2.5c-.5 2.5-2 4.9-4 6.5S5 13 5 15a7 7 0 0 0 7 7Z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    run: '<circle cx="14" cy="4" r="2"/><path d="m6 21 3-6 3 2 1-5 3 3h3"/><path d="m8 10 3-3 4 1"/>',
    flask: '<path d="M10 2v7.3L4.5 18A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3L14 9.3V2"/><path d="M8.5 2h7M7 16h10"/>'
  };
  const ico = (n) => `<svg class="nb-ico" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;

  function mount() {
    document.body.innerHTML = '';
    document.body.className = 'nb-body';
    document.body.dataset.nbTheme = THEME;
    // Une seule balise viewport : on modifie celle de Pwofeel au lieu d'en ajouter une
    // (deux balises = le téléphone garde la première et zoome au chargement)
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'viewport'; document.head.appendChild(meta); }
    meta.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
    document.title = 'NSB — Boissons inédites en Guadeloupe';
    const root = document.createElement('main');
    root.id = 'nb-app';
    document.body.appendChild(root);
    return root;
  }

  // Boisson mystère : canette floutée en fond, mood au centre, saveurs dessous (pas de marque)
  function slide(b, moods) {
    const m = moods[b.mood] || { label: b.mood, icon: 'sparkle' };
    return `
      <figure class="nb-slide" data-mood="${esc(b.mood)}">
        <div class="nb-photo">
          ${b.image ? `<img src="${esc(BASE + b.image)}" alt="" loading="lazy">` : ''}
          <span class="nb-mood nb-mood-${esc(b.mood)}">${ico(m.icon)} ${esc(m.label)}</span>
        </div>
        <figcaption><strong>${esc(b.saveurs)}</strong>${esc(b.type)} · ${esc(b.format).replace(/ (cl)\b/g, '&nbsp;$1')}</figcaption>
      </figure>`;
  }

  let THEME = 'nuit';

  function render(root, cat, r) {
    const v = cat.vague_active;
    VAGUE = v ?? '';
    const list = cat.boissons.filter((b) => b.vague === v);
    const total = cat.boissons.length;
    const vagues = Math.max(...cat.boissons.map((b) => b.vague));

    const vote = withSource(r.test_visuel_stock);
    const avis = withSource(r.test_degustation);
    const radar = withSource(r.test_radar);

    root.innerHTML = `
      <header class="nb-header">
        <span class="nb-brandbox"><span class="nb-logo">NSB</span><span class="nb-baseline">Communauté d'accès à des produits introuvables ailleurs</span></span>
        <span class="nb-badge">${ico('waves')} Drop ${v} / ${vagues} en cours</span>
      </header>

      <section class="nb-hero">
        <p class="nb-kicker">${ico('sparkle')} Nouveau</p>
        <h1>Des boissons inédites en Guadeloupe.</h1>
        <p class="nb-lead">Un labo de découverte local : ${total} boissons, ${vagues} drops.
          <strong>À chaque drop, c'est toi qui décides lesquelles restent.</strong></p>
      </section>

      <ol class="nb-ritual">
        ${(cat.rituel || '').split('·').map((t, i) => `<li class="nb-step-${i + 1}"><span>${i + 1}</span>${esc(t.trim())}</li>`).join('')}
      </ol>

      <section class="nb-wave nb-stepsec nb-sec-1">
        <h2><span class="nb-num">1</span> Choisis ton mood</h2>
        <p class="nb-mystery">Le drop ${v} : ${list.length} boissons mystère. La marque se découvre au stand.</p>
        <div class="nb-chips">
          <button class="nb-chip is-on" data-filter="tout">Tout</button>
          ${Object.entries(cat.moods).filter(([k]) => list.some((b) => b.mood === k)).map(([k, m]) => `<button class="nb-chip nb-chip-${esc(k)}" data-filter="${esc(k)}">${ico(m.icon)} ${esc(m.label)}</button>`).join('')}
        </div>
        <div class="nb-carousel" tabindex="0">${list.map((b) => slide(b, cat.moods)).join('')}</div>
        <div class="nb-dots"></div>
        ${vote
          ? `<a class="nb-cta nb-go-1" href="${esc(vote)}" target="_blank" rel="noopener">${ico('sparkle')} Dis-nous ton mood</a>
             <p class="nb-hint">Code donné au stand</p>`
          : ''}
      </section>

      <section class="nb-block nb-stepsec nb-sec-2">
        <h2><span class="nb-num">2</span> Goûte une boisson</h2>
        <p class="nb-tag-2">${ico('cup')} Demande ta dégustation au stand</p>
        <p>${esc(cat.stand)}</p>
        <p class="nb-small">Tu as déjà vu une de ces boissons ailleurs en Guadeloupe ? Dis-le-nous, ça nous intéresse.</p>
      </section>

      ${avis ? `
      <section class="nb-block nb-stepsec nb-sec-3">
        <h2><span class="nb-num">3</span> Vote pour qu'elle reste</h2>
        <p>Tu as goûté ? Ta note décide des boissons du prochain drop.</p>
        <a class="nb-btn nb-go-3" href="${esc(avis)}" target="_blank" rel="noopener">${ico('vote')} Vote pour qu'elle reste</a>
        <p class="nb-small">Code donné au stand</p>
      </section>` : ''}

      ${radar ? `
      <section class="nb-block">
        <h2>${ico('radar')} Le radar</h2>
        <p>Des boissons qu'on n'a pas encore importées. Lesquelles devraient venir ?</p>
        <a class="nb-btn" href="${esc(radar)}" target="_blank" rel="noopener">Voter pour la suite</a>
      </section>` : ''}

      ${r.whatsapp_groupe ? `
      <section class="nb-block nb-soft">
        <h2>${ico('bell')} Être prévenu du prochain drop</h2>
        <p>Annonces uniquement : nouveaux drops et dates du stand.</p>
        <a class="nb-btn nb-join" href="${esc(r.whatsapp_groupe)}" target="_blank" rel="noopener">${ico('chat')} Rejoindre les annonces WhatsApp</a>
      </section>` : ''}

      <footer class="nb-footer">
        <nav>
          ${r.tiktok ? `<a href="${esc(r.tiktok)}" target="_blank" rel="noopener">TikTok</a>` : ''}
          ${r.instagram ? `<a href="${esc(r.instagram)}" target="_blank" rel="noopener">Instagram</a>` : ''}
        </nav>
        <p>NSB — North Star Business · Guadeloupe · 2026</p>
      </footer>
    `;

    // Carrousel : moods (filtre) + glisse au doigt + défilement auto (pause au toucher)
    const track = root.querySelector('.nb-carousel');
    const dotsBox = root.querySelector('.nb-dots');
    const all = [...track.children];
    let visible = all, idx = 0, paused = false;
    const drawDots = () => {
      dotsBox.innerHTML = visible.map((_, i) => `<span class="${i === idx ? 'is-on' : ''}"></span>`).join('');
    };
    const show = (i) => {
      if (!visible.length) return;
      idx = (i + visible.length) % visible.length;
      track.scrollTo({ left: visible[idx].offsetLeft - track.offsetLeft, behavior: 'smooth' });
    };
    track.addEventListener('scroll', () => {
      if (!visible.length) return;
      const w = visible[0].offsetWidth + 12;
      idx = Math.min(visible.length - 1, Math.round(track.scrollLeft / w));
      dotsBox.querySelectorAll('span').forEach((d, k) => d.classList.toggle('is-on', k === idx));
    }, { passive: true });
    root.querySelectorAll('.nb-chip').forEach((chip) => chip.addEventListener('click', () => {
      root.querySelectorAll('.nb-chip').forEach((c) => c.classList.remove('is-on'));
      chip.classList.add('is-on');
      const f = chip.dataset.filter;
      all.forEach((el) => { el.hidden = !(f === 'tout' || el.dataset.mood === f); });
      visible = all.filter((el) => !el.hidden);
      idx = 0; track.scrollLeft = 0; drawDots(); paused = true;
    }));
    ['touchstart', 'mousedown'].forEach((e) => track.addEventListener(e, () => { paused = true; }, { passive: true }));
    drawDots();
    setInterval(() => { if (!paused && visible.length > 1) show(idx + 1); }, 3000);
  }

  // ---------------------------------------------------------
  // Statistiques GoatCounter (sans cookies, donc sans bannière)
  // Tableau de bord : https://nsb.goatcounter.com
  // Pages comptées : visite-carte / visite-flyer
  // Clics comptés : clic-mood-form, clic-vote, clic-radar,
  //   clic-whatsapp, clic-tiktok, clic-instagram, mood-<nom>
  // (chaque clic se termine par -carte ou -flyer)
  // Pour couper les stats : mettre STATS = '' ci-dessous.
  // ---------------------------------------------------------
  const STATS = 'https://nsb.goatcounter.com/count';
  const nbCount = (path, title, event) => {
    try {
      if (window.goatcounter && window.goatcounter.count) {
        window.goatcounter.count({ path, title, event });
      }
    } catch (e) { /* les stats ne doivent jamais casser la page */ }
  };
  function startStats() {
    if (!STATS) return;
    window.goatcounter = { no_onload: true };
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://gc.zgo.at/count.js';
    s.dataset.goatcounter = STATS;
    s.onload = () => nbCount('visite-' + SOURCE, 'Visite page NSB (' + SOURCE + ')', false);
    document.head.appendChild(s);

    document.addEventListener('click', (e) => {
      const el = e.target.closest('a, .nb-chip');
      if (!el) return;
      let name = '';
      if (el.classList.contains('nb-chip')) name = 'mood-' + el.dataset.filter;
      else if (el.classList.contains('nb-go-1')) name = 'clic-mood-form';
      else if (el.classList.contains('nb-go-3')) name = 'clic-vote';
      else if (el.classList.contains('nb-join')) name = 'clic-whatsapp';
      else if (/tiktok/i.test(el.href)) name = 'clic-tiktok';
      else if (/instagram/i.test(el.href)) name = 'clic-instagram';
      else if (/tally/i.test(el.href)) name = 'clic-radar';
      if (name) nbCount(name + '-' + SOURCE, el.textContent.trim().slice(0, 60), true);
    }, true);
  }

  Promise.all([get('catalogue.json', 'json'), get('routes.json', 'json'), get('nsb-style.css', 'text')])
    .then(([cat, routes, css]) => {
      // Le style est injecté en <style> (GitHub sert les .css en text/plain, refusé en <link>)
      const style = document.createElement('style');
      style.id = 'nb-style';
      style.textContent = css;
      document.head.appendChild(style);
      // Thème : catalogue.json → "theme" (ou ?theme=… pour tester)
      THEME = new URLSearchParams(location.search).get('theme') || cat.theme || 'nuit';
      render(mount(), cat, routes.fr || {});
      startStats();
    })
    .catch((err) => console.error('NSB Gateway :', err));
})();
