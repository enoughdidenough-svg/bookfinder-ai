import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ docs: [] });
  if (q.length > 200) return NextResponse.json({ error: "Search query is too long." }, { status: 400 });

  const url = new URL("https://openlibrary.org/search.json");
  url.searchParams.set("q", q);
  url.searchParams.set("limit", "30");
  url.searchParams.set("fields", "key,title,author_name,first_publish_year,cover_i,ebook_access,ia,publisher");

  try {
    const response = await fetch(url, { next: { revalidate: 300 } });
    if (!response.ok) return NextResponse.json({ error: "Book search is temporarily unavailable." }, { status: 502 });
    const data = await response.json();
    return NextResponse.json({ docs: data.docs ?? [], numFound: data.numFound ?? 0 });
  } catch {
    return NextResponse.json({ error: "Could not reach the book catalog." }, { status: 502 });
  }
}
