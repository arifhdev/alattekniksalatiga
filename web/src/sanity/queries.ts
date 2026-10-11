import { defineQuery } from "next-sanity";

const IMAGE = /* groq */ `{
  alt,
  hotspot,
  crop,
  asset->{ _id, url, metadata { lqip, dimensions { width, height } } }
}`;

const PRODUCT_CARD = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  mainImage ${IMAGE},
  "category": category->{ name, title, "slug": slug.current }
`;

// photographed products first, then newest
const PRODUCT_ORDER = /* groq */ `order(defined(mainImage) desc, publishedAt desc, title asc)`;

const HEADING = /* groq */ `{ eyebrow, title, accent, description }`;
const HERO = /* groq */ `{ eyebrow, title, accent, description, image ${IMAGE} }`;

export const SETTINGS_QUERY = defineQuery(`*[_id == "siteSettings"][0]{
  name,
  legalName,
  description,
  footerText,
  since,
  brands,
  phones,
  whatsapp[]{ _key, label, number, display },
  email,
  address { street, city, region },
  geo { lat, lng },
  mapEmbedUrl,
  cta ${HEADING}
}`);

export const CATEGORIES_QUERY = defineQuery(`*[_type == "category" && defined(slug.current)] | order(order asc){
  _id,
  title,
  name,
  "slug": slug.current,
  description,
  image ${IMAGE},
  "count": count(*[_type == "product" && references(^._id)])
}`);

export const PRODUCTS_QUERY = defineQuery(`*[_type == "product" && defined(slug.current)] | ${PRODUCT_ORDER}{
  ${PRODUCT_CARD}
}`);

export const PRODUCT_SLUGS_QUERY = defineQuery(
  `*[_type == "product" && defined(slug.current)]{ "slug": slug.current }`,
);

export const PRODUCT_QUERY = defineQuery(`*[_type == "product" && slug.current == $slug][0]{
  ${PRODUCT_CARD},
  gallery[]{ _key, ...${IMAGE} },
  body,
  specs[]{ _key, label, value },
  "related": *[_type == "product" && category._ref == ^.category._ref && _id != ^._id] | ${PRODUCT_ORDER}[0...4]{
    ${PRODUCT_CARD}
  }
}`);

export const CATEGORY_SLUGS_QUERY = defineQuery(
  `*[_type == "category" && defined(slug.current)]{ "slug": slug.current }`,
);

export const CATEGORY_QUERY = defineQuery(`*[_type == "category" && slug.current == $slug][0]{
  _id,
  title,
  name,
  "slug": slug.current,
  description,
  image ${IMAGE},
  "products": *[_type == "product" && references(^._id)] | ${PRODUCT_ORDER}{
    ${PRODUCT_CARD}
  }
}`);

export const HOME_QUERY = defineQuery(`*[_id == "homePage"][0]{
  hero ${HERO},
  stats[]{ _key, value, label },
  pillars[]{ _key, title, text },
  categoriesHeading ${HEADING},
  latestHeading ${HEADING},
  servicesHeading ${HEADING},
  services[]->{ ${PRODUCT_CARD} },
  aboutHeading ${HEADING},
  aboutImage ${IMAGE},
  "latest": *[_type == "category" && defined(slug.current)] | order(order asc){
    _id,
    title,
    "slug": slug.current,
    "products": *[_type == "product" && references(^._id)] | ${PRODUCT_ORDER}[0...4]{
      ${PRODUCT_CARD}
    }
  }
}`);

export const ABOUT_QUERY = defineQuery(`*[_id == "aboutPage"][0]{
  hero ${HERO},
  quote,
  story[]{ _key, question, answer },
  photos[]{ _key, ...${IMAGE} },
  rangeHeading ${HEADING},
  productRange
}`);
