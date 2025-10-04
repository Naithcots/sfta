import type { FastifyPluginAsync } from 'fastify';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { uploadsDir } from '../configuration.js';

const protectedRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('onRequest', async (req, reply) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== server.config.apiKey) {
      return reply.status(403).send();
    }
  });

  server.post('/upload', async (req, reply) => {
    const data = await req.file();
    if (!data) {
      return reply.status(400).send();
    }

    const ext = path.extname(data.filename);
    const randomName = crypto.randomBytes(16).toString('hex');
    const fileName = `${randomName}${ext}`;

    await pipeline(
      data.file,
      fs.createWriteStream(`${uploadsDir}/${fileName}`),
    );
    return reply
      .status(201)
      .send({ url: `${server.config.webDomainUrl}/uploads/${fileName}` });
  });
};

export default protectedRoutes;
