import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";
import prisma from "@/lib/prisma"; // path to your prisma client
import { ReservationStatus, typeNotification } from "@/generated/prisma/enums";
import { addHours } from "date-fns";
import { sendEmail } from "@/lib/mail/send-email-resend";

export const { POST, GET } = toNextJsHandler(auth);

export async function sendInvite(
  reservationId: string,
  invitedUsers: string[]
) {

  const notifications = invitedUsers.map((userId) => ({
    type: typeNotification.confirmation,
    id_user: userId,
    id_reservation: reservationId
  }));

  await prisma.notification.createMany({
    data: notifications
  });
}

export async function sendReminder() {
  try {
    const now = new Date();
    const oneHourLater = addHours(now, 1);

    const reservations = await prisma.reservation.findMany({
      where: {
        startTime: {
          gte: now,
          lte: oneHourLater
        },
        status: ReservationStatus.confirmed
      },
      include: {
        user: true,
      }
    });

    for (const reservation of reservations) {
      const owner = reservation.user;

      const notifications = await prisma.notification.findMany({
        where: { id_reservation: reservation.id_reservation }
      });

      const invitedUserIds = notifications.map(n => n.id_user);

      const usersToNotify = [owner.id, ...invitedUserIds];

      const users = await prisma.user.findMany({
        where: { id: { in: usersToNotify } }
      });

      for (const user of users) {
        await sendEmail({
          to: user.email,
          subject: "Rappel de votre réservation",
          text: `Bonjour ${user.name},\n\nVous avez une réservation prévue pour ${reservation.startTime.toLocaleString()}.\nEspace: ${reservation.id_space}`
        });
      }
    }

  } catch (error) {
    console.error("Erreur lors de l'envoi des rappels:", error);
  }
}
