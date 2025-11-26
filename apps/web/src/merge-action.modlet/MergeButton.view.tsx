import React from "react";
import "./MergeButton.styles.css";
import type { MergeStatus } from "../shared/types";

interface Props {
  disabled?: boolean;
  onClick(): void;
  clipCount: number;
  status: MergeStatus;
}

export const MergeButtonView: React.FC<Props> = ({
  disabled,
  onClick,
  clipCount,
  status
}) => {
  const isBusy = status === "uploading" || status === "rendering";

  return (
    <button
      className="cm-primary-btn cm-merge-btn"
      disabled={disabled || isBusy}
      onClick={onClick}
    >
      {isBusy
        ? "Merging..."
        : `Merge ${clipCount} Video${clipCount === 1 ? "" : "s"}`}
    </button>
  );
};
