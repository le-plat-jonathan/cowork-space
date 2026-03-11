"use server";

import { getRequiredUser } from "@/lib/auth/auth-user";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export  const getUserReservations = async () => {
    const user = await getRequiredUser();

    const reservations = await prisma.reservation.findMany({
        where: {id_user: user.id},
        orderBy: {startTime: "asc"}
    })

    return reservations;

}

export const createReservation = async (startTime: Date, endTime: Date, idSpace: string, is_private: boolean, is_recurrent: boolean, reason: string) => {
    const user = await getRequiredUser()
    const isSpaceAvailable = await checkSpaceAvailability(idSpace, startTime, endTime)
    if (!isSpaceAvailable) {
        console.error("Space not available")
        return false
    }
    const reservation = await prisma.reservation.create({
        data: {
            startTime,
            endTime,
            id_user: user.id,
            id_space: idSpace,
            is_private,
            is_recurrent,
            reason,
        }
    })

    console.log("Reservation crée : ", reservation)
    return true
}

export const checkSpaceAvailability = async (idSpace: string, startTime: Date, endTime: Date) => {
    const space = await prisma.space.findUnique({ where: { id_espace: idSpace } })
    if (!space || space.status === "unavailable") {
        console.error("Le space demandé n'existe pas")
        return false
    }

    if (space.type === "meeting_room") {
        const conflict = await prisma.reservation.findFirst({
            where: {
                id_space: idSpace,
                status: { not: "canceled" },
                startTime: { lt: endTime },   // la résa existante commence AVANT la fin demandée
                endTime: { gt: startTime },   // la résa existante se termine APRÈS le début demandé
            }
        })

        if (conflict) {
            console.error("Space not available")
            return false
        }
    } else if (space.type === "open_space") {
        const count = await prisma.reservation.count({
            where: {
                id_space: idSpace,
                status: { not: "canceled" },
                startTime: { lt: endTime },   // la résa existante commence AVANT la fin demandée
                endTime: { gt: startTime },   // la résa existante se termine APRÈS le début demandé
            }
        })

        if (count >= space.capacity) {
            console.error("Capacity maximum reached")
            return false
        }
    }

    return true
}