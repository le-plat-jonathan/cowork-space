import "dotenv/config";
import { vi, describe, it, expect, beforeAll, afterAll } from "vitest";
import { nanoid } from "nanoid";

// Mock Next.js modules absents hors contexte Next
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/headers", () => ({ headers: vi.fn(() => new Headers()) }));
vi.mock("next/navigation", () => ({
  unauthorized: vi.fn(() => {
    throw new Error("unauthorized");
  }),
}));

// Mock auth — doit être avant l'import des server actions
vi.mock("@/lib/auth/auth-user", () => ({
  getRequiredUser: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

import prisma from "@/lib/prisma";
import { createReservation } from "@/features/reservations/reservations";
import { sendReminder } from "@/features/invite/invite";
import { getRequiredUser } from "@/lib/auth/auth-user";
import { auth } from "@/lib/auth";

describe("Flow complet : réservation + invitation + reminder", () => {
  const suffix = nanoid(6);
  const ownerId = `test-owner-${suffix}`;
  const invitedId = `test-invited-${suffix}`;
  const spaceId = `test-space-${suffix}`;
  let reservationId: string | null = null;

  beforeAll(async () => {
    await prisma.$executeRaw`
      INSERT INTO "user" (id, email, name, "emailVerified", role, "createdAt", "updatedAt")
      VALUES (${ownerId}, ${'playwright-test-owner-' + suffix + '@test.com'}, 'Test Owner', true, 'user', NOW(), NOW())
    `;

    await prisma.$executeRaw`
      INSERT INTO "user" (id, email, name, "emailVerified", role, "createdAt", "updatedAt")
      VALUES (${invitedId}, ${'playwright-test-invited-' + suffix + '@test.com'}, 'Test Invited', true, 'user', NOW(), NOW())
    `;

    await prisma.space.create({
      data: {
        id_espace: spaceId,
        nom: "Test Meeting Room",
        type: "meeting_room",
        capacity: 5,
        description: "Test",
        plan: "test",
        position_x: 0,
        position_y: 0,
        status: "available",
      },
    });

    vi.mocked(getRequiredUser).mockResolvedValue({
      id: ownerId,
      email: `playwright-test-owner-${suffix}@test.com`,
      name: "Test Owner",
      emailVerified: true,
      role: "MEMBER",
      createdAt: new Date(),
      updatedAt: new Date(),
      image: null,
      phone: null,
    } as any);
  });

  afterAll(async () => {
    if (reservationId) {
      await prisma.notification.deleteMany({ where: { id_reservation: reservationId } });
      await prisma.reservationParticipant.deleteMany({ where: { id_reservation: reservationId } });
      await prisma.reservation.delete({ where: { id_reservation: reservationId } });
    }
    await prisma.space.delete({ where: { id_espace: spaceId } });
    await prisma.user.delete({ where: { id: invitedId } });
    await prisma.user.delete({ where: { id: ownerId } });
    await prisma.$disconnect();
  });

  it("crée la réservation et invite le participant", async () => {
    const startTime = new Date(Date.now() + 30 * 60 * 1000);
    const endTime = new Date(Date.now() + 2 * 60 * 60 * 1000);

    const ok = await createReservation(
      startTime,
      endTime,
      spaceId,
      false,
      false,
      "Test flow",
      [invitedId]
    );

    expect(ok).toBe(true);

    const reservation = await prisma.reservation.findFirst({
      where: { id_space: spaceId, id_user: ownerId },
      include: { participants: true },
    });

    expect(reservation).not.toBeNull();
    expect(reservation!.participants).toHaveLength(1);
    expect(reservation!.participants[0].id_user).toBe(invitedId);
    expect(reservation!.participants[0].status).toBe("pending");

    reservationId = reservation!.id_reservation;
  });

  it("sendReminder envoie la notification au owner (participant encore pending)", async () => {
    await expect(sendReminder()).resolves.not.toThrow();

    // Le participant est "pending" → seul le owner reçoit le reminder
    const notifications = await prisma.notification.findMany({
      where: { id_reservation: reservationId!, type: "reminder" },
    });

    expect(notifications.length).toBe(1);
    expect(notifications[0].id_user).toBe(ownerId);
  });

  it("getMyInvitations retourne l'invitation pending pour l'invité", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: invitedId },
    } as any);

    const { getMyInvitations } = await import("@/features/invite/invite");
    const result = await getMyInvitations();

    expect(result).toHaveProperty("pending");
    expect(result).toHaveProperty("accepted");
    expect(result).toHaveProperty("declined");

    expect(result.pending).toHaveLength(1);
    expect(result.pending[0].id_user).toBe(invitedId);
    expect(result.pending[0].id_reservation).toBe(reservationId);

    expect(result.accepted).toHaveLength(0);
    expect(result.declined).toHaveLength(0);
  });
});