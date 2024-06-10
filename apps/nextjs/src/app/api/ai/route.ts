import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

import { auth } from "@aura/auth";

import { api } from "~/trpc/server";

type ChatResponse = {
  character: string;
  dialogue: string;
};

const formatHint = `[
  {
    "character": "Queen",
    "dialogue": "You needn't say “exactually,”",
  },
  {
    "character": "Queen",
    "dialogue": "I can believe it without that. Now I'll give you something to believe. I'm just one hundred and one, five months and a day.",
  },
]`;

const handler = auth(async (req: Request) => {
  const body = await req.json();

  if (!body.workspace_id) {
    return new Response("workspace_id is required", { status: 400 });
  }

  const works = await api.works.all({ workspace_id: body.workspace_id });

  const model = new ChatOpenAI({ model: "gpt-3.5-turbo-0125" });

  const parser = new JsonOutputParser<ChatResponse[]>();

  const res: ChatResponse[] = [];

  console.log(works);

  for (const work of works) {
    if (work.content) {
      const prompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          `
              You are an experienced editor, precise and detail-oriented, and doing stuff steb by step.
              First you will identify the dialogues in the text.
    
              Let's take this sentence for example,
    
              'You needn't say “exactually,”’ the Queen remarked: 'I can believe it without that. Now I'll give you something to believe. I'm just one hundred and one, five months and a day.'
    
              You Respond only in valid JSON. The JSON object you return should match the following schema:
    
              {formatHint}
            `,
        ],
        ["human", "{query}"],
      ]);

      const chain = prompt.pipe(model).pipe(parser);

      const response = await chain.invoke({ query: work.content, formatHint });

      console.log(response);

      res.push(...response);
    }
  }

  return new Response(JSON.stringify(res), {
    headers: {
      "Content-Type": "application/json",
    },
  });
});

export { handler as POST };
