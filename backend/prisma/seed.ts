import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await prisma.user.create({
    data: { email: "user1@example.com", password: hashedPassword },
  });

  const hotel1 = await prisma.hotel.create({
    data: {
      name: "Hotel Paradise",
      location: "Mumbai",
      description: "Luxury hotel with sea view",
    },
  });

  const hotel2 = await prisma.hotel.create({
    data: {
      name: "Mountain Retreat",
      location: "Shimla",
      description: "Cozy resort in the hills",
    },
  });

  const booking = await prisma.booking.create({
    data: {
      userId: user.id,
      hotelId: hotel1.id,
      checkInDate: new Date("2025-05-01"),
      checkOutDate: new Date("2025-05-05"),
      numMembers: 2,
    },
  });

  await prisma.checkIn.create({
    data: {
      bookingId: booking.id,
      aadhaarNumber: "123456789012",
    },
  });

  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
