const THEMES = { 1: "cream", 2: "maroon", 3: "ink", 4: "ink", 5: "cream" };

export class ScrollDirector {
  constructor(onFrame) {
    this.onFrame = onFrame;
    this.sections = [...document.querySelectorAll("[data-act]")];
    this.active = Number(this.sections[0]?.dataset.act || 1);
    this.activeNode = this.sections[0];
    this.raw = 0;
    this.smooth = 0;
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        this.activeNode = entry.target;
        this.active = Number(entry.target.dataset.act || 1);
        document.body.dataset.stageTheme = entry.target.dataset.theme || THEMES[this.active] || "cream";
        if (this.active === 3) document.dispatchEvent(new CustomEvent("circuit-pulse"));
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    this.sections.forEach((section) => this.observer.observe(section));
    this.read = this.read.bind(this);
    addEventListener("scroll", this.read, { passive: true });
    addEventListener("resize", this.read, { passive: true });
    this.read();
  }

  read() {
    if (!this.activeNode) return;
    const rect = this.activeNode.getBoundingClientRect();
    const travel = Math.max(1, rect.height + innerHeight);
    this.raw = Math.max(0, Math.min(1, (innerHeight - rect.top) / travel));
  }

  tick() {
    this.smooth += (this.raw - this.smooth) * .08;
    this.onFrame(this.active, this.smooth);
  }

  destroy() {
    this.observer.disconnect();
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
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.setProperty("--card-rx", `${(-y * 6).toFixed(2)}deg`);
      card.style.setProperty("--card-ry", `${(x * 6).toFixed(2)}deg`);
    }, { passive: true });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--card-rx", "0deg");
      card.style.setProperty("--card-ry", "0deg");
    }, { passive: true });
  });
}
