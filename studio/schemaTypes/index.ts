import {category} from './documents/category'
import {product} from './documents/product'
import {pageHero, sectionHeading} from './objects/heading'
import {imageWithAlt} from './objects/imageWithAlt'
import {richText} from './objects/richText'
import {aboutPage} from './singletons/aboutPage'
import {homePage} from './singletons/homePage'
import {siteSettings} from './singletons/siteSettings'

export const SINGLETONS = ['siteSettings', 'homePage', 'aboutPage']

export const schemaTypes = [
  // documents
  product,
  category,
  // singletons
  siteSettings,
  homePage,
  aboutPage,
  // objects
  imageWithAlt,
  richText,
  sectionHeading,
  pageHero,
]
