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