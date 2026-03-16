"use server";

import { getRequiredUser } from "@/lib/auth/auth-user";
import prisma from "@/lib/prisma";

export async function getPendingInvitations() {
  const user = await getRequiredUser();

  const participations = await prisma.reservationParticipant.findMany({
    where: { id_user: user.id, status: "pending" },
    select: { id_reservation: true },
  });

  if (participations.length === 0) return [];

  const reservationIds = participations.map((p) => p.id_reservation);

  const reservations = await prisma.reservation.findMany({
    where: { id_reservation: { in: reservationIds }, status: { not: "canceled" } },
    select: { id_reservation: true, startTime: true, endTime: true, reason: true, id_space: true },
  });

  const spaceIds = [...new Set(reservations.map((r) => r.id_space))];
  const spaces = await prisma.space.findMany({
    where: { id_espace: { in: spaceIds } },
    select: { id_espace: true, nom: true },
  });
  const spaceMap = new Map(spaces.map((s) => [s.id_espace, s]));

  return reservations.map((r) => ({
    ...r,
    space: spaceMap.get(r.id_space) ?? null,
  }));
}

export async function getDashboardData() {
  const user = await getRequiredUser();
  const now = new Date();

  const [upcomingReservations] = await Promise.all([
    prisma.reservation.findMany({
      where: {
        id_user: user.id,
        status: { not: "canceled" },
        startTime: { gte: now },
      },
      orderBy: { startTime: "asc" },
      take: 5,
    }),
  ]);

  const reservationIds = upcomingReservations.map((r) => r.id_reservation);
  const spaceIds = [...new Set(upcomingReservations.map((r) => r.id_space))];

  const [spaces, rawParticipants, allSpaces] = await Promise.all([
    spaceIds.length > 0
      ? prisma.space.findMany({
          where: { id_espace: { in: spaceIds } },
          select: { id_espace: true, nom: true, type: true },
        })
      : Promise.resolve([]),
    reservationIds.length > 0
      ? prisma.reservationParticipant.findMany({
          where: { id_reservation: { in: reservationIds } },
          select: { id_reservation: true, id_user: true, status: true },
        })
      : Promise.resolve([]),
    prisma.space.findMany({
      where: { status: "available" },
      select: { id_espace: true, nom: true, type: true },
      orderBy: { nom: "asc" },
    }),
  ]);

  const participantUserIds = [...new Set(rawParticipants.map((p) => p.id_user))];
  const participantUsers =
    participantUserIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: participantUserIds } },
          select: { id: true, name: true, email: true, phone: true, image: true },
        })
      : [];

  const userMap = new Map(participantUsers.map((u) => [u.id, u]));

  const participantsByReservation = new Map<
    string,
    { id: string; name: string; email: string; phone: string | null; image: string | null; status: string }[]
  >();
  for (const p of rawParticipants) {
    const u = userMap.get(p.id_user);
    if (!u) continue;
    const list = participantsByReservation.get(p.id_reservation) ?? [];
    list.push({ ...u, status: p.status });
    participantsByReservation.set(p.id_reservation, list);
  }

  const spaceMap = new Map(spaces.map((s) => [s.id_espace, s]));

  const reservationsWithSpace = upcomingReservations.map((r) => ({
    ...r,
    space: spaceMap.get(r.id_space) ?? null,
    participants: participantsByReservation.get(r.id_reservation) ?? [],
  }));

  return {
    upcomingReservations: reservationsWithSpace,
    nextReservation: reservationsWithSpace[0] ?? null,
    allSpaces,
  };
}
