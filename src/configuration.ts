import * as z from 'zod';

const variables = {
  nodeEnv: process.env.NODE_ENV,
  host: process.env.HOST,
  port: process.env.PORT,
  apiKey: process.env.API_KEY,
  uploadsDir: process.env.UPLOADS_DIR,
  webUploadsUrl: process.env.WEB_UPLOADS_URL,
  fileSizeLimit: process.env.FILE_SIZE_LIMIT,
};

const schema = z.object({
  nodeEnv: z.enum(['development', 'production']),
  host: z.string(),
  port: z.coerce.number().positive().max(65535),
  apiKey: z.hex().min(32),
  uploadsDir: z.string(),
  webUploadsUrl: z.url(),
  fileSizeLimit: z.coerce.number().positive(),
});

export const getConfig = async () => {
  const { success, data, error } = await schema.safeParseAsync(variables);
  if (!success) {
    console.error('Configuration validation error:', error.message);
    process.exit(1);
  }
  return data;
};
