"use server";

import { getRequiredUser } from "@/lib/auth/auth-user";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const getUserReservations = async () => {
  const user = await getRequiredUser();

  const reservations = await prisma.reservation.findMany({
    where: { id_user: user.id },
    orderBy: { startTime: "asc" },
  });

  return reservations;
};

export const getSpaces = async () => {
  const spaces = await prisma.space.findMany({
    orderBy: { nom: "asc" },
  });

  return spaces;
};

export const createReservation = async (data: {
  id_space: string;
  startTime: string;
  endTime: string;
  reason?: string;
}) => {
  const user = await getRequiredUser();

  const start = new Date(data.startTime);
  const end = new Date(data.endTime);

  if (end <= start) {
    throw new Error("La date de fin doit être après la date de début");
  }

  // Vérifier les conflits de réservation sur cet espace
  const conflict = await prisma.reservation.findFirst({
    where: {
      id_space: data.id_space,
      status: { not: "canceled" },
      startTime: { lt: end },
      endTime: { gt: start },
    },
  });

  if (conflict) {
    throw new Error("Cet espace est déjà réservé sur ce créneau");
  }

  const reservation = await prisma.reservation.create({
    data: {
      id_user: user.id,
      id_space: data.id_space,
      startTime: start,
      endTime: end,
      reason: data.reason || null,
      status: "confirmed",
    },
  });

  revalidatePath("/app/bookings");

  return reservation;
};