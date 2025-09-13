import z from 'zod';
import { generateSchema } from '../validators';

export type GenerateSchemaParams = z.infer<typeof generateSchema>;
