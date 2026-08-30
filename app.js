(() => {
  const data = window.SITE_CONTENT;
  if (!data) return;

  const get = (path) => path.split(".").reduce((value, key) => value?.[key], data);
  document.querySelectorAll("[data-field]").forEach((element) => {
    const value = get(element.dataset.field);
    if (value) element.textContent = value;
  });

  document.title = `${data.doctor.name} | ${data.doctor.shortTitle}`;
  document.querySelector('meta[name="description"]').content = data.site.introduction;
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[property="og:description"]').content = data.site.introduction;

  if (data.doctor.photo) {
    const image = document.querySelector(".hero-image img");
    image.src = data.doctor.photo;
    image.alt = `Portrait of ${data.doctor.name}`;
  }

  const facts = [
    ["Practice", data.clinic.name], ["Consultations", data.clinic.appointmentTypes], ["Languages", data.doctor.languages.join(" · ")]
  ].filter(([, value]) => value);
  document.querySelector("#quick-facts").innerHTML = facts.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("");

  document.querySelector("#credentials").innerHTML = data.doctor.credentials.filter(Boolean).map((item) => `<p><span aria-hidden="true">✓</span>${item}</p>`).join("");
  document.querySelector("#steps").innerHTML = data.approach.steps.map((step, index) => `<article class="step reveal"><span>0${index + 1}</span><h3>${step.title}</h3><p>${step.text}</p></article>`).join("");
  document.querySelector("#areas").innerHTML = data.areas.items.map((item, index) => `<div><span>0${index + 1}</span><p>${item}</p><i aria-hidden="true">↗</i></div>`).join("");
  document.querySelector("#preparation-list").innerHTML = data.preparation.items.map((item, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><p>${item}</p></li>`).join("");
  document.querySelector("#resources-list").innerHTML = data.resources.items.map((item) => `<article class="resource-card reveal"><p>${item.category}</p><h3>${item.title}</h3><div><span>${item.summary}</span><a href="${item.url}" target="_blank" rel="noopener">Read at ${item.source} <i aria-hidden="true">↗</i></a></div></article>`).join("");
  document.querySelector("#faqs").innerHTML = data.faqs.map((faq, index) => `<details${index === 0 ? " open" : ""}><summary><span>${faq.question}</span><i aria-hidden="true"></i></summary><p>${faq.answer}</p></details>`).join("");

  const contactItems = [
    ["Phone", data.contact.phone, `tel:${data.contact.phone.replace(/\s/g, "")}`],
    ["WhatsApp", data.contact.whatsapp, `https://wa.me/${data.contact.whatsapp.replace(/\D/g, "")}`],
    ["Email", data.contact.email, `mailto:${data.contact.email}`],
    ["Facebook", data.contact.facebook ? "Visit Facebook page" : "", data.contact.facebook],
    ["Address", data.clinic.address, data.clinic.mapUrl],
    ["Hours", data.clinic.hours, ""]
  ].filter(([, value]) => value);
  const primary = data.contact.bookingUrl || data.contact.whatsapp || data.contact.phone || data.contact.email || data.contact.facebook;
  document.querySelector("#contact-card").innerHTML = `<div class="contact-name"><span class="brand-mark">S</span><div><strong>${data.doctor.name}</strong><small>${data.clinic.name}</small></div></div><div class="contact-details">${contactItems.map(([label, value, href]) => `<div><span>${label}</span>${href ? `<a href="${href}" target="${href.startsWith("http") ? "_blank" : "_self"}" rel="noopener">${value}</a>` : `<p>${value}</p>`}</div>`).join("")}</div>${primary ? `<a class="button button-wide" href="${primary}" ${primary.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>Get in touch <span>↗</span></a>` : ""}`;

  document.querySelector("#footer-disclaimer").textContent = data.legal.disclaimer;
  document.querySelector("#year").textContent = new Date().getFullYear();

  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector("#site-nav");
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("open", !open);
  });
  nav.addEventListener("click", (event) => {
    if (event.target.matches("a")) { nav.classList.remove("open"); menuButton.setAttribute("aria-expanded", "false"); }
  });

  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
})();
