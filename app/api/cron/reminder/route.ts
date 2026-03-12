import { sendReminder } from "@/features/invite/invite";

export async function GET() {
  await sendReminder();
  return new Response("ok");
}
