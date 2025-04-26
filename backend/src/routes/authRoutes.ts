import { Router } from "express";
import { registerUser, getUserProfile } from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post("/register", registerUser);
router.get("/profile", authenticateToken, getUserProfile);

export default router;
