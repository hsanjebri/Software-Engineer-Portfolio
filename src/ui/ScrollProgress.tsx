import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/motion";

/** A thin spectrum line along the top edge that fills as you read. */
const ScrollProgress = () => {
  const bar = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const tween = gsap.to(bar.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return <div ref={bar} className="progress" aria-hidden="true" />;
};

export default ScrollProgress;
