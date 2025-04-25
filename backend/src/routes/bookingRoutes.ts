import { Router } from "express";
import { getHotels, createBooking } from "../controllers/bookingController";

const router = Router();

router.get("/hotels", getHotels);
router.post("/book", createBooking);

export default router;
