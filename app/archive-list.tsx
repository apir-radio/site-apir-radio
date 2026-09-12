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
  const openYearsRef = useRef<string[]>([]);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      try {
        const stored = JSON.parse(window.sessionStorage.getItem(storageKey) || "[]");
        if (Array.isArray(stored) && !userInteractedRef.current) {
          const restoredYears = [...new Set(stored.filter((year): year is string => typeof year === "string" && seasons.some((season) => season.year === year)))];
          openYearsRef.current = restoredYears;
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
    persistOpenYears(openYears);
  }, [hasRestoredState, openYears]);

  function handleToggle(year: string, isOpen: boolean) {
    userInteractedRef.current = true;
    const current = openYearsRef.current;
    const next = isOpen
      ? [...new Set([...current, year])]
      : current.filter((item) => item !== year);
    openYearsRef.current = next;
    setOpenYears(next);
    persistOpenYears(next);
  }

  return (
    <div className="archive-wrap">
      <h3 className="archive-label">Archives des soirées</h3>
      {seasons.map((season) => {
        const count = season.events.length;
        return (
          <details
            key={season.year}
            open={openYears.includes(season.year)}
            onToggle={(event) => handleToggle(season.year, event.currentTarget.open)}
          >
            <summary>
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
