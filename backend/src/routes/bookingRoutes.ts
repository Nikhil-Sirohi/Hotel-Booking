import { Router } from "express";
import {
  createBooking,
  getBooking,
  getHotelOccupancy,
  getAllHotels,
} from "../controllers/bookingController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/hotels", authenticateToken, getAllHotels);
router.get("/hotels/:id", authenticateToken, getHotelOccupancy);
router.post("/", authenticateToken, createBooking);
router.get("/:id", authenticateToken, getBooking);

export default router;
