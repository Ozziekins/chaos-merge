import React from "react";
import "./MergeStudio.styles.css";
import { useMergeStudioState } from "./mergeStudio.state";
import { UploadZoneView } from "../upload.modlet/UploadZone.view";
import { ClipListView } from "../clips.modlet/ClipList.view";
import { OutputFormatSelectView } from "../output-format.modlet/OutputFormatSelect.view";
import { MergeButtonView } from "../merge-action.modlet/MergeButton.view";
import { RenderProgressView } from "../progress.modlet/RenderProgress.view";
import { ResultPreviewView } from "../result.modlet/ResultPreview.view";

export const MergeStudioView: React.FC = () => {
  const state = useMergeStudioState();
  const { clips, job, status } = state;

  const totalClips = clips.length;

  return (
    <>
      {/* Sidebar */}
      <aside className="cm-sidebar">
        <header className="cm-sidebar-header">
          <div className="cm-logo">
            <div className="cm-logo-icon" />
            <span className="cm-logo-text">ChaosMerge</span>
          </div>
        </header>

        <div className="cm-sidebar-inner">
          <div className="cm-drag-hint">Drag to reorder clips</div>
          <UploadZoneView onFilesSelected={state.addClips} />
          <ClipListView
            clips={clips}
            onRemove={state.removeClip}
            onReorder={state.reorderClips}
          />
        </div>

        <footer className="cm-sidebar-footer">
          <button
            className="cm-danger-link"
            disabled={!clips.length}
            onClick={state.reset}
          >
            Clear All
          </button>
        </footer>
      </aside>

      {/* Main panel */}
      <main className="cm-main">
        {status === "idle" && !clips.length && !job && (
          <section className="cm-empty-state">
            <div className="cm-play-icon">
              <span>▶</span>
            </div>
            <h1>Merge Studio</h1>
            <p>
              Arrange your videos in the desired order on the left. Select your
              preferred output format below and start merging.
            </p>
            <button
              className="cm-primary-btn cm-empty-btn"
              onClick={() => {
                const input = document.getElementById("cm-upload-input");
                (input as HTMLInputElement | null)?.click();
              }}
            >
              Add videos to start
            </button>
          </section>
        )}

        {!!clips.length && status === "idle" && (
          <section className="cm-ready-state">
            <div className="cm-play-icon">
              <span>▶</span>
            </div>
            <h1>Merge Studio</h1>
            <p>
              You&apos;re ready to merge. Double-check the order on the left
              and pick an output format.
            </p>

            <div className="cm-controls-row">
              <OutputFormatSelectView
                value={state.format}
                onChange={state.setFormat}
              />
              <MergeButtonView
                disabled={!clips.length}
                onClick={state.startMerge}
                clipCount={clips.length}
                status={status}
              />
            </div>
          </section>
        )}

        {status === "rendering" && job && <RenderProgressView job={job} />}

        {status === "finished" && job && (
          <ResultPreviewView job={job} onCreateAnother={state.reset} />
        )}

        {status === "error" && (
          <section className="cm-ready-state">
            <h1>Something went wrong</h1>
            <p>Please try again or adjust your clips.</p>
            <button className="cm-primary-btn cm-empty-btn" onClick={state.reset}>
              Start over
            </button>
          </section>
        )}
      </main>
    </>
  );
};
