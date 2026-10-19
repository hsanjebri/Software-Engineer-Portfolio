import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { IoBatteryFull, IoDocumentText, IoGameController, IoLayers, IoLogoGithub, IoLogoLinkedin, IoMail, IoSearch, IoTrashOutline, IoWifi } from "react-icons/io5";
import { config } from "../../../config";
import { gsap, prefersReducedMotion } from "../../../lib/motion";
import Img from "../../../ui/Img";
import { AboutApp, ExperienceApp, MailApp, PlayApp, PreviewApp, ProjectsApp, StackApp, TrashApp, type Project } from "./apps";
import Wallpaper from "./Wallpaper";

/**
 * A small, playable desktop OS rendered at a fixed 1280×800 and scaled to the
 * laptop screen. Windows open from the Dock, can be dragged, minimised into
 * the Dock, zoomed and closed. After boot it demos itself until touched.
 */

const DESK_W = 1280;
const DESK_H = 800;
const MENU_H = 28;
const DOCK_SPACE = 92;

type AppId = "about" | "projects" | "experience" | "stack" | "mail" | "play" | "trash" | "preview";

const APPS: Record<AppId, { title: string; w: number; h: number; x?: number; y?: number }> = {
  about: { title: "About Hassan", w: 400, h: 470, x: 120, y: 84 },
  projects: { title: "Projects", w: 720, h: 470, x: 430, y: 120 },
  experience: { title: "Experience", w: 700, h: 450 },
  stack: { title: "Stack", w: 600, h: 470 },
  mail: { title: "New Message", w: 540, h: 440 },
  play: { title: "Stack Match", w: 500, h: 492 },
  trash: { title: "Trash", w: 380, h: 240 },
  preview: { title: "Preview", w: 560, h: 560 },
};

type Win = {
  key: string;
  app: AppId;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  state: "open" | "closing" | "min";
  max: boolean;
  resizing: boolean;
  dx: number;
  dy: number;
  project?: Project;
};

type DockItem =
  | { kind: "app"; id: Exclude<AppId, "preview">; label: string; icon: ReactNode; tone: string }
  | { kind: "link"; id: string; label: string; href: string; icon: ReactNode; tone: string };

const DOCK: DockItem[] = [
  { kind: "app", id: "about", label: "About", tone: "photo", icon: <Img src={config.about.photo} alt="" sizes="96px" /> },
  { kind: "app", id: "projects", label: "Projects", tone: "folder", icon: <span className="ico-folder" /> },
  { kind: "app", id: "experience", label: "Experience", tone: "notes", icon: <IoDocumentText /> },
  { kind: "app", id: "stack", label: "Stack", tone: "stack", icon: <IoLayers /> },
  { kind: "app", id: "mail", label: "Mail", tone: "mail", icon: <IoMail /> },
  { kind: "app", id: "play", label: "Stack Match", tone: "play", icon: <IoGameController /> },
  { kind: "link", id: "github", label: "GitHub", href: config.contact.github, tone: "github", icon: <IoLogoGithub /> },
  { kind: "link", id: "linkedin", label: "LinkedIn", href: config.contact.linkedin, tone: "linkedin", icon: <IoLogoLinkedin /> },
  { kind: "app", id: "trash", label: "Trash", tone: "trash", icon: <IoTrashOutline /> },
];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const clock = () =>
  new Date().toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).replace(",", "");

/* ---------- Window ---------- */

type WinProps = {
  win: Win;
  scale: number;
  active: boolean;
  onFocus: (key: string) => void;
  onMove: (key: string, x: number, y: number) => void;
  onClose: (key: string) => void;
  onMin: (key: string) => void;
  onMax: (key: string) => void;
  onGone: (key: string) => void;
  children: ReactNode;
};

