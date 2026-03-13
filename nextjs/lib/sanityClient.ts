import { createClient } from '@sanity/client';

// Use environment variables so the same code works for any project
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'nilp0ec1';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = '2023-01-01';

export const client = createClient({
  projectId,
  dataset,
  useCdn: false, // Set to false to ensure we see the ✅ status immediately
  apiVersion,
  token: process.env.SANITY_API_TOKEN,
  perspective: 'published', // Only fetch published content
});