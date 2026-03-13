"use server";

import { getRequiredUser } from "@/lib/auth/auth-user";
import prisma from "@/lib/prisma";

export const getAllReservations = async () => {
  const user = await getRequiredUser();

  if (user.role !== "ADMIN") {
    console.error("Accès refusé : admin uniquement");
    return null;
  }

  return await prisma.reservation.findMany({
    orderBy: { startTime: "asc" },
    include: {
      user: true,
      space: true,
      participants: true,
    },
  });
};

export const getReservationsBySpace = async (spaceId: string) => {
  const user = await getRequiredUser();

  if (user.role !== "ADMIN") {
    console.error("Accès refusé : admin uniquement");
    return null;
  }

  const space = await prisma.space.findUnique({
    where: { id_espace: spaceId },
  });

  if (!space) {
    console.error("Space introuvable");
    return null;
  }

  return await prisma.reservation.findMany({
    where: { id_space: spaceId },
    orderBy: { startTime: "asc" },
    include: {
      user: true,
      participants: true,
    },
  });
};

export const updateSpaceStatus = async (
  spaceId: string,
  status: "available" | "unavailable"
) => {
  const user = await getRequiredUser();

  if (user.role !== "ADMIN") {
    console.error("Accès refusé : admin uniquement");
    return false;
  }

  const space = await prisma.space.findUnique({
    where: { id_espace: spaceId },
  });

  if (!space) {
    console.error("Space introuvable");
    return false;
  }

  await prisma.space.update({
    where: { id_espace: spaceId },
    data: { status },
  });

  return true;
};