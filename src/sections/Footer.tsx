import { Link } from "react-router-dom";
import { config } from "../config";
import "./Footer.css";

const sections = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#stack", label: "Stack" },
  { href: "#experience", label: "Experience" },
  { href: "#work", label: "Work" },
  { href: "#credentials", label: "Credentials" },
  { href: "#play", label: "Play" },
  { href: "#contact", label: "Contact" },
];

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <nav className="footer__nav" aria-label="Footer">
        <ul>
          {sections.map((s) => (
            <li key={s.href}>
              <a href={s.href}>{s.label}</a>
            </li>
          ))}
          <li>
            <Link to="/myworks">All projects</Link>
          </li>
          <li>
            <Link to="/play">Chess</Link>
          </li>
        </ul>
      </nav>
      <div className="footer__legal">
        <p>
          Copyright © {new Date().getFullYear()} {config.developer.fullName}. Designed and developed by{" "}
          {config.developer.fullName}.
        </p>
        <p>Built with React, GSAP and Lenis. Based in {config.social.location}.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
