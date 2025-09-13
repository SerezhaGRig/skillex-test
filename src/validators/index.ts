import { z } from 'zod';

export const generateSchema = z
  .object({
    items: z.array(z.number().int().gte(0)).min(1),
    length: z.number().int().gte(0),
  })
  .strict();
