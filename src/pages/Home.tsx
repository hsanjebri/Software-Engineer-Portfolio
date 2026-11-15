import { useEffect, useLayoutEffect, useRef } from "react";
import Nav from "../sections/Nav";
import Hero from "../sections/hero/Hero";
import About from "../sections/About";
import Skills from "../sections/Skills";
import TechStack from "../sections/stack/TechStack";
import Experience from "../sections/Experience";
import Interlude from "../sections/Interlude";
import Work from "../sections/Work";
import Credentials from "../sections/Credentials";
import PlaySection from "../sections/play/PlaySection";
import Contact from "../sections/Contact";
import Footer from "../sections/Footer";
import Cursor from "../ui/Cursor";
import ScrollProgress from "../ui/ScrollProgress";
import Agent from "../ui/agent/Agent";
import { ScrollTrigger, startSmoothScroll } from "../lib/motion";
import { initPageScenes } from "../lib/scenes";

// Rhythm: light hero → black About → light Skills → white Tech stack → black Experience →
// colour dive (Interlude) → light Work → light-gray Credentials →
// white Play (game) → black Contact → gray footer.
const Home = () => {
  const main = useRef<HTMLElement>(null);

  useEffect(() => {
    const stop = startSmoothScroll();
    // Re-measure pinned scenes once web fonts settle line widths.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return stop;
  }, []);

  // Runs after every section's own scenes exist (child effects run first).
  useLayoutEffect(() => (main.current ? initPageScenes(main.current) : undefined), []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ScrollProgress />
      <Nav />
      <main id="main" ref={main}>
        <Hero />
        <About />
        <Skills />
        <TechStack />
        <Experience />
        <Interlude />
        <Work />
        <Credentials />
        <PlaySection />
        <Contact />
      </main>
      <Footer />
      <Agent />
      <Cursor />
    </>
  );
};

export default Home;
