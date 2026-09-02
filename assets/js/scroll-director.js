const THEMES = { 1: "cream", 2: "maroon", 3: "ink", 4: "ink", 5: "cream" };

export class ScrollDirector {
  constructor(onFrame) {
    this.onFrame = onFrame;
    this.sections = [...document.querySelectorAll("[data-act]")];
    this.active = Number(this.sections[0]?.dataset.act || 1);
    this.activeNode = this.sections[0];
    this.raw = 0;
    this.smooth = 0;
    this.globalRaw = 0;
    this.globalSmooth = 0;
    this.read = this.read.bind(this);
    addEventListener("scroll", this.read, { passive: true });
    addEventListener("resize", this.read, { passive: true });
    this.read();
  }

  read() {
    if (!this.sections.length) return;
    const viewportCenter = innerHeight * .5;
    let nearest = this.sections[0];
    let nearestDistance = Infinity;
    this.sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height * .5 - viewportCenter);
      if (distance < nearestDistance) {
        nearest = section;
        nearestDistance = distance;
      }
    });
    if (nearest !== this.activeNode) {
      const previousAct = this.active;
      this.activeNode = nearest;
      this.active = Number(nearest.dataset.act || 1);
      document.body.dataset.stageTheme = nearest.dataset.theme || THEMES[this.active] || "cream";
      if (this.active === 3 && previousAct !== 3) document.dispatchEvent(new CustomEvent("circuit-pulse"));
    } else {
      document.body.dataset.stageTheme = nearest.dataset.theme || THEMES[this.active] || "cream";
    }
    const rect = this.activeNode.getBoundingClientRect();
    const travel = Math.max(1, rect.height + innerHeight);
    this.raw = Math.max(0, Math.min(1, (innerHeight - rect.top) / travel));
    const scrollRange = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    this.globalRaw = Math.max(0, Math.min(1, scrollY / scrollRange));
  }

  tick() {
    this.smooth += (this.raw - this.smooth) * .08;
    this.globalSmooth += (this.globalRaw - this.globalSmooth) * .075;
    document.body.style.setProperty("--scroll-progress", this.globalSmooth.toFixed(4));
    this.onFrame(this.active, this.smooth, this.globalSmooth);
  }

  destroy() {
    removeEventListener("scroll", this.read);
    removeEventListener("resize", this.read);
  }
}

export function setupReveals(reducedMotion = false) {
  const nodes = [...document.querySelectorAll("[data-reveal]")];
  if (reducedMotion || !("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: .14 });
  nodes.forEach((node) => observer.observe(node));
}

export function setupCardTilt(reducedMotion = false) {
  if (reducedMotion || matchMedia("(pointer: coarse)").matches) return;
  const cards = new Set(document.querySelectorAll("[data-tilt], .glass-card"));
  cards.forEach((card) => {
    card.setAttribute("data-tilt", "");
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.setProperty("--pointer-x", `${((x + .5) * 100).toFixed(1)}%`);
      card.style.setProperty("--pointer-y", `${((y + .5) * 100).toFixed(1)}%`);
      card.style.setProperty("--card-rx", `${(-y * 6).toFixed(2)}deg`);
      card.style.setProperty("--card-ry", `${(x * 6).toFixed(2)}deg`);
      card.dataset.pointerActive = "true";
    }, { passive: true });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--card-rx", "0deg");
      card.style.setProperty("--card-ry", "0deg");
      card.dataset.pointerActive = "false";
    }, { passive: true });
  });
}
