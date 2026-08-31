(() => {
  const data = window.SITE_CONTENT;
  if (!data) return;

  /* Inline icon set — keeps the page dependency-free. */
  const svg = (paths) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  const icons = {
    hospital: svg('<path d="M4 21V7l8-4 8 4v14"/><path d="M9 21v-5h6v5"/><path d="M12 8v4"/><path d="M10 10h4"/>'),
    home: svg('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.6V21h14V9.6"/><path d="M10 21v-6h4v6"/>'),
    video: svg('<rect x="2.5" y="6" width="13" height="12" rx="2.5"/><path d="m15.5 11 6-3.5v9L15.5 13Z"/>'),
    phone: svg('<path d="M6.5 3h3l1.5 4-2 1.4a12 12 0 0 0 6.6 6.6L17 13l4 1.5v3a2.5 2.5 0 0 1-2.7 2.5A16.5 16.5 0 0 1 3.5 5.7 2.5 2.5 0 0 1 6 3Z"/>'),
    whatsapp: svg('<path d="M3.5 20.5 5 16.4A8.2 8.2 0 1 1 8.1 19.4Z"/><path d="M9 9.5c.6 2.6 2.9 4.9 5.5 5.5l1.1-1.5 1.9.8a4.6 4.6 0 0 1-6-1.8 4.6 4.6 0 0 1-1.8-6l.8 1.9Z"/>'),
    email: svg('<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>'),
    facebook: svg('<path d="M14.5 21v-8h2.7l.5-3.2h-3.2V7.7c0-.9.3-1.6 1.7-1.6h1.6V3.2A21 21 0 0 0 15.3 3c-2.5 0-4.1 1.5-4.1 4.3v2.5H8.3V13h2.9v8Z"/>'),
    instagram: svg('<rect x="3" y="3" width="18" height="18" rx="5.2"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none"/>'),
    address: svg('<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>'),
    hours: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 2"/>')
  };

  /* Content helpers ---------------------------------------- */
  /* Everything from content.js is escaped before it reaches the page. `text`
     also honours a \n in any value as a line break; `plain` folds those
     newlines back to spaces for places that cannot show one, such as the
     document title, meta tags, and image alt text. */
  const ENTITIES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ENTITIES[character]);
  const text = (value) => escapeHtml(value).replace(/\r?\n/g, "<br>");
  const plain = (value) => String(value).replace(/\s*\r?\n\s*/g, " ");

  /* Text bindings ------------------------------------------ */
  const get = (path) => path.split(".").reduce((value, key) => value?.[key], data);
  document.querySelectorAll("[data-field]").forEach((element) => {
    const value = get(element.dataset.field);
    if (value) element.innerHTML = text(value);
    else element.remove();
  });

  document.title = `${plain(data.doctor.name)} | ${plain(data.doctor.shortTitle)}`;
  document.querySelector('meta[name="description"]').content = plain(data.site.introduction);
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[property="og:description"]').content = plain(data.site.introduction);

  if (!data.doctor.membership) document.querySelector(".member-badge")?.remove();

  const initials = plain(data.doctor.name).replace(/^dr\.?\s+/i, "").trim().charAt(0).toUpperCase();
  document.querySelectorAll(".brand-mark").forEach((mark) => (mark.textContent = initials));

  if (data.doctor.photo) {
    const image = document.querySelector(".hero-image img");
    image.src = data.doctor.photo;
    image.alt = `Portrait of ${plain(data.doctor.name)}`;
  }

  /* Rendered lists ----------------------------------------- */
  /* A fact may hold several lines; each becomes its own <dd> under the label. */
  const facts = [
    ["Practice", [data.clinic.name, data.clinic.tagline]],
    ["Consultations", data.clinic.appointmentTypes],
    ["Languages", data.doctor.languages.join(" · ")]
  ]
    .map(([label, value]) => [label, [value].flat().filter(Boolean)])
    .filter(([, lines]) => lines.length);
  document.querySelector("#quick-facts").innerHTML = facts
    .map(([label, lines]) => `<div><dt>${label}</dt>${lines.map((line) => `<dd>${text(line)}</dd>`).join("")}</div>`)
    .join("");

  document.querySelector("#credentials").innerHTML = data.doctor.credentials
    .filter(Boolean)
    .map((item) => `<p><span aria-hidden="true">✓</span>${text(item)}</p>`)
    .join("");

  const modeIcons = [icons.hospital, icons.home, icons.video];
  document.querySelector("#consultation-modes").innerHTML = data.clinic.consultationTypes
    .map(
      (mode, index) =>
        `<article class="reveal"><span class="mode-icon">${modeIcons[index] || icons.home}</span><div><h3>${text(mode.title)}</h3><p>${text(mode.text)}</p></div></article>`
    )
    .join("");

  document.querySelector("#steps").innerHTML = data.approach.steps
    .map(
      (step, index) =>
        `<article class="step reveal"><span>STEP 0${index + 1}</span><h3>${text(step.title)}</h3><p>${text(step.text)}</p></article>`
    )
    .join("");

  document.querySelector("#areas").innerHTML = data.areas.items
    .map(
      (item, index) =>
        `<div class="reveal"><span>0${index + 1}</span><p>${text(item)}</p><i aria-hidden="true">↗</i></div>`
    )
    .join("");

  /* `notes` is a list; a single `note` string from an older content.js still works. */
  const notes = [data.preparation.notes || data.preparation.note].flat().filter(Boolean);
  document.querySelector("#preparation-notes").innerHTML = notes
    .map((note) => `<li><span aria-hidden="true">✦</span><p>${text(note)}</p></li>`)
    .join("");

  const itemsIntro = document.querySelector("#preparation-items-intro");
  if (data.preparation.itemsIntro) itemsIntro.innerHTML = text(data.preparation.itemsIntro);
  else itemsIntro.remove();

  document.querySelector("#preparation-list").innerHTML = data.preparation.items
    .map((item, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><p>${text(item)}</p></li>`)
    .join("");

  document.querySelector("#resources-list").innerHTML = data.resources.items
    .map(
      (item) =>
        `<article class="resource-card reveal"><p>${text(item.category)}</p><h3>${text(item.title)}</h3><div><span>${text(item.summary)}</span><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener">Read at ${text(item.source)} <i aria-hidden="true">↗</i></a></div></article>`
    )
    .join("");

  document.querySelector("#faqs").innerHTML = data.faqs
    .map(
      (faq, index) =>
        `<details${index === 0 ? " open" : ""}><summary><span>${text(faq.question)}</span><i aria-hidden="true"></i></summary><div class="faq-answer"><p>${text(faq.answer)}</p></div></details>`
    )
    .join("");

  /* Rows appear in this order, and any row with no value is left out. */
  /* Tolerate a stray "mailto:" prefix or padding around the address. */
  const email = String(data.contact.email || "").trim().replace(/^mailto:/i, "");

  const contactItems = [
    ["Phone", icons.phone, data.contact.phone, `tel:${data.contact.phone.replace(/\s/g, "")}`],
    ["WhatsApp", icons.whatsapp, data.contact.whatsapp, `https://wa.me/${data.contact.whatsapp.replace(/\D/g, "")}`],
    ["Address", icons.address, data.clinic.address, data.clinic.mapUrl],
    ["Hours", icons.hours, data.clinic.hours, ""],
    ["Facebook", icons.facebook, data.contact.facebook ? "Visit Facebook page" : "", data.contact.facebook],
    ["Instagram", icons.instagram, data.contact.instagram ? "Visit Instagram profile" : "", data.contact.instagram],
    ["Email", icons.email, email, `mailto:${email}`]
  ].filter(([, , value]) => value);
  document.querySelector("#contact-card").innerHTML = `
    <div class="contact-name"><span class="brand-mark">${initials}</span><div><strong>${text(data.doctor.name)}</strong><small>${text(data.clinic.name)}</small>${data.clinic.tagline ? `<small class="contact-tagline">${text(data.clinic.tagline)}</small>` : ""}</div></div>
    <div class="contact-details">${contactItems
      .map(
        ([label, icon, value, href]) =>
          `<div><span class="contact-icon">${icon}</span><span>${label}</span>${
            href
              ? `<a href="${escapeHtml(href)}" target="${href.startsWith("http") ? "_blank" : "_self"}" rel="noopener">${text(value)}</a>`
              : `<p>${text(value)}</p>`
          }</div>`
      )
      .join("")}</div>
    ${
      email
        ? `<a class="button button-wide" href="mailto:${escapeHtml(email)}">Email us <span class="button-arrow">↗</span></a>`
        : ""
    }`;

  document.querySelector("#footer-disclaimer").innerHTML = text(data.legal.disclaimer);
  document.querySelector("#year").textContent = new Date().getFullYear();

  /* Header, progress and back-to-top ------------------------ */
  const header = document.querySelector(".site-header");
  const progress = document.querySelector(".scroll-progress");
  const toTop = document.querySelector(".to-top");

  const onScroll = () => {
    const scrolled = window.scrollY;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle("scrolled", scrolled > 12);
    toTop.classList.toggle("show", scrolled > window.innerHeight * 0.8);
    progress.style.setProperty("--progress", `${scrollable > 0 ? (scrolled / scrollable) * 100 : 0}%`);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  /* Mobile navigation --------------------------------------- */
  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector("#site-nav");
  const closeMenu = () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  };
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("open", !open);
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  /* One FAQ open at a time ---------------------------------- */
  const faqItems = [...document.querySelectorAll("#faqs details")];
  faqItems.forEach((item) =>
    item.addEventListener("toggle", () => {
      if (item.open) faqItems.filter((other) => other !== item && other.open).forEach((other) => (other.open = false));
    })
  );

  /* Scroll reveals with a gentle stagger --------------------- */
  const revealObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }),
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((element) => {
    const siblings = [...element.parentElement.children].filter((child) => child.classList.contains("reveal"));
    element.style.setProperty("--reveal-delay", `${Math.min(siblings.indexOf(element), 5) * 90}ms`);
    revealObserver.observe(element);
  });

  /* Highlight the section currently in view ------------------ */
  const navLinks = [...nav.querySelectorAll("a")];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) =>
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((section) => sectionObserver.observe(section));
})();
