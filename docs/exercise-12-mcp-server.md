# Level 5, Exercise 1: read-only MCP server

A stdio MCP server (`@modelcontextprotocol/sdk` v1 + Zod) in `src/mcp/`. It is registered in the project-level `.mcp.json` as `project-files` and exposes exactly three primitives:

| Primitive | Name | What it does |
| --- | --- | --- |
| Tool | `list_project_files` | Lists files and folders under a project-relative `path` (default `.`), `depth` 1 to 3 (default 1). |
| Resource | `project://package.json` | Returns the project `package.json` as JSON. |
| Prompt | `explain-project-structure` | Asks the model to explain the project layout using the tool and resource. |

## Safety

- Read-only: no write, delete or exec code exists.
- Absolute paths, `..`, null bytes and paths through `.git` or `node_modules` are rejected; the resolved real path must stay inside the project root, so symlinks and junctions that point outside are refused.
- `.git` and `node_modules` never appear in listings; symlinks are not listed or followed.
- Tool input is validated by a Zod schema (`src/mcp/listInputSchema.ts`) before the handler runs.
- The server root is derived from the script location, not from the working directory or an environment variable.

## Setting

`.mcp.json` sets `MCP_LIST_MAX_ENTRIES` to `${MCP_LIST_MAX_ENTRIES:-200}`: the maximum entries per listing. Default 200; invalid values fall back to 200; the cap is 1000.

## Verify in Claude Code

Needs Node 22.6 or newer (the server runs with `--experimental-strip-types`).

1. Start Claude Code in the project folder and approve the `project-files` server when prompted.
2. Run `/mcp`: `project-files` should show as connected with 1 tool and 1 prompt.
3. Tool: ask "List the files in src using the project-files MCP tool". Claude should call `mcp__project-files__list_project_files`. Try `path: ".."` or `node_modules`; both must return an error. `depth: 9` must fail schema validation.
4. Resource: type `@project-files:project://package.json` in the prompt and ask what scripts it defines.
5. Prompt: run `/mcp__project-files__explain-project-structure`. Claude should call the tool, read the resource and summarize.

## Automated checks

`npm run check` runs `src/mcp/projectFiles.test.ts` (exclusions, containment, symlink escape, depth, truncation, schema, env parsing).
