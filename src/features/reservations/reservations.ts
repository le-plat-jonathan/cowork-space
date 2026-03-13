"use server";

import { getRequiredUser } from "@/lib/auth/auth-user";
import prisma from "@/lib/prisma";
import { inviteUserToReservation } from "../invite/invite";
import { getRequiredAdmin } from "@/lib/auth/auth-user";

export  const getUserReservations = async () => {
    const user = await getRequiredUser();

    const reservations = await prisma.reservation.findMany({
        where: {id_user: user.id},
        orderBy: {startTime: "asc"}
    })

    return reservations;

}

export const createReservation = async (startTime: Date, endTime: Date, idSpace: string, is_private: boolean, is_recurrent: boolean, reason: string, participantIds: string[]) => {
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
            reason
        }
    })

    for (const p of participantIds) {
        await inviteUserToReservation(reservation.id_reservation, p)
    }

    console.log("Reservation crée : ", reservation)
    return true
}

export const checkSpaceAvailability = async (
    idSpace: string,
    startTime: Date,
    endTime: Date,
    excludeReservationId?: string,
) => {
    const space = await prisma.space.findUnique({ where: { id_espace: idSpace } })
    if (!space || space.status === "unavailable") {
        console.error("Le space demandé n'existe pas")
        return false
    }

    const exclusion = excludeReservationId
        ? { id_reservation: { not: excludeReservationId } }
        : {}

    if (space.type === "meeting_room") {
        const conflict = await prisma.reservation.findFirst({
            where: {
                ...exclusion,
                id_space: idSpace,
                status: { not: "canceled" },
                startTime: { lt: endTime },
                endTime: { gt: startTime },
            }
        })

        if (conflict) {
            console.error("Space not available")
            return false
        }
    } else if (space.type === "open_space") {
        const count = await prisma.reservation.count({
            where: {
                ...exclusion,
                id_space: idSpace,
                status: { not: "canceled" },
                startTime: { lt: endTime },
                endTime: { gt: startTime },
            }
        })

        if (count >= space.capacity) {
            console.error("Capacity maximum reached")
            return false
        }
    }
    return true
}

export const checkCapacityMeetingRoom = async (idEspace: string, startTime: Date, endTime: Date) => {
    const space = await prisma.space.findFirst({
        where: {id_espace: idEspace}
    })
    if (!space || space.type != "open_space") {
        console.error("Bad isEspace")
        return -1
    }

    const count = await prisma.reservation.count({
            where: {
                id_space: idEspace,
                status: { not: "canceled" },
                startTime: { lt: endTime },   // la résa existante commence AVANT la fin demandée
                endTime: { gt: startTime },   // la résa existante se termine APRÈS le début demandé
            }
        })

    const capacityAvailable = space.capacity - count
    return capacityAvailable
}

export const canceledReservation = async (idReservation: string) => {
    const user = await getRequiredUser()
    const reservation = await prisma.reservation.findUnique({
        where: {id_reservation: idReservation}
    })
    if (!reservation) {
        console.error("Reservation introuvable")
        return false
    }
    if (user.id != reservation.id_user) {
        console.error("L'id_user n'est pas le proprietaire de la reservation")
        return false
    }
    const reservationCancelled = await prisma.reservation.update({
        where: {id_reservation: idReservation},
        data: {status: "canceled"}
    })
    
    return true
}

export const updateReservation = async (
    idReservation: string,
    startTime?: Date,
    endTime?: Date,
    idSpace?: string,
    is_private?: boolean,
    is_recurrent?: boolean,
    reason?: string
) => {
    const user = await getRequiredUser()

    const reservation = await prisma.reservation.findUnique({
        where: { id_reservation: idReservation }
    })
    if (!reservation) {
        console.error("Reservation introuvable")
        return false
    }
    if (user.id !== reservation.id_user) {
        console.error("L'utilisateur n'est pas le propriétaire")
        return false
    }

    const targetSpace = idSpace ?? reservation.id_space
    const targetStart = startTime ?? reservation.startTime
    const targetEnd = endTime ?? reservation.endTime

    const isAvailable = await checkSpaceAvailability(
        targetSpace,
        targetStart,
        targetEnd,
        idReservation,
    )
    if (!isAvailable) return false

    await prisma.reservation.update({
        where: { id_reservation: idReservation },
        data: {
            ...(startTime !== undefined && { startTime }),
            ...(endTime !== undefined && { endTime }),
            ...(idSpace !== undefined && { id_space: idSpace }),
            ...(is_private !== undefined && { is_private }),
            ...(is_recurrent !== undefined && { is_recurrent }),
            ...(reason !== undefined && { reason }),
        }
    })

    return true
}

export const getReservationById = async (reservationId: string) => {
    const user = await getRequiredUser()

    const reservation = await prisma.reservation.findUnique({
        where:{
            id_reservation: reservationId,
        },
        include: {participants: true}
    })
    if (!reservation) {
        console.error("Aucunes reservation correspondante avec l'id de reservation")
        return null
    }

    const isOwner = reservation.id_user === user.id
    const isParticipant = reservation.participants.some(p => p.id_user === user.id)
    
    if (!isOwner && !isParticipant) return null

    return reservation
}

export const getReservationParticipants = async (reservationId: string) => {
    const user = await getRequiredUser();

    const reservation = await prisma.reservation.findUnique({
    where: { id_reservation: reservationId },
    include: {
    participants: {
        include: {
            user: true,
        },
        },
        user: true,
    },
  });

  if (!reservation) {
    console.error("Reservation introuvable");
    return null;
  }

  const isOwner = reservation.id_user === user.id;
  const isParticipant = reservation.participants.some((p) => p.id_user === user.id);

  if (!isOwner && !isParticipant) {
    console.error("Accès refusé");
    return null;
  }

  return {
    owner: reservation.user,
    participants: reservation.participants.map((p) => ({
      ...p.user,
      status: p.status,
    })),
  };
};

export const getAllReservation = async () => {
    await getRequiredAdmin()

    const reservation = await prisma.reservation.findMany()
    if (reservation.length === 0) {
        console.error("Aucune reservation trouvée")
        return null
    }
    return reservation
}