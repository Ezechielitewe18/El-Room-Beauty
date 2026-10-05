const WHATSAPP_NUMBER = "243979497516";

const nav = document.getElementById("nav");
const navLinks = document.getElementById("navLinks");
const navBurger = document.getElementById("navBurger");

if (navBurger && navLinks) {
  navBurger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    navBurger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  });

  navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      navLinks.classList.remove("is-open");
      navBurger.setAttribute("aria-label", "Ouvrir le menu");
    }
  });
}

if (nav) {
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

const revealables = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  revealables.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 3, 2) * 90}ms`;
    observer.observe(el);
  });
} else {
  revealables.forEach((el) => el.classList.add("is-visible"));
}

const galleryGrid = document.getElementById("galleryGrid");
const chips = document.querySelectorAll(".chip");

if (galleryGrid && chips.length) {
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");

      const filter = chip.dataset.filter;
      const items = galleryGrid.querySelectorAll(".gallery__item");

      items.forEach((item) => {
        const show = filter === "all" || item.dataset.cat === filter;
        item.classList.toggle("is-hidden", !show);
        if (show) {
          item.style.animation = "none";
          void item.offsetWidth;
          item.style.animation = "";
        }
      });
    });
  });
}

const form = document.getElementById("bookingForm");

if (form) {
  const travelFields = document.getElementById("travelFields");
  const dateInput = document.getElementById("date");

  if (dateInput) {
    const today = new Date();
    const iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    dateInput.min = iso;
  }

  form.querySelectorAll('input[name="lieu"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      travelFields.classList.toggle("is-hidden", radio.dataset.travel !== "yes" || !radio.checked);
    });
  });

  document.querySelectorAll("[data-service]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const select = document.getElementById("prestation");
      if (select) select.value = btn.dataset.service;
    });
  });

  const travelCta = document.getElementById("travelCta");

  if (travelCta) {
    travelCta.addEventListener("click", () => {
      const radio = form.querySelector('input[name="lieu"][data-travel="yes"]');
      if (!radio) return;
      radio.checked = true;
      travelFields.classList.remove("is-hidden");
    });
  }

  const value = (name) => {
    const el = form.elements[name];
    return el ? el.value.trim() : "";
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.reportValidity()) return;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank", "noopener");
  });
}

document.querySelectorAll("[data-wa]").forEach((link) => {
  link.href = `https://wa.me/${WHATSAPP_NUMBER}`;
});

document.querySelectorAll("[data-split]").forEach((el) => {
  const words = el.textContent.trim().split(/\s+/);

  el.classList.add("words");
  el.textContent = "";

  words.forEach((word, i) => {
    const outer = document.createElement("span");
    const inner = document.createElement("span");

    outer.className = "w";
    outer.style.setProperty("--d", `${i * 0.11}s`);
    inner.className = "wi";
    inner.textContent = word;

    outer.appendChild(inner);
    el.appendChild(outer);
    el.appendChild(document.createTextNode(" "));
  });
});

const words = document.querySelectorAll(".words .wi");

if (words.length && "IntersectionObserver" in window) {
  const wordsObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll(".wi").forEach((word) => word.classList.add("is-in"));
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  words.forEach((word) => wordsObserver.observe(word.closest(".words")));
} else {
  words.forEach((word) => word.classList.add("is-in"));
}

document.querySelectorAll("[data-copy]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const value = btn.dataset.copy;
    const original = btn.textContent;

    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const helper = document.createElement("textarea");
      helper.value = value;
      document.body.appendChild(helper);
      helper.select();
      document.execCommand("copy");
      helper.remove();
    }

    btn.textContent = "Numéro copié ✓";
    btn.classList.add("is-copied");

    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove("is-copied");
    }, 2000);
  });
});