const EVENT_JSON = "content/event.json";
const EVENT_START_UTC = Date.parse("2026-10-24T08:00:00+08:00");
const EVENT_END_UTC = Date.parse("2026-10-24T18:00:00+08:00");

const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isConfigured(value) {
  return Boolean(value && !String(value).trim().startsWith("TODO:"));
}

function safeHref(value, fallback = "#") {
  if (!isConfigured(value)) return fallback;
  try {
    const url = new URL(value, window.location.href);
    return ["http:", "https:", "mailto:"].includes(url.protocol) ? url.href : fallback;
  } catch {
    return fallback;
  }
}

function setContent(id, markup) {
  const node = document.getElementById(id);
  if (node) node.innerHTML = markup;
}

function icon(name) {
  const icons = {
    arrow: '<svg aria-hidden="true" viewBox="0 0 16 16"><path d="M3 8h9M9 4l4 4-4 4"/></svg>',
    calendar: '<svg aria-hidden="true" viewBox="0 0 16 16"><rect x="2" y="3.5" width="12" height="10"/><path d="M5 1.5v4M11 1.5v4M2 6.5h12"/></svg>',
    pin: '<svg aria-hidden="true" viewBox="0 0 16 16"><path d="M13 6.5c0 3.6-5 8-5 8s-5-4.4-5-8a5 5 0 0 1 10 0Z"/><circle cx="8" cy="6.5" r="1.5"/></svg>',
    external: '<svg aria-hidden="true" viewBox="0 0 16 16"><path d="M9 2h5v5M14 2 7.5 8.5"/><path d="M12.5 9v4.5h-10v-10H7"/></svg>'
  };
  return icons[name] || "";
}

function renderHeader(data) {
  const followHref = safeHref(data.event.followUrl, "community.html");
  qsa("[data-follow-link]").forEach((link) => {
    link.href = followHref;
    if (followHref.startsWith("http")) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
  });

  const register = qs("[data-register-link]");
  if (register && isConfigured(data.event.registrationUrl)) {
    register.href = safeHref(data.event.registrationUrl);
    register.hidden = false;
  }

  const page = document.body.dataset.page;
  qsa("[data-page-link]").forEach((link) => {
    if (link.dataset.pageLink === page) link.setAttribute("aria-current", "page");
  });
}

function renderHero(data) {
  const event = data.event;
  setContent("hero-copy", `
    <p class="eyebrow">UTM · JOHOR BAHRU · 2026</p>
    <h1>${escapeHtml(event.name)}</h1>
    <p class="hero-tagline">${escapeHtml(event.tagline)}</p>
    <div class="event-lockup" aria-label="Event date and venue">
      <p><span>${icon("calendar")}</span><strong>${escapeHtml(event.dateLabel)}</strong><small>${escapeHtml(event.timeLabel)}</small></p>
      <p><span>${icon("pin")}</span><strong>${escapeHtml(event.venue.name)}</strong><small>${escapeHtml(event.venue.institution)}, ${escapeHtml(event.venue.city)}</small></p>
    </div>
  `);
}

function renderStats(data) {
  setContent("stats-grid", data.stats.map((stat) => `
    <article class="stat-card reveal">
      <strong>${escapeHtml(stat.value)}</strong>
      <span>${escapeHtml(stat.label)}</span>
    </article>
  `).join(""));
}

function renderExperiences(data) {
  setContent("experience-grid", data.experiences.map((item) => `
    <article class="experience-item reveal">
      <span class="index-marker">${escapeHtml(item.marker)}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
    </article>
  `).join(""));
}

function sessionBounds(item) {
  const start = Date.parse(`2026-10-24T${item.start}:00+08:00`);
  const end = item.end ? Date.parse(`2026-10-24T${item.end}:00+08:00`) : start + 60000;
  return { start, end };
}

function currentSessionIndex(agenda, now = Date.now()) {
  if (now < EVENT_START_UTC || now > EVENT_END_UTC) return -1;
  return agenda.findIndex((item) => {
    const bounds = sessionBounds(item);
    return now >= bounds.start && now < bounds.end;
  });
}

function renderAgenda(data) {
  const nowIndex = currentSessionIndex(data.agenda);
  const rows = data.agenda.map((item, index) => {
    const isNow = index === nowIndex;
    return `<tr class="agenda-row type-${escapeHtml(item.type)}${isNow ? " is-now" : ""}">
      <th scope="row"><time datetime="2026-10-24T${escapeHtml(item.start)}:00+08:00">${escapeHtml(item.start)}</time>${item.end ? ` <span>– ${escapeHtml(item.end)}</span>` : ""}</th>
      <td>${isNow ? '<span class="now-badge">Now</span>' : ""}${escapeHtml(item.session)}</td>
    </tr>`;
  }).join("");

  const cards = data.agenda.map((item, index) => {
    const isNow = index === nowIndex;
    return `<details class="agenda-card type-${escapeHtml(item.type)}${isNow ? " is-now" : ""}" ${index < 3 || isNow ? "open" : ""}>
      <summary>
        <time>${escapeHtml(item.start)}${item.end ? `–${escapeHtml(item.end)}` : ""}</time>
        <span>${escapeHtml(item.session)}</span>
        ${isNow ? '<b class="now-badge">Now</b>' : ""}
      </summary>
      <p>${escapeHtml(item.type.replace("-", " "))} · All times MYT (UTC+8)</p>
    </details>`;
  }).join("");

  setContent("agenda-content", `
    <div class="agenda-table-wrap">
      <table class="agenda-table">
        <caption class="sr-only">Qiskit Fall Fest 2026 agenda, all times in Malaysia time</caption>
        <thead><tr><th scope="col">Time · MYT</th><th scope="col">Session</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="agenda-cards" aria-label="Mobile agenda">${cards}</div>
  `);
}

function initials(name) {
  return name.split(/\s+/).filter((part) => !part.includes(".")).slice(0, 2).map((part) => part[0]).join("");
}

function renderSpeakers(data) {
  setContent("speaker-grid", data.speakers.map((speaker) => {
    const media = isConfigured(speaker.photo)
      ? `<img src="${safeHref(speaker.photo)}" alt="Portrait of ${escapeHtml(speaker.name)}" width="560" height="560" loading="lazy">`
      : `<div class="speaker-placeholder" role="img" aria-label="Photo pending for ${escapeHtml(speaker.name)}"><span>${escapeHtml(initials(speaker.name))}</span><small>Photo pending approval</small></div>`;
    return `<article class="speaker-card reveal">
      <div class="speaker-media">${media}</div>
      <div>
        <p class="eyebrow">${escapeHtml(speaker.affiliation)}</p>
        <h3>${escapeHtml(speaker.name)}</h3>
        <p class="speaker-role">${escapeHtml(speaker.role)}</p>
        <p>${escapeHtml(speaker.bio)}</p>
      </div>
    </article>`;
  }).join(""));
}

function renderVenue(data) {
  const venue = data.event.venue;
  const notes = [venue.arrivalNote, venue.parkingNote].map((note) => `<li>${escapeHtml(note)}</li>`).join("");
  setContent("venue-copy", `
    <p class="eyebrow">ON CAMPUS</p>
    <h3>${escapeHtml(venue.name)}</h3>
    <p>${escapeHtml(venue.addressLabel)}</p>
    <ul class="check-list">${notes}</ul>
    <a class="text-link" href="${safeHref(venue.mapsUrl)}" target="_blank" rel="noopener noreferrer">Open live directions ${icon("external")}</a>
  `);
  setContent("bring-list", data.bring.map((item) => `<li>${escapeHtml(item)}</li>`).join(""));
  const mapLink = qs("[data-map-link]");
  if (mapLink) mapLink.href = safeHref(venue.mapsUrl);
}

function resourceCard(item) {
  return `<article class="resource-card reveal">
    <p class="resource-stage">${escapeHtml(item.stage)}</p>
    <h3>${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(item.description)}</p>
    <a class="text-link" href="${safeHref(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.label)} ${icon("external")}</a>
  </article>`;
}

function renderResources(data) {
  setContent("resource-grid", data.resources.map(resourceCard).join(""));
}

function renderCommunityPreview(data) {
  const community = data.community;
  setContent("community-copy", `
    <p class="eyebrow">THE OUTCOME</p>
    <h2>${escapeHtml(community.name)} starts here.</h2>
    <p class="lede">${escapeHtml(data.event.outcome)}</p>
    <a class="button button-primary" href="community.html">See the community plan ${icon("arrow")}</a>
  `);
}

function renderCollaborators(data) {
  setContent("collaborator-strip", data.collaborators.map((item) => {
    const content = isConfigured(item.logo)
      ? `<img src="${safeHref(item.logo)}" alt="${escapeHtml(item.name)} logo" loading="lazy">`
      : `<span>${escapeHtml(item.name)}</span><small>Approved logo pending</small>`;
    const tag = isConfigured(item.url) ? "a" : "div";
    const href = isConfigured(item.url) ? ` href="${safeHref(item.url)}" target="_blank" rel="noopener noreferrer"` : "";
    return `<${tag} class="collaborator-mark"${href}>${content}</${tag}>`;
  }).join(""));

  const sponsorBlock = qs("#sponsor-block");
  if (sponsorBlock && data.sponsors.length) {
    sponsorBlock.hidden = false;
    setContent("sponsor-list", data.sponsors.map((item) => `<a href="${safeHref(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.name)} · ${escapeHtml(item.tier)}</a>`).join(""));
  }
}

