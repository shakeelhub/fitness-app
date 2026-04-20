import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpsertUserProfileBody } from "@workspace/api-zod";

const router: IRouter = Router();

const DEFAULT_USER_ID = 1;

router.get("/profile", async (req, res) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, DEFAULT_USER_ID));

  if (!user) {
    return res.status(404).json({ error: "Profile not found" });
  }

  res.json(user);
});

router.post("/profile", async (req, res) => {
  const body = UpsertUserProfileBody.parse(req.body);

  const [existing] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, DEFAULT_USER_ID));

  if (existing) {
    const [updated] = await db
      .update(usersTable)
      .set({
        name: body.name,
        age: body.age,
        fitnessLevel: body.fitnessLevel,
        goals: body.goals ?? [],
        preferredWorkouts: body.preferredWorkouts ?? [],
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, DEFAULT_USER_ID))
      .returning();
    return res.json(updated);
  }

  const [created] = await db
    .insert(usersTable)
    .values({
      name: body.name,
      age: body.age,
      fitnessLevel: body.fitnessLevel,
      goals: body.goals ?? [],
      preferredWorkouts: body.preferredWorkouts ?? [],
    })
    .returning();

  res.json(created);
});

export default router;
