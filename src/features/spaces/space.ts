"use server";

import prisma from "@/lib/prisma";

export const getSpacesWithCurrentAvailability = async () => {
  const now = new Date()

  const [spaces, reservationCounts] = await Promise.all([
    prisma.space.findMany(),
    prisma.reservation.groupBy({
      by: ["id_space"],
      where: {
        status: { not: "canceled" },
        startTime: { lte: now },
        endTime: { gte: now },
      },
      _count: { id_reservation: true },
    }),
  ])

  const countMap = new Map(reservationCounts.map((r) => [r.id_space, r._count.id_reservation]))

  return spaces.map((space) => ({
    ...space,
    currentReservations: countMap.get(space.id_espace) ?? 0,
  }))
}

export const getSpaces = async () => {
    const spaces = await prisma.space.findMany()
    return spaces
}

export const getSpacesById = async (spaceId: string) => {

    const space = await prisma.space.findUnique({
        where: { id_espace: spaceId }
    })

    return space ?? null
}

export const getSpaceQuery = async (query: string) => {
    const spaces = await prisma.space.findMany({
        where: {
            nom: { contains: query, mode:"insensitive" }
        }
    })

    return spaces
}

export const getSpaceByQuery = async (type?: "meeting_room" | "open_space", capacity?: number) => {
    const spaces = await prisma.space.findMany({
        where: {
            ...(type && { type }),
            ...(capacity && { capacity: { gte: capacity } }),
        },
    })

    return spaces
}