"use client";

import Link from "next/link";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function HeroCta() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="mt-10 flex items-center justify-center gap-3">
        <div className="h-9 w-56 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (session) {
    return (
      <div className="mt-10 flex items-center justify-center gap-3">
        <Button size="lg" asChild>
          <Link href="/app">
            <LayoutDashboard data-icon="inline-start" />
            Accéder à mon espace
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-10 flex items-center justify-center gap-3">
      <Button size="lg" asChild>
        <Link href="/register">
          Créer un compte gratuitement
          <ArrowRight data-icon="inline-end" />
        </Link>
      </Button>
      <Button variant="outline" size="lg" asChild>
        <Link href="#comment-ca-marche">Découvrir</Link>
      </Button>
    </div>
  );
}
