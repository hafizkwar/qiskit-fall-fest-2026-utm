import * as THREE from "../vendor/three.module.min.js";

const C = {
  maroon: 0x570000, red: 0xa30000, coral: 0xff9b91,
  cream: 0xfff8f6, pink: 0xff9bc6, cold: 0x94a0ff,
  ink: 0x1a1a1a, blue: 0x433bff, grey: 0x8e706c
};

function material(color, opacity = 1, emissive = 0) {
  const value = new THREE.MeshStandardMaterial({
    color, roughness: .3, metalness: .2, transparent: true, opacity,
    emissive, emissiveIntensity: emissive ? .55 : 0
  });
  value.userData.opacity = opacity;
  return value;
}

function lineMaterial(color, opacity = 1) {
  const value = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  value.userData.opacity = opacity;
  return value;
}

function remember(group) {
  group.traverse((item) => {
    if (!item.material) return;
    const list = Array.isArray(item.material) ? item.material : [item.material];
    list.forEach((entry) => {
      entry.transparent = true;
      if (entry.userData.opacity == null) entry.userData.opacity = entry.opacity;
    });
  });
  return group;
}

export class QuantumScene {
  constructor(canvas, { reducedMotion = false, mobile = false, onFailure = () => {} } = {}) {
    this.canvas = canvas;
    this.reducedMotion = reducedMotion;
    this.mobile = mobile;
    this.onFailure = onFailure;
    this.target = { x: 0, y: 0 };
    this.rotation = { x: 0, y: 0 };
    this.act = 1;
    this.progress = 0;
    this.globalTarget = 0;
    this.globalProgress = 0;
    this.previousGlobalProgress = 0;
    this.pulse = 0;
    this.quality = 2;
    this.weights = [1, 0, 0, 0, 0];
    this.timer = new THREE.Timer();
    this.timer.connect(document);
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !mobile, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2));
    this.renderer.setSize(innerWidth, innerHeight, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, .1, 100);
    this.camera.position.set(0, 0, mobile ? 15 : 13);
    this.scene = new THREE.Scene();
    this.root = new THREE.Group();
    this.scene.add(this.root);
    this.groups = [this.createBloch(), this.createLattice(), this.createCircuit(), this.createCryostat(), this.createConstellation()];
    this.groups.forEach((group) => this.root.add(remember(group)));
    this.orbit = remember(this.createScrollOrbit());
    this.root.add(this.orbit);
    this.particles = this.createParticles(mobile ? 1200 : 4000);
    this.scene.add(this.particles);
    this.addLights();
    this.setAct(1, 0);
    canvas.addEventListener("webglcontextlost", (event) => { event.preventDefault(); onFailure(); }, { passive: false });
  }

  addLights() {
    this.scene.add(new THREE.AmbientLight(C.cream, 1.5));
    const key = new THREE.DirectionalLight(C.coral, 4.5);
    key.position.set(5, 7, 8);
    this.scene.add(key);
    const rim = new THREE.PointLight(C.cold, 25, 20);
    rim.position.set(-5, -2, 5);
    this.scene.add(rim);
  }

  createBloch() {
    const group = new THREE.Group();
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(2.1, 24, 18), new THREE.MeshBasicMaterial({ color: C.maroon, wireframe: true, transparent: true, opacity: .32 }));
    sphere.material.userData.opacity = .32;
    group.add(sphere);
    [0, Math.PI / 2, Math.PI / 3].forEach((rotation, index) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(2.17 + index * .04, .025, 8, 96), material(index === 2 ? C.pink : C.red, .8, index === 2 ? C.pink : C.red));
      ring.rotation.set(rotation, rotation / 2, index * .7);
      group.add(ring);
    });
    const state = new THREE.ArrowHelper(new THREE.Vector3(.55, .8, .35).normalize(), new THREE.Vector3(), 2.75, C.red, .55, .26);
    state.line.material.transparent = true;
    state.line.material.userData.opacity = 1;
    state.cone.material.transparent = true;
    state.cone.material.userData.opacity = 1;
    group.add(state);
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(.32, 2), material(C.pink, 1, C.pink));
    group.add(core);
    group.position.set(3.25, .15, 0);
    group.userData.base = group.position.clone();
    return group;
  }

  createScrollOrbit() {
    const group = new THREE.Group();
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(2.75, 32, 22),
      new THREE.MeshBasicMaterial({ color: C.pink, wireframe: true, transparent: true, opacity: .13 })
    );
    shell.material.userData.opacity = .13;
    group.add(shell);
    [
      [2.82, C.coral, .7, .18, .2, 0],
      [3.02, C.pink, .8, Math.PI / 2, .35, .5],
      [3.18, C.cold, .48, Math.PI / 3, Math.PI / 2, -.35]
    ].forEach(([radius, color, opacity, x, y, z]) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, .035, 8, 128), material(color, opacity, color));
      ring.rotation.set(x, y, z);
      group.add(ring);
    });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(.46, 3), material(C.pink, .78, C.pink));
    group.add(core);
    const satellites = new THREE.Group();
    for (let index = 0; index < 8; index += 1) {
      const angle = index / 8 * Math.PI * 2;
      const node = new THREE.Mesh(new THREE.IcosahedronGeometry(index % 3 === 0 ? .13 : .075, 1), material(index % 2 ? C.coral : C.cold, .9, C.pink));
      node.position.set(Math.cos(angle) * 3.18, Math.sin(angle) * 1.1, Math.sin(angle) * 2.65);
      satellites.add(node);
    }
    satellites.rotation.x = .55;
    group.add(satellites);
    group.position.set(this.mobile ? 2.1 : 4.5, -2.8, -1.8);
    group.scale.setScalar(this.mobile ? .68 : .82);
    return group;
  }

  createLattice() {
    const group = new THREE.Group();
    const count = 40;
    const nodes = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.12, 1), material(C.coral, .95, C.red), count);
    const dummy = new THREE.Object3D();
    const points = [];
    for (let i = 0; i < count; i += 1) {
      const col = i % 8;
      const row = Math.floor(i / 8);
      const point = new THREE.Vector3((col - 3.5) * .72, (row - 2) * .72, Math.sin(i * 1.7) * .35);
      points.push(point);
      dummy.position.copy(point);
      dummy.scale.setScalar(i % 7 === 0 ? 1.65 : 1);
      dummy.updateMatrix();
      nodes.setMatrixAt(i, dummy.matrix);
      nodes.setColorAt(i, new THREE.Color(i % 7 === 0 ? C.pink : C.coral));
    }
    const segments = [];
    points.forEach((point, index) => {
      if (index % 8 !== 7) segments.push(...point.toArray(), ...points[index + 1].toArray());
      if (index < 32) segments.push(...point.toArray(), ...points[index + 8].toArray());
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(segments, 3));
    group.add(new THREE.LineSegments(geometry, lineMaterial(C.coral, .38)), nodes);
    group.position.set(2.8, 0, 0);
    group.rotation.y = -.35;
    group.userData.base = group.position.clone();
    return group;
  }

  createCircuit() {
    const group = new THREE.Group();
    const lines = [];
    for (let row = 0; row < 5; row += 1) lines.push(-3.2, 1.45 - row * .72, 0, 3.2, 1.45 - row * .72, 0);
    const wireGeometry = new THREE.BufferGeometry();
    wireGeometry.setAttribute("position", new THREE.Float32BufferAttribute(lines, 3));
    group.add(new THREE.LineSegments(wireGeometry, lineMaterial(C.cold, .72)));
    const gateGeometry = new THREE.BoxGeometry(.62, .62, .2);
    [[-1.9, .73], [-.55, -.72], [1.1, 1.45], [2.05, -1.44]].forEach(([x, y], index) => {
      const gate = new THREE.Mesh(gateGeometry, material(index % 2 ? C.pink : C.cold, .95, index % 2 ? C.red : C.blue));
      gate.position.set(x, y, 0);
      gate.rotation.z = index * .12;
      group.add(gate);
    });
    const connector = new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, 2.16, 8), material(C.coral, .9, C.red));
    connector.position.set(1.1, .36, 0);
    const control = new THREE.Mesh(new THREE.SphereGeometry(.16, 12, 8), material(C.coral, 1, C.red));
    control.position.set(1.1, 1.45, 0);
    const target = new THREE.Mesh(new THREE.TorusGeometry(.24, .045, 8, 32), material(C.coral, 1, C.red));
    target.position.set(1.1, -.72, 0);
    group.add(connector, control, target);
    group.position.set(2.6, 0, 0);
    group.rotation.set(-.12, -.25, -.08);
    group.userData.base = group.position.clone();
    group.userData.gates = group.children.filter((item) => item.geometry === gateGeometry);
    return group;
  }

  createCryostat() {
    const group = new THREE.Group();
    const gold = material(0xd6a160, .96, 0x4a2000);
    for (let index = 0; index < 6; index += 1) {
      const radius = 2.05 - index * .22;
      const plate = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * .9, .14, 40), index < 3 ? gold : material(C.cold, .9, C.blue));
      plate.position.y = 2.25 - index * .73;
      plate.rotation.x = .08;
      group.add(plate);
    }
    const cables = [];
    for (let index = 0; index < 18; index += 1) {
      const angle = (index / 18) * Math.PI * 2;
      cables.push(Math.cos(angle) * 1.85, 2.2, Math.sin(angle) * 1.85, Math.cos(angle + .22) * .7, -2.1, Math.sin(angle + .22) * .7);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(cables, 3));
    group.add(new THREE.LineSegments(geometry, lineMaterial(C.cold, .48)));
    group.position.set(2.8, -.15, 0);
    group.rotation.set(.08, -.35, -.12);
    group.userData.base = group.position.clone();
    return group;
  }

  createConstellation() {
    const group = new THREE.Group();
    const nodes = [];
    const segments = [];
    for (let index = 0; index < 26; index += 1) {
      const angle = index * 2.399;
      const radius = 1 + (index % 6) * .48;
      const point = new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius * .65, Math.sin(index * .8) * .7);
      nodes.push(point);
      const star = new THREE.Mesh(new THREE.IcosahedronGeometry(index % 5 === 0 ? .18 : .08, 1), material(index % 4 ? C.red : C.pink, 1, C.pink));
      star.position.copy(point);
      group.add(star);
      if (index) segments.push(...nodes[index - 1].toArray(), ...point.toArray());
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(segments, 3));
    group.add(new THREE.LineSegments(geometry, lineMaterial(C.red, .38)));
    group.position.set(2.8, 0, 0);
    group.userData.base = group.position.clone();
    return group;
  }

  createParticles(count) {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      const radius = 2 + Math.random() * 8;
      const angle = Math.random() * Math.PI * 2;
      positions.set([Math.cos(angle) * radius, (Math.random() - .5) * 9, Math.sin(angle) * radius - 2], i * 3);
      seeds[i] = Math.random();
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geometry.setDrawRange(0, count);
    this.particleCount = count;
    const shader = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uCondense: { value: 0 }, uColor: { value: new THREE.Color(C.maroon) }, uScale: { value: devicePixelRatio } },
      transparent: true, depthWrite: false, blending: THREE.NormalBlending,
      vertexShader: "attribute float aSeed; uniform float uTime; uniform float uCondense; uniform float uScale; varying float vAlpha; void main(){ vec3 p=position; float drift=uTime*(.05+aSeed*.09); p.x+=sin(drift+aSeed*40.)*.25; p.y+=cos(drift*.8+aSeed*20.)*.18; p=mix(p,vec3(p.x*.36,p.y*.9,p.z*.36),uCondense); vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv; gl_PointSize=(1.5+aSeed*3.5)*uScale*(12./-mv.z); vAlpha=.22+aSeed*.56; }",
      fragmentShader: "uniform vec3 uColor; varying float vAlpha; void main(){ float d=distance(gl_PointCoord,vec2(.5)); if(d>.5) discard; float glow=smoothstep(.5,0.,d); gl_FragColor=vec4(uColor,glow*vAlpha*.58); }"
    });
    return new THREE.Points(geometry, shader);
  }

  setRotation(x, y) { this.target.x = x; this.target.y = y; }
  triggerPulse() { this.pulse = 1; }

  setAct(act, progress = 0, globalProgress = this.globalTarget) {
    const next = Math.max(1, Math.min(5, act));
    const changed = next !== this.act;
    this.act = next;
    this.progress = progress;
    this.globalTarget = Math.max(0, Math.min(1, globalProgress));
    if (!changed) return;
    const dark = this.act >= 2 && this.act <= 4;
    this.particles.material.uniforms.uColor.value.setHex(this.act === 4 ? C.cold : dark ? C.coral : C.maroon);
    this.particles.material.uniforms.uCondense.value = this.act === 4 ? .78 : 0;
    this.particles.material.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    this.particles.material.needsUpdate = true;
  }

  lowerQuality() {
    this.quality -= 1;
    this.renderer.setPixelRatio(1);
    this.particles.geometry.setDrawRange(0, Math.max(600, Math.floor(this.particleCount * .5)));
  }

  resize() {
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.position.z = innerWidth < 760 ? 15 : 13;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(innerWidth, innerHeight, false);
  }

  render() {
    this.timer.update();
    const delta = Math.min(this.timer.getDelta(), 1 / 30);
    const time = this.timer.getElapsed();
    this.groups.forEach((group, index) => {
      const target = index === this.act - 1 ? 1 : 0;
      this.weights[index] += (target - this.weights[index]) * (this.reducedMotion ? 1 : .08);
      group.visible = this.weights[index] > .01;
      group.traverse((item) => {
        if (!item.material) return;
        const list = Array.isArray(item.material) ? item.material : [item.material];
        list.forEach((entry) => { entry.opacity = (entry.userData.opacity ?? 1) * this.weights[index]; });
      });
    });
    const damp = this.reducedMotion ? 1 : 1 - Math.pow(.06, delta * 60);
    this.rotation.x += (this.target.x - this.rotation.x) * damp;
    this.rotation.y += (this.target.y - this.rotation.y) * damp;
    this.root.rotation.set(this.rotation.x, this.rotation.y, 0);
    this.globalProgress += (this.globalTarget - this.globalProgress) * (this.reducedMotion ? 1 : .085);
    const scrollVelocity = Math.abs(this.globalProgress - this.previousGlobalProgress);
    this.previousGlobalProgress = this.globalProgress;
    const scroll = this.globalProgress;
    const orbitArc = Math.sin(scroll * Math.PI);
    const orbitStartX = this.mobile ? 2.1 : 4.5;
    const orbitTravelX = this.mobile ? 3.9 : 8;
    this.orbit.position.x = orbitStartX - scroll * orbitTravelX + Math.sin(scroll * Math.PI * 2) * .42;
    this.orbit.position.y = -2.8 + scroll * 5.4 + Math.sin(time * .55) * .12;
    this.orbit.position.z = -1.8 + orbitArc * 2.35;
    this.orbit.scale.setScalar((this.mobile ? .68 : .82) + orbitArc * (this.mobile ? .18 : .34));
    if (!this.reducedMotion) {
      this.orbit.rotation.y += delta * (.22 + Math.min(2.4, scrollVelocity * 180));
      this.orbit.rotation.x = .22 + Math.sin(scroll * Math.PI * 2) * .55;
      this.orbit.rotation.z = -.18 + scroll * Math.PI * 1.65;
    }
    const active = this.groups[this.act - 1];
    if (!this.reducedMotion && active) {
      active.rotation.y += delta * (this.act === 3 ? .08 : .18);
      active.position.y = active.userData.base.y + Math.sin(time * .7) * .08;
      if (this.act === 4) active.position.y += this.progress * .55;
      if (this.act === 5) active.position.y += this.progress * 1.4;
    }
    if (this.act === 3) {
      const gates = active.userData.gates || [];
      const selected = gates[Math.min(gates.length - 1, Math.floor(this.progress * gates.length))];
      gates.forEach((gate) => gate.scale.setScalar(gate === selected ? 1.2 + this.pulse * .3 : 1));
      this.pulse *= .88;
    }
    this.particles.material.uniforms.uTime.value = this.reducedMotion ? 0 : time;
    this.particles.rotation.y = time * .018;
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.timer.disconnect();
    this.scene.traverse((item) => { item.geometry?.dispose(); item.material?.dispose?.(); });
    this.renderer.dispose();
  }
}
