"use server";

import { getRequiredUser } from "@/lib/auth/auth-user";
import prisma from "@/lib/prisma";

export async function getMyPhone() {
  const user = await getRequiredUser();

  const profile = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    select: { phone: true },
  });

  return profile.phone;
}
