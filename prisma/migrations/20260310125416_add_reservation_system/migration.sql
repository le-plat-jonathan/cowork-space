-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('annulée', 'confirmée', 'en_attente');

-- CreateEnum
CREATE TYPE "typeEspace" AS ENUM ('open_space', 'salle_de_reunion');

-- CreateEnum
CREATE TYPE "StatusEspace" AS ENUM ('disponible', 'indisponible');

-- CreateEnum
CREATE TYPE "typeNotification" AS ENUM ('confirmation', 'annulation', 'rappel');

-- CreateEnum
CREATE TYPE "StatusNotification" AS ENUM ('envoyée', 'en_attente', 'echec');

-- CreateEnum
CREATE TYPE "TypeReccurence" AS ENUM ('hebdomadaire', 'mensuelle');

-- CreateTable
CREATE TABLE "reservation" (
    "id_reservation" TEXT NOT NULL,
    "date_debut" TIMESTAMP(3) NOT NULL,
    "date_fin" TIMESTAMP(3) NOT NULL,
    "heure_debut" TIMESTAMP(3) NOT NULL,
    "heure_fin" TIMESTAMP(3) NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'confirmée',
    "est_recurrente" BOOLEAN NOT NULL DEFAULT false,
    "est_privée" BOOLEAN NOT NULL DEFAULT false,
    "motif" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "id_espace" TEXT NOT NULL,

    CONSTRAINT "reservation_pkey" PRIMARY KEY ("id_reservation")
);

-- CreateTable
CREATE TABLE "espace" (
    "id_espace" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "type" "typeEspace" NOT NULL DEFAULT 'open_space',
    "capacité" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "position_x" INTEGER NOT NULL,
    "position_y" INTEGER NOT NULL,
    "status" "StatusEspace" NOT NULL DEFAULT 'disponible',

    CONSTRAINT "espace_pkey" PRIMARY KEY ("id_espace")
);

-- CreateTable
CREATE TABLE "notification" (
    "id_notification" TEXT NOT NULL,
    "type" "typeNotification" NOT NULL,
    "date_envoi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusNotification" NOT NULL DEFAULT 'en_attente',
    "id_reservation" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id_notification")
);

-- CreateTable
CREATE TABLE "equipement" (
    "id_equipement" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "equipement_pkey" PRIMARY KEY ("id_equipement")
);

-- CreateTable
CREATE TABLE "reccurence" (
    "id_reccurence" TEXT NOT NULL,
    "type_reccurence" "TypeReccurence" NOT NULL,
    "jour_semaine" INTEGER NOT NULL,
    "date_fin_recurrence" TIMESTAMP(3) NOT NULL,
    "id_reservation_parent" INTEGER NOT NULL,

    CONSTRAINT "reccurence_pkey" PRIMARY KEY ("id_reccurence")
);

-- CreateIndex
CREATE INDEX "reservation_id_user_idx" ON "reservation"("id_user");

-- CreateIndex
CREATE INDEX "notification_id_user_idx" ON "notification"("id_user");

-- CreateIndex
CREATE INDEX "reccurence_id_reservation_parent_idx" ON "reccurence"("id_reservation_parent");
