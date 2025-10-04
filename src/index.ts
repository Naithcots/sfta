import multipart from '@fastify/multipart';
import fastify from 'fastify';
import fs from 'node:fs';
import { getConfig, uploadsDir } from './configuration.js';
import protectedRoutes from './routes/protected.js';
import publicRoutes from './routes/public.js';

const config = await getConfig();

fs.mkdir(uploadsDir, (err) => {
  if (err) {
    console.log(`Upload directory already exists at ${uploadsDir}`);
  } else {
    console.log(`Upload directory created at ${uploadsDir}`);
  }
});

const server = fastify({ logger: true });
server.decorate('config', config);

server.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1,
  },
});

server.register(publicRoutes);
server.register(protectedRoutes);

server.listen(
  {
    host: config.host,
    port: config.port,
  },
  (err, address) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
    server.log.info(`Server listening at ${address}`);
  },
);
