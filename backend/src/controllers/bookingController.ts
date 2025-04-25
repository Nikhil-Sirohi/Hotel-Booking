import { Request, Response } from "express";
import prisma from "../models";

export const getHotels = async (req: Request, res: Response): Promise<void> => {
  try {
    const hotels = await prisma.hotel.findMany();
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, hotelId, checkInDate, checkOutDate, numMembers } = req.body;

  if (!userId || !hotelId || !checkInDate || !checkOutDate || !numMembers) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
    if (!user || !hotel) {
      res.status(400).json({ error: "Invalid user or hotel" });
      return;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (checkIn >= checkOut) {
      res
        .status(400)
        .json({ error: "Check-out date must be after check-in date" });
      return;
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        hotelId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numMembers,
      },
    });

    res
      .status(201)
      .json({ id: booking.id, message: "Booking created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
