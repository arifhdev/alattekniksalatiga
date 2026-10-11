import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { CONTENT_TAG } from "@/sanity/live";

/**
 * Called by a Sanity GROQ webhook on every publish/unpublish/delete so the prerendered
 * pages refresh even when no visitor has <SanityLive /> open at that moment.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return new Response("SANITY_REVALIDATE_SECRET is not set", { status: 500 });

  // `true` waits briefly so the Sanity CDN has the new content before we refetch it
  const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
  if (!isValidSignature) return new Response("Invalid signature", { status: 401 });

  revalidateTag(CONTENT_TAG, { expire: 0 });
  return NextResponse.json({ revalidated: CONTENT_TAG, type: body?._type ?? null });
}
