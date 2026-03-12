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

export const getSpacesWithReservations = async () => {
  const now = new Date();

  const spaces = await prisma.space.findMany({
    orderBy: { nom: "asc" },
  });

  // Réservations actives en ce moment
  const reservations = await prisma.reservation.findMany({
    where: {
      status: { not: "canceled" },
      startTime: { lte: now },
      endTime: { gte: now },
    },
  });

  // Récupérer les users qui ont réservé
  const userIds = [...new Set(reservations.map((r) => r.id_user))];
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, image: true },
  });
  const usersMap = new Map(users.map((u) => [u.id, u]));

  return spaces.map((space) => {
    const reservation = reservations.find((r) => r.id_space === space.id_espace);
    const user = reservation ? usersMap.get(reservation.id_user) : null;

    return {
      ...space,
      reservation: reservation
        ? {
            id: reservation.id_reservation,
            userId: reservation.id_user,
            userName: user?.name ?? "Inconnu",
            userImage: user?.image ?? null,
            startTime: reservation.startTime.toISOString(),
            endTime: reservation.endTime.toISOString(),
          }
        : null,
    };
  });
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