"use client";

import { useEffect, useState } from "react";
import type { ArchiveSeason } from "./events";

const storageKey = "apir-open-archive-years";

export function ArchiveList({ seasons }: { seasons: ArchiveSeason[] }) {
  const [openYears, setOpenYears] = useState<string[]>([]);

  useEffect(() => {
    let restoreTimer: number | undefined;
    try {
      const stored = JSON.parse(window.sessionStorage.getItem(storageKey) || "[]");
      if (Array.isArray(stored)) {
        const restoredYears = stored.filter((year): year is string => typeof year === "string" && seasons.some((season) => season.year === year));
        restoreTimer = window.setTimeout(() => setOpenYears(restoredYears), 0);
      }
    } catch {
      // Le navigateur peut désactiver le stockage : les archives restent utilisables.
    }
    return () => {
      if (restoreTimer !== undefined) window.clearTimeout(restoreTimer);
    };
  }, [seasons]);

  function updateOpenYear(year: string, isOpen: boolean) {
    setOpenYears((current) => {
      const next = isOpen ? [...new Set([...current, year])] : current.filter((item) => item !== year);
      try {
        window.sessionStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Le stockage est un confort, pas une condition de fonctionnement.
      }
      return next;
    });
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
            onToggle={(event) => updateOpenYear(season.year, event.currentTarget.open)}
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
