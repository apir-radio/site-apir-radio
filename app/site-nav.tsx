"use client";

import { useEffect, useRef, useState } from "react";

const links = [
  ["#mission", "L’association"],
  ["#bureau", "Bureau"],
  ["#soirees", "Soirées"],
  ["#ressources", "Ressources"],
  ["#postes-hospitaliers", "Postes hospitaliers"],
  ["#contact", "Nous contacter"],
] as const;

const desktopLinks = links.slice(0, 4);

export function SiteNav() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const navRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    let frame = 0;

    function updateActiveSection() {
      frame = 0;
      const marker = window.scrollY + window.innerHeight * 0.32;
      let nextActiveId: string | null = null;

      for (const [href] of links) {
        const section = document.querySelector(href);
        if (section instanceof HTMLElement && section.offsetTop <= marker) {
          nextActiveId = href.slice(1);
        }
      }

      setActiveId(nextActiveId);
    }

    function scheduleUpdate() {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveSection);
    }

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  function closeMenu() {
    if (navRef.current) navRef.current.open = false;
  }

  function linkProps(href: string) {
    const id = href.slice(1);
    return {
      className: activeId === id ? "is-active" : undefined,
      "aria-current": activeId === id ? ("location" as const) : undefined,
    };
  }

  return (
    <>
      <nav aria-label="Navigation principale">
        {desktopLinks.map(([href, label]) => (
          <a key={href} href={href} {...linkProps(href)}>{label}</a>
        ))}
      </nav>
      <details className="mobile-nav" ref={navRef}>
        <summary aria-label="Menu de navigation">
          <span>Menu</span>
          <span className="mobile-nav-icon" aria-hidden="true">+</span>
        </summary>
        <div className="mobile-nav-popover">
          <p>Navigation</p>
          {links.map(([href, label]) => (
            <a key={href} href={href} {...linkProps(href)} onClick={closeMenu}>{label}</a>
          ))}
        </div>
      </details>
    </>
  );
}
