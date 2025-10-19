// Low-level function posting a single chat message and returning the answer string.
export async function sendChatMessage(message: string): Promise<string> {
  const res = await fetch("http://localhost:4000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Chat API error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return typeof data.answer === "string" ? data.answer : JSON.stringify(data);
}

// SWR mutation fetcher signature helper
export async function chatFetcher(
  _key: string,
  { arg }: { arg: { message: string } }
) {
  return sendChatMessage(arg.message);
}
