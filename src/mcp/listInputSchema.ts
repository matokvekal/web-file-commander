import { z } from 'zod';

export const listInputSchema = {
  path: z
    .string()
    .max(200)
    .default('.')
    .describe('Folder to list, relative to the project root. Defaults to the root.'),
  depth: z
    .number()
    .int()
    .min(1)
    .max(3)
    .default(1)
    .describe('How many folder levels to list (1 to 3). Defaults to 1.'),
};
