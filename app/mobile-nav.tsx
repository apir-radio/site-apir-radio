"use client";

import { useRef } from "react";

const links = [
  ["#mission", "L’association"],
  ["#bureau", "Bureau"],
  ["#soirees", "Soirées"],
  ["#ressources", "Ressources"],
  ["#postes-hospitaliers", "Postes hospitaliers"],
  ["#contact", "Nous contacter"],
] as const;

export function MobileNav() {
  const navRef = useRef<HTMLDetailsElement>(null);

  function closeMenu() {
    if (navRef.current) navRef.current.open = false;
  }

  return (
    <details className="mobile-nav" ref={navRef}>
      <summary aria-label="Menu de navigation">
        <span>Menu</span>
        <span className="mobile-nav-icon" aria-hidden="true">+</span>
      </summary>
      <div className="mobile-nav-popover">
        <p>Navigation</p>
        {links.map(([href, label]) => (
          <a key={href} href={href} onClick={closeMenu}>{label}</a>
        ))}
      </div>
    </details>
  );
}
