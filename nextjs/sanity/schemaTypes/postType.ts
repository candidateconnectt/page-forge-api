import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: {type: 'author'},
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        })
      ]
    }),
    defineField({
      name: 'categories',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: {type: 'category'}})],
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
    }),
    
    // --- AUTOMATION & SEO FIELDS ---
    defineField({
      name: 'seo_description',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      description: 'Must be 50-160 characters. Validated automatically.',
    }),
    defineField({
      name: 'validation_status',
      title: 'Automation Status',
      type: 'string',
      readOnly: true, // Prevents manual editing
      initialValue: '⏳ Awaiting first publish...',
      description: 'The result of the FastAPI validation check.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      status: 'validation_status',
    },
    prepare(selection) {
      const {author, status} = selection
      return {
        ...selection, 
        subtitle: `${status || 'New'} ${author ? `by ${author}` : ''}`
      }
    },
  },
})