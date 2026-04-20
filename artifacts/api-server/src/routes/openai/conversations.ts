import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { conversations as conversationsTable, messages as messagesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateOpenaiConversationBody,
  SendOpenaiMessageBody,
} from "@workspace/api-zod";
import { openai, AI_MODEL } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();

const FITNESS_SYSTEM_PROMPT = `You are an elite AI personal trainer and fitness coach named APEX. You are the user's personal trainer in a cutting-edge fitness app for Gen Z men.

Your personality:
- Energetic, motivating, and direct — like a high-end personal trainer
- Knowledgeable about exercise science, nutrition, and performance
- Supportive but challenging — you push users beyond their comfort zone
- You use modern language but stay professional

Your capabilities:
- Design personalized workout plans based on user goals and fitness level
- Guide users through exercises with precise technique cues
- Count reps and sets verbally when users ask
- Adapt workouts on the fly based on user feedback ("I'm tired", "that's too easy")
- Answer questions about form, nutrition, recovery, and fitness science
- Provide real-time motivational coaching during workouts

When a user asks for a workout:
- Always ask about their goal (strength, cardio, weight loss, muscle gain) if not specified
- Design progressive, effective workouts
- Give clear, numbered exercise instructions
- Include warm-up and cool-down recommendations

Keep responses concise and energetic. Use formatting sparingly — this is a voice-first app.`;

router.get("/", async (req, res) => {
  const conversations = await db
    .select()
    .from(conversationsTable)
    .orderBy(conversationsTable.createdAt);
  res.json(conversations);
});

router.post("/", async (req, res) => {
  const body = CreateOpenaiConversationBody.parse(req.body);
  const [conversation] = await db
    .insert(conversationsTable)
    .values({ title: body.title })
    .returning();
  res.status(201).json(conversation);
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [conversation] = await db
    .select()
    .from(conversationsTable)
    .where(eq(conversationsTable.id, id));
  if (!conversation) {
    return res.status(404).json({ error: "Not found" });
  }
  const msgs = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, id))
    .orderBy(messagesTable.createdAt);
  res.json({ ...conversation, messages: msgs });
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [deleted] = await db
    .delete(conversationsTable)
    .where(eq(conversationsTable.id, id))
    .returning();
  if (!deleted) {
    return res.status(404).json({ error: "Not found" });
  }
  res.status(204).end();
});

router.get("/:id/messages", async (req, res) => {
  const id = parseInt(req.params.id);
  const msgs = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, id))
    .orderBy(messagesTable.createdAt);
  res.json(msgs);
});

router.post("/:id/messages", async (req, res) => {
  const id = parseInt(req.params.id);
  const body = SendOpenaiMessageBody.parse(req.body);

  const [conversation] = await db
    .select()
    .from(conversationsTable)
    .where(eq(conversationsTable.id, id));
  if (!conversation) {
    return res.status(404).json({ error: "Not found" });
  }

  await db.insert(messagesTable).values({
    conversationId: id,
    role: "user",
    content: body.content,
  });

  const allMessages = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, id))
    .orderBy(messagesTable.createdAt);

  const chatMessages = allMessages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullResponse = "";

  try {
    const stream = await openai.chat.completions.create({
      model: AI_MODEL,
      max_tokens: 8192,
      messages: [
        { role: "system", content: FITNESS_SYSTEM_PROMPT },
        ...chatMessages,
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    await db.insert(messagesTable).values({
      conversationId: id,
      role: "assistant",
      content: fullResponse,
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    req.log.error({ err }, "Error streaming chat");
    res.write(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`);
    res.end();
  }
});

export default router;
