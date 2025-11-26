import React from "react";
import "./Progress.styles.css";
import type { MergeJob } from "../shared/types";

interface Props {
  job: MergeJob;
}

export const RenderProgressView: React.FC<Props> = ({ job }) => {
  const pct = job.progress ?? 0;
  const totalClips = job.clips.length;
  // Estimate current clip based on progress
  const currentClip = Math.max(1, Math.min(totalClips, Math.ceil((pct / 100) * totalClips)));

  return (
    <section className="cm-progress">
      <div
        className="cm-progress-circle"
        style={{ ["--pct" as any]: pct }}
      >
        <span>{pct}%</span>
      </div>
      <h2>Rendering Video</h2>
      <p>Processing clip {currentClip} of {totalClips}...</p>
      <div className="cm-progress-bar">
        <div style={{ width: `${pct}%` }} />
      </div>
      <small>Please do not close this tab.</small>
    </section>
  );
};
