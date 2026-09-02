import { QuantumScene } from "./quantum-scene.js?v=20260901g";
import { ScrollDirector, setupReveals, setupCardTilt } from "./scroll-director.js?v=20260902a";
import { SceneInteraction } from "./interaction.js?v=20260901c";

const EVENT_START = new Date("2026-10-24T08:00:00+08:00");
const EVENT_END = new Date("2026-10-24T18:00:00+08:00");

function webglAvailable() {
  try {
    const test = document.createElement("canvas");
    return Boolean(test.getContext("webgl2") || test.getContext("webgl"));
  } catch { return false; }
}

function setupMenu() {
  const button = document.querySelector("[data-menu-button]");
  const panel = document.querySelector("[data-menu-panel]");
  if (!button || !panel) return;
  button.addEventListener("click", () => {
    const open = panel.dataset.open !== "true";
    panel.dataset.open = String(open);
    button.setAttribute("aria-expanded", String(open));
  });
  panel.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    panel.dataset.open = "false";
    button.setAttribute("aria-expanded", "false");
  });
}

function setupCountdown() {
  const root = document.querySelector("[data-countdown]");
  if (!root) return;
  const fields = Object.fromEntries([...root.querySelectorAll("[data-unit]")].map((node) => [node.dataset.unit, node]));
  const state = document.querySelector("[data-countdown-state]");
  const update = () => {
    const now = new Date();
    let delta = EVENT_START - now;
    if (now >= EVENT_END) {
      Object.values(fields).forEach((node) => { node.textContent = "00"; });
      if (state) state.textContent = "The 2026 gathering has concluded.";
      return;
    }
    if (now >= EVENT_START) {
      delta = EVENT_END - now;
      if (state) state.textContent = "Quantum Day is happening now at UTM.";
    } else if (state) state.textContent = "Counting down to 24 October 2026 · 08:00 MYT";
    const days = Math.floor(delta / 86400000);
    const hours = Math.floor(delta / 3600000) % 24;
    const minutes = Math.floor(delta / 60000) % 60;
    const seconds = Math.floor(delta / 1000) % 60;
    const values = { days, hours, minutes, seconds };
    Object.entries(values).forEach(([key, value]) => { if (fields[key]) fields[key].textContent = String(value).padStart(2, "0"); });
  };
  update();
  setInterval(update, 1000);
}

function setupAudio() {
  const audio = document.querySelector("[data-site-audio]");
  if (!audio) return;
  const stateKey = "qff-background-audio";
  audio.volume = .38;
  audio.autoplay = true;

  const restore = () => {
    try {
      const state = JSON.parse(sessionStorage.getItem(stateKey) || "null");
      if (!state || !Number.isFinite(state.time) || !Number.isFinite(state.savedAt) || !audio.duration) return;
      const elapsed = Math.max(0, (Date.now() - state.savedAt) / 1000);
      audio.currentTime = (state.time + elapsed) % audio.duration;
    } catch { /* Playback can continue without saved position. */ }
  };

  const persist = () => {
    try { sessionStorage.setItem(stateKey, JSON.stringify({ time: audio.currentTime, savedAt: Date.now() })); }
    catch { /* Storage may be unavailable in a private browser context. */ }
  };

  const releaseFallback = () => {
    document.removeEventListener("pointerdown", startFromInteraction, true);
    document.removeEventListener("keydown", startFromInteraction, true);
  };
  const start = async () => {
    try {
      await audio.play();
      releaseFallback();
    } catch { /* Browser policy will retry on the visitor's first interaction. */ }
  };
  const startFromInteraction = () => { void start(); };

  if (audio.readyState >= 1) restore();
  else audio.addEventListener("loadedmetadata", restore, { once: true });
  document.addEventListener("pointerdown", startFromInteraction, { capture: true, passive: true });
  document.addEventListener("keydown", startFromInteraction, true);
  addEventListener("pagehide", persist);
  addEventListener("pageshow", () => { void start(); });
  let lastPersisted = 0;
  audio.addEventListener("timeupdate", () => {
    const now = Date.now();
    if (now - lastPersisted < 2000) return;
    lastPersisted = now;
    persist();
  });
  void start();
}

function markSchedulePulses(scene) {
  const cards = document.querySelectorAll(".timeline-card");
  if (!cards.length) return;
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) scene?.triggerPulse();
  }, { rootMargin: "-42% 0px -42% 0px", threshold: 0 });
  cards.forEach((card) => observer.observe(card));
  document.addEventListener("circuit-pulse", () => scene?.triggerPulse());
}

function startExperience() {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = matchMedia("(max-width: 760px), (pointer: coarse)").matches;
  if (reduced) document.querySelectorAll("video").forEach((video) => { video.removeAttribute("autoplay"); video.pause(); });
  setupMenu();
  setupCountdown();
  setupAudio();
  setupReveals(reduced);
  setupCardTilt(reduced);
  if (!webglAvailable()) {
    document.documentElement.classList.add("webgl-failed");
    return;
  }
  const canvas = document.createElement("canvas");
  canvas.id = "stage";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);
  let scene;
  try {
    scene = new QuantumScene(canvas, {
      reducedMotion: reduced,
      mobile,
      onFailure: () => document.documentElement.classList.add("webgl-failed")
    });
  } catch (error) {
    console.warn("WebGL experience unavailable; using the CSS fallback.", error);
    document.documentElement.classList.add("webgl-failed");
    return;
  }
  const director = reduced ? null : new ScrollDirector((act, progress, globalProgress) => scene.setAct(act, progress, globalProgress));
  if (reduced) {
    document.body.dataset.stageTheme = "cream";
    scene.setAct(1, 0, 0);
  }
  new SceneInteraction(document.documentElement, (x, y) => scene.setRotation(x, y), reduced);
  markSchedulePulses(scene);
  const frameTimes = [];
  let last = performance.now();
  let running = !document.hidden;
  let raf = 0;
  const frame = (now) => {
    if (!running) return;
    const elapsed = now - last;
    last = now;
    if (elapsed < 250) frameTimes.push(elapsed);
    director?.tick();
    scene.render();
    canvas.dataset.act = String(scene.act);
    canvas.dataset.scroll = scene.globalProgress.toFixed(3);
    canvas.dataset.rotationX = scene.rotation.x.toFixed(3);
    canvas.dataset.rotationY = scene.rotation.y.toFixed(3);
    if (frameTimes.length === 90) {
      const median = [...frameTimes].sort((a, b) => a - b)[45];
      if (median > 20 && scene.quality > 0) scene.lowerQuality();
      canvas.dataset.frameMedian = median.toFixed(2);
      canvas.dataset.quality = String(scene.quality);
      frameTimes.length = 0;
    }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  addEventListener("resize", () => scene.resize(), { passive: true });
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    cancelAnimationFrame(raf);
    if (running) { last = performance.now(); raf = requestAnimationFrame(frame); }
  });
}

if (document.readyState === "complete") startExperience();
else addEventListener("load", startExperience, { once: true });
