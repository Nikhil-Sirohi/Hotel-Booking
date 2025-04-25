import { Request, Response } from "express";
import prisma from "../models";

export const createCheckIn = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { bookingId, aadhaarNumbers } = req.body;

  if (
    !bookingId ||
    !Array.isArray(aadhaarNumbers) ||
    aadhaarNumbers.length === 0
  ) {
    res
      .status(400)
      .json({ error: "Booking ID and Aadhaar numbers array are required" });
    return;
  }

  try {
    // Check if booking exists
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) {
      res.status(400).json({ error: "Invalid booking ID" });
      return;
    }

    if (aadhaarNumbers.length > booking.numMembers) {
      res.status(400).json({ error: "Too many Aadhaar numbers provided" });
      return;
    }

    const checkIns = await Promise.all(
      aadhaarNumbers.map((aadhaarNumber: string) =>
        prisma.checkIn.create({
          data: {
            bookingId,
            aadhaarNumber,
          },
        })
      )
    );

    res
      .status(201)
      .json({ message: "Check-in completed successfully", checkIns });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
