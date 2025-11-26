import React from "react";
import "./Result.styles.css";
import type { MergeJob } from "../shared/types";
import { API_BASE } from "../api/client";

interface Props {
  job: MergeJob;
  onCreateAnother(): void;
}

export const ResultPreviewView: React.FC<Props> = ({
  job,
  onCreateAnother
}) => {
  const base = API_BASE.replace(/\/api$/, "");
  const url = job.outputUrl ? `${base}${job.outputUrl}` : "";

  function handleDownload(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!url) {
      e.preventDefault();
      return;
    }
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = `chaos-merge.${job.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <section className="cm-result">
      <div className="cm-result-video-frame">
        {url ? (
          <video src={url} className="cm-result-video" controls />
        ) : (
          <div className="cm-result-placeholder" />
        )}
      </div>
      <div className="cm-result-actions">
        <a
          href={url}
          onClick={handleDownload}
          download={`chaos-merge.${job.format}`}
          className="cm-primary-btn cm-download-btn"
        >
          Download {job.format.toUpperCase()}
        </a>
        <button className="cm-ghost-btn" onClick={onCreateAnother}>
          Create Another
        </button>
      </div>
    </section>
  );
};
