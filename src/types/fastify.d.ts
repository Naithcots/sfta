import type { getConfig } from '../configuration.ts';

declare module 'fastify' {
  interface FastifyInstance {
    config: Awaited<ReturnType<typeof getConfig>>;
  }
}
