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



  /* ---------- Arka plan fotoğrafı ve blur ayarları ---------- */
  function initBackgroundControls() {
    var backdrop = document.querySelector(".backdrop");
    var topbar = document.querySelector(".topbar");
    if (!backdrop || !topbar) return;

    var STORAGE_KEY = "konechiba-background-settings";
    var settings = { image: "", blur: 0 };
    try {
      settings = Object.assign(settings, JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));
    } catch (e) { /* Bozuk kayıt varsa varsayılanları kullan. */ }

    function applySettings() {
      var imageLayer = settings.image ? 'url("' + settings.image.replace(/"/g, "%22") + '"), ' : "";
      backdrop.style.backgroundImage = imageLayer + "var(--bg-image)";
      backdrop.style.filter = "blur(" + Number(settings.blur || 0) + "px) saturate(var(--bg-saturation))";
      document.documentElement.style.setProperty("--bg-blur", (Number(settings.blur) || 0) + "px");
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch (e) { /* Depolama doluysa görünüm yine uygulanır. */ }
    }

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "background-settings-toggle";
    toggle.setAttribute("aria-label", "Arka plan ayarlarını aç");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = '<i class="fa-solid fa-sliders"></i>';

    var panel = document.createElement("section");
    panel.className = "background-settings-panel";
    panel.hidden = true;
    panel.setAttribute("aria-label", "Arka plan ayarları");
    panel.innerHTML = '<h2>Arka Plan Ayarları</h2>' +
      '<label for="background-image-url">Fotoğraf bağlantısı</label>' +
      '<input id="background-image-url" type="url" placeholder="https://ornek.com/fotograf.jpg" autocomplete="url">' +
      '<label for="background-image-file">veya cihazından fotoğraf seç</label>' +
      '<input id="background-image-file" type="file" accept="image/*">' +
      '<label for="background-blur">Bulanıklık: <output id="background-blur-value">0 px</output></label>' +
      '<input id="background-blur" type="range" min="0" max="24" step="1" value="0">' +
      '<div class="background-settings-actions"><button type="button" id="background-reset">Varsayılana dön</button><button type="button" id="background-close">Kapat</button></div>';

    topbar.appendChild(toggle);
    document.body.appendChild(panel);

    var urlInput = panel.querySelector("#background-image-url");
    var fileInput = panel.querySelector("#background-image-file");
    var blurInput = panel.querySelector("#background-blur");
    var blurValue = panel.querySelector("#background-blur-value");
    urlInput.value = settings.image && !settings.image.startsWith("data:") ? settings.image : "";
    blurInput.value = Number(settings.blur) || 0;
    blurValue.value = blurInput.value + " px";
    applySettings();

    toggle.addEventListener("click", function () {
      panel.hidden = !panel.hidden;
      toggle.setAttribute("aria-expanded", String(!panel.hidden));
    });
    urlInput.addEventListener("change", function () {
      settings.image = urlInput.value.trim();
      fileInput.value = "";
      applySettings();
    });
    blurInput.addEventListener("input", function () {
      settings.blur = Number(blurInput.value);
      blurValue.value = blurInput.value + " px";
      applySettings();
    });
    fileInput.addEventListener("change", function () {
      var file = fileInput.files && fileInput.files[0];
      if (!file) return;
      if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
        if (window.showToast) window.showToast("2 MB'dan küçük bir fotoğraf seçin.", "error");
        fileInput.value = "";
        return;
      }
      var reader = new FileReader();
      reader.onload = function () {
        settings.image = reader.result;
        urlInput.value = "";
        applySettings();
      };
      reader.readAsDataURL(file);
    });
    panel.querySelector("#background-reset").addEventListener("click", function () {
      settings = { image: "", blur: 0 };
      urlInput.value = "";
      fileInput.value = "";
      blurInput.value = 0;
      blurValue.value = "0 px";
      applySettings();
    });
    panel.querySelector("#background-close").addEventListener("click", function () {
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    });
    document.addEventListener("click", function (event) {
      if (!panel.hidden && !panel.contains(event.target) && event.target !== toggle && !toggle.contains(event.target)) {
        panel.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBackgroundControls);
  } else {
    initBackgroundControls();
  }

  checkMaintenanceMode();
})();