const Window = ({ win, scale, active, onFocus, onMove, onClose, onMin, onMax, onGone, children }: WinProps) => {
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);

  const down = (e: ReactPointerEvent) => {
    if (win.max) return;
    drag.current = { px: e.clientX, py: e.clientY, x: win.x, y: win.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const move = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d) return;
    onMove(win.key, d.x + (e.clientX - d.px) / scale, d.y + (e.clientY - d.py) / scale);
  };
  const up = () => (drag.current = null);

  const cls = [
    "win",
    active && "is-active",
    win.state === "closing" && "win--exit",
    win.state === "min" && "win--min",
    win.max && "win--max",
    win.resizing && "win--resizing",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cls}
      role="dialog"
      aria-label={win.title}
      style={{ left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z, "--dx": `${win.dx}px`, "--dy": `${win.dy}px` } as CSSProperties}
      onPointerDown={() => onFocus(win.key)}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget && win.state === "closing") onGone(win.key);
      }}
    >
      <div
        className="win__bar"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onDoubleClick={() => onMax(win.key)}
        data-cursor-label="Drag"
      >
        <div className="win__lights" onPointerDown={(e) => e.stopPropagation()}>
          <button type="button" className="light light--close" aria-label={`Close ${win.title}`} onClick={() => onClose(win.key)} />
          <button type="button" className="light light--min" aria-label={`Minimise ${win.title}`} onClick={() => onMin(win.key)} />
          <button type="button" className="light light--max" aria-label={`Zoom ${win.title}`} onClick={() => onMax(win.key)} />
        </div>
        <span className="win__title">{win.title}</span>
      </div>
      <div className="win__body">{children}</div>
    </div>
  );
};

/* ---------- Desktop ---------- */

