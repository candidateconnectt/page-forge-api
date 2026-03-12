import {DocumentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const pageType = defineType({
  name: 'page', // This MUST be 'page' to match your data
  title: 'Forged Pages',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ 
      name: 'slug', 
      type: 'slug', 
      options: { source: 'title' } 
    }),
    defineField({ name: 'category', type: 'string' }),
    defineField({ name: 'image_url', type: 'url', title: 'External Image URL' }),
    defineField({ name: 'body', type: 'text' }),
    defineField({ name: 'seo_description', type: 'string' }),
  ],
})