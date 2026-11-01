import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    files: ['**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommended],
  },
  {
    ignores: ['dist', 'node_modules', 'vite-tmp', 'mods/*/.claude-plugin/types'],
  }
);
