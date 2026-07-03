(!(function () {
  "use strict";
  var e = "cfz_cookie_consent_v2",
    t = function () {
      try {
        var t = localStorage.getItem(e);
        return t ? JSON.parse(t) : null;
      } catch (e) {
        return null;
      }
    },
    n = function (t) {
      ((t.timestamp = new Date().toISOString()), localStorage.setItem(e, JSON.stringify(t)), a(t));
    },
    o = function () {
      localStorage.removeItem(e);
    };
  var i = { analitica: !1, marketing: !1 };
  function a(e) {
    var t;
    (e.analitica && (i.analitica || (i.analitica = !0)),
      e.marketing && (i.marketing || (i.marketing = !0)),
      (e.analitica && e.marketing) ||
        ((t = ["cfz_cookie_consent_v2"]),
        document.cookie.split(";").forEach(function (e) {
          var n = e.split("=")[0].trim();
          if (n && -1 === t.indexOf(n)) {
            var o = [location.hostname, "." + location.hostname],
              i = ["/", location.pathname];
            (o.forEach(function (e) {
              i.forEach(function (t) {
                document.cookie = n + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=" + t + "; domain=" + e;
              });
            }),
              (document.cookie = n + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"));
          }
        })));
  }
  ((window.CFZCookies = {
    open: function () {
      openSettings();
    },
    reset: function () {
      (o(), showBanner());
    },
  }),
    document.addEventListener("DOMContentLoaded", function () {
      var e = document.getElementById("site-header"),
        o = document.getElementById("scroll-top"),
        i = document.getElementById("nav-toggle"),
        c = document.getElementById("mobile-nav"),
        r = document.getElementById("year");
      function l() {
        var t = window.scrollY || window.pageYOffset;
        (e && e.classList.toggle("is-scrolled", t > 20), o && o.classList.toggle("is-visible", t > 400));
      }
      (r && (r.textContent = new Date().getFullYear()),
        window.addEventListener("scroll", l, { passive: !0 }),
        l(),
        o &&
          o.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }),
        i &&
          c &&
          (i.addEventListener("click", function () {
            var e = c.classList.toggle("is-open");
            (i.classList.toggle("is-open", e), i.setAttribute("aria-label", e ? "Cerrar menú" : "Abrir menú"));
          }),
          c.querySelectorAll("a").forEach(function (e) {
            e.addEventListener("click", function () {
              (c.classList.remove("is-open"), i.classList.remove("is-open"));
            });
          })));
      var s = document.querySelectorAll(".reveal");
      if ("IntersectionObserver" in window) {
        var d = new IntersectionObserver(
          function (e) {
            e.forEach(function (e) {
              e.isIntersecting && (e.target.classList.add("is-in"), d.unobserve(e.target));
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
        );
        s.forEach(function (e) {
          d.observe(e);
        });
      } else
        s.forEach(function (e) {
          e.classList.add("is-in");
        });
      var u = document.getElementById("contact-form");
      u &&
        u.addEventListener("submit", function (e) {
          e.preventDefault();
          var t = (u.nombre.value || "").trim(),
            n = (u.telefono.value || "").trim(),
            o = (u.motivo.value || "").trim(),
            i =
              "https://wa.me/34976273000?text=" +
              encodeURIComponent(
                "Hola, me gustaría pedir una cita de fisioterapia.\n\nNombre: " +
                  t +
                  "\nTeléfono: " +
                  n +
                  "\nMotivo: " +
                  o,
              );
          window.open(i, "_blank", "noopener");
        });
      var m = document.getElementById("cookie-banner"),
        v = document.getElementById("cookie-modal");
      function f() {
        m && m.classList.remove("is-visible");
      }
      function g() {
        if (v) {
          var e = t() || { necesarias: !0, analitica: !1, marketing: !1 },
            n = v.querySelector("#cookie-cat-analitica"),
            o = v.querySelector("#cookie-cat-marketing");
          (n && (n.checked = !!e.analitica),
            o && (o.checked = !!e.marketing),
            v.classList.add("is-open"),
            (document.body.style.overflow = "hidden"));
        }
      }
      function k() {
        v && (v.classList.remove("is-open"), (document.body.style.overflow = ""));
      }
      window.CFZCookies.openSettings = g;
      var p = t();
      p
        ? a(p)
        : m &&
          setTimeout(function () {
            m.classList.add("is-visible");
          }, 400);
      var E = document.getElementById("cookie-accept");
      E &&
        E.addEventListener("click", function () {
          (n({ necesarias: !0, analitica: !0, marketing: !0 }), f());
        });
      var y = document.getElementById("cookie-reject");
      y &&
        y.addEventListener("click", function () {
          (n({ necesarias: !0, analitica: !1, marketing: !1 }), f());
        });
      var h = document.getElementById("cookie-configure");
      if (
        (h &&
          h.addEventListener("click", function () {
            g();
          }),
        v)
      ) {
        var L = v.querySelector("#cookie-save"),
          w = v.querySelector("#cookie-modal-reject"),
          S = v.querySelector("#cookie-modal-accept"),
          b = v.querySelector("#cookie-modal-close");
        (L &&
          L.addEventListener("click", function () {
            var e = v.querySelector("#cookie-cat-analitica"),
              t = v.querySelector("#cookie-cat-marketing");
            (n({ necesarias: !0, analitica: !!e && e.checked, marketing: !!t && t.checked }), k(), f());
          }),
          w &&
            w.addEventListener("click", function () {
              (n({ necesarias: !0, analitica: !1, marketing: !1 }), k(), f());
            }),
          S &&
            S.addEventListener("click", function () {
              (n({ necesarias: !0, analitica: !0, marketing: !0 }), k(), f());
            }),
          b && b.addEventListener("click", k),
          v.addEventListener("click", function (e) {
            e.target === v && k();
          }));
      }
      document.querySelectorAll("[data-cookie-manage]").forEach(function (e) {
        e.addEventListener("click", function (e) {
          (e.preventDefault(), g());
        });
      });
    }));
})(),
  document.querySelectorAll(".faq__item").forEach((e) => {
    e.addEventListener("toggle", () => {
      e.open &&
        document.querySelectorAll(".faq__item[open]").forEach((t) => {
          t !== e && t.removeAttribute("open");
        });
    });
  }));
