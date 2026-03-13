"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CameraIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getMyPhone } from "./sidebar.action";

const COUNTRY_PHONE_CONFIG: Record<
  string,
  { flag: string; label: string; placeholder: string }
> = {
  FR: { flag: "🇫🇷", label: "France (+33)", placeholder: "06 12 34 56 78" },
  BE: { flag: "🇧🇪", label: "Belgique (+32)", placeholder: "0470 12 34 56" },
  CH: { flag: "🇨🇭", label: "Suisse (+41)", placeholder: "078 123 45 67" },
  LU: { flag: "🇱🇺", label: "Luxembourg (+352)", placeholder: "621 123 456" },
  MA: { flag: "🇲🇦", label: "Maroc (+212)", placeholder: "0612 345 678" },
  DZ: { flag: "🇩🇿", label: "Algérie (+213)", placeholder: "0555 12 34 56" },
  TN: { flag: "🇹🇳", label: "Tunisie (+216)", placeholder: "20 123 456" },
  SN: { flag: "🇸🇳", label: "Sénégal (+221)", placeholder: "77 123 45 67" },
  CI: {
    flag: "🇨🇮",
    label: "Côte d'Ivoire (+225)",
    placeholder: "07 12 34 56 78",
  },
  GB: {
    flag: "🇬🇧",
    label: "Royaume-Uni (+44)",
    placeholder: "07700 900123",
  },
  DE: { flag: "🇩🇪", label: "Allemagne (+49)", placeholder: "0151 12345678" },
  ES: { flag: "🇪🇸", label: "Espagne (+34)", placeholder: "612 345 678" },
  IT: { flag: "🇮🇹", label: "Italie (+39)", placeholder: "320 123 4567" },
  PT: { flag: "🇵🇹", label: "Portugal (+351)", placeholder: "912 345 678" },
};

interface MyInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MyInfoDialog({ open, onOpenChange }: MyInfoDialogProps) {
  const { data: session } = authClient.useSession();

  const { data: phoneFromDb } = useQuery({
    queryKey: ["my-phone"],
    queryFn: () => getMyPhone(),
    enabled: open,
  });

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("FR");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session?.user.name) setName(session.user.name);
  }, [session?.user.name]);

  useEffect(() => {
    const current =
      (session?.user as { phone?: string | null })?.phone ?? phoneFromDb;
    if (current !== undefined) setPhone(current ?? "");
  }, [phoneFromDb, session?.user]);

  useEffect(() => {
    if (!open) {
      setImageFile(null);
      setImagePreview(null);
    }
  }, [open]);

  const mutation = useMutation({
    mutationFn: async () => {
      let imageUrl = session?.user.image ?? undefined;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Erreur upload");
        }
        const data = await res.json();
        imageUrl = data.url;
      }

      await unwrapSafePromise(
        authClient.updateUser({
          name,
          image: imageUrl,
          phone: phone || null,
        }),
      );
    },
    onSuccess: () => {
      toast.success("Profil mis à jour");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      toast.error("Image trop grande (max 500 Ko)");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const displayImage = imagePreview ?? session?.user.image ?? undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mes informations</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="space-y-4"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <Avatar className="size-20">
                <AvatarImage src={displayImage} />
                <AvatarFallback className="text-2xl">
                  {session?.user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 hover:bg-primary/90 transition-colors"
              >
                <CameraIcon className="size-3" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <p className="text-xs text-muted-foreground">Max 500 Ko</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nom</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Téléphone</label>
            <div className="flex gap-2">
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="w-44 shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(COUNTRY_PHONE_CONFIG).map(([code, cfg]) => (
                    <SelectItem key={code} value={code}>
                      {cfg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={COUNTRY_PHONE_CONFIG[country].placeholder}
                pattern="[\+\d\s\-\(\)]{7,20}"
                title="Numéro de téléphone valide (chiffres, espaces, +, -, parenthèses)"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
