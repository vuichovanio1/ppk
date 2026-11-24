(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var headerInner = document.querySelector("header .header-container");
    var lang = document.querySelector(".language-selector");
    var drop = document.querySelector(".dropdown.container");
    var nav = document.querySelector("nav.container");

    // Only wrap existing region dropdown / main nav — never invent empty Menu UI
    if (headerInner && (drop || nav) && !document.getElementById("site-nav-panel")) {
      var panel = document.createElement("div");
      panel.id = "site-nav-panel";
      panel.className = "site-nav-panel";
      if (drop) panel.appendChild(drop);
      if (nav) panel.appendChild(nav);

      if (lang) lang.insertAdjacentElement("afterend", panel);
      else headerInner.parentNode.insertBefore(panel, headerInner.nextSibling);

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "site-menu-toggle";
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-controls", "site-nav-panel");
      btn.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i> Меню';
      headerInner.appendChild(btn);

      btn.addEventListener("click", function () {
        var open = panel.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    if (headerInner) {
      var headerBar = headerInner.closest("header");
      var lastY = window.scrollY;
      var acc = 0;
      window.addEventListener(
        "scroll",
        function () {
          var y = window.scrollY;
          var delta = y - lastY;
          lastY = y;
          if (y < 48) {
            acc = 0;
            headerBar.classList.remove("is-hidden");
            return;
          }
          acc += delta;
          if (acc > 8) {
            headerBar.classList.add("is-hidden");
            acc = 0;
          } else if (acc < -8) {
            headerBar.classList.remove("is-hidden");
            acc = 0;
          }
        },
        { passive: true }
      );
    }

    document.querySelectorAll(".hero .btn-container, .hero-stage__cta").forEach(function (box) {
      var tel = box.querySelector('a[href^="tel:"]');
      if (tel) box.insertBefore(tel, box.firstChild);
    });

    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.innerHTML =
      '<button type="button" class="lightbox__close" aria-label="Close">&times;</button><img alt="">';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector("img");

    function openLb(src, alt) {
      lbImg.src = src;
      lbImg.alt = alt || "";
      lb.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
    function closeLb() {
      lb.classList.remove("is-open");
      lbImg.removeAttribute("src");
      document.body.style.overflow = "";
    }

    lb.querySelector(".lightbox__close").addEventListener("click", closeLb);
    lb.addEventListener("click", function (e) {
      if (e.target === lb) closeLb();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLb();
    });

    document.querySelectorAll(".image-gallery img").forEach(function (img) {
      img.addEventListener("click", function () {
        var src = img.currentSrc || img.getAttribute("src");
        var pic = img.closest("picture");
        if (pic) {
          var lg = pic.querySelector('source[srcset*="-lg.webp"]');
          var any = pic.querySelector("source:not([media])");
          var pick = lg || any;
          if (pick) src = (pick.getAttribute("srcset") || "").split(/\s+/)[0] || src;
        }
        openLb(src, img.getAttribute("alt") || "");
      });
    });

    document.querySelectorAll(".hero, .hero-stage").forEach(function (hero) {
      var existing = hero.style.getPropertyValue("--hero-image");
      if (existing) {
        // Root-relative so url() resolves against the page, not css/site.css
        if (existing.indexOf("url('/") === -1 && existing.indexOf("url(\"/" ) === -1) {
          hero.style.setProperty(
            "--hero-image",
            existing.replace("url('", "url('/").replace('url("', 'url("/')
          );
        }
        return;
      }
      var lg = document.querySelector('.image-gallery source[srcset*="-lg.webp"]');
      var img = document.querySelector(".image-gallery img");
      var url = lg
        ? (lg.getAttribute("srcset") || "").split(/\s+/)[0]
        : img && (img.currentSrc || img.getAttribute("src"));
      if (url) {
        if (url.charAt(0) !== "/" && url.indexOf("http") !== 0) url = "/" + url.replace(/^\.\//, "");
        hero.style.setProperty("--hero-image", "url('" + url + "')");
        hero.classList.add("hero-stage");
      }
    });
  });
})();
