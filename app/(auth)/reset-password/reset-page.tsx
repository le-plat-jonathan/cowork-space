import { LogoSvg } from "@/components/svg/logo-svg";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { SiteConfig } from "@/site-config";
import Image from "next/image";
import Link from "next/link";
import { ResetPasswordForm } from "./reset-password.form";

export default async function ResetPasswordPage({
  searchParams,
  logo,
  title,
}: {
  searchParams: Promise<{ token?: string }>;
  logo?: string | null;
  title?: string | null;
}) {
  const { token } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-[380px] flex flex-col items-center gap-8">
        <Card className="w-full ">
          <CardHeader className="pb-2">
            {logo ? (
              <Image
                src={logo}
                alt={title ?? SiteConfig.title}
                width={128}
                height={128}
                className="rounded-md object-contain"
              />
            ) : (
              <LogoSvg className="size-16" />
            )}
            <CardDescription className="">
              Choisissez un nouveau mot de passe pour votre compte.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {token ? (
              <ResetPasswordForm token={token} />
            ) : (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <p className="text-sm text-slate-600">
                  Lien invalide ou expiré.
                </p>
                <Link
                  href="/central/forgot-password"
                  className="text-xs text-slate-500 hover:text-slate-700 underline-offset-4 hover:underline"
                >
                  Demander un nouveau lien
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-slate-400 text-center">
          © {new Date().getFullYear()} MedLMS. All rights reserved.
        </p>
      </div>
    </main>
  );
}
