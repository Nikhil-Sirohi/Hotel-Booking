import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../models";
import { AuthenticatedRequest } from "../middleware/auth"; // Add this import

const JWT_SECRET = process.env.JWT_SECRET || "your-secure-secret-key";

export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ user: { id: user.id, email: user.email }, token });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
};

export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        bookings: {
          include: { hotel: true, checkIns: true },
        },
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};
