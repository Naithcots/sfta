import path from 'node:path';
import * as z from 'zod';

export const uploadsDir = path.join(path.resolve('.'), 'uploads');

const variables = {
  nodeEnv: process.env.NODE_ENV,
  host: process.env.HOST,
  port: process.env.PORT,
  apiKey: process.env.API_KEY,
  webDomainUrl: process.env.WEB_DOMAIN_URL,
};

const schema = z.object({
  nodeEnv: z.enum(['development', 'production']),
  host: z.string(),
  port: z.coerce.number().int().positive().max(65535),
  apiKey: z.hex().min(32),
  webDomainUrl: z.url(),
});

export const getConfig = async () => {
  const { success, data, error } = await schema.safeParseAsync(variables);
  if (!success) {
    console.error('Configuration validation error:', error.message);
    process.exit(1);
  }
  return data;
};
