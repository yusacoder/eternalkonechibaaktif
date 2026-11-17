/* ==========================================================================
   home.js — Ana sayfa: profil + sosyal medya kartları
   Veriler doğrudan burada tanımlı (fetch yok, dosya olarak da çalışır).
   ========================================================================== */

(function () {
  "use strict";

  var DATA = {
    name: "Konechiba Senpai",
    logo: "https://photograph.eternalproduction.net/konechiba-senpai-logo.jpg",
    bio: "Merhaba! Ben Konechiba Senpai. High School DxD içerikleri, karakter analizleri, haberler ve eğlenceli paylaşımlar için doğru yerdesin. Sosyal medya hesaplarımdan beni takip etmeyi unutma! ✨",
    socials: [
      { name: "Instagram", username: "Konechiba Senpai Instagram", url: "https://www.instagram.com/konechiba._.senpai", icon: "instagram" },
      { name: "Instagram", username: "Ohayo Senpai Instagram", url: "https://www.instagram.com/ohayo._.senpai", icon: "instagram" },
      { name: "Instagram", username: "Chibi Senpai Instagram", url: "https://www.instagram.com/chibi._.senpai", icon: "instagram" },
      { name: "Instagram", username: "Konehub Instagram", url: "https://www.instagram.com/konehub_", icon: "instagram" },
      { name: "Instagram", username: "Konecistan Instagram", url: "https://www.instagram.com/konecistan", icon: "instagram" },
      { name: "Instagram", username: "Konezaki Instagram", url: "https://www.instagram.com/konezakisenpai", icon: "instagram" },
      { name: "Instagram", username: "Tsuki Senpai Instagram", url: "https://www.instagram.com/tsuki.__.senpai", icon: "instagram" },
      { name: "WhatsApp", username: "DxD sticker arşivi wp", url: "https://www.whatsapp.com/channel/0029VbDOkcDGehERpth9t70X", icon: "whatsapp" },
      { name: "TikTok", username: "Konechiba Senpai TikTok", url: "https://www.tiktok.com/@_konechiba._.senpai_", icon: "tiktok" },
      { name: "TikTok", username: "Ohayo Senpai TikTok", url: "https://www.tiktok.com/@ohayo._.senpai", icon: "tiktok" },
      { name: "YouTube", username: "Konechiba Senpai YouTube", url: "https://youtube.com/konechiba-senpai", icon: "youtube" },
      { name: "YouTube", username: "Ohayo Senpai YouTube", url: "https://www.youtube.com/@ohayosenpai666", icon: "youtube" },
      { name: "Pinterest", username: "Konechiba Senpai Pinterest", url: "https://tr.pinterest.com/konechiba_senpai/", icon: "pinterest" },
      { name: "Spotify", username: "Konechiba Senpai Spotify", url: "https://open.spotify.com/user/313xx55ztcjseth37xnml6eongry?si=SDeHvk4TRK-GlsyqxduwoA&utm_source=copy-link&nd=1&dlsi=c78b979b3a4e40b8", icon: "spotify" },
      { name: "Email", username: "Konechiba Senpai Email", url: "mailto:konechibailetisim@gmail.com", icon: "email" },
      { name: "Kick", username: "Konechiba Senpai Kick", url: "https://kick.com/konechiba_senpai", icon: "kick" }
    ]
  };

  var ICON_MAP = {
    instagram: "fa-brands fa-instagram",
    tiktok: "fa-brands fa-tiktok",
    threads: "fa-brands fa-threads",
    x: "fa-brands fa-x-twitter",
    twitter: "fa-brands fa-x-twitter",
    facebook: "fa-brands fa-facebook",
    youtube: "fa-brands fa-youtube",
    discord: "fa-brands fa-discord",
    github: "fa-brands fa-github",
    linkedin: "fa-brands fa-linkedin",
    steam: "fa-brands fa-steam",
    telegram: "fa-brands fa-telegram",
    reddit: "fa-brands fa-reddit",
    pinterest: "fa-brands fa-pinterest",
    spotify: "fa-brands fa-spotify",
    twitch: "fa-brands fa-twitch",
    patreon: "fa-brands fa-patreon",
    "ko-fi": "fa-solid fa-mug-hot",
    kofi: "fa-solid fa-mug-hot",
    soundcloud: "fa-brands fa-soundcloud",
    website: "fa-solid fa-globe",
    email: "fa-solid fa-envelope",
    kick: "fa-solid fa-bolt",
    bluesky: "fa-brands fa-bluesky",
    tumblr: "fa-brands fa-tumblr",
    whatsapp: "fa-brands fa-whatsapp"
  };

  function iconMarkup(social) {
    var icon = (social.icon || social.name || "").toString().trim();
    var lower = icon.toLowerCase();

    var looksLikeImage = /^https?:\/\//i.test(icon) || /\.(svg|png|jpg|jpeg|webp)$/i.test(icon);
    if (looksLikeImage) {
      return '<img src="' + icon + '" alt="" loading="lazy" onerror="this.parentElement.innerHTML=\'<i class=&quot;fa-solid fa-link&quot;></i>\'">';
    }

    var faClass = ICON_MAP[lower] || ICON_MAP[(social.name || "").toLowerCase()] || "fa-solid fa-link";
    return '<i class="' + faClass + '"></i>';
  }

  function renderHero() {
    var logoEl = document.getElementById("hero-logo");
    var fallbackEl = document.getElementById("avatar-fallback");
    var nameEl = document.getElementById("hero-name");
    var bioEl = document.getElementById("hero-bio");
    var badgeEl = document.getElementById("verified-badge");

    var name = window.withPlaceholder(DATA.name, "Konechiba Senpai");
    var bio = window.withPlaceholder(DATA.bio, "Bio yakında eklenecek.");
    var logo = window.withPlaceholder(DATA.logo, "");
    var verifiedText = "Bu kullanıcı Eternal Production tarafından onaylanmıştır.";

    if (nameEl) nameEl.textContent = name;
    if (bioEl) bioEl.textContent = bio;
    document.title = name;

    if (logoEl && logo) {
      logoEl.addEventListener("load", function () {
        logoEl.hidden = false;
        if (fallbackEl) fallbackEl.hidden = true;
      });
      logoEl.addEventListener("error", function () {
        logoEl.hidden = true;
        if (fallbackEl) fallbackEl.hidden = false;
      });
      logoEl.src = logo;
    }

    if (badgeEl) {
      badgeEl.addEventListener("click", function () {
        if (window.showToast) window.showToast(verifiedText, "success");
      });
    }
  }

  function renderSocials() {
    var list = document.getElementById("social-grid");
    if (!list) return;

    var socials = DATA.socials;
    if (!Array.isArray(socials) || socials.length === 0) {
      list.innerHTML = '<p class="empty-state">Henüz sosyal medya hesabı eklenmemiş.</p>';
      return;
    }

    list.innerHTML = socials.map(function (social, index) {
      var url = social.url;
      var validUrl = window.isValidUrl(url);
      var username = window.withPlaceholder(social.username, "@kullaniciadi");
      var platform = window.withPlaceholder(social.name, "Platform");
      var delay = (index * 0.04).toFixed(2);

      return (
        '<a class="account-card" style="animation-delay:' + delay + 's" ' +
        (validUrl ? 'href="' + window.escapeHtml(url) + '" target="_blank" rel="noopener noreferrer"' : 'href="javascript:void(0)" aria-disabled="true"') +
        '>' +
          '<span class="account-icon">' + iconMarkup(social) + '</span>' +
          '<span class="account-details">' +
            '<span class="account-platform">' + window.escapeHtml(username) + '</span>' +
            '<span class="account-subtitle">' + window.escapeHtml(platform) + '</span>' +
          '</span>' +
          '<span class="account-arrow"><i class="fa-solid fa-chevron-right"></i></span>' +
        '</a>'
      );
    }).join("");
  }

  /* ---------- Görünüm değiştirme (Ana Sayfa / Hesaplar) ---------- */
  function showView(name) {
    var home = document.getElementById("view-home");
    var accounts = document.getElementById("view-accounts");
    if (!home || !accounts) return;
    var isAccounts = name === "accounts";
    home.hidden = isAccounts;
    accounts.hidden = !isAccounts;

    var items = document.querySelectorAll(".bottom-nav .nav-item");
    Array.prototype.forEach.call(items, function (item) {
      var key = item.getAttribute("data-nav");
      var selected = key === (isAccounts ? "accounts" : "home");
      item.classList.toggle("is-selected", selected);
      if (selected) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
    window.scrollTo(0, 0);
  }

  function syncFromHash() {
    showView(window.location.hash === "#hesaplar" ? "accounts" : "home");
  }

  function loadProfileConfig() {
    fetch(new URL("data.json", document.baseURI).href)
      .then(function (response) {
        if (!response.ok) throw new Error("Profil ayarları yüklenemedi");
        return response.json();
      })
      .then(function (config) {
        var profile = config && config.profile ? config.profile : {};
        if (typeof profile.photo === "string" && profile.photo.trim()) DATA.logo = profile.photo.trim();
        if (typeof profile.description === "string" && profile.description.trim()) DATA.bio = profile.description.trim();
      })
      .catch(function () {
        /* data.json yüklenemezse profil yedek verileri kullanılır. */
      })
      .then(renderHero);
  }

  document.addEventListener("DOMContentLoaded", function () {
    loadProfileConfig();
    renderSocials();
    window.addEventListener("hashchange", syncFromHash);
    syncFromHash();
  });
})();
