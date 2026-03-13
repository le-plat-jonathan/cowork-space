"use server";

import { getRequiredAdmin } from "@/lib/auth/auth-user";
import prisma from "@/lib/prisma";

export async function getRecentAccounts() {
  await getRequiredAdmin();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const users = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return users;
}

export async function getReservationsThisWeek(spaceType: "open_space" | "meeting_room") {
  await getRequiredAdmin();

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const spaces = await prisma.space.findMany({
    where: { type: spaceType },
    select: { id_espace: true },
  });
  const spaceIds = spaces.map((s) => s.id_espace);

  const reservations = await prisma.reservation.findMany({
    where: {
      startTime: { gte: startOfWeek, lte: endOfWeek },
      status: { not: "canceled" },
      id_space: { in: spaceIds },
    },
    select: { startTime: true },
  });

  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const counts: Record<string, number> = Object.fromEntries(days.map((d) => [d, 0]));

  for (const r of reservations) {
    const dayIndex = r.startTime.getDay();
    // JS: 0=Sun,1=Mon,...,6=Sat → map to Lun=0,...,Dim=6
    const mappedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    counts[days[mappedIndex]]++;
  }

  return days.map((day) => ({ day, reservations: counts[day] }));
}

export async function getAttendanceThisWeek() {
  await getRequiredAdmin();

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const reservations = await prisma.reservation.findMany({
    where: {
      startTime: { gte: startOfWeek, lte: endOfWeek },
      status: { not: "canceled" },
    },
    select: { startTime: true, id_user: true },
  });

  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const usersByDay: Record<string, Set<string>> = Object.fromEntries(
    days.map((d) => [d, new Set<string>()])
  );

  for (const r of reservations) {
    const dayIndex = r.startTime.getDay();
    const mappedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    usersByDay[days[mappedIndex]].add(r.id_user);
  }

  return days.map((day) => ({ day, visitors: usersByDay[day].size }));
}

export async function listUsers(
  page: number = 1,
  search: string = "",
  perPage: number = 20,
) {
  await getRequiredAdmin();

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        banned: true,
        banReason: true,
        banExpires: true,
        createdAt: true,
        emailVerified: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    total,
    totalPages: Math.ceil(total / perPage),
    page,
  };
}
