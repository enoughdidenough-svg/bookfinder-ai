export async function POST(request: Request) {
  let body: { topic?: string; question?: string };
  try { body = await request.json(); } catch { return Response.json({ message: "Invalid request." }, { status: 400 }); }
  const topic = body.topic?.trim() || "";
  const question = body.question?.trim() || "";
  if (!topic && !question) return Response.json({ message: "Add a topic or question." }, { status: 400 });
  if (topic.length > 500 || question.length > 4000) return Response.json({ message: "Input is too long." }, { status: 400 });

  // Provider-neutral server contract. A production AI provider can be connected through
  // BOOKFINDER_AI_API_URL and BOOKFINDER_AI_API_KEY without exposing credentials to the browser.
  const endpoint = process.env.BOOKFINDER_AI_API_URL;
  const key = process.env.BOOKFINDER_AI_API_KEY;
  if (!endpoint || !key) return Response.json({ message: "AI provider is not configured yet. The research workspace is ready for a secure server-side AI connection." }, { status: 503 });

  try {
    const response = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${key}` }, body: JSON.stringify({ topic, question, instructions: "Give a concise, source-aware educational response. Distinguish facts from inference, encourage checking primary sources, and do not fabricate citations." }), cache: "no-store" });
    if (!response.ok) return Response.json({ message: "The AI research provider returned an error." }, { status: 502 });
    const data = await response.json();
    const answer = data.answer ?? data.output ?? data.text ?? data.result;
    if (typeof answer !== "string") return Response.json({ message: "The AI provider returned an unsupported response." }, { status: 502 });
    return Response.json({ answer });
  } catch { return Response.json({ message: "Could not reach the AI research provider." }, { status: 502 }); }
}
