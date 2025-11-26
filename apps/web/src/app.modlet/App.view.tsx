import React from "react";
import "../styles/tokens.css";
import "../styles/globals.css";
import "./App.styles.css";
import { MergeStudioView } from "../merge-studio.modlet/MergeStudio.view";

export const App: React.FC = () => {
  return (
    <div className="cm-shell">
      <MergeStudioView />
    </div>
  );
};
