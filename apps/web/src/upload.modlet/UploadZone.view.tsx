import React, { ChangeEvent } from "react";
import "./Upload.styles.css";

interface Props {
  onFilesSelected(files: File[]): void;
}

export const UploadZoneView: React.FC<Props> = ({ onFilesSelected }) => {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    onFilesSelected(Array.from(e.target.files));
  }

  return (
    <div className="cm-upload-zone">
      <input
        id="cm-upload-input"
        type="file"
        multiple
        accept="video/*"
        onChange={handleChange}
        hidden
      />
      <button
        className="cm-upload-btn"
        onClick={() =>
          document.getElementById("cm-upload-input")?.click()
        }
      >
        + Add Videos
      </button>
    </div>
  );
};
