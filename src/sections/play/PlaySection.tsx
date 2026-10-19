import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { palette } from "../../lib/color";
import { gsap, FULL_MOTION } from "../../lib/motion";
import Words from "../../ui/Words";
import StackMatch from "./StackMatch";
import "./Play.css";

// Starting position for the decorative board (top = dark side).
// U+FE0E asks for the text glyph, not the colour emoji some systems use.
const T = "︎";
const BACK_RANK = ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"].map((p) => p + T);
const board = Array.from({ length: 64 }, (_, i) => {
  const rank = Math.floor(i / 8);
  const file = i % 8;
  if (rank === 0) return { piece: BACK_RANK[file], side: "top" };
  if (rank === 1) return { piece: "♟" + T, side: "top" };
  if (rank === 6) return { piece: "♟" + T, side: "bottom" };
  if (rank === 7) return { piece: BACK_RANK[file], side: "bottom" };
  return null;
});
// The pawns that play 1. e4 e5 2. Nf3 as you scroll.
const E7 = 12;
const E2 = 52;
const G1 = 62;

const PlaySection = () => {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add(FULL_MOTION, () => {
      // The chess card swings in, then the opening plays out with the scroll.
      gsap.fromTo(
        q(".chess"),
        { x: 120, rotateY: -18, opacity: 0, transformPerspective: 1400 },
        {
          x: 0,
          rotateY: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: q(".chess")[0], start: "top bottom", end: "top 55%", scrub: 0.6 },
        }
      );
      const square = () => (q(".chess__sq")[0] as HTMLElement).offsetWidth;
      gsap
        .timeline({
          defaults: { ease: "power2.inOut", duration: 1 },
          scrollTrigger: { trigger: q(".chess__board")[0], start: "top 75%", end: "bottom 35%", scrub: 0.8, invalidateOnRefresh: true },
        })
        .to(q(`[data-sq="${E2}"] .chess__piece`), { y: () => -2 * square() })
        .to(q(`[data-sq="${E7}"] .chess__piece`), { y: () => 2 * square() })
        .to(q(`[data-sq="${G1}"] .chess__piece`), { x: () => -square(), y: () => -2 * square() });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="play" ref={root} className="play section sheet" aria-labelledby="play-title">
      <div data-exit>
        <div className="container">
          <header className="section-head">
            <p className="eyebrow" data-reveal="up">
              Play
            </p>
            <Words
              as="h2"
              id="play-title"
              className="headline"
              text="Take a break. Play a game."
              data-reveal="words"
              gradient={{ stops: [palette.green.light, palette.cyan.light, palette.blue.light], from: 3 }}
            />
            <p className="subhead" data-reveal="up">
              Match the stack: flip two cards, find the pairs. Fewer moves, better score.
            </p>
          </header>

          <div className="play__grid">
            <div className="play__game" data-reveal="up">
              <StackMatch />
            </div>

            <aside className="chess" aria-labelledby="chess-title">
              <div className="chess__board" aria-hidden="true">
                {board.map((sq, i) => (
                  <span
                    key={i}
                    data-sq={i}
                    className={`chess__sq${(Math.floor(i / 8) + (i % 8)) % 2 ? " chess__sq--dark" : ""}`}
                  >
                    {sq && <span className={`chess__piece chess__piece--${sq.side}`}>{sq.piece}</span>}
                  </span>
                ))}
              </div>
              <div className="chess__body">
                <p className="chess__eyebrow">Chess</p>
                <h3 className="chess__title" id="chess-title">
                  Fancy a real challenge?
                </h3>
                <p className="chess__text">Play a full game of chess against an engine, right in your browser.</p>
                <Link to="/play" className="btn chess__cta" data-cursor-label="Play">
                  Play chess
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlaySection;
