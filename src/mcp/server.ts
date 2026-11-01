import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { listInputSchema } from './listInputSchema.ts';
import { listProjectFiles, parseMaxEntries } from './projectFiles.ts';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const maxEntries = parseMaxEntries(process.env.MCP_LIST_MAX_ENTRIES);

const server = new McpServer({ name: 'web-file-commander-readonly', version: '1.0.0' });

server.registerTool(
  'list_project_files',
  {
    title: 'List project files',
    description:
      'Read-only. Lists files and folders inside the project. .git and node_modules are always excluded.',
    inputSchema: listInputSchema,
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  async ({ path: requested, depth }) => {
    try {
      const { entries, truncated } = await listProjectFiles(projectRoot, requested, depth, maxEntries);
      const lines = entries.map((entry) => `${entry.type === 'directory' ? 'dir ' : 'file'} ${entry.path}`);
      if (truncated) lines.push(`... truncated at ${maxEntries} entries`);
      return { content: [{ type: 'text', text: lines.join('\n') || '(empty folder)' }] };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error.';
      return { isError: true, content: [{ type: 'text', text: message }] };
    }
  },
);

server.registerResource(
  'package-json',
  'project://package.json',
  {
    title: 'Project package.json',
    description: 'The package.json of this project (read-only).',
    mimeType: 'application/json',
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: 'application/json',
        text: await readFile(path.join(projectRoot, 'package.json'), 'utf8'),
      },
    ],
  }),
);

server.registerPrompt(
  'explain-project-structure',
  {
    title: 'Explain project structure',
    description: 'Asks the model to explain how this project is organized.',
  },
  () => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: [
            'Explain the structure of this project (Web File Commander).',
            'First call the list_project_files tool for the project root, then for src with depth 2.',
            'Read the project://package.json resource for scripts and dependencies.',
            'Then describe the main folders, the entry point, how the app is built and tested,',
            'and what the src/mcp folder is for. Keep it short and only use what you observed.',
          ].join(' '),
        },
      },
    ],
  }),
);

await server.connect(new StdioServerTransport());
