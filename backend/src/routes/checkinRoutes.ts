import { Router } from "express";
import {
  createCheckIn,
  getCheckInsForBooking,
} from "../controllers/checkinController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post("/", authenticateToken, createCheckIn);
router.get("/booking/:id", authenticateToken, getCheckInsForBooking);

export default router;
