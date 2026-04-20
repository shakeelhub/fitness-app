import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { workoutSessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  GenerateWorkoutPlanBody,
  CreateWorkoutSessionBody,
  UpdateWorkoutSessionBody,
} from "@workspace/api-zod";
import { openai, AI_MODEL } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();

router.post("/generate", async (req, res) => {
  const body = GenerateWorkoutPlanBody.parse(req.body);

  const prompt = `Design a ${body.durationMinutes}-minute ${body.fitnessLevel} workout plan targeting: ${body.targetMuscles.join(", ")}.
Goals: ${body.goals?.join(", ") || "general fitness"}.
User request: ${body.userRequest || "give me a great workout"}.

Respond with a JSON object (no markdown, raw JSON only) with this exact structure:
{
  "title": "Workout name",
  "description": "Brief description",
  "totalDurationMinutes": ${body.durationMinutes},
  "aiCoachNote": "Motivational note from the AI coach",
  "exercises": [
    {
      "name": "Exercise name",
      "sets": 3,
      "reps": 12,
      "durationSeconds": 60,
      "restSeconds": 30,
      "instructions": "How to perform this exercise properly"
    }
  ]
}

Include 4-8 exercises appropriate for the fitness level. Include warm-up and cool-down if there's time.`;

  try {
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    let plan;
    try {
      plan = JSON.parse(content);
    } catch {
      plan = {
        title: "Custom Workout",
        description: "AI-generated workout plan",
        totalDurationMinutes: body.durationMinutes,
        aiCoachNote: "Let's crush this workout! Remember: form over weight, always.",
        exercises: [
          { name: "Push-ups", sets: 3, reps: 12, restSeconds: 30, instructions: "Keep your core tight, lower chest to the ground" },
          { name: "Squats", sets: 3, reps: 15, restSeconds: 30, instructions: "Feet shoulder-width apart, go until thighs are parallel to floor" },
          { name: "Plank", sets: 3, reps: 1, durationSeconds: 30, restSeconds: 30, instructions: "Keep your body in a straight line from head to heels" },
        ],
      };
    }

    res.json(plan);
  } catch (err) {
    req.log.error({ err }, "Error generating workout");
    res.status(500).json({ error: "Failed to generate workout" });
  }
});

router.get("/sessions", async (req, res) => {
  const sessions = await db
    .select()
    .from(workoutSessionsTable)
    .orderBy(workoutSessionsTable.createdAt);
  res.json(sessions);
});

router.post("/sessions", async (req, res) => {
  const body = CreateWorkoutSessionBody.parse(req.body);
  const [session] = await db
    .insert(workoutSessionsTable)
    .values({ title: body.title, planData: body.planData })
    .returning();
  res.status(201).json(session);
});

router.get("/sessions/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [session] = await db
    .select()
    .from(workoutSessionsTable)
    .where(eq(workoutSessionsTable.id, id));
  if (!session) {
    return res.status(404).json({ error: "Not found" });
  }
  res.json(session);
});

router.patch("/sessions/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const body = UpdateWorkoutSessionBody.parse(req.body);

  const updateData: Record<string, unknown> = {};
  if (body.status !== undefined) updateData.status = body.status;
  if (body.totalReps !== undefined) updateData.totalReps = body.totalReps;
  if (body.totalSets !== undefined) updateData.totalSets = body.totalSets;
  if (body.durationMinutes !== undefined) updateData.durationMinutes = body.durationMinutes;
  if (body.caloriesBurned !== undefined) updateData.caloriesBurned = body.caloriesBurned;
  if (body.notes !== undefined) updateData.notes = body.notes;

  if (body.status === "active" && !updateData.startedAt) {
    updateData.startedAt = new Date();
  }
  if (body.status === "completed") {
    updateData.completedAt = new Date();
  }

  const [session] = await db
    .update(workoutSessionsTable)
    .set(updateData)
    .where(eq(workoutSessionsTable.id, id))
    .returning();

  if (!session) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json(session);
});

export default router;
