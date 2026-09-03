"use client";

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
    persistOpenYears(openYears);
  }, [hasRestoredState, openYears]);

  function updateOpenYear(year: string, isOpen: boolean) {
    userInteractedRef.current = true;
    const nextOpenYears = isOpen ? [...new Set([...openYears, year])] : openYears.filter((item) => item !== year);
    setOpenYears(nextOpenYears);
    persistOpenYears(nextOpenYears);
  }

  return (
    <div className="archive-wrap">
      <p className="archive-label">Archives des soirées</p>
      {seasons.map((season) => {
        const count = season.events.length;
        return (
          <details
            key={season.year}
            open={openYears.includes(season.year)}
          >
            <summary
              onClick={(event) => {
                event.preventDefault();
                updateOpenYear(season.year, !openYears.includes(season.year));
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
