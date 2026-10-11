import { defineLive } from "next-sanity/live";
import { client } from "./client";

// Published content only: no tokens, so nothing secret reaches the browser.
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: false,
  browserToken: false,
});

/** Tag shared by every Sanity fetch, revalidated by the publish webhook. */
export const CONTENT_TAG = "sanity-content";
