import { Router } from "express";
import { createCheckIn } from "../controllers/checkinController";

const router = Router();

router.post("/checkin", createCheckIn);

export default router;
