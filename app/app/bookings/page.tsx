import { getUserReservations } from "@/features/reservations/reservations";

export default async function BookingsPage() {
  const reservations = await getUserReservations();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Mes réservations</h1>
      <pre className="bg-muted p-4 rounded text-sm">
        {JSON.stringify(reservations, null, 2)}
      </pre>
    </div>
  );
}
