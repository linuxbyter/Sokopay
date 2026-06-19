/** @type {import('next').NextConfig} */
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
const envPath = resolve(process.cwd(), '.env.local');
const envConfig = config({ path: envPath });
if (envConfig.error) {
  console.warn('Warning: Failed to load .env.local file', envConfig.error);
}

const nextConfig = {
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
};

export default nextConfig;
