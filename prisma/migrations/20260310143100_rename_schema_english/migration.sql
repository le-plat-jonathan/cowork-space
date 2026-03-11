/*
  Warnings:

  - The values [annulée,confirmée,en_attente] on the enum `ReservationStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [envoyée,en_attente,echec] on the enum `StatusNotification` will be removed. If these variants are still used in the database, this will fail.
  - The values [annulation,rappel] on the enum `typeNotification` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `capacité` on the `espace` table. All the data in the column will be lost.
  - The `type` column on the `espace` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `espace` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `date_envoi` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `date_debut` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `date_fin` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `est_privée` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `est_recurrente` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `heure_debut` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `heure_fin` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `id_espace` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `motif` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `banExpires` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `banReason` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `banned` on the `user` table. All the data in the column will be lost.
  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `equipement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reccurence` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `capacity` to the `espace` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_space` to the `reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `reservation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "TypeSpace" AS ENUM ('open_space', 'meeting_room');

-- CreateEnum
CREATE TYPE "StatusSpace" AS ENUM ('available', 'unavailable');

-- CreateEnum
CREATE TYPE "TypeRecurrence" AS ENUM ('weekly', 'monthly');

-- AlterEnum
BEGIN;
CREATE TYPE "ReservationStatus_new" AS ENUM ('canceled', 'confirmed', 'waiting');
ALTER TABLE "public"."reservation" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "reservation" ALTER COLUMN "status" TYPE "ReservationStatus_new" USING ("status"::text::"ReservationStatus_new");
ALTER TYPE "ReservationStatus" RENAME TO "ReservationStatus_old";
ALTER TYPE "ReservationStatus_new" RENAME TO "ReservationStatus";
DROP TYPE "public"."ReservationStatus_old";
ALTER TABLE "reservation" ALTER COLUMN "status" SET DEFAULT 'confirmed';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "StatusNotification_new" AS ENUM ('send', 'is_waiting', 'failed');
ALTER TABLE "public"."notification" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "notification" ALTER COLUMN "status" TYPE "StatusNotification_new" USING ("status"::text::"StatusNotification_new");
ALTER TYPE "StatusNotification" RENAME TO "StatusNotification_old";
ALTER TYPE "StatusNotification_new" RENAME TO "StatusNotification";
DROP TYPE "public"."StatusNotification_old";
ALTER TABLE "notification" ALTER COLUMN "status" SET DEFAULT 'is_waiting';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "typeNotification_new" AS ENUM ('confirmation', 'cancellation', 'reminder');
ALTER TABLE "notification" ALTER COLUMN "type" TYPE "typeNotification_new" USING ("type"::text::"typeNotification_new");
ALTER TYPE "typeNotification" RENAME TO "typeNotification_old";
ALTER TYPE "typeNotification_new" RENAME TO "typeNotification";
DROP TYPE "public"."typeNotification_old";
COMMIT;

-- DropIndex
DROP INDEX "reservation_id_user_idx";

-- AlterTable
ALTER TABLE "espace" DROP COLUMN "capacité",
ADD COLUMN     "capacity" INTEGER NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "TypeSpace" NOT NULL DEFAULT 'open_space',
DROP COLUMN "status",
ADD COLUMN     "status" "StatusSpace" NOT NULL DEFAULT 'available';

-- AlterTable
ALTER TABLE "notification" DROP COLUMN "date_envoi",
ADD COLUMN     "date_send" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "status" SET DEFAULT 'is_waiting';

-- AlterTable
ALTER TABLE "reservation" DROP COLUMN "date_debut",
DROP COLUMN "date_fin",
DROP COLUMN "est_privée",
DROP COLUMN "est_recurrente",
DROP COLUMN "heure_debut",
DROP COLUMN "heure_fin",
DROP COLUMN "id_espace",
DROP COLUMN "motif",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "id_space" TEXT NOT NULL,
ADD COLUMN     "is_private" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_recurrent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'confirmed';

-- AlterTable
ALTER TABLE "user" DROP COLUMN "banExpires",
DROP COLUMN "banReason",
DROP COLUMN "banned",
ADD COLUMN     "phone" TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user';

-- DropTable
DROP TABLE "equipement";

-- DropTable
DROP TABLE "reccurence";

-- DropEnum
DROP TYPE "StatusEspace";

-- DropEnum
DROP TYPE "TypeReccurence";

-- DropEnum
DROP TYPE "typeEspace";

-- CreateTable
CREATE TABLE "equipment" (
    "id_equipment" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "equipment_pkey" PRIMARY KEY ("id_equipment")
);

-- CreateTable
CREATE TABLE "recurrence" (
    "id_recurrence" TEXT NOT NULL,
    "type_recurrence" "TypeRecurrence" NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "end_date_recurrence" TIMESTAMP(3) NOT NULL,
    "id_reservation_parent" INTEGER NOT NULL,

    CONSTRAINT "recurrence_pkey" PRIMARY KEY ("id_recurrence")
);

-- CreateIndex
CREATE INDEX "recurrence_id_reservation_parent_idx" ON "recurrence"("id_reservation_parent");

-- CreateIndex
CREATE INDEX "reservation_id_user_startTime_endTime_idx" ON "reservation"("id_user", "startTime", "endTime");
