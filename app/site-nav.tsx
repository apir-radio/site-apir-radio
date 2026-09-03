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
    if (!("IntersectionObserver" in window)) return;

    const sections = links
      .map(([href]) => document.querySelector(href))
      .filter((section): section is HTMLElement => section instanceof HTMLElement);
    if (sections.length === 0) return;

    const sectionEntries = new Map<Element, IntersectionObserverEntry>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => sectionEntries.set(entry.target, entry));
        const visibleSections = [...sectionEntries.values()]
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const nextActiveId = visibleSections[0]?.target instanceof HTMLElement
          ? visibleSections[0].target.id
          : null;
        setActiveId(nextActiveId);
      },
      { rootMargin: "-18% 0px -66% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
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
