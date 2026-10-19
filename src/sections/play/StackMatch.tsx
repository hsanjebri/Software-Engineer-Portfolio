import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { skillGroups, type Tech } from "../../data/site";
import { palette, spectrum } from "../../lib/color";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/motion";

/**
 * "Stack Match": a memory game with the tech stack. Flip two cards, match the
 * logos. Cards are dealt from the centre when the board scrolls into view.
 */

const PAIRS = 6;
const BEST_KEY = "stack-match-best";

// Colourful logos only, so every pair is easy to tell apart.
const pool = skillGroups
  .flatMap((g) => g.items)
  .filter((t): t is Required<Tech> => Boolean(t.icon && t.color && t.color !== "#1d1d1f"));

type Card = { key: number; tech: Required<Tech>; matched: boolean };

function shuffle<T>(list: T[]) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const newDeck = (): Card[] =>
  shuffle(
    shuffle(pool)
      .slice(0, PAIRS)
      .flatMap((tech, i) => [
        { key: i * 2, tech, matched: false },
        { key: i * 2 + 1, tech, matched: false },
      ])
  );

// Best score is a per-visitor nicety; storage may be unavailable.
const readBest = () => {
  try {
    const v = Number(localStorage.getItem(BEST_KEY));
    return v > 0 ? v : null;
  } catch {
    return null;
  }
};
const writeBest = (moves: number) => {
  try {
    localStorage.setItem(BEST_KEY, String(moves));
  } catch {
    /* ignore */
  }
};

const cardsIn = (grid: HTMLElement | null) => Array.from(grid?.querySelectorAll<HTMLElement>(".mm__card") ?? []);

/** Deal: cards fly out of a pile in the centre of the board. */
function deal(grid: HTMLElement | null) {
  const cards = cardsIn(grid);
  if (!grid || !cards.length) return;
  if (prefersReducedMotion()) {
    gsap.fromTo(cards, { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.03 });
    return;
  }
  const box = grid.getBoundingClientRect();
  const offset = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    return { x: box.left + box.width / 2 - (r.left + r.width / 2), y: box.top + box.height / 2 - (r.top + r.height / 2) };
  };
  gsap.fromTo(
    cards,
    {
      x: (_: number, el: HTMLElement) => offset(el).x,
      y: (_: number, el: HTMLElement) => offset(el).y,
      rotate: () => gsap.utils.random(-25, 25),
      scale: 0.6,
      opacity: 0,
    },
    { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.3)", stagger: 0.055 }
  );
}

