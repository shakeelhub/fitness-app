import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { exercisesTable } from "@workspace/db";

const router: IRouter = Router();

const SEED_EXERCISES = [
  {
    name: "Push-ups",
    muscleGroup: "chest",
    difficulty: "beginner" as const,
    description: "Classic upper body strength exercise",
    instructions: [
      "Start in a high plank position with hands shoulder-width apart",
      "Lower your chest toward the floor, keeping elbows at 45 degrees",
      "Push back up to starting position",
      "Keep your core engaged throughout the movement",
    ],
    repsDefault: 12,
    setsDefault: 3,
  },
  {
    name: "Squats",
    muscleGroup: "legs",
    difficulty: "beginner" as const,
    description: "Fundamental lower body strength exercise",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Lower your hips back and down as if sitting in a chair",
      "Go until thighs are parallel to the floor",
      "Drive through heels to return to standing",
    ],
    repsDefault: 15,
    setsDefault: 3,
  },
  {
    name: "Plank",
    muscleGroup: "core",
    difficulty: "beginner" as const,
    description: "Core stability and endurance exercise",
    instructions: [
      "Start in a forearm plank position",
      "Keep your body in a straight line from head to heels",
      "Engage your core and glutes",
      "Hold for the specified time",
    ],
    durationSeconds: 30,
    setsDefault: 3,
  },
  {
    name: "Pull-ups",
    muscleGroup: "back",
    difficulty: "intermediate" as const,
    description: "Upper body pulling strength exercise",
    instructions: [
      "Hang from the bar with an overhand grip, slightly wider than shoulder-width",
      "Pull your chest up to the bar",
      "Lower yourself with control",
      "Avoid swinging or using momentum",
    ],
    repsDefault: 8,
    setsDefault: 3,
  },
  {
    name: "Burpees",
    muscleGroup: "full body",
    difficulty: "intermediate" as const,
    description: "High-intensity full body cardio exercise",
    instructions: [
      "Start standing, drop your hands to the floor",
      "Jump your feet back to a push-up position",
      "Do one push-up",
      "Jump your feet forward and explosively jump up with arms overhead",
    ],
    repsDefault: 10,
    setsDefault: 3,
  },
  {
    name: "Dips",
    muscleGroup: "triceps",
    difficulty: "intermediate" as const,
    description: "Tricep and chest strengthening exercise",
    instructions: [
      "Place hands on parallel bars or a bench",
      "Lower yourself until elbows are at 90 degrees",
      "Press back up to full arm extension",
      "Lean slightly forward to emphasize chest",
    ],
    repsDefault: 10,
    setsDefault: 3,
  },
  {
    name: "Deadlifts",
    muscleGroup: "posterior chain",
    difficulty: "advanced" as const,
    description: "Compound posterior chain strength movement",
    instructions: [
      "Stand with feet hip-width apart, barbell over mid-foot",
      "Hinge at hips and grip the bar just outside your legs",
      "Drive through the floor, keeping bar close to body",
      "Lock out at the top with hips and knees fully extended",
    ],
    repsDefault: 5,
    setsDefault: 4,
  },
  {
    name: "Lunges",
    muscleGroup: "legs",
    difficulty: "beginner" as const,
    description: "Unilateral leg strength and balance exercise",
    instructions: [
      "Stand tall with feet together",
      "Step forward with one foot",
      "Lower your back knee toward the floor",
      "Push back up and alternate legs",
    ],
    repsDefault: 12,
    setsDefault: 3,
  },
  {
    name: "Mountain Climbers",
    muscleGroup: "core",
    difficulty: "beginner" as const,
    description: "Dynamic core and cardio exercise",
    instructions: [
      "Start in a high plank position",
      "Drive one knee toward your chest",
      "Quickly switch legs in a running motion",
      "Keep your hips level throughout",
    ],
    durationSeconds: 30,
    setsDefault: 3,
  },
  {
    name: "Box Jumps",
    muscleGroup: "legs",
    difficulty: "intermediate" as const,
    description: "Explosive plyometric leg power exercise",
    instructions: [
      "Stand in front of a sturdy box or platform",
      "Bend your knees and swing your arms back",
      "Explosively jump onto the box, landing softly",
      "Step back down with control",
    ],
    repsDefault: 8,
    setsDefault: 3,
  },
];

router.get("/", async (req, res) => {
  let exercises = await db.select().from(exercisesTable);

  if (exercises.length === 0) {
    await db.insert(exercisesTable).values(SEED_EXERCISES);
    exercises = await db.select().from(exercisesTable);
  }

  res.json(exercises);
});

export default router;
