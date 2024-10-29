"use server";

import { streamObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createStreamableValue } from "ai/rsc";
import { z } from "zod";
import { InferDealSchemaType } from "../(main-site)/infer-deal/page";
import { InferDealSchema } from "../components/schemas/infer-deal-schema";

const openai = createOpenAI({
  // custom settings, e.g.
  apiKey: process.env.AI_API_KEY,
  compatibility: "strict", // strict mode, enable when using the OpenAI API
});

// Infer the TypeScript type from the schema

export async function inferDealFromDescription(values: InferDealSchemaType) {
  "use server";
  try {
    const stream = createStreamableValue();

    (async () => {
      const { partialObjectStream } = await streamObject({
        model: openai("gpt-4o"),
        prompt: `generated a structured schema for a deal using the schema provided and the descirpiton given -> ${values.description}`,

        schema: InferDealSchema,
      });

      for await (const partialObject of partialObjectStream) {
        stream.update(partialObject);
      }

      stream.done();
    })();

    return stream.value;
  } catch (error) {
    console.error("an error occured while trying to infer deal", error);
  }
}
