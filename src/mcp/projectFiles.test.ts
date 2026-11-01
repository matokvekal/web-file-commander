import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { z } from 'zod';
import { listInputSchema } from './listInputSchema.ts';
import { DEFAULT_MAX_ENTRIES, listProjectFiles, parseMaxEntries } from './projectFiles.ts';

let root: string;

beforeAll(async () => {
  root = await mkdtemp(path.join(os.tmpdir(), 'mcp-root-'));
  await mkdir(path.join(root, 'src', 'deep'), { recursive: true });
  await mkdir(path.join(root, '.git'));
  await mkdir(path.join(root, 'node_modules', 'pkg'), { recursive: true });
  await writeFile(path.join(root, 'package.json'), '{}');
  await writeFile(path.join(root, 'src', 'a.ts'), '');
  await writeFile(path.join(root, 'src', 'deep', 'b.ts'), '');
  await writeFile(path.join(root, '.git', 'HEAD'), '');
  const outside = await mkdtemp(path.join(os.tmpdir(), 'mcp-outside-'));
  await symlink(outside, path.join(root, 'link'), 'junction').catch(() => undefined);
});

afterAll(async () => {
  await rm(root, { recursive: true, force: true });
});

describe('listProjectFiles', () => {
  it('lists the root and excludes .git and node_modules', async () => {
    const { entries } = await listProjectFiles(root, '.', 3, 100);
    const paths = entries.map((entry) => entry.path);
    expect(paths).toContain('package.json');
    expect(paths).toContain('src/deep/b.ts');
    expect(paths.some((p) => p.startsWith('.git') || p.startsWith('node_modules'))).toBe(false);
    expect(paths).not.toContain('link');
  });

  it('respects depth', async () => {
    const { entries } = await listProjectFiles(root, '.', 1, 100);
    expect(entries.map((entry) => entry.path)).not.toContain('src/a.ts');
  });

  it('truncates at the entry limit', async () => {
    const result = await listProjectFiles(root, '.', 3, 2);
    expect(result.entries).toHaveLength(2);
    expect(result.truncated).toBe(true);
  });

  it.each(['..', '../x', 'src/../..', '/etc', 'C:\\Windows', '.git', 'node_modules/pkg', 'src\\..\\..'])(
    'rejects %s',
    async (bad) => {
      await expect(listProjectFiles(root, bad, 1, 100)).rejects.toThrow();
    },
  );

  it('rejects a symlink that points outside the project', async () => {
    await expect(listProjectFiles(root, 'link', 1, 100)).rejects.toThrow(/inside the project|exist/);
  });

  it('rejects files and missing paths', async () => {
    await expect(listProjectFiles(root, 'package.json', 1, 100)).rejects.toThrow(/not a directory/);
    await expect(listProjectFiles(root, 'nope', 1, 100)).rejects.toThrow(/exist/);
  });
});

describe('tool input schema', () => {
  const schema = z.object(listInputSchema);

  it('applies defaults', () => {
    expect(schema.parse({})).toEqual({ path: '.', depth: 1 });
  });

  it.each([{ depth: 0 }, { depth: 4 }, { depth: 1.5 }, { path: 5 }, { path: 'x'.repeat(201) }])(
    'rejects %o',
    (input) => {
      expect(schema.safeParse(input).success).toBe(false);
    },
  );
});

describe('parseMaxEntries', () => {
  it('falls back to the default for missing or invalid values', () => {
    expect(parseMaxEntries(undefined)).toBe(DEFAULT_MAX_ENTRIES);
    expect(parseMaxEntries('abc')).toBe(DEFAULT_MAX_ENTRIES);
    expect(parseMaxEntries('-5')).toBe(DEFAULT_MAX_ENTRIES);
  });

  it('accepts and clamps valid values', () => {
    expect(parseMaxEntries('50')).toBe(50);
    expect(parseMaxEntries('999999')).toBe(1000);
  });
});
