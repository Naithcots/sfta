import type { FastifyPluginAsync } from 'fastify';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

const protectedRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('onRequest', async (req, reply) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== server.config.apiKey) {
      server.log.warn(`Invalid API key: ${apiKey}`);
      return reply.status(403).send();
    }
  });

  server.post('/upload', async (req, reply) => {
    const data = await req.file();
    if (!data) {
      server.log.warn(`No file uploaded`);
      return reply.status(400).send();
    }

    const ext = path.extname(data.filename);
    const randomName = crypto.randomBytes(64).toString('hex');
    const fileName = `${randomName}${ext}`;

    await pipeline(
      data.file,
      fs.createWriteStream(`${server.config.uploadsDir}/${fileName}`, {
        mode: 0o644,
      }),
    );
    req.log.info(
      `File uploaded: ${data.filename} ${fileName} (${data.mimetype})`,
    );
    return reply
      .status(201)
      .send({ url: `${server.config.webUploadsUrl}/${fileName}` });
  });
};

export default protectedRoutes;
