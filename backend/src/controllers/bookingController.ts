import { Request, Response } from "express";
import prisma from "../models";
import { AuthenticatedRequest } from "../middleware/auth";

export const createBooking = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { hotelId, checkInDate, checkOutDate, numMembers } = req.body;
  if (!hotelId || !checkInDate || !checkOutDate || !numMembers) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (new Date(checkInDate) >= new Date(checkOutDate)) {
    return res
      .status(400)
      .json({ error: "Check-out date must be after check-in date" });
  }
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });

    const booking = await prisma.booking.create({
      data: {
        userId: req.user.id, // Safe after check
        hotelId,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        numMembers,
      },
      include: { user: true, hotel: true, checkIns: true },
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: "Failed to create booking" });
  }
};

export const getBooking = async (req: AuthenticatedRequest, res: Response) => {
  const bookingId = parseInt(req.params.id);
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { user: true, hotel: true, checkIns: true },
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.userId !== req.user.id) {
      // Safe after check
      return res
        .status(403)
        .json({ error: "Unauthorized to view this booking" });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch booking" });
  }
};

export const getHotelOccupancy = async (req: Request, res: Response) => {
  const hotelId = parseInt(req.params.id);
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
      include: {
        bookings: {
          include: { user: true, checkIns: true },
        },
      },
    });
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotel occupancy" });
  }
};

export const getAllHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await prisma.hotel.findMany({
      include: {
        bookings: {
          include: { user: true, checkIns: true },
        },
      },
    });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
};
