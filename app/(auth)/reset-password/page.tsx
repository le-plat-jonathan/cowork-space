import { Card, CardContent } from "@/components/ui/card";
import { ResetPasswordForm } from "./reset-password.form";

export default async function RoutePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return <div>Token not found</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <ResetPasswordForm token={token} />
          <div className="bg-radial from-green-700 to-green-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <img src="/logo.svg" alt="Cowork" className="size-[92px]" />
            <p className="text-2xl font-semibold text-white">Cowork</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
