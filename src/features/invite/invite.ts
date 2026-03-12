"use server";

import { getRequiredUser } from "@/lib/auth/auth-user";
import prisma from "@/lib/prisma";
import { addHours } from "date-fns";
import { sendEmail } from "@/lib/mail/send-email-resend";
import { typeNotification } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function inviteUserToReservation(
  reservationId: string,
  invitedUserId: string
) {
  const user = await getRequiredUser();

  const reservation = await prisma.reservation.findUnique({
    where: { id_reservation: reservationId },
    include: { space: true, participants: true },
  });

  if (!reservation) {
    console.error("Reservation introuvable");
    return false;
  }

  if (reservation.id_user !== user.id) {
    console.error("Seul le owner peut inviter");
    return false;
  }

  if (reservation.space.type !== "meeting_room") {
    console.error("Les invitations sont réservées aux meeting_room");
    return false;
  }

  const currentParticipants = reservation.participants.filter(
    (p) => p.status !== "declined"
  ).length;

  // +1 pour le owner
  if (currentParticipants + 1 >= reservation.space.capacity) {
    console.error("Capacité maximale atteinte");
    return false;
  }

  await prisma.reservationParticipant.create({
    data: {
      id_reservation: reservationId,
      id_user: invitedUserId,
      status: "pending",
    },
  });

  // Notifier l'invité
  await prisma.notification.create({
    data: {
      type: typeNotification.confirmation,
      id_user: invitedUserId,
      id_reservation: reservationId,
    },
  });

  return true;
}

export async function sendReminder() {
  try {
    const now = new Date();
    const oneHourLater = addHours(now, 1);

    const reservations = await prisma.reservation.findMany({
      where: {
        startTime: { gte: now, lte: oneHourLater },
        status: "confirmed",
      },
      include: {
        user: true,
        participants: {
          where: { status: "accepted" },
        },
      },
    });

    for (const reservation of reservations) {
      const participantIds = reservation.participants.map((p) => p.id_user);
      const usersToNotify = await prisma.user.findMany({
        where: { id: { in: [reservation.user.id, ...participantIds] } },
      });

      for (const u of usersToNotify) {
        await sendEmail({
          to: u.email,
          subject: "Rappel de votre réservation",
          text: `Bonjour ${u.name},\n\nVous avez une réservation prévue pour ${reservation.startTime.toLocaleString()}.\nEspace: ${reservation.id_space}`,
        });

        await prisma.notification.create({
          data: {
            type: typeNotification.reminder,
            id_user: u.id,
            id_reservation: reservation.id_reservation,
          },
        });
      }
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi des rappels:", error);
  }
}


export async function getMyInvitations() {
 const user = await getRequiredUser();

  const invitations = await prisma.reservationParticipant.findMany({
    where: {
      id_user: user.id,
    },
    include: {
      reservation: {
        include: {
          user: true,
          space: true,
        }
      }
    },
    orderBy: {
      reservation: {
        startTime: "asc"
      }
    }
  });

  return {
    pending: invitations.filter(i => i.status === "pending"),
    accepted: invitations.filter(i => i.status === "accepted"),
    declined: invitations.filter(i => i.status === "declined"),
  };
}