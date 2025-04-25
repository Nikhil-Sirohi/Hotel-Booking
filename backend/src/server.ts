import express, { Express, Request, Response } from "express";
import authRoutes from "./routes/authRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import checkinRoutes from "./routes/checkinRoutes";

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || "5000");

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hotel Booking API");
});
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/checkin", checkinRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
