import { Router, type IRouter } from "express";
import healthRouter from "./health";
import openaiRouter from "./openai";
import usersRouter from "./users";
import workoutsRouter from "./workouts";
import exercisesRouter from "./exercises";
import progressRouter from "./progress";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/openai", openaiRouter);
router.use("/users", usersRouter);
router.use("/workouts", workoutsRouter);
router.use("/exercises", exercisesRouter);
router.use("/progress", progressRouter);

export default router;
