import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { client } from '../lib/sanityClient'
import { pages } from './pageData'

async function debugConfig() {
  console.log("🔍 Debugging Sanity Client Config:")
  console.log("Project ID:", client.config().projectId)
  console.log("Dataset:", client.config().dataset)
  console.log("API Version:", client.config().apiVersion)
  console.log("Token (first 6 chars):", process.env.SANITY_API_TOKEN?.slice(0, 6) || "undefined")
}

async function seedPages() {
  await debugConfig()

  for (const page of pages) {
    try {
      await client.createOrReplace(page) // ✅ overwrite if exists
      console.log(`✅ Synced page: ${page.title}`)
    } catch (err: any) {
      console.error(`❌ Error syncing page: ${page.title}`, err.message)
      if (err.responseBody) {
        console.error("Response body:", err.responseBody)
      }
    }
  }

  // 📊 Count how many pages exist after seeding
  const total = await client.fetch('count(*[_type == "page"])')
  console.log(`📊 Total pages in dataset: ${total}`)
}

async function cleanup() {
  const oldDocs = await client.fetch(`*[_type == "page" && image_url match "https://example.com/*"]{_id}`)
  for (const doc of oldDocs) {
    await client.delete(doc._id)
    console.log(`🗑 Deleted old doc: ${doc._id}`)
  }
}

cleanup()
seedPages()
  .then(() => console.log('✅ All pages synced!'))
  .catch(err => console.error("❌ Script failed:", err.message))
