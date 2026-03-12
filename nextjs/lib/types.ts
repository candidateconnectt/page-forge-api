export interface Page {
  _id?: string
  title: string
  body: string
  image_url?: string
  seo_description?: string
  category?: string
  slug: {
    current: string
  }
}

export interface SectionContent {
  type: 'hero' | 'features' | 'content' | 'cta' | 'testimonial'
  title?: string
  description?: string
  content?: string
  image?: string
  items?: FeatureItem[]
}

export interface FeatureItem {
  title: string
  description: string
  icon?: string
}

export interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  message: string
}
