import { type SchemaTypeDefinition } from 'sanity'
import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'
import {pageType} from './pageType' // 1. Import it here

export const schema: { types: SchemaTypeDefinition[] } = {
  // 2. Add pageType to this list
  types: [blockContentType, categoryType, postType, authorType, pageType],
}