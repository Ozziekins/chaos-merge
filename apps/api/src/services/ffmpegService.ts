import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { getDuration } from "./durationService";
import { publicPath } from "./pathService";

interface MergeOptions {
  clipPaths: string[];
  outputFormat: "mp4" | "webm";
  onProgress?(percent: number): void;
}

export async function mergeVideos({
  clipPaths,
  outputFormat,
  onProgress
}: MergeOptions): Promise<string> {
  const durations = await Promise.all(clipPaths.map(getDuration));
  const totalDuration = durations.reduce((s, d) => s + d, 0) || 1;

  // concat list file
  const tmpDir = fs.mkdtempSync("/tmp/chaos-merge-");
  const listFile = path.join(tmpDir, "list.txt");
  const listContent = clipPaths
    .map((p) => `file '${p.replace(/'/g, "'\\''")}'`)
    .join("\n");
  fs.writeFileSync(listFile, listContent);

  const outPath = publicPath(`merged-${Date.now()}.${outputFormat}`);

  const args = [
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    listFile,
    "-c",
    "copy",
    outPath
  ];

  return new Promise((resolve, reject) => {
    const proc = spawn("ffmpeg", args);
    let currentTime = 0;

    proc.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      const match = text.match(/time=(\d+):(\d+):(\d+\.?\d*)/);
      if (match) {
        const [, hh, mm, ss] = match;
        currentTime =
          parseInt(hh, 10) * 3600 +
          parseInt(mm, 10) * 60 +
          parseFloat(ss);
        const percent = Math.min(
          100,
          Math.round((currentTime / totalDuration) * 100)
        );
        onProgress?.(percent);
      }
    });

    proc.on("close", (code) => {
      fs.unlinkSync(listFile);
      fs.rmdirSync(tmpDir);
      if (code === 0) {
        onProgress?.(100);
        resolve(outPath);
      } else {
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });
  });
}
