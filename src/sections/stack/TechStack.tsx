import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { stackLayers } from "../../data/site";
import { palette } from "../../lib/color";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/motion";
import Words from "../../ui/Words";
import "./TechStack.css";

/**
 * Tech stack sphere. Every logo sits on a Fibonacci sphere and is projected
 * to 2D each frame (so tiles always face the viewer). Scrolling in makes the
 * logos fly in and assemble; the sphere spins on its own, follows the
 * pointer, can be dragged with inertia, and gets a kick from scroll speed.
 * Picking a layer lights its tools up and dims the rest.
 */

const items = stackLayers.flatMap((l) => l.items.map((t) => ({ ...t, layer: l.id })));
const N = items.length;

const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const points = items.map((_, i) => {
  const y = 1 - ((i + 0.5) * 2) / N;
  const r = Math.sqrt(1 - y * y);
  return [Math.cos(i * GOLDEN) * r, y, Math.sin(i * GOLDEN) * r];
});
// Where each logo starts before assembling: far out and toward the camera.
const scatter = points.map(([x, y, z], i) => {
  const k = 2.4 + ((i * 37) % 17) / 9;
  return [x * k, y * k, z * k + 1.6];
});
const delays = items.map((_, i) => ((i * 7) % 11) / 11); // 0…1 stagger order

const AUTO = 0.0032; // idle spin, radians per frame
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

