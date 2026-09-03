"use client";

// Liste les annonces et gère les fiches locales avec l’historique navigateur.
import { Fragment, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import type { HospitalJob } from "./jobs";

function safeHref(href: string) {
  return /^(https:\/\/|mailto:|tel:)/i.test(href) ? href : null;
}

function renderInline(text: string): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > cursor) nodes.push(text.slice(cursor, index));

    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(<strong key={`strong-${index}`}>{token.slice(2, -2)}</strong>);
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const href = safeHref(link[2]);
        nodes.push(href ? <a key={`link-${index}`} href={href}>{link[1]}</a> : link[1]);
      }
    }

    cursor = index + token.length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

function MarkdownContent({ source }: { source: string }) {
  const lines = source.trim().split(/\r?\n/);
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    if (line.startsWith("## ") || line.startsWith("### ")) {
      const heading = line.replace(/^#{2,3}\s+/, "");
      blocks.push(<h3 key={`heading-${index}`}>{renderInline(heading)}</h3>);
      index += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: ReactNode[] = [];
      const listStart = index;
      while (index < lines.length && lines[index].trim().startsWith("- ")) {
        items.push(<li key={`item-${index}`}>{renderInline(lines[index].trim().slice(2))}</li>);
        index += 1;
      }
      blocks.push(<ul key={`list-${listStart}`}>{items}</ul>);
      continue;
    }

    const paragraphStart = index;
    const paragraph: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^#{2,3}\s+/.test(lines[index].trim()) &&
      !lines[index].trim().startsWith("- ")
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push(
      <p key={`paragraph-${paragraphStart}`}>
        {paragraph.map((part, partIndex) => (
          <Fragment key={`${paragraphStart}-${partIndex}`}>
            {partIndex > 0 && <br />}
            {renderInline(part)}
          </Fragment>
        ))}
      </p>,
    );
  }

  return <div className="job-description">{blocks}</div>;
}

function RowContent({ job, index }: { job: HospitalJob; index: number }) {
  return (
    <>
      <span className="job-index">{String(index + 1).padStart(2, "0")}</span>
      <span><strong>{job.title}</strong><small>{job.place}</small></span>
      <span className="job-arrow" aria-hidden="true">{job.content ? "→" : "↗"}</span>
    </>
  );
}

export function JobList({ jobs }: { jobs: HospitalJob[] }) {
  const [selectedJob, setSelectedJob] = useState<HospitalJob | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const syncingFromHistoryRef = useRef(false);

  const jobFromHash = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!window.location.hash.startsWith("#poste-")) return null;
    let jobId: string;
    try {
      jobId = decodeURIComponent(window.location.hash.replace(/^#poste-/, ""));
    } catch {
      return null;
    }
    if (!jobId) return null;
    return jobs.find((job) => job.id === jobId && job.content) ?? null;
  }, [jobs]);

  function clearJobHash() {
    if (typeof window === "undefined") return;
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }

  useEffect(() => {
    const updateFromLocation = () => {
      const job = jobFromHash();
      if (job) {
        setSelectedJob(job);
        return;
      }

      if (dialogRef.current?.open) {
        syncingFromHistoryRef.current = true;
        dialogRef.current.close();
      } else {
        setSelectedJob(null);
        syncingFromHistoryRef.current = false;
      }
    };

    updateFromLocation();
    window.addEventListener("popstate", updateFromLocation);
    window.addEventListener("hashchange", updateFromLocation);
    return () => {
      window.removeEventListener("popstate", updateFromLocation);
      window.removeEventListener("hashchange", updateFromLocation);
    };
  }, [jobFromHash]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !selectedJob || dialog.open) return;
    dialog.showModal();
  }, [selectedJob]);

  function closeDialog() {
    // Closing is a state change, not navigation: replace the hash instead of going back.
    clearJobHash();
    dialogRef.current?.close();
  }

  function handleDialogClose() {
    if (!syncingFromHistoryRef.current) {
      clearJobHash();
    }
    setSelectedJob(null);
    triggerRef.current?.focus();
    triggerRef.current = null;
    syncingFromHistoryRef.current = false;
  }

  return (
    <>
      <div className="jobs-list">
        {jobs.map((job, index) => job.content ? (
          <button
            type="button"
            className="job-row"
            key={job.id}
            data-job-id={job.id}
            aria-haspopup="dialog"
            aria-controls="job-dialog"
            aria-expanded={selectedJob?.id === job.id}
            onClick={(event) => {
              triggerRef.current = event.currentTarget;
              window.history.pushState(null, "", `#poste-${encodeURIComponent(job.id)}`);
              setSelectedJob(job);
            }}
          >
            <RowContent job={job} index={index} />
          </button>
        ) : (
          <a href={job.href} target="_blank" rel="noopener noreferrer" className="job-row" key={job.id}>
            <RowContent job={job} index={index} />
          </a>
        ))}
      </div>

      <noscript>
        <style>{`.jobs-list { display: none; }`}</style>
        <div className="jobs-noscript">
          <p className="jobs-noscript-note">JavaScript est désactivé : les annonces sont affichées directement ci-dessous.</p>
          {jobs.filter((job) => job.content).map((job) => (
            <article className="jobs-noscript-card" key={job.id}>
              <p className="job-dialog-place">{job.place}</p>
              <h3>{job.title}</h3>
              <MarkdownContent source={job.content ?? ""} />
            </article>
          ))}
        </div>
      </noscript>

      <dialog
        ref={dialogRef}
        id="job-dialog"
        className="job-dialog"
        aria-labelledby="job-dialog-title"
        aria-describedby={selectedJob ? "job-dialog-description" : undefined}
        onCancel={(event) => {
          event.preventDefault();
          closeDialog();
        }}
        onClose={handleDialogClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
      >
        {selectedJob?.content && (
          <article className="job-dialog-shell">
            <p id="job-dialog-description" className="visually-hidden">
              Informations détaillées, conditions et coordonnées de candidature.
            </p>
            <header className="job-dialog-header">
              <span>Offre hospitalière</span>
              <button type="button" onClick={closeDialog} aria-label="Fermer l’annonce">×</button>
            </header>
            <div className="job-dialog-scroll">
              <p className="job-dialog-place">{selectedJob.place}</p>
              <h2 id="job-dialog-title">{selectedJob.title}</h2>
              <MarkdownContent source={selectedJob.content} />
            </div>
          </article>
        )}
      </dialog>
    </>
  );
}
