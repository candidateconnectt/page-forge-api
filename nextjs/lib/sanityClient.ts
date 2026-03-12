import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'nilp0ec1',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-01-01',
  token: process.env.SANITY_API_TOKEN
});
