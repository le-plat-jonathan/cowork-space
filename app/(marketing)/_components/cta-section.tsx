"use client";

import Link from "next/link";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function CtaSection() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="mt-8 flex items-center justify-center gap-3">
        <div className="h-9 w-48 animate-pulse rounded-lg bg-white/20" />
      </div>
    );
  }

  if (session) {
    return (
      <div className="mt-8 flex items-center justify-center">
        <Button
          size="lg"
          variant="secondary"
          className="bg-white text-primary hover:bg-white/90"
          asChild
        >
          <Link href="/app">
            <LayoutDashboard data-icon="inline-start" />
            Accéder à mon espace
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <Button
        size="lg"
        variant="secondary"
        className="bg-white text-primary hover:bg-white/90"
        asChild
      >
        <Link href="/register">
          Commencer maintenant
          <ArrowRight data-icon="inline-end" />
        </Link>
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
        asChild
      >
        <Link href="/login">Se connecter</Link>
      </Button>
    </div>
  );
}
