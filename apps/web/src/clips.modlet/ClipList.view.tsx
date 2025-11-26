import React, { useState } from "react";
import type { LocalClip } from "../shared/types";
import "./Clips.styles.css";

interface Props {
  clips: LocalClip[];
  onRemove(id: string): void;
  onReorder(from: number, to: number): void;
}

export const ClipListView: React.FC<Props> = ({ clips, onRemove, onReorder }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  function handleDragStart(e: React.DragEvent, index: number) {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", ""); // Required for Firefox
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  }

  function handleDragLeave() {
    setDragOverIndex(null);
  }

  function handleDrop(e: React.DragEvent, dropIndex: number) {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    
    onReorder(draggedIndex, dropIndex);
    setDraggedIndex(null);
    setDragOverIndex(null);
  }

  function handleDragEnd() {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }

  return (
    <div className="cm-clip-list">
      {!clips.length && (
        <div className="cm-clip-empty">No videos added yet</div>
      )}
      {clips.map((clip, index) => (
        <div
          key={clip.id}
          className={`cm-clip-item ${draggedIndex === index ? "dragging" : ""} ${dragOverIndex === index ? "drag-over" : ""}`}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
        >
          <div className="cm-clip-drag-handle">⋮</div>
          <div className="cm-clip-thumb">
            {clip.thumbnailUrl ? (
              <video src={clip.thumbnailUrl} muted />
            ) : (
              <span>#{index + 1}</span>
            )}
          </div>
          <div className="cm-clip-body">
            <div className="cm-clip-title">
              #{index + 1} {clip.file.name.slice(0, 20)}
            </div>
            <div className="cm-clip-meta">
              {(clip.sizeBytes / (1024 * 1024)).toFixed(2)} MB
            </div>
          </div>
          <button
            className="cm-clip-remove"
            onClick={() => onRemove(clip.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
