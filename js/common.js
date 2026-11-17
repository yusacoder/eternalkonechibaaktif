/* ==========================================================================
   common.js — Ortak: yükleme ekranı, yardımcı fonksiyonlar, toast, bakım modu
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Loading screen ---------- */
  function hideLoader() {
    var loader = document.getElementById("loading-screen");
    if (loader) {
      setTimeout(function () {
        loader.classList.add("is-hidden");
      }, 250);
    }
  }

  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader);
  }

  /* ---------- Placeholder helper (global) ---------- */
  window.withPlaceholder = function (value, fallback) {
    if (value === undefined || value === null) return fallback;
    if (typeof value === "string" && value.trim() === "") return fallback;
    return value;
  };

  /* ---------- URL doğrulama (global) ---------- */
  window.isValidUrl = function (url) {
    if (!url || typeof url !== "string") return false;
    if (url.startsWith("mailto:") || url.startsWith("tel:")) return true;
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  /* ---------- HTML escape (global) ---------- */
  window.escapeHtml = function (str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  /* ---------- Toast helper (global) ---------- */
  window.showToast = function (message, type) {
    var stack = document.getElementById("toast-stack");
    if (!stack) return;

    var toast = document.createElement("div");
    toast.className = "toast" + (type ? " " + type : "");
    toast.innerHTML = '<span style="margin-right:8px; font-size:1.1rem;"><i class="fa-solid fa-circle-check" style="color:#ff2a2a;"></i></span> ' + window.escapeHtml(message);

    stack.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      setTimeout(function () {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
      }, 300);
    }, 3500);
  };

  /* ---------- Bakım Modu (Maintenance Mode) ---------- */
  function checkMaintenanceMode() {
    var paths = ["bakim.json", "data/bakim.json", "../bakim.json", "../data/bakim.json"];

    function tryPath(idx) {
      if (idx >= paths.length) return;
      fetch(paths[idx])
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.json();
        })
        .then(function (data) {
          if (data && (data.active === true || data.active === "true")) {
            renderMaintenanceOverlay(data);
          }
        })
        .catch(function () {
          tryPath(idx + 1);
        });
    }

    tryPath(0);
  }

  function renderMaintenanceOverlay(data) {
    var title = data.title || "Sitemiz Bakımdadır";
    var message = data.message || "Sizlere daha iyi bir deneyim sunabilmek için bakım çalışması yapıyoruz.";
    var estimated = data.estimated_time || "";
    var contact = data.contact_info || "";

    var appShell = document.getElementById("app-shell");
    if (appShell) {
      appShell.style.display = "none";
    }
    var bottomNav = document.querySelector(".bottom-nav");
    if (bottomNav) bottomNav.style.display = "none";

    var overlay = document.createElement("div");
    overlay.id = "maintenance-screen";
    overlay.className = "maintenance-screen";

    overlay.innerHTML =
      '<div class="maintenance-card glass-card">' +
        '<div class="maintenance-icon-wrapper">' +
          '<i class="fa-solid fa-gears maintenance-gear"></i>' +
        '</div>' +
        '<h1 class="maintenance-title">' + window.escapeHtml(title) + '</h1>' +
        '<p class="maintenance-message">' + window.escapeHtml(message) + '</p>' +
        (estimated ? '<div class="maintenance-badge"><i class="fa-solid fa-clock"></i> ' + window.escapeHtml(estimated) + '</div>' : '') +
        (contact ? '<div class="maintenance-contact"><a href="mailto:' + window.escapeHtml(contact) + '" class="btn btn-primary"><i class="fa-solid fa-envelope"></i> ' + window.escapeHtml(contact) + '</a></div>' : '') +
      '</div>';

    document.body.appendChild(overlay);
  }



  /* ---------- Kodla yönetilen arka plan ayarları (data.json) ---------- */
  function loadBackgroundConfig() {
    var backdrop = document.querySelector(".backdrop");
    if (!backdrop) return;

    var scriptUrl = document.currentScript && document.currentScript.src
      ? document.currentScript.src
      : new URL("js/common.js", document.baseURI).href;
    var configUrl = new URL("../data.json", scriptUrl);

    fetch(configUrl.href)
      .then(function (response) {
        if (!response.ok) throw new Error("Arka plan ayarları yüklenemedi");
        return response.json();
      })
      .then(function (config) {
        var background = config && config.background ? config.background : {};
        var image = typeof background.image === "string" ? background.image.trim() : "";
        var blur = Number(background.blur);
        if (!Number.isFinite(blur)) blur = 0;
        blur = Math.max(0, Math.min(24, blur));

        if (image) {
          var imageUrl = new URL(image, configUrl.href);
          if (imageUrl.protocol === "http:" || imageUrl.protocol === "https:") {
            backdrop.style.backgroundImage = 'url("' + imageUrl.href.replace(/"/g, "%22") + '"), var(--bg-image)';
          }
        }
        document.documentElement.style.setProperty("--bg-blur", blur + "px");
      })
      .catch(function () {
        /* data.json bulunmazsa CSS varsayılan arka planı kullanılır. */
      });
  }

  loadBackgroundConfig();

  checkMaintenanceMode();
})();
