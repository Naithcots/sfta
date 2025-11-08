import * as z from 'zod';

export const constants = {
  host: '0.0.0.0',
  port: 80,
  uploadsDir: '/var/www/uploads',
};

const variables = {
  nodeEnv: process.env.NODE_ENV,
  apiKey: process.env.API_KEY,
  fileSizeLimit: process.env.FILE_SIZE_LIMIT,
};

const schema = z.object({
  nodeEnv: z.enum(['development', 'production']),
  apiKey: z.hex().min(32),
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