const clock = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/** `dealOnMount`: deal right away (e.g. inside a window) instead of on scroll. */
const StackMatch = ({ dealOnMount = false }: { dealOnMount?: boolean }) => {
  const [deck, setDeck] = useState(newDeck);
  const [open, setOpen] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [won, setWon] = useState(false);
  const [best, setBest] = useState(readBest);
  const [message, setMessage] = useState("");
  const [round, setRound] = useState(0);
  const locked = useRef(false);
  const grid = useRef<HTMLDivElement>(null);
  const burstLayer = useRef<HTMLDivElement>(null);

  const againBtn = useRef<HTMLButtonElement>(null);
  const cardsEls = () => cardsIn(grid.current);

  // First deal when the board scrolls into view; later deals on restart.
  useLayoutEffect(() => {
    const el = grid.current;
    gsap.set(cardsIn(el), { opacity: 0 });
    if (dealOnMount) {
      const id = requestAnimationFrame(() => deal(el));
      return () => cancelAnimationFrame(id);
    }
    const st = ScrollTrigger.create({ trigger: el, start: "top 78%", once: true, onEnter: () => deal(el) });
    return () => st.kill();
  }, [dealOnMount]);
  useEffect(() => {
    if (round > 0) deal(grid.current);
  }, [round]);

  // The cards are disabled once won, so hand focus to "Play again".
  useEffect(() => {
    if (won) againBtn.current?.focus({ preventScroll: true });
  }, [won]);

  // Clock runs from the first flip to the last match.
  useEffect(() => {
    if (!startedAt || won) return;
    const id = window.setInterval(() => setElapsed(Date.now() - startedAt), 250);
    return () => window.clearInterval(id);
  }, [startedAt, won]);

  const shake = (indices: number[]) => {
    const els = cardsEls();
    if (prefersReducedMotion()) return;
    gsap.fromTo(
      indices.map((i) => els[i]),
      { x: 0 },
      { keyframes: { x: [0, -8, 8, -6, 6, 0] }, duration: 0.45, ease: "power1.inOut" }
    );
  };

  const pop = (indices: number[]) => {
    const els = cardsEls();
    if (prefersReducedMotion()) return;
    gsap.fromTo(indices.map((i) => els[i]), { scale: 1 }, { keyframes: { scale: [1, 1.1, 1] }, duration: 0.5, ease: "power2.out" });
  };

  // Celebration: a burst of Apple-colour dots from the middle of the board.
  const burst = () => {
    const layer = burstLayer.current;
    if (!layer || prefersReducedMotion()) return;
    const colors = spectrum.map((h) => palette[h].base);
    const dots = Array.from({ length: 56 }, (_, i) => {
      const d = document.createElement("i");
      d.className = "mm__dot";
      d.style.background = colors[i % colors.length];
      layer.appendChild(d);
      return d;
    });
    gsap.fromTo(
      dots,
      { x: 0, y: 0, scale: 1, opacity: 1 },
      {
        x: () => gsap.utils.random(-320, 320),
        y: () => gsap.utils.random(-260, 140),
        scale: () => gsap.utils.random(0.4, 1.4),
        rotate: () => gsap.utils.random(-180, 180),
        opacity: 0,
        duration: 1.6,
        ease: "power3.out",
        onComplete: () => dots.forEach((d) => d.remove()),
      }
    );
  };

  const flip = (i: number) => {
    const card = deck[i];
    if (locked.current || won || card.matched || open.includes(i)) return;
    const start = startedAt ?? Date.now();
    if (!startedAt) setStartedAt(start);

    const next = [...open, i];
    setOpen(next);
    if (next.length < 2) return;

    const total = moves + 1;
    setMoves(total);
    const [a, b] = next;
    if (deck[a].tech.name === deck[b].tech.name) {
      const updated = deck.map((c, k) => (k === a || k === b ? { ...c, matched: true } : c));
      setDeck(updated);
      setOpen([]);
      pop([a, b]);
      if (updated.every((c) => c.matched)) {
        const time = Date.now() - start;
        setElapsed(time);
        setWon(true);
        const record = best === null || total < best;
        if (record) {
          setBest(total);
          writeBest(total);
        }
        setMessage(`All matched in ${total} moves and ${clock(time)}.${record ? " New best!" : ""}`);
        burst();
      } else {
        setMessage(`Match: ${card.tech.name}.`);
      }
    } else {
      locked.current = true;
      setMessage("No match.");
      shake([a, b]);
      window.setTimeout(() => {
        setOpen([]);
        locked.current = false;
      }, 850);
    }
  };

  const restart = () => {
    locked.current = false;
    setDeck(newDeck());
    setOpen([]);
    setMoves(0);
    setStartedAt(null);
    setElapsed(0);
    setWon(false);
    setMessage("New game. Find the six pairs.");
    setRound((r) => r + 1);
  };

  return (
    <div className="mm">
      <div className="mm__bar">
        <dl className="mm__stats">
          <div>
            <dt>Moves</dt>
            <dd>{moves}</dd>
          </div>
          <div>
            <dt>Time</dt>
            <dd>{clock(elapsed)}</dd>
          </div>
          <div>
            <dt>Best</dt>
            <dd>{best ?? "–"}</dd>
          </div>
        </dl>
        <button type="button" className="btn btn--ghost mm__restart" onClick={restart} data-cursor-label="Shuffle">
          Restart
        </button>
      </div>

      <div className="mm__board">
        <div className="mm__grid" ref={grid} role="group" aria-label="Memory game: 12 cards">
          {deck.map((c, i) => {
            const up = c.matched || open.includes(i);
            const Icon = c.tech.icon;
            return (
              <button
                key={c.key}
                type="button"
                className={`mm__card${up ? " is-up" : ""}${c.matched ? " is-matched" : ""}`}
                style={{ "--brand": c.tech.color } as CSSProperties}
                onClick={() => flip(i)}
                disabled={c.matched || won}
                aria-label={up ? `Card ${i + 1}: ${c.tech.name}${c.matched ? ", matched" : ""}` : `Card ${i + 1}: face down`}
                data-cursor-label="Flip"
              >
                <span className="mm__inner">
                  <span className="mm__face mm__back" aria-hidden="true">
                    <span className="mm__glyph">{"{ }"}</span>
                  </span>
                  <span className="mm__face mm__front" aria-hidden="true">
                    <Icon />
                    <span className="mm__name">{c.tech.name}</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="mm__burst" ref={burstLayer} aria-hidden="true" />

        {won && (
          <div className="mm__win">
            <p className="mm__win-title">Shipped.</p>
            <p className="mm__win-text">
              6 pairs in {moves} moves · {clock(elapsed)}
              {best === moves ? " · Best score" : ""}
            </p>
            <button ref={againBtn} type="button" className="btn" onClick={restart} data-cursor-label="Again">
              Play again
            </button>
          </div>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {message}
      </p>
    </div>
  );
};

export default StackMatch;
