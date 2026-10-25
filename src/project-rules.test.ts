import { describe, expect, it } from 'vitest';

const rootFiles = import.meta.glob('/{AGENTS.md,package.json,tsconfig.json}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const raw = (path: string) => rootFiles[path];

const projectFiles = [
  '/src/project-rules.test.ts',
  ...Object.keys(import.meta.glob('/{src,docs}/**/*', { query: '?url' })),
];

const agents = raw('/AGENTS.md');

describe('instruction files match the repo (Rule 1)', () => {
  it('only mentions npm scripts that exist in package.json', () => {
    const scripts = Object.keys(JSON.parse(raw('/package.json')).scripts);
    const mentioned = [...agents.matchAll(/npm run (\w+)/g)].map((match) => match[1]);
    expect(mentioned.length).toBeGreaterThan(0);
    expect(mentioned.filter((name) => !scripts.includes(name))).toEqual([]);
  });

  it('only mentions src/ and docs/ files that exist', () => {
    const mentioned = [...agents.matchAll(/`((?:src|docs)\/[^`*{}\s]+\.\w+)`/g)].map((match) => match[1]);
    expect(mentioned.length).toBeGreaterThan(0);
    expect(mentioned.filter((path) => !projectFiles.includes(`/${path}`))).toEqual([]);
  });

  it('states the TypeScript strict flag the way tsconfig.json has it', () => {
    const claimsNotStrict = /does not enable `strict`/.test(agents);
    const tsconfigHasStrict = /"strict"\s*:\s*true/.test(raw('/tsconfig.json'));
    expect(claimsNotStrict).toBe(!tsconfigHasStrict);
  });
});
