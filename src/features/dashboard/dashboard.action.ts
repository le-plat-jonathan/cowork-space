"use server";

import { getRequiredUser } from "@/lib/auth/auth-user";
import prisma from "@/lib/prisma";

export async function getDashboardData() {
  const user = await getRequiredUser();
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const [upcomingReservations, todayCount] = await Promise.all([
    prisma.reservation.findMany({
      where: {
        id_user: user.id,
        status: { not: "canceled" },
        startTime: { gte: now },
      },
      orderBy: { startTime: "asc" },
      take: 5,
    }),
    prisma.reservation.count({
      where: {
        id_user: user.id,
        status: { not: "canceled" },
        startTime: { gte: todayStart },
        endTime: { lte: todayEnd },
      },
    }),
  ]);

  const spaceIds = [...new Set(upcomingReservations.map((r) => r.id_space))];
  const spaces =
    spaceIds.length > 0
      ? await prisma.space.findMany({
          where: { id_espace: { in: spaceIds } },
          select: { id_espace: true, nom: true, type: true },
        })
      : [];

  const spaceMap = new Map(spaces.map((s) => [s.id_espace, s]));

  const reservationsWithSpace = upcomingReservations.map((r) => ({
    ...r,
    space: spaceMap.get(r.id_space) ?? null,
  }));

  return {
    upcomingReservations: reservationsWithSpace,
    nextReservation: reservationsWithSpace[0] ?? null,
    todayCount,
  };
}
