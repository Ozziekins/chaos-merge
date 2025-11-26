import React from "react";
import type { OutputFormat } from "../shared/types";
import "./OutputFormat.styles.css";

interface Props {
  value: OutputFormat;
  onChange(value: OutputFormat): void;
}

export const OutputFormatSelectView: React.FC<Props> = ({
  value,
  onChange
}) => {
  return (
    <div className="cm-format-select">
      <span className="cm-format-label">Output format</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as OutputFormat)}
      >
        <option value="mp4">MP4</option>
        <option value="webm">WEBM</option>
      </select>
    </div>
  );
};