function renderFaq(data) {
  setContent("faq-list", data.faq.map((item, index) => `
    <details class="faq-item reveal" ${index === 0 ? "open" : ""}>
      <summary>${escapeHtml(item.question)}<span aria-hidden="true">+</span></summary>
      <div><p>${escapeHtml(item.answer)}</p></div>
    </details>
  `).join(""));
}

function renderHome(data) {
  renderHero(data);
  renderStats(data);
  renderExperiences(data);
  renderAgenda(data);
  renderSpeakers(data);
  renderVenue(data);
  renderResources(data);
  renderCommunityPreview(data);
  renderCollaborators(data);
  renderFaq(data);
}

function renderResourcesPage(data) {
  const order = ["before", "during", "after"];
  const descriptions = {
    before: "Set up your account and arrive ready to work.",
    during: "Keep the references for the hands-on sessions close.",
    after: "Turn one event day into a longer learning path."
  };
  setContent("resources-page-content", order.map((stage, index) => `
    <section class="resource-group reveal" aria-labelledby="resource-${stage}">
      <div class="section-number">0${index + 1}</div>
      <div class="section-intro">
        <p class="eyebrow">${escapeHtml(stage)}</p>
        <h2 id="resource-${stage}">${escapeHtml(descriptions[stage])}</h2>
      </div>
      <div class="resource-grid">${data.resources.filter((item) => item.stage === stage).map(resourceCard).join("")}</div>
    </section>
  `).join(""));
}

function renderCommunityPage(data) {
  const community = data.community;
  setContent("community-page-content", `
    <section class="community-statement section-grid reveal">
      <div class="section-number">01</div>
      <div class="section-intro"><p class="eyebrow">WHY IT EXISTS</p><h2>${escapeHtml(community.summary)}</h2></div>
      <div class="section-body"><p class="lede">${escapeHtml(data.event.outcome)}</p></div>
    </section>
    <section class="community-plan section-grid reveal" aria-labelledby="planned-activities">
      <div class="section-number">02</div>
      <div class="section-intro"><p class="eyebrow">NEXT STEPS</p><h2 id="planned-activities">Planned activities</h2></div>
      <div class="section-body"><ol class="plan-list">${community.plannedActivities.map((item, index) => `<li><span>0${index + 1}</span>${escapeHtml(item)}</li>`).join("")}</ol></div>
    </section>
    <section class="join-panel reveal" aria-labelledby="join-title">
      <p class="eyebrow">JOIN THE COMMUNITY</p>
      <h2 id="join-title">Stay close to what comes next.</h2>
      <p>${escapeHtml(community.joinText)}</p>
      <div class="social-list">${community.socials.map((social) => isConfigured(social.url)
        ? `<a class="button button-secondary" href="${safeHref(social.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(social.name)} ${icon("external")}</a>`
        : `<span class="pending-link">${escapeHtml(social.name)} · link pending</span>`).join("")}</div>
    </section>
  `);
}

function updateFooter(data) {
  qsa("[data-last-updated]").forEach((node) => { node.textContent = data.site.lastUpdated; });
  qsa("[data-contact]").forEach((node) => {
    if (isConfigured(data.site.contactEmail)) {
      node.innerHTML = `<a href="mailto:${escapeHtml(data.site.contactEmail)}">${escapeHtml(data.site.contactEmail)}</a>`;
    } else {
      node.textContent = "Committee email pending confirmation";
    }
  });
}

function injectStructuredData(data) {
  const venue = data.event.venue;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: data.event.name,
    description: `${data.event.tagline} A beginner-friendly quantum computing event in Malaysia.`,
    startDate: data.event.start,
    endDate: data.event.end,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: venue.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: `${venue.name}, ${venue.institution}`,
        addressLocality: venue.city,
        addressRegion: venue.region,
        addressCountry: "MY"
      }
    },
    organizer: { "@type": "Organization", name: data.event.organizer },
    image: new URL("assets/img/og-image.png", window.location.href).href,
    maximumAttendeeCapacity: data.event.capacity
  };
  if (isConfigured(venue.postalCode)) schema.location.address.postalCode = venue.postalCode;
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.append(script);

  if (isConfigured(data.site.canonicalBase)) {
    const pagePath = document.body.dataset.page === "home" ? "" : `${document.body.dataset.page}.html`;
    const href = new URL(pagePath, data.site.canonicalBase).href;
    let canonical = qs('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.append(canonical);
    }
    canonical.href = href;
  }
}

function formatIcsText(value) {
  return String(value).replaceAll("\\", "\\\\").replaceAll(";", "\\;").replaceAll(",", "\\,").replaceAll("\n", "\\n");
}

export function buildCalendar(data) {
  const event = data.event;
  const description = `${event.tagline}\n\n${event.collaboration}\n\nResources: ${data.site.repositoryUrl}`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Qiskit Fall Fest 2026 UTM//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    "TZID:Asia/Kuala_Lumpur",
    "X-LIC-LOCATION:Asia/Kuala_Lumpur",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:+0800",
    "TZOFFSETTO:+0800",
    "TZNAME:MYT",
    "DTSTART:19700101T000000",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    "UID:qff-2026-utm@qiskit-fall-fest-2026",
    "DTSTAMP:20260830T000000Z",
    "DTSTART;TZID=Asia/Kuala_Lumpur:20261024T080000",
    "DTEND;TZID=Asia/Kuala_Lumpur:20261024T180000",
    `SUMMARY:${formatIcsText(event.name)}`,
    `LOCATION:${formatIcsText(event.venue.addressLabel)}`,
    `DESCRIPTION:${formatIcsText(description)}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}

