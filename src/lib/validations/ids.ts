import { z } from 'zod';

/**
 * Permissive UUID-format validator: accepts any 8-4-4-4-12 hex string with dashes.
 * Intentionally more permissive than z.string().uuid() (RFC 4122) so seed/demo
 * IDs (e.g. a0000000-0000-0000-0000-000000000001) are accepted alongside real UUIDs.
 */
const UUID_LIKE_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const uuidLike = z.string().regex(UUID_LIKE_REGEX, { message: 'Invalid ID format' });