const TechStack = () => {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [layer, setLayer] = useState<string | null>(null);
  const layerRef = useRef<string | null>(null);
  layerRef.current = layer;

  useLayoutEffect(() => {
    const el = stage.current;
    const section = root.current;
    if (!el || !section) return;
    const orbs = Array.from(el.querySelectorAll<HTMLElement>(".orb"));
    const reduced = prefersReducedMotion();

    const s = {
      ax: -0.35,
      ay: 0.6,
      vx: 0,
      vy: reduced ? 0 : AUTO,
      tx: 0,
      ty: reduced ? 0 : AUTO,
      assemble: reduced ? 1 : 0,
      dragging: false,
      hovering: false,
      active: false,
      lastX: 0,
      lastY: 0,
      focus: new Float32Array(N).fill(1),
    };

    const render = () => {
      const R = (el.clientWidth / 2) * 0.78;
      const P = 2.8; // camera distance in sphere radii
      const cy = Math.cos(s.ay), sy = Math.sin(s.ay);
      const cx = Math.cos(s.ax), sx = Math.sin(s.ax);
      const want = layerRef.current;
      for (let i = 0; i < N; i++) {
        // Fly-in: each logo travels from its scatter point on its own beat.
        const local = clamp((s.assemble - delays[i] * 0.45) / 0.55, 0, 1);
        const e = easeOut(local);
        const [px, py, pz] = points[i];
        const [qx, qy, qz] = scatter[i];
        const x = qx + (px - qx) * e;
        const y = qy + (py - qy) * e;
        const z = qz + (pz - qz) * e;
        // Rotate around Y, then X.
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        const y2 = y * cx - z1 * sx;
        const z2 = y * sx + z1 * cx;
        const persp = P / Math.max(0.35, P - z2);
        const depth = clamp((z2 + 1) / 2, 0, 1);
        // Layer focus eases toward 1 (lit) or 0 (dimmed).
        const target = !want || items[i].layer === want ? 1 : 0;
        s.focus[i] += (target - s.focus[i]) * 0.12;
        const f = s.focus[i];
        const scale = persp * (0.62 + 0.38 * depth) * (0.78 + 0.22 * f);
        const alpha = (0.28 + 0.72 * depth) * (0.12 + 0.88 * f) * Math.min(1, local * 1.6);
        const o = orbs[i];
        o.style.transform = `translate3d(${(x1 * R * persp).toFixed(1)}px, ${(y2 * R * persp).toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        o.style.opacity = alpha.toFixed(3);
        o.style.zIndex = String(Math.round(depth * 1000) + (f > 0.5 ? 1000 : 0));
      }
    };

    const tick = () => {
      if (!s.active) return;
      const dt = gsap.ticker.deltaRatio(60);
      if (!s.dragging) {
        const slow = s.hovering ? 0.2 : 1;
        s.vy += (s.ty * slow - s.vy) * 0.05 * dt;
        s.vx += (s.tx * slow - s.vx) * 0.05 * dt;
        s.ay += s.vy * dt;
        s.ax = clamp(s.ax + s.vx * dt, -0.9, 0.9);
      }
      render();
    };
    gsap.ticker.add(tick);

    // Only animate while the section is on screen.
    const visible = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        s.active = self.isActive;
        if (self.isActive) render();
      },
      onUpdate: (self) => {
        // Scroll speed gives the sphere a spin.
        if (!reduced) s.vy += clamp(self.getVelocity() * 0.0000045, -0.03, 0.03);
      },
    });

    // Fly-in, scrubbed by scroll.
    const assemble = reduced
      ? null
      : gsap.to(s, {
          assemble: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 98%", end: "center 55%", scrub: 0.8 },
        });

    // Pointer: steer when hovering, drag to spin with inertia.
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (s.dragging) {
        const dx = e.clientX - s.lastX;
        const dy = e.clientY - s.lastY;
        s.ay += dx * 0.006;
        s.ax = clamp(s.ax - dy * 0.006, -0.9, 0.9);
        s.vy = dx * 0.006;
        s.vx = -dy * 0.006;
        s.lastX = e.clientX;
        s.lastY = e.clientY;
        if (reduced) render();
        return;
      }
      if (reduced || e.pointerType !== "mouse") return;
      s.ty = AUTO + ((e.clientX - r.left) / r.width - 0.5) * 0.02;
      s.tx = -((e.clientY - r.top) / r.height - 0.5) * 0.012;
      s.hovering = Boolean((e.target as Element).closest(".orb"));
    };
    const onDown = (e: PointerEvent) => {
      s.dragging = true;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
      el.classList.add("is-dragging");
    };
    const onUp = (e: PointerEvent) => {
      s.dragging = false;
      el.classList.remove("is-dragging");
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    const onLeave = () => {
      s.ty = reduced ? 0 : AUTO;
      s.tx = 0;
      s.hovering = false;
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("pointerleave", onLeave);

    const onResize = () => render();
    window.addEventListener("resize", onResize);
    render();

    return () => {
      gsap.ticker.remove(tick);
      visible.kill();
      assemble?.scrollTrigger?.kill();
      assemble?.kill();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const current = stackLayers.find((l) => l.id === layer);

  return (
    <section id="stack" ref={root} className="techstack section sheet" aria-labelledby="stack-title">
      <div data-exit>
        <div className="container">
          <header className="section-head stack__head">
            <p className="eyebrow" data-reveal="up">
              Tech stack
            </p>
            <Words
              as="h2"
              id="stack-title"
              className="headline"
              text={`${N} tools. One stack.`}
              data-reveal="words"
              gradient={{ stops: [palette.cyan.light, palette.blue.light, palette.green.light], from: 2 }}
            />
            <p className="subhead" data-reveal="up">
              Drag to spin it. Pick a layer to light it up.
            </p>
          </header>

          <div
            className="stack__stage"
            ref={stage}
            role="img"
            aria-label={`A rotating sphere of ${N} technology logos`}
            data-cursor-label="Drag"
          >
            <div className="stack__glow" aria-hidden="true" />
            {items.map((t) => {
              const Icon = t.icon;
              return (
                <span key={t.name} className="orb" style={{ "--brand": t.color } as CSSProperties} aria-hidden="true">
                  <span className="orb__tile">
                    <Icon />
                  </span>
                  <span className="orb__label">{t.name}</span>
                </span>
              );
            })}
          </div>

          <div className="layers" role="group" aria-label="Filter the stack by layer">
            <button type="button" className="layer" aria-pressed={layer === null} onClick={() => setLayer(null)}>
              All <span>{N}</span>
            </button>
            {stackLayers.map((l) => (
              <button
                key={l.id}
                type="button"
                className="layer"
                aria-pressed={layer === l.id}
                onClick={() => setLayer(layer === l.id ? null : l.id)}
                style={{ "--chip": palette[l.hue].light } as CSSProperties}
              >
                {l.title} <span>{l.items.length}</span>
              </button>
            ))}
          </div>

          <p className="stack__caption" aria-live="polite">
            {current ? (
              <>
                <strong style={{ color: palette[current.hue].light }}>{current.title}</strong>
                {" · "}
                {current.items.map((t) => t.name).join(" · ")}
              </>
            ) : (
              "Hover a logo to see its name."
            )}
          </p>

          {/* The full list, for screen readers. */}
          <div className="sr-only">
            {stackLayers.map((l) => (
              <section key={l.id}>
                <h3>{l.title}</h3>
                <ul>
                  {l.items.map((t) => (
                    <li key={t.name}>{t.name}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
