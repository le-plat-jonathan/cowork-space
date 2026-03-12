import { getRequiredUser } from "@/lib/auth/auth-user";
import { getSpacesWithReservations } from "@/features/reservations/reservations";
import Plan from "./plan";

export default async function BookingsPage() {
  const user = await getRequiredUser();
  const spaces = await getSpacesWithReservations();

  return <Plan spaces={spaces} currentUserId={user.id} />;
}
