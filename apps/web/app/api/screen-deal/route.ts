import { createOpenAI as createGroq } from "@ai-sdk/openai";
import { z } from "zod";
import { JSONParseError, TypeValidationError } from "ai";
import { streamObject } from "ai";
import { dealScreenSchema } from "../../components/schemas";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const context = await req.json();
    const { fileContent, ...dealContext } = context; // Extract fileContent and remove it from context

    if (!process.env.GROQ_API_KEY) {
      return {
        type: "unknown-error",
        error: "Api key does not exist",
      };
    }

    const groq = createGroq({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY,
    });

    const result = await streamObject({
      model: groq("llama-3.1-70b-versatile"),
      schema: dealScreenSchema,
      prompt: `Screen the following deal: ${dealContext} against this deal questionaire ${fileContent} and come at a conclusion whether this deal should be pursued or rejected. Provided an approval status and an explanation for your diagnosis`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error(
      "an error occured while generating a deal screen answer from ai",
      error
    );

    if (TypeValidationError.isInstance(error)) {
      return { type: "validation-error", value: error.value };
    } else if (JSONParseError.isInstance(error)) {
      return { type: "parse-error", text: error.text };
    } else {
      return { type: "unknown-error", error };
    }
  }
}