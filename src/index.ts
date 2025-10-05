import multipart from '@fastify/multipart';
import fastify from 'fastify';
import fs from 'node:fs/promises';
import os from 'node:os';
import { getConfig } from './configuration.js';
import protectedRoutes from './routes/protected.js';

const config = await getConfig();

try {
  await fs.access(config.uploadsDir, fs.constants.R_OK | fs.constants.W_OK);
  console.log(`Upload directory access permissions correct!`);
} catch (error) {
  const { username } = os.userInfo();
  console.log(
    `Unable to access the upload directory!\n${error}\nPlease ensure that it exists and is readable and writable by the "${username}".`,
  );
  process.exit(1);
}

const server = fastify({ logger: true });
server.decorate('config', config);

server.register(multipart, {
  limits: {
    fileSize: config.fileSizeLimit,
    files: 1,
  },
});

server.register(protectedRoutes);

server.listen(
  {
    host: config.host,
    port: config.port,
  },
  (err) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
  },
);
