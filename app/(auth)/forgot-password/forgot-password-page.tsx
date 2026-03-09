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
import { ForgotPasswordForm } from "./forgot-password.form";

export default function ForgotPasswordPage({
  logo = null,
  title = null,
}: {
  logo?: string | null;
  title?: string | null;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-[380px] flex flex-col items-center gap-8">
        <Card className="w-full ">
          <CardHeader className="flex flex-col items-center gap-2">
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

            <CardDescription className="text-sm text-center text-muted-foreground">
              Réinitialisez votre mot de passe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm />
          </CardContent>
        </Card>

        <p className="text-xs text-slate-400 text-center">
          Powered by{" "}
          <Link href={SiteConfig.prodUrl as never}>{SiteConfig.title}</Link>
        </p>
      </div>
    </main>
  );
}
