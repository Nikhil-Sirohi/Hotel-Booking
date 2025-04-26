import { Response } from "express";
import prisma from "../models";
import { AuthenticatedRequest } from "../middleware/auth";

export const createCheckIn = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { bookingId, aadhaarNumbers } = req.body;

  // Validate input
  if (!bookingId || !aadhaarNumbers || !Array.isArray(aadhaarNumbers)) {
    return res
      .status(400)
      .json({
        error: "Booking ID and an array of Aadhaar numbers are required",
      });
  }

  // Validate each Aadhaar number format
  for (const aadhaar of aadhaarNumbers) {
    if (!/^\d{12}$/.test(aadhaar)) {
      return res
        .status(400)
        .json({
          error: `Invalid Aadhaar number: ${aadhaar}. Must be 12 digits`,
        });
    }
  }

  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Fetch the booking with numMembers
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { user: true },
    });

    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized to check into this booking" });
    }

    // Check if the number of Aadhaar numbers matches numMembers
    if (aadhaarNumbers.length !== booking.numMembers) {
      return res.status(400).json({
        error: `Expected ${booking.numMembers} Aadhaar numbers, but received ${aadhaarNumbers.length}`,
      });
    }

    // Check if there are already check-ins for this booking
    const existingCheckIns = await prisma.checkIn.count({
      where: { bookingId: booking.id },
    });

    if (existingCheckIns > 0) {
      return res
        .status(400)
        .json({ error: "Check-in already completed for this booking" });
    }

    // Create a CheckIn record for each Aadhaar number
    const checkIns = await prisma.$transaction(
      aadhaarNumbers.map((aadhaarNumber: string) =>
        prisma.checkIn.create({
          data: {
            bookingId: booking.id,
            aadhaarNumber,
          },
          include: { booking: { include: { user: true, hotel: true } } },
        })
      )
    );

    res.status(201).json(checkIns);
  } catch (error) {
    res.status(500).json({ error: "Failed to create check-in" });
  }
};

// New endpoint to fetch all check-ins for a booking
export const getCheckInsForBooking = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const bookingId = parseInt(req.params.id);

  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized to view this booking" });
    }

    const checkIns = await prisma.checkIn.findMany({
      where: { bookingId: booking.id },
      include: { booking: { include: { user: true, hotel: true } } },
    });

    res.json(checkIns);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch check-ins" });
  }
};
