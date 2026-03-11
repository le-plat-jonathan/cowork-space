-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('pending', 'accepted', 'declined');

-- CreateTable
CREATE TABLE "reservation_participant" (
    "id" TEXT NOT NULL,
    "id_reservation" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "reservation_participant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reservation_participant_id_user_idx" ON "reservation_participant"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "reservation_participant_id_reservation_id_user_key" ON "reservation_participant"("id_reservation", "id_user");

-- AddForeignKey
ALTER TABLE "reservation_participant" ADD CONSTRAINT "reservation_participant_id_reservation_fkey" FOREIGN KEY ("id_reservation") REFERENCES "reservation"("id_reservation") ON DELETE CASCADE ON UPDATE CASCADE;