function downloadCalendar(data) {
  const ics = buildCalendar(data);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = "qiskit-fall-fest-2026-utm.ics";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 1000);
}

function setupCountdown(data) {
  const root = qs("[data-countdown]");
  if (!root) return;
  const heroStatus = qs("[data-event-status]");

  const tick = () => {
    const now = Date.now();
    if (now < EVENT_START_UTC) {
      const distance = EVENT_START_UTC - now;
      const units = {
        days: Math.floor(distance / 86400000),
        hours: Math.floor((distance % 86400000) / 3600000),
        minutes: Math.floor((distance % 3600000) / 60000),
        seconds: Math.floor((distance % 60000) / 1000)
      };
      root.innerHTML = Object.entries(units).map(([label, value]) => `<span><strong>${String(value).padStart(2, "0")}</strong><small>${label}</small></span>`).join("");
      if (heroStatus) heroStatus.textContent = "Counting down to event day";
    } else if (now <= EVENT_END_UTC) {
      root.innerHTML = '<p class="live-state"><span></span>Happening now</p>';
      if (heroStatus) heroStatus.textContent = "Live at UTM today";
    } else {
      root.innerHTML = '<p class="past-state">Thank you for joining us.</p>';
      if (heroStatus) heroStatus.textContent = "Fall Fest 2026 is complete · explore the community next";
      const primary = qs("[data-post-event-primary]");
      if (primary) {
        primary.href = "community.html";
        primary.innerHTML = `Continue with UTM Quantum ${icon("arrow")}`;
      }
    }
  };
  tick();
  window.setInterval(tick, 1000);
}

function setupMenu() {
  const button = qs("[data-menu-button]");
  const nav = qs("[data-mobile-nav]");
  if (!button || !nav) return;
  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!open));
    nav.dataset.open = String(!open);
  });
  qsa("a", nav).forEach((link) => link.addEventListener("click", () => {
    button.setAttribute("aria-expanded", "false");
    nav.dataset.open = "false";
  }));
}

function setupReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    qsa(".reveal").forEach((node) => node.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
  qsa(".reveal").forEach((node) => observer.observe(node));
}

function setupCalendar(data) {
  qsa("[data-calendar-button]").forEach((button) => button.addEventListener("click", () => downloadCalendar(data)));
}

function showLoadError() {
  qsa("[data-load-status]").forEach((node) => {
    node.hidden = false;
    node.textContent = "Live content could not be loaded. The verified fallback details below remain available.";
  });
}

async function init() {
  document.documentElement.classList.add("js");
  setupMenu();
  try {
    const response = await fetch(EVENT_JSON, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    renderHeader(data);
    updateFooter(data);
    injectStructuredData(data);

    if (document.body.dataset.page === "home") renderHome(data);
    if (document.body.dataset.page === "resources") renderResourcesPage(data);
    if (document.body.dataset.page === "community") renderCommunityPage(data);

    setupCountdown(data);
    setupCalendar(data);
    setupReveal();
  } catch (error) {
    console.error("Event content load failed", error);
    showLoadError();
    setupReveal();
  }
}

if (typeof document !== "undefined") init();
