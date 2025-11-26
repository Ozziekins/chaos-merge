import { spawn } from "child_process";

/** Uses ffprobe to get file duration in seconds */
export function getDuration(pathToFile: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const proc = spawn("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      pathToFile
    ]);

    let out = "";
    proc.stdout.on("data", (d) => (out += d.toString()));

    proc.on("close", (code) => {
      if (code !== 0) return reject(new Error("ffprobe failed"));
      const val = parseFloat(out.trim());
      resolve(isNaN(val) ? 0 : val);
    });
  });
}
