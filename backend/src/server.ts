import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import checkinRoutes from "./routes/checkinRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/bookings", bookingRoutes);
app.use("/checkins", checkinRoutes);

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
