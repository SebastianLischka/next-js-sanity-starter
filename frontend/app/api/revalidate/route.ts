import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type RevalidateWebhookBody = {
  _type?: string;
  slug?: {
    current?: string;
  };
  language?: string;
};

const GLOBAL_TYPES = new Set(["settings", "navigation"]);

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      { message: "Missing SANITY_REVALIDATE_SECRET" },
      { status: 500 },
    );
  }

  const { body, isValidSignature } =
    await parseBody<RevalidateWebhookBody>(request, secret);

  if (!isValidSignature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  const docType = body?._type ?? "";
  const slug = body?.slug?.current ?? "";
  const locale = body?.language ?? "";

  // Always refresh global entry points that commonly depend on shared content.
  revalidatePath("/");
  revalidatePath("/blog");

  if (locale) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/blog`);
  }

  if (GLOBAL_TYPES.has(docType)) {
    return NextResponse.json({
      revalidated: true,
      kind: "global",
      type: docType,
    });
  }

  if (docType === "page" && slug) {
    if (slug === "index") {
      if (locale) {
        revalidatePath(`/${locale}`);
      }

      return NextResponse.json({
        revalidated: true,
        kind: "page-index",
        locale: locale || null,
      });
    }

    revalidatePath(`/${slug}`);
    if (locale) {
      revalidatePath(`/${locale}/${slug}`);
    }

    return NextResponse.json({
      revalidated: true,
      kind: "page",
      slug,
      locale: locale || null,
    });
  }

  if (docType === "post" && slug) {
    revalidatePath(`/blog/${slug}`);
    if (locale) {
      revalidatePath(`/${locale}/blog/${slug}`);
    }

    return NextResponse.json({
      revalidated: true,
      kind: "post",
      slug,
      locale: locale || null,
    });
  }

  return NextResponse.json({
    revalidated: true,
    kind: "fallback",
    type: docType || null,
  });
}
