/* NSB Gateway — chargeur (ce fichier ne change plus).
   Pwofeel charge ce petit fichier, qui va chercher la dernière version
   de nsb-core.js à chaque visite : plus de problème de cache. */
(function () {
  var B = window.NSB_BASE || 'https://raw.githubusercontent.com/Samuuniv9/nsb-gateway/main/docs/';
  function fallback() {
    var s = document.createElement('script');
    s.src = 'https://raw.githack.com/Samuuniv9/nsb-gateway/main/docs/nsb-core.js';
    document.body.appendChild(s);
  }
  fetch(B + 'nsb-core.js?t=' + Date.now())
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(function (code) {
      var s = document.createElement('script');
      s.textContent = code;
      document.body.appendChild(s);
    })
    .catch(fallback);
})();
