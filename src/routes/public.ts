import type { FastifyPluginAsync } from 'fastify';
import crypto from 'node:crypto';

const publicRoutes: FastifyPluginAsync = async (server) => {
  if (server.config.nodeEnv === 'development') {
    server.get('/keygen', async (req, reply) => {
      const key = crypto.randomBytes(64).toString('hex');
      return reply.status(200).send(key);
    });
  }
};

export default publicRoutes;
