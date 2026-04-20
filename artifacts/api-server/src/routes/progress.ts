import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { workoutSessionsTable } from "@workspace/db";
import { eq, sum, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats", async (req, res) => {
  const sessions = await db
    .select()
    .from(workoutSessionsTable)
    .orderBy(desc(workoutSessionsTable.createdAt));

  const completedSessions = sessions.filter((s) => s.status === "completed");
  const totalSessions = completedSessions.length;
  const totalReps = completedSessions.reduce((acc, s) => acc + (s.totalReps ?? 0), 0);
  const totalMinutes = completedSessions.reduce((acc, s) => acc + (s.durationMinutes ?? 0), 0);

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const today = new Date();
  const sortedByDate = [...completedSessions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const uniqueDays = new Set<string>();
  sortedByDate.forEach((s) => {
    const d = new Date(s.createdAt);
    uniqueDays.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
  });

  const dayArray = Array.from(uniqueDays).sort().reverse();
  let prevDay: Date | null = null;
  for (const dayStr of dayArray) {
    const [yr, mo, da] = dayStr.split("-").map(Number);
    const day = new Date(yr, mo, da);
    if (!prevDay) {
      tempStreak = 1;
    } else {
      const diff = (prevDay.getTime() - day.getTime()) / (1000 * 60 * 60 * 24);
      if (diff <= 1.5) {
        tempStreak++;
      } else {
        if (tempStreak > longestStreak) longestStreak = tempStreak;
        tempStreak = 1;
      }
    }
    prevDay = day;
  }
  if (tempStreak > longestStreak) longestStreak = tempStreak;

  const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const yesterdayDate = new Date(today);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = `${yesterdayDate.getFullYear()}-${yesterdayDate.getMonth()}-${yesterdayDate.getDate()}`;

  if (uniqueDays.has(todayStr) || uniqueDays.has(yesterdayStr)) {
    currentStreak = tempStreak > 0 ? tempStreak : 1;
  }

  const weeklyActivity = [];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const daySessions = completedSessions.filter((s) => {
      const sd = new Date(s.createdAt);
      return `${sd.getFullYear()}-${sd.getMonth()}-${sd.getDate()}` === dayKey;
    });
    weeklyActivity.push({
      day: days[d.getDay()],
      sessions: daySessions.length,
      minutes: daySessions.reduce((acc, s) => acc + (s.durationMinutes ?? 0), 0),
    });
  }

  const personalRecords = [
    {
      exercise: "Total Workouts",
      value: totalSessions,
      unit: "sessions",
      achievedAt: completedSessions[0]?.createdAt ?? new Date().toISOString(),
    },
    {
      exercise: "Total Reps",
      value: totalReps,
      unit: "reps",
      achievedAt: completedSessions[0]?.createdAt ?? new Date().toISOString(),
    },
    {
      exercise: "Longest Streak",
      value: longestStreak,
      unit: "days",
      achievedAt: completedSessions[0]?.createdAt ?? new Date().toISOString(),
    },
  ];

  res.json({
    totalSessions,
    totalReps,
    totalMinutes,
    currentStreak,
    longestStreak,
    personalRecords,
    weeklyActivity,
  });
});

export default router;
