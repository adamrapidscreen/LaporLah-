import { z } from 'zod';

export const flagSchema = z.object({
  reason: z.string().min(1, 'Reason is required').max(500, 'Reason must be 500 characters or less'),
});

export type FlagInput = z.infer<typeof flagSchema>;
