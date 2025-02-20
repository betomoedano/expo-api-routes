import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const responseSchema = z.object({
  title: z.string(),
  content: z.string(),
  thoughts: z.string(),
  post_rate: z.number(),
});

export async function POST(req: Request) {
  const { content } = await req.json();

  if (!content) {
    return new Response("No content provided", { status: 400 });
  }

  try {
    // Setup streaming response
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Chat stream
    const completion = openai.beta.chat.completions
      .stream({
        model: "gpt-4o-2024-11-20",
        messages: [
          {
            role: "system",
            content:
              "You are an assistant that helps improve posts for social media. You will be given a post and you will need to improve it.",
          },
          {
            role: "user",
            content: `Here is the post: ${content}`,
          },
        ],
        response_format: zodResponseFormat(responseSchema, "post"),
      })
      .on(
        "content.delta",
        async ({ snapshot, parsed }) =>
          await writer.write(encoder.encode(JSON.stringify(parsed)))
      )
      .on("content.done", async () => await writer.close());

    // Return the readable stream
    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}
