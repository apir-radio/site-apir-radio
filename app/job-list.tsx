"use client";

import { Fragment, type ReactNode, useEffect, useRef, useState } from "react";
import type { HospitalJob } from "./jobs";

function safeHref(href: string) {
  return /^(https:\/\/|mailto:|tel:)/i.test(href) ? href : "#";
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
        nodes.push(
          <a key={`link-${index}`} href={safeHref(link[2])}>
            {link[1]}
          </a>,
        );
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

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !selectedJob || dialog.open) return;
    dialog.showModal();
  }, [selectedJob]);

  function closeDialog() {
    dialogRef.current?.close();
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
            onClick={() => setSelectedJob(job)}
          >
            <RowContent job={job} index={index} />
          </button>
        ) : (
          <a href={job.href} target="_blank" rel="noreferrer" className="job-row" key={job.id}>
            <RowContent job={job} index={index} />
          </a>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="job-dialog"
        aria-labelledby="job-dialog-title"
        aria-describedby={selectedJob ? "job-dialog-description" : undefined}
        onClose={() => setSelectedJob(null)}
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
