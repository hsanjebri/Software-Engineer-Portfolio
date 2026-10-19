import { useLayoutEffect, useRef } from "react";
import { gsap, FULL_MOTION } from "../lib/motion";
import "./Interlude.css";

// The hero's promise, one word per beat: "I turn code into products."
const WORDS = ["Ideas", "Code", "Products"];

/**
 * Pinned colour scene between Experience and Work.
 * The words are cut out of a black layer (white text + multiply blend), so a
 * living spectrum shows through them. Each word lights up in turn, then the
 * camera dives through the final dot until colour fills the screen and the
 * Work section slides up over it.
 */
const Interlude = () => {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add(FULL_MOTION, () => {
      const knock = q(".interlude__knock")[0] as HTMLElement;
      const dot = q(".interlude__dot--zoom")[0] as HTMLElement;
      const words = q(".interlude__word") as HTMLElement[];

      // Centre of the last dot inside the layer (offsets ignore transforms).
      const dotCentre = () => {
        let x = dot.offsetWidth / 2;
        let y = dot.offsetHeight / 2;
        for (let n: HTMLElement | null = dot; n && n !== knock; n = n.offsetParent as HTMLElement | null) {
          x += n.offsetLeft;
          y += n.offsetTop;
        }
        return { x, y };
      };
      // Zoom pivots on the dot while it glides to the centre of the screen,
      // until it is wide enough to cover the whole viewport.
      const setOrigin = () => {
        const { x, y } = dotCentre();
        gsap.set(knock, { transformOrigin: `${x}px ${y}px` });
      };
      const toCentreX = () => knock.clientWidth / 2 - dotCentre().x;
      const toCentreY = () => knock.clientHeight / 2 - dotCentre().y;
      const coverScale = () => (Math.hypot(knock.clientWidth, knock.clientHeight) / dot.offsetWidth) * 1.3;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
          onRefresh: setOrigin,
        },
      });
      setOrigin();

      // Beat 1–3: each word rises and lights up (white = colour shows through).
      words.forEach((w, i) => {
        tl.fromTo(
          w,
          { color: "#262626", y: 60, opacity: 0.4 },
          { color: "#ffffff", y: 0, opacity: 1, ease: "power2.out", duration: 1 },
          i * 0.9
        );
      });
      // The spectrum drifts the whole time.
      tl.fromTo(q(".interlude__color"), { backgroundPosition: "0% 50%" }, { backgroundPosition: "100% 50%", duration: 6.4 }, 0);

      // Dive: other words dim, then we fly through the final dot.
      tl.to(words.slice(0, -1), { color: "#000000", duration: 0.6 }, 3.3)
        .to(q(".interlude__label"), { opacity: 0, duration: 0.4 }, 3.3)
        .to(knock, { x: toCentreX, y: toCentreY, ease: "power2.inOut", duration: 1.6 }, 3.6)
        .to(knock, { scale: coverScale, ease: "power3.in", duration: 2.4 }, 3.6)
        .to({}, { duration: 0.4 }, 6);
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="interlude" data-nav-theme="dark" aria-label="Ideas. Code. Products.">
      <div className="interlude__stage">
        <div className="interlude__color" aria-hidden="true" />
        <div className="interlude__knock" aria-hidden="true">
          <p className="interlude__words">
            {WORDS.map((w, i) => (
              <span className="interlude__word" key={w}>
                {w}
                <i className={`interlude__dot${i === WORDS.length - 1 ? " interlude__dot--zoom" : ""}`} />
              </span>
            ))}
          </p>
          <p className="interlude__label">I turn code into products.</p>
        </div>
      </div>
    </section>
  );
};

export default Interlude;
