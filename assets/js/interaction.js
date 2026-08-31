const DEG = Math.PI / 180;

export class SceneInteraction {
  constructor(hero, onRotate, reducedMotion = false) {
    this.hero = hero;
    this.onRotate = onRotate;
    this.reducedMotion = reducedMotion;
    this.drag = null;
    this.claimed = false;
    if (!hero || reducedMotion) return;
    this.move = this.move.bind(this);
    this.down = this.down.bind(this);
    this.up = this.up.bind(this);
    hero.addEventListener("pointerdown", this.down, { passive: true });
    hero.addEventListener("pointermove", this.move, { passive: false });
    hero.addEventListener("pointerup", this.up, { passive: true });
    hero.addEventListener("pointercancel", this.up, { passive: true });
    hero.addEventListener("pointerleave", (event) => {
      if (!this.drag && event.pointerType === "mouse") onRotate(0, 0);
    }, { passive: true });
  }

  blocked(target) {
    return Boolean(target.closest("a, button, input, textarea, select, label, form"));
  }

  down(event) {
    if (this.blocked(event.target)) return;
    this.drag = { x: event.clientX, y: event.clientY, pointer: event.pointerId, type: event.pointerType };
    this.claimed = event.pointerType === "mouse";
  }

  move(event) {
    const rect = this.hero.getBoundingClientRect();
    if (!this.drag && event.pointerType === "mouse" && !this.blocked(event.target)) {
      const nx = (event.clientX - rect.left) / rect.width - .5;
      const ny = (event.clientY - rect.top) / rect.height - .5;
      this.onRotate(-ny * 16 * DEG, nx * 24 * DEG);
      return;
    }
    if (!this.drag || this.drag.pointer !== event.pointerId) return;
    const dx = event.clientX - this.drag.x;
    const dy = event.clientY - this.drag.y;
    if (this.drag.type !== "mouse" && !this.claimed) this.claimed = Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.2;
    if (!this.claimed) return;
    if (event.cancelable) event.preventDefault();
    const yaw = Math.max(-40, Math.min(40, dx / 3.8));
    const pitch = Math.max(-20, Math.min(20, -dy / 4));
    this.onRotate(pitch * DEG, yaw * DEG);
  }

  up(event) {
    if (!this.drag || this.drag.pointer !== event.pointerId) return;
    this.drag = null;
    this.claimed = false;
    this.onRotate(0, 0);
  }
}
