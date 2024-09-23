import { createOpenAI } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { dealScreenSchema } from "../../components/schemas";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const context = await req.json();
  const { fileContent, ...dealContext } = context; // Extract fileContent and remove it from context

  const openai = createOpenAI({
    // custom settings, e.g.
    apiKey: process.env.AI_API_KEY,
    compatibility: "strict", // strict mode, enable when using the OpenAI API
  });

  console.log("screening deal using openai");

  const result = await streamObject({
    model: openai("gpt-4o"),
    schema: dealScreenSchema,
    prompt: `Screen the following deal: ${dealContext} against this deal questionaire ${fileContent} and come at a conclusion whether this deal should be pursued or rejected. Provided an approval status and step by step explanation for why the deal was approved or rejected.`,
    onFinish({ usage }) {
      // your own logic, e.g. for saving the chat history or recording usage
      console.log("token consumed for this request", usage);
    },
  });

  console.log("result of screening deal using openai", result);

  return result.toTextStreamResponse();
}
