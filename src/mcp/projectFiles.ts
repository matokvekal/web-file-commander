import { lstat, readdir, realpath } from 'node:fs/promises';
import path from 'node:path';

export const EXCLUDED_NAMES = new Set(['.git', 'node_modules']);

export const DEFAULT_MAX_ENTRIES = 200;
const HARD_MAX_ENTRIES = 1000;

export type ProjectEntry = {
  path: string;
  type: 'file' | 'directory';
};

export type ListResult = {
  entries: ProjectEntry[];
  truncated: boolean;
};

export function parseMaxEntries(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? '', 10);
  if (!Number.isInteger(parsed) || parsed < 1) return DEFAULT_MAX_ENTRIES;
  return Math.min(parsed, HARD_MAX_ENTRIES);
}

const toPosix = (value: string) => value.split(path.sep).join('/');

function isInside(root: string, target: string): boolean {
  const relative = path.relative(root, target);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

export async function resolveInsideProject(root: string, requested: string): Promise<string> {
  if (requested.includes('\0')) throw new Error('Path contains an invalid character.');
  if (path.isAbsolute(requested) || path.win32.isAbsolute(requested) || path.posix.isAbsolute(requested)) {
    throw new Error('Path must be relative to the project root.');
  }
  const segments = requested.split(/[\\/]+/);
  if (segments.includes('..')) throw new Error('Path must not leave the project.');
  if (segments.some((segment) => EXCLUDED_NAMES.has(segment))) {
    throw new Error('Path points to an excluded folder.');
  }

  const realRoot = await realpath(root);
  const candidate = path.resolve(realRoot, requested);
  if (!isInside(realRoot, candidate)) throw new Error('Path must stay inside the project.');

  let real: string;
  try {
    real = await realpath(candidate);
  } catch {
    throw new Error('Path does not exist.');
  }
  if (!isInside(realRoot, real)) throw new Error('Path must stay inside the project.');
  return real;
}

export async function listProjectFiles(
  root: string,
  requested: string,
  depth: number,
  maxEntries: number,
): Promise<ListResult> {
  const realRoot = await realpath(root);
  const start = await resolveInsideProject(root, requested);
  const info = await lstat(start);
  if (!info.isDirectory()) throw new Error('Path is not a directory.');

  const entries: ProjectEntry[] = [];
  let truncated = false;

  async function walk(directory: string, level: number): Promise<void> {
    const children = await readdir(directory, { withFileTypes: true });
    children.sort((a, b) => a.name.localeCompare(b.name));
    for (const child of children) {
      if (EXCLUDED_NAMES.has(child.name)) continue;
      const isDirectory = child.isDirectory();
      if (!isDirectory && !child.isFile()) continue;
      if (entries.length >= maxEntries) {
        truncated = true;
        return;
      }
      const full = path.join(directory, child.name);
      entries.push({
        path: toPosix(path.relative(realRoot, full)),
        type: isDirectory ? 'directory' : 'file',
      });
      if (isDirectory && level < depth) {
        await walk(full, level + 1);
        if (truncated) return;
      }
    }
  }

  await walk(start, 1);
  return { entries, truncated };
}
