import { useEffect, useState, type MouseEvent } from "react";
import { config } from "../config";
import { getLenis, scrollToHash } from "../lib/motion";
import "./Nav.css";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#work", label: "Work" },
  { href: "#play", label: "Play" },
  { href: "#contact", label: "Contact" },
];

const Nav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    let frame = 0;
    // Sample what sits under the bar; any ancestor with data-nav-theme wins.
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
      const below = document
        .elementsFromPoint(window.innerWidth / 2, 20)
        .find((el) => !el.closest(".nav"));
      const theme = below?.closest<HTMLElement>("[data-nav-theme]")?.dataset.navTheme;
      setDark(theme === "dark");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    // Freeze the page behind the sheet.
    getLenis()?.stop();
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      getLenis()?.start();
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    scrollToHash(href);
    history.replaceState(null, "", href);
  };

  return (
    <header
      className={`nav${scrolled ? " nav--scrolled" : ""}${dark ? " nav--dark" : ""}${open ? " nav--open" : ""}`}
    >
      <nav className="nav__bar" aria-label="Primary">
        <a className="nav__brand" href="#top" onClick={(e) => go(e, "#top")}>
          {config.developer.fullName}
        </a>

        <ul className="nav__links" id="nav-menu">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={(e) => go(e, l.href)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          className="nav__cta"
          href={`mailto:${config.contact.email}`}
          data-cursor-label="Email"
        >
          Get in touch
        </a>

        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="nav-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </nav>
    </header>
  );
};

export default Nav;
