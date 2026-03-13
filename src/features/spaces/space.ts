"use server";

import prisma from "@/lib/prisma";

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