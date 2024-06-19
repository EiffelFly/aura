import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import OpenAI from "openai";
import { z } from "zod";

import { auth } from "@aura/auth";
import { TDialogue } from "@aura/db/schema";

import { api } from "~/trpc/server";
import { systemPrompt } from "./_prompt";

const DialogueSchema = z.object({
  character: z.string(),
  dialogue: z.string(),
});

const ChatResponseFromModelSchema = z.object({
  dialogues: z.array(DialogueSchema),
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const handler = auth(async (req: Request) => {
  const body = await req.json();

  if (!body.workspace_id) {
    return new Response("workspace_id is required", { status: 400 });
  }

  const works = await api.works.all({ workspace_id: body.workspace_id });
  const characters = await api.characters.all({
    workspace_id: body.workspace_id,
  });

  const dialogues: TDialogue[] = [];

  for (const work of works) {
    if (work.content && !work.processed) {
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 3000,
        chunkOverlap: 0,
        separators: ['"', "'", "\n\n", "\n", " ", ""],
      });

      const documents = await splitter.splitText(work.content);

      const newVersion = work.latest_version + 1;

      const totalResponses: z.infer<typeof DialogueSchema>[] = [];

      for (const doc of documents) {
        const chatCompletion = await openai.chat.completions.create({
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: `${doc}`,
            },
          ],
          model: "gpt-4o",
          top_p: 1,
          temperature: 0.5,
          presence_penalty: 0,
          stream: false,
          max_tokens: 4096,
          response_format: {
            type: "json_object",
          },
        });

        if (!chatCompletion.choices[0]?.message.content) {
          return new Response("Error with model response", {
            status: 500,
          });
        }

        let parsedResponse: z.infer<typeof ChatResponseFromModelSchema> | null =
          null;

        try {
          parsedResponse = ChatResponseFromModelSchema.parse(
            JSON.parse(chatCompletion.choices[0]?.message.content),
          );
        } catch (error) {
          console.error(error);
          return new Response("Error with parsing model response", {
            status: 500,
          });
        }

        if (!parsedResponse) {
          return new Response("Error with parsing model response", {
            status: 500,
          });
        }

        totalResponses.push(...parsedResponse.dialogues);
      }

      // Create new work version
      const workVersion = await api.work_version.create({
        work_id: work.id,
        version: newVersion,
        content: work.content,
      });

      await api.works.update({ work_id: work.id, latest_version: newVersion });

      for (const r of totalResponses) {
        const targetCharacter = characters.find((c) => c.name === r.character);
        const dialogueStart = work.content.indexOf(r.dialogue);

        if (targetCharacter) {
          if (workVersion[0]) {
            const dialogue = await api.dialogues.create({
              workspace_id: body.workspace_id,
              work_id: work.id,
              start_at: dialogueStart,
              end_at: dialogueStart + r.dialogue.length - 1,
              character_id: targetCharacter.id,
              work_version_id: workVersion[0].id,
              content: r.dialogue,
            });
            if (dialogue[0]) {
              dialogues.push(dialogue[0]);
            }
          }
        } else {
          const newCharacter = await api.characters.create({
            name: r.character,
            workspace_id: body.workspace_id,
          });
          if (newCharacter[0] && workVersion[0]) {
            const dialogue = await api.dialogues.create({
              workspace_id: body.workspace_id,
              work_id: work.id,
              start_at: dialogueStart,
              end_at: dialogueStart + r.dialogue.length - 1,
              character_id: newCharacter[0].id,
              work_version_id: workVersion[0].id,
              content: r.dialogue,
            });
            if (dialogue[0]) {
              dialogues.push(dialogue[0]);
            }
          }
        }
      }

      return new Response(JSON.stringify(dialogues), { status: 200 });
    }
  }
});

export { handler as POST };
