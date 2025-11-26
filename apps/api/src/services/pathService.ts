import path from "path";
import { env } from "../config/env";

export function uploadsPath(...segments: string[]) {
  return path.join(process.cwd(), env.uploadsDir, ...segments);
}

export function publicPath(...segments: string[]) {
  return path.join(process.cwd(), env.publicDir, ...segments);
}
