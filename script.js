(function () {
  "use strict";

  var WHATSAPP_NUMBER = "34976273000";
  var CONSENT_KEY = "cfz_cookie_consent_v2";

  // ------- Consent Manager (bloqueo preventivo + granular) -------
  // Categorías: necesarias (siempre), analitica, marketing.
  // Ninguna cookie/script no esencial se carga hasta que el usuario consienta.
  var Consent = {
    get: function () {
      try {
        var raw = localStorage.getItem(CONSENT_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (e) { return null; }
    },
    save: function (c) {
      c.timestamp = new Date().toISOString();
      localStorage.setItem(CONSENT_KEY, JSON.stringify(c));
      applyConsent(c);
    },
    clear: function () { localStorage.removeItem(CONSENT_KEY); }
  };

  function defaultConsent() {
    return { necesarias: true, analitica: false, marketing: false };
  }

  // Aquí es donde se cargarían los scripts de terceros SOLO tras consentimiento.
  // Mientras el usuario no acepte, nada de analítica/publicidad se ejecuta.
  var loaded = { analitica: false, marketing: false };
  function loadAnalytics() {
    if (loaded.analitica) return;
    loaded.analitica = true;
    // Ejemplo (activar cuando se contrate proveedor):
    // var s = document.createElement('script');
    // s.async = true;
    // s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXX';
    // document.head.appendChild(s);
    // window.dataLayer = window.dataLayer || [];
    // function gtag(){ dataLayer.push(arguments); }
    // gtag('js', new Date()); gtag('config','G-XXXX', { anonymize_ip: true });
  }
  function loadMarketing() {
    if (loaded.marketing) return;
    loaded.marketing = true;
    // Aquí se cargarían pixels/remarketing solo con consentimiento explícito.
  }

  // Elimina cookies no esenciales si el usuario retira su consentimiento.
  function purgeNonEssentialCookies() {
    var essential = ["cfz_cookie_consent_v2"]; // ninguna cookie real, solo storage
    document.cookie.split(";").forEach(function (c) {
      var name = c.split("=")[0].trim();
      if (!name) return;
      if (essential.indexOf(name) !== -1) return;
      var domains = [location.hostname, "." + location.hostname];
      var paths = ["/", location.pathname];
      domains.forEach(function (d) {
        paths.forEach(function (p) {
          document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=" + p + "; domain=" + d;
        });
      });
      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    });
  }

  function applyConsent(c) {
    if (c.analitica) loadAnalytics();
    if (c.marketing) loadMarketing();
    if (!c.analitica || !c.marketing) purgeNonEssentialCookies();
  }

  // Exponer para el botón "Gestionar cookies"
  window.CFZCookies = {
    open: function () { openSettings(); },
    reset: function () { Consent.clear(); showBanner(); }
  };

  document.addEventListener("DOMContentLoaded", function () {
    var header = document.getElementById("site-header");
    var scrollTopBtn = document.getElementById("scroll-top");
    var navToggle = document.getElementById("nav-toggle");
    var mobileNav = document.getElementById("mobile-nav");

    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      if (header) header.classList.toggle("is-scrolled", y > 20);
      if (scrollTopBtn) scrollTopBtn.classList.toggle("is-visible", y > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (scrollTopBtn) {
      scrollTopBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    if (navToggle && mobileNav) {
      navToggle.addEventListener("click", function () {
        var open = mobileNav.classList.toggle("is-open");
        navToggle.classList.toggle("is-open", open);
        navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      });
      mobileNav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          mobileNav.classList.remove("is-open");
          navToggle.classList.remove("is-open");
        });
      });
    }

    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
      );
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("is-in"); });
    }

    var form = document.getElementById("contact-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var nombre = (form.nombre.value || "").trim();
        var telefono = (form.telefono.value || "").trim();
        var motivo = (form.motivo.value || "").trim();
        var msg =
          "Hola, me gustaría pedir una cita de fisioterapia.\n\n" +
          "Nombre: " + nombre + "\n" +
          "Teléfono: " + telefono + "\n" +
          "Motivo: " + motivo;
        var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);
        window.open(url, "_blank", "noopener");
      });
    }

    // ---------- Cookie banner + modal ----------
    var banner = document.getElementById("cookie-banner");
    var modal = document.getElementById("cookie-modal");

    function showBanner() {
      if (banner) setTimeout(function () { banner.classList.add("is-visible"); }, 400);
    }
    function hideBanner() { if (banner) banner.classList.remove("is-visible"); }

    function openSettings() {
      if (!modal) return;
      var current = Consent.get() || defaultConsent();
      var an = modal.querySelector("#cookie-cat-analitica");
      var mk = modal.querySelector("#cookie-cat-marketing");
      if (an) an.checked = !!current.analitica;
      if (mk) mk.checked = !!current.marketing;
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
    function closeSettings() {
      if (!modal) return;
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    }
    // exponer para uso externo
    window.CFZCookies.openSettings = openSettings;

    // Estado inicial: si no hay consentimiento, mostrar banner (bloqueo preventivo)
    var saved = Consent.get();
    if (!saved) {
      showBanner();
    } else {
      applyConsent(saved);
    }

    // Banner: aceptar todo
    var accept = document.getElementById("cookie-accept");
    if (accept) accept.addEventListener("click", function () {
      Consent.save({ necesarias: true, analitica: true, marketing: true });
      hideBanner();
    });
    // Banner: rechazar todo
    var reject = document.getElementById("cookie-reject");
    if (reject) reject.addEventListener("click", function () {
      Consent.save({ necesarias: true, analitica: false, marketing: false });
      hideBanner();
    });
    // Banner: configurar
    var configure = document.getElementById("cookie-configure");
    if (configure) configure.addEventListener("click", function () {
      openSettings();
    });

    // Modal: guardar preferencias
    if (modal) {
      var saveBtn = modal.querySelector("#cookie-save");
      var rejectAllBtn = modal.querySelector("#cookie-modal-reject");
      var acceptAllBtn = modal.querySelector("#cookie-modal-accept");
      var closeBtn = modal.querySelector("#cookie-modal-close");

      if (saveBtn) saveBtn.addEventListener("click", function () {
        var an = modal.querySelector("#cookie-cat-analitica");
        var mk = modal.querySelector("#cookie-cat-marketing");
        Consent.save({
          necesarias: true,
          analitica: an ? an.checked : false,
          marketing: mk ? mk.checked : false
        });
        closeSettings();
        hideBanner();
      });
      if (rejectAllBtn) rejectAllBtn.addEventListener("click", function () {
        Consent.save({ necesarias: true, analitica: false, marketing: false });
        closeSettings();
        hideBanner();
      });
      if (acceptAllBtn) acceptAllBtn.addEventListener("click", function () {
        Consent.save({ necesarias: true, analitica: true, marketing: true });
        closeSettings();
        hideBanner();
      });
      if (closeBtn) closeBtn.addEventListener("click", closeSettings);
      modal.addEventListener("click", function (e) {
        if (e.target === modal) closeSettings();
      });
    }

    // Botón "Gestionar cookies" del footer (y cualquier data-cookie-manage)
    document.querySelectorAll("[data-cookie-manage]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        openSettings();
      });
    });
  });
})();

// FAQ: solo un item abierto a la vez
document.querySelectorAll('.faq__item').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      document.querySelectorAll('.faq__item[open]').forEach((other) => {
        if (other !== item) other.removeAttribute('open');
      });
    }
  });
});