const Desktop = ({ booted }: { booted: boolean }) => {
  const reduced = prefersReducedMotion();
  const [phase, setPhase] = useState<"off" | "hello" | "on">(reduced ? "on" : "off");
  const [wins, setWins] = useState<Win[]>([]);
  const [scale, setScale] = useState(1);
  const [time, setTime] = useState(clock);
  const [bounce, setBounce] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const zTop = useRef(10);
  const screen = useRef<HTMLDivElement>(null);
  const desk = useRef<HTMLDivElement>(null);
  const dock = useRef<HTMLDivElement>(null);
  const hello = useRef<HTMLSpanElement>(null);
  const timers = useRef<number[]>([]);

  // Fit the 1280×800 desktop to whatever size the laptop screen is.
  useLayoutEffect(() => {
    const el = screen.current!;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / DESK_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setTime(clock()), 15000);
    return () => window.clearInterval(id);
  }, []);

  /** Offset from a window's centre to its Dock icon, for open/minimise motion. */
  const toDock = useCallback(
    (app: AppId, x: number, y: number, w: number, h: number) => {
      const icon = dock.current?.querySelector<HTMLElement>(`[data-app="${app === "preview" ? "projects" : app}"]`);
      const deskBox = desk.current?.getBoundingClientRect();
      if (!icon || !deskBox) return { dx: 0, dy: 360 };
      const r = icon.getBoundingClientRect();
      const cx = (r.left + r.width / 2 - deskBox.left) / scale;
      const cy = (r.top + r.height / 2 - deskBox.top) / scale;
      return { dx: cx - (x + w / 2), dy: cy - (y + h / 2) };
    },
    [scale]
  );

  const open = useCallback(
    (app: AppId, project?: Project) => {
      const key = project ? `preview-${project.id}` : app;
      const def = APPS[app];
      setWins((ws) => {
        const z = ++zTop.current;
        const existing = ws.find((w) => w.key === key && w.state !== "closing");
        if (existing) return ws.map((w) => (w.key === key ? { ...w, z, state: "open" } : w));
        const n = ws.filter((w) => w.state !== "closing").length;
        const x = clamp(def.x ?? (DESK_W - def.w) / 2 + ((n % 5) - 2) * 36, 8, DESK_W - def.w - 8);
        const y = clamp(def.y ?? 70 + (n % 5) * 24, MENU_H + 8, DESK_H - DOCK_SPACE - def.h);
        const { dx, dy } = toDock(app, x, y, def.w, def.h);
        return [
          ...ws.filter((w) => w.key !== key),
          { key, app, title: project ? project.title : def.title, x, y, w: def.w, h: def.h, z, state: "open", max: false, resizing: false, dx, dy, project },
        ];
      });
      setBounce(app === "preview" ? "projects" : app);
      window.setTimeout(() => setBounce(null), 700);
    },
    [toDock]
  );

  const patch = (key: string, p: Partial<Win> | ((w: Win) => Partial<Win>)) =>
    setWins((ws) => ws.map((w) => (w.key === key ? { ...w, ...(typeof p === "function" ? p(w) : p) } : w)));

  const focus = (key: string) => patch(key, () => ({ z: ++zTop.current }));
  const close = (key: string) => patch(key, { state: "closing" });
  const gone = (key: string) => setWins((ws) => ws.filter((w) => w.key !== key));
  const minimise = (key: string) => patch(key, (w) => ({ state: "min", ...toDock(w.app, w.x, w.y, w.w, w.h) }));
  const move = (key: string, x: number, y: number) =>
    patch(key, (w) => ({ x: clamp(x, -w.w + 120, DESK_W - 120), y: clamp(y, MENU_H, DESK_H - 60) }));
  const zoom = (key: string) => {
    patch(key, (w) => ({ max: !w.max, resizing: true, z: ++zTop.current }));
    window.setTimeout(() => patch(key, { resizing: false }), 420);
  };

  // Boot (once): "hello" is written across the screen, then the desktop appears.
  const bootStarted = useRef(false);
  useEffect(() => {
    if (!booted || bootStarted.current || reduced) return;
    bootStarted.current = true;
    setPhase("hello");
    const el = hello.current!;
    const tl = gsap
      .timeline({ onComplete: () => setPhase("on") })
      .fromTo(el, { "--p": "-20%" }, { "--p": "120%", duration: 1.9, ease: "power1.inOut" })
      .to(el, { opacity: 0, scale: 0.94, duration: 0.45, ease: "power2.in" }, "+=0.2");
    return () => {
      // Unmounting mid-boot: finish instantly rather than leave a black screen.
      tl.progress(1).kill();
    };
  }, [booted, reduced]);

  // Demo mode: open a couple of apps by itself until someone touches it.
  useEffect(() => {
    if (phase !== "on" || touched) return;
    const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
    later(reduced ? 0 : 900, () => open("about"));
    if (!reduced) later(4200, () => open("projects"));
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [phase, touched, open, reduced]);

  // Dock magnification: icons grow with a smooth falloff around the pointer.
  const magnify = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse" || reduced) return;
    dock.current?.querySelectorAll<HTMLElement>(".dock__item").forEach((item) => {
      const r = item.getBoundingClientRect();
      const d = Math.abs(e.clientX - (r.left + r.width / 2)) / scale;
      const m = 1 + 0.65 * Math.max(0, Math.cos(Math.min(d / 150, 1) * (Math.PI / 2)));
      item.style.setProperty("--m", m.toFixed(3));
    });
  };
  const unmagnify = () => dock.current?.querySelectorAll<HTMLElement>(".dock__item").forEach((i) => i.style.setProperty("--m", "1"));

  const live = wins.filter((w) => w.state !== "closing");
  const top = live.filter((w) => w.state === "open").sort((a, b) => b.z - a.z)[0];
  const running = (id: string) => live.some((w) => w.app === id || (id === "projects" && w.app === "preview"));

  const onKey = (e: ReactKeyboardEvent) => {
    if (e.key === "Escape" && top) close(top.key);
  };

  const content = (w: Win) => {
    switch (w.app) {
      case "about": return <AboutApp />;
      case "projects": return <ProjectsApp onOpen={(p) => open("preview", p)} />;
      case "preview": return w.project ? <PreviewApp project={w.project} /> : null;
      case "experience": return <ExperienceApp />;
      case "stack": return <StackApp />;
      case "mail": return <MailApp />;
      case "play": return <PlayApp />;
      case "trash": return <TrashApp />;
    }
  };

  return (
    <div className="mac-screen" ref={screen}>
      <div
        ref={desk}
        className={`desk desk--${phase}`}
        style={{ transform: `scale(${scale})` } as CSSProperties}
        onPointerDownCapture={() => setTouched(true)}
        onKeyDown={onKey}
        role="region"
        aria-label="Hassan's desktop. Open apps from the Dock."
      >
        <Wallpaper />

        {/* Menu bar */}
        <div className="menubar" aria-hidden={phase !== "on"}>
          <span className="menubar__mark">{"{ }"}</span>
          <strong>{top ? APPS[top.app].title.replace("About Hassan", "About") : "Hassan’s Mac"}</strong>
          <span className="menubar__menus" aria-hidden="true">
            <span>File</span>
            <span>Edit</span>
            <span>View</span>
            <span>Window</span>
            <span>Help</span>
          </span>
          <span className="menubar__status">
            <IoBatteryFull aria-hidden="true" />
            <IoWifi aria-hidden="true" />
            <IoSearch aria-hidden="true" />
            <time>{time}</time>
          </span>
        </div>

        {/* Desktop icons */}
        <div className="desk__icons">
          <button type="button" className="desk__icon" onClick={() => open("projects")} data-cursor-label="Open">
            <span className="ico-folder" aria-hidden="true" />
            <span>Projects</span>
          </button>
          <button type="button" className="desk__icon" onClick={() => open("play")} data-cursor-label="Play">
            <span className="ico-game" aria-hidden="true">
              <IoGameController />
            </span>
            <span>Stack Match</span>
          </button>
        </div>

        {/* Windows */}
        {wins.map((w) => (
          <Window
            key={w.key}
            win={w}
            scale={scale}
            active={top?.key === w.key}
            onFocus={focus}
            onMove={move}
            onClose={close}
            onMin={minimise}
            onMax={zoom}
            onGone={gone}
          >
            {content(w)}
          </Window>
        ))}

        {/* Dock */}
        <div className="dock" ref={dock} onPointerMove={magnify} onPointerLeave={unmagnify}>
          {DOCK.map((item, i) => {
            const isLink = item.kind === "link";
            const minimised = !isLink && live.find((w) => w.app === item.id && w.state === "min");
            const body = (
              <>
                <span className={`dock__icon tone--${item.tone}`}>{item.icon}</span>
                <span className="dock__tip">{item.label}</span>
                {!isLink && running(item.id) && <span className="dock__dot" />}
              </>
            );
            const style = { "--i": i } as CSSProperties;
            return (
              <div key={item.id} className="dock__slot">
                {i === 6 || i === 8 ? <span className="dock__sep" aria-hidden="true" /> : null}
                {isLink ? (
                  <a
                    className="dock__item"
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={style}
                    aria-label={`${item.label} (opens in a new tab)`}
                    data-cursor-label="Open"
                  >
                    {body}
                  </a>
                ) : (
                  <button
                    type="button"
                    className={`dock__item${bounce === item.id ? " is-bouncing" : ""}`}
                    data-app={item.id}
                    style={style}
                    aria-label={`Open ${item.label}`}
                    data-cursor-label="Open"
                    onClick={() => (minimised ? patch(minimised.key, { state: "open", z: ++zTop.current }) : open(item.id))}
                  >
                    {body}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {phase === "on" && !touched && (
          <p className="desk__hint" aria-hidden="true">
            Click an app ↓
          </p>
        )}

        {/* Boot */}
        <div className="boot" aria-hidden="true">
          <span className="boot__hello" ref={hello}>
            hello
          </span>
        </div>
      </div>
    </div>
  );
};

export default Desktop;
