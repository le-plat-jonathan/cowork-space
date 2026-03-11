import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  ChartBar,
  Clock,
  MapPin,
  Monitor,
  Shield,
  Star,
  Users,
  Wifi,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import NavbarAuth from "./_components/navbar-auth";
import HeroCta from "./_components/hero-cta";
import CtaSection from "./_components/cta-section";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="Cowork" width={32} height={32} />
            <span className="text-lg font-semibold tracking-tight">
              Cowork
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm md:flex">
            <a
              href="#fonctionnalites"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Fonctionnalités
            </a>
            <a
              href="#comment-ca-marche"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Comment ça marche
            </a>
            <a
              href="#espaces"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Nos espaces
            </a>
            <a
              href="#temoignages"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Témoignages
            </a>
          </nav>

          <NavbarAuth />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,oklch(0.63_0.17_149/0.15),transparent)]" />
          <div className="mx-auto max-w-6xl px-6 py-24 text-center md:py-36">
            <Badge variant="secondary" className="mb-6">
              <Zap className="size-3" />
              Gestion simplifiée de votre espace de coworking
            </Badge>
            <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
              Votre espace de travail,{" "}
              <span className="text-primary">réinventé</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Réservez vos postes de travail et salles de réunion en quelques
              clics. Une plateforme moderne pour gérer votre coworking
              efficacement.
            </p>
            <HeroCta />

            <div className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-primary" />
                <span>+200 coworkers</span>
              </div>
              <Separator orientation="vertical" className="h-5" />
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                <span>Espaces premium</span>
              </div>
              <Separator orientation="vertical" className="h-5" />
              <div className="flex items-center gap-2">
                <Star className="size-4 text-primary" />
                <span>4.9/5 satisfaction</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="fonctionnalites" className="border-t bg-muted/30">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="text-center">
              <Badge variant="outline" className="mb-4">
                Fonctionnalités
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight">
                Tout ce dont vous avez besoin
              </h2>
              <p className="mt-3 text-muted-foreground">
                Une suite complète d&apos;outils pour gérer votre espace de
                coworking au quotidien.
              </p>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Calendar,
                  title: "Réservation en ligne",
                  description:
                    "Réservez vos postes et salles de réunion depuis n'importe quel appareil, à tout moment.",
                },
                {
                  icon: ChartBar,
                  title: "Tableau de bord admin",
                  description:
                    "Suivez les statistiques de fréquentation, les réservations et gérez vos utilisateurs.",
                },
                {
                  icon: Users,
                  title: "Gestion des membres",
                  description:
                    "Administrez les comptes, attribuez des rôles et gérez les accès facilement.",
                },
                {
                  icon: Clock,
                  title: "Disponibilité en temps réel",
                  description:
                    "Consultez la disponibilité des espaces en un coup d'œil pour planifier vos journées.",
                },
                {
                  icon: Shield,
                  title: "Accès sécurisé",
                  description:
                    "Authentification robuste avec gestion des rôles pour protéger vos données.",
                },
                {
                  icon: Monitor,
                  title: "Interface intuitive",
                  description:
                    "Une expérience utilisateur fluide et moderne, pensée pour la productivité.",
                },
              ].map((feature) => (
                <Card key={feature.title} className="border-0 bg-card/60">
                  <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="size-5 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="comment-ca-marche">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="text-center">
              <Badge variant="outline" className="mb-4">
                Comment ça marche
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight">
                Prêt en 3 étapes
              </h2>
              <p className="mt-3 text-muted-foreground">
                Commencez à utiliser votre espace de coworking en quelques
                minutes.
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Créez votre compte",
                  description:
                    "Inscrivez-vous en quelques secondes avec votre adresse email. C'est gratuit et sans engagement.",
                },
                {
                  step: "02",
                  title: "Réservez votre espace",
                  description:
                    "Choisissez un poste de travail ou une salle de réunion selon vos besoins et disponibilités.",
                },
                {
                  step: "03",
                  title: "Travaillez sereinement",
                  description:
                    "Profitez de votre espace de travail équipé et concentrez-vous sur ce qui compte vraiment.",
                },
              ].map((item) => (
                <div key={item.step} className="relative text-center">
                  <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                    <span className="text-xl font-bold text-primary">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Spaces */}
        <section id="espaces" className="border-t bg-muted/30">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="text-center">
              <Badge variant="outline" className="mb-4">
                Nos espaces
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight">
                Des espaces pensés pour vous
              </h2>
              <p className="mt-3 text-muted-foreground">
                Chaque espace est conçu pour favoriser la productivité et le
                bien-être.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              <Card className="overflow-hidden">
                <CardHeader>
                  <div className="mb-1 flex items-center gap-2">
                    <Monitor className="size-5 text-primary" />
                    <CardTitle className="text-xl">
                      Espace de coworking
                    </CardTitle>
                  </div>
                  <CardDescription>
                    Des postes de travail ergonomiques dans un environnement
                    stimulant.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5 text-sm text-muted-foreground">
                    {[
                      "Bureau ergonomique avec écran externe",
                      "Connexion Wi-Fi haut débit",
                      "Accès aux espaces communs",
                      "Café et boissons inclus",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <div className="size-1.5 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader>
                  <div className="mb-1 flex items-center gap-2">
                    <Users className="size-5 text-primary" />
                    <CardTitle className="text-xl">
                      Salles de réunion
                    </CardTitle>
                  </div>
                  <CardDescription>
                    Des salles équipées pour vos réunions, ateliers et
                    présentations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5 text-sm text-muted-foreground">
                    {[
                      "Capacité de 4 à 20 personnes",
                      "Vidéoprojecteur et tableau blanc",
                      "Visioconférence intégrée",
                      "Réservation à l'heure ou à la journée",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <div className="size-1.5 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="temoignages">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="text-center">
              <Badge variant="outline" className="mb-4">
                Témoignages
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight">
                Ils nous font confiance
              </h2>
              <p className="mt-3 text-muted-foreground">
                Découvrez ce que nos coworkers pensent de leur expérience.
              </p>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {[
                {
                  name: "Sophie Martin",
                  role: "Développeuse freelance",
                  quote:
                    "La plateforme de réservation est incroyablement simple. Je peux organiser ma semaine en quelques clics.",
                },
                {
                  name: "Thomas Dupont",
                  role: "Chef de projet",
                  quote:
                    "Les salles de réunion sont parfaitement équipées. Le système de réservation en temps réel est un vrai plus.",
                },
                {
                  name: "Marie Leroy",
                  role: "Designer UX",
                  quote:
                    "L'ambiance de travail est motivante et l'outil de gestion rend tout tellement fluide au quotidien.",
                },
              ].map((testimonial) => (
                <Card key={testimonial.name}>
                  <CardContent className="pt-2">
                    <div className="mb-3 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="size-4 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <Separator className="my-4" />
                    <div>
                      <p className="text-sm font-medium">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-16 text-center text-primary-foreground">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(1_0_0/0.1),transparent_50%)]" />
              <div className="relative">
                <h2 className="text-3xl font-bold tracking-tight">
                  Prêt à rejoindre notre communauté ?
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-primary-foreground/80">
                  Créez votre compte dès aujourd&apos;hui et découvrez une
                  nouvelle façon de travailler. Aucun engagement requis.
                </p>
                <CtaSection />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2.5">
              <Image src="/logo.svg" alt="Cowork" width={24} height={24} />
              <span className="font-semibold">Cowork</span>
            </div>
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <a
                href="#fonctionnalites"
                className="transition-colors hover:text-foreground"
              >
                Fonctionnalités
              </a>
              <a
                href="#espaces"
                className="transition-colors hover:text-foreground"
              >
                Espaces
              </a>
              <a
                href="#temoignages"
                className="transition-colors hover:text-foreground"
              >
                Témoignages
              </a>
            </nav>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Wifi className="size-4" />
              <span>&copy; 2026 Cowork. Tous droits réservés.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
