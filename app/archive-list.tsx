"use client";

// Affiche les archives et mémorise uniquement les années ouvertes par l’utilisateur.
import { useEffect, useRef, useState } from "react";
import type { ArchiveSeason } from "./events";

const storageKey = "apir-open-archive-years";

function persistOpenYears(years: string[]) {
  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify(years));
  } catch {
    // Le stockage est un confort, pas une condition de fonctionnement.
  }
}

export function ArchiveList({ seasons }: { seasons: ArchiveSeason[] }) {
  const [openYears, setOpenYears] = useState<string[]>([]);
  const [hasRestoredState, setHasRestoredState] = useState(false);
  const userInteractedRef = useRef(false);
  const detailsRefs = useRef(new Map<string, HTMLDetailsElement>());

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      try {
        const stored = JSON.parse(window.sessionStorage.getItem(storageKey) || "[]");
        if (Array.isArray(stored) && !userInteractedRef.current) {
          const restoredYears = stored.filter((year): year is string => typeof year === "string" && seasons.some((season) => season.year === year));
          setOpenYears(restoredYears);
        }
      } catch {
        // Le navigateur peut désactiver le stockage : les archives restent utilisables.
      }
      setHasRestoredState(true);
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, [seasons]);

  useEffect(() => {
    if (!hasRestoredState) return;
    detailsRefs.current.forEach((details, year) => {
      details.open = openYears.includes(year);
    });
    persistOpenYears(openYears);
  }, [hasRestoredState, openYears]);

  function updateOpenYear(year: string, isOpen: boolean) {
    userInteractedRef.current = true;
    const nextOpenYears = isOpen ? [...new Set([...openYears, year])] : openYears.filter((item) => item !== year);
    setOpenYears(nextOpenYears);
    persistOpenYears(nextOpenYears);
  }

  function toggleArchive(year: string) {
    const details = detailsRefs.current.get(year);
    if (!details) return;
    const isOpen = !details.open;
    details.open = isOpen;
    updateOpenYear(year, isOpen);
  }

  return (
    <div className="archive-wrap">
      <p className="archive-label">Archives des soirées</p>
      {seasons.map((season) => {
        const count = season.events.length;
        return (
          <details
            key={season.year}
            ref={(element) => {
              if (element) detailsRefs.current.set(season.year, element);
              else detailsRefs.current.delete(season.year);
            }}
          >
            <summary
              onClick={(event) => {
                event.preventDefault();
                toggleArchive(season.year);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  toggleArchive(season.year);
                }
              }}
            >
              <span>{season.year}</span>
              <span className="archive-summary-meta">
                <span className="archive-count">{count} soirée{count > 1 ? "s" : ""}</span>
                <span className="plus" aria-hidden="true">+</span>
              </span>
            </summary>
            <ul>{season.events.map((event) => <li key={event.label}>{event.label}</li>)}</ul>
          </details>
        );
      })}
    </div>
  );
}
