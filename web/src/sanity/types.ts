import type {
  CATEGORIES_QUERY_RESULT,
  PRODUCTS_QUERY_RESULT,
  SETTINGS_QUERY_RESULT,
} from "../../sanity.types";

export type ProductCardData = PRODUCTS_QUERY_RESULT[number];
export type CategoryData = CATEGORIES_QUERY_RESULT[number];
export type Settings = NonNullable<SETTINGS_QUERY_RESULT>;
export type Heading = { eyebrow: string | null; title: string | null; accent: string | null; description: string | null } | null;
