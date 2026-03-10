"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listUsers } from "../admin.action";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  UsersIcon,
  SearchIcon,
  MoreHorizontalIcon,
  PencilIcon,
  BanIcon,
  Trash2Icon,
  ShieldCheckIcon,
} from "lucide-react";

type User = Awaited<ReturnType<typeof listUsers>>["users"][number];

export function UsersManagementDialog() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [banUser, setBanUser] = useState<User | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", page, debouncedSearch],
    queryFn: () => listUsers(page, debouncedSearch),
    enabled: open,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
    // Simple debounce with setTimeout
    const timeout = setTimeout(() => setDebouncedSearch(value), 300);
    return () => clearTimeout(timeout);
  };

  const invalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "new-accounts"] });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <UsersIcon className="size-4" />
            Gerer les utilisateurs
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-5xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Gestion des utilisateurs</DialogTitle>
          </DialogHeader>

          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom ou email..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex-1 overflow-auto min-h-[340px]">
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Inscription</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.users.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground py-8"
                      >
                        Aucun utilisateur trouve
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          {user.role === "admin" ? (
                            <Badge variant="default" className="gap-1">
                              <ShieldCheckIcon className="size-3" />
                              Admin
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Utilisateur</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.banned ? (
                            <Badge variant="destructive">Banni</Badge>
                          ) : (
                            <Badge variant="outline">Actif</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                        </TableCell>
                        <TableCell>
                          <UserActions
                            user={user}
                            onEdit={() => setEditUser(user)}
                            onDelete={() => setDeleteUser(user)}
                            onBan={() => setBanUser(user)}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                {data.total} utilisateur{data.total > 1 ? "s" : ""}
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={
                        page <= 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-3 text-sm text-muted-foreground">
                      {page} / {data.totalPages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPage((p) => Math.min(data.totalPages, p + 1))
                      }
                      className={
                        page >= data.totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {editUser && (
        <EditUserDialog
          user={editUser}
          open={!!editUser}
          onOpenChange={(open) => !open && setEditUser(null)}
          onSuccess={invalidateUsers}
        />
      )}

      {deleteUser && (
        <DeleteUserDialog
          user={deleteUser}
          open={!!deleteUser}
          onOpenChange={(open) => !open && setDeleteUser(null)}
          onSuccess={invalidateUsers}
        />
      )}

      {banUser && (
        <BanUserDialog
          user={banUser}
          open={!!banUser}
          onOpenChange={(open) => !open && setBanUser(null)}
          onSuccess={invalidateUsers}
        />
      )}
    </>
  );
}

function UserActions({
  user,
  onEdit,
  onDelete,
  onBan,
}: {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
  onBan: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit} className="gap-2">
          <PencilIcon className="size-4" />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onBan} className="gap-2">
          <BanIcon className="size-4" />
          {user.banned ? "Debannir" : "Bannir"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className="gap-2 text-destructive focus:text-destructive"
        >
          <Trash2Icon className="size-4" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function EditUserDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role ?? "user");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authClient.admin.setRole({
        userId: user.id,
        role: role as "admin" | "user",
      });

      if (name !== user.name || email !== user.email) {
        await authClient.admin.updateUser({
          userId: user.id,
          data: { name, email },
        });
      }

      toast.success("Utilisateur mis a jour");
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error("Erreur lors de la mise a jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l&apos;utilisateur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteUserDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await authClient.admin.removeUser({
        userId: user.id,
      });
      toast.success("Utilisateur supprime");
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer l&apos;utilisateur</AlertDialogTitle>
          <AlertDialogDescription>
            Etes-vous sur de vouloir supprimer le compte de{" "}
            <strong>{user.name}</strong> ({user.email}) ? Cette action est
            irreversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            variant="destructive"
          >
            {loading ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function BanUserDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const isBanned = user.banned;

  const handleAction = async () => {
    setLoading(true);
    try {
      if (isBanned) {
        await authClient.admin.unbanUser({
          userId: user.id,
        });
        toast.success("Utilisateur debanni");
      } else {
        await authClient.admin.banUser({
          userId: user.id,
          banReason: reason || undefined,
        });
        toast.success("Utilisateur banni");
      }
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error(
        isBanned
          ? "Erreur lors du debannissement"
          : "Erreur lors du bannissement",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isBanned ? "Debannir" : "Bannir"} l&apos;utilisateur
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isBanned ? (
              <>
                Voulez-vous debannir <strong>{user.name}</strong> ({user.email})
                ?
              </>
            ) : (
              <>
                Voulez-vous bannir <strong>{user.name}</strong> ({user.email}) ?
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {!isBanned && (
          <div className="space-y-2 px-1">
            <label className="text-sm font-medium">
              Raison (optionnel)
            </label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Raison du bannissement..."
            />
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleAction}
            disabled={loading}
            variant={isBanned ? "default" : "destructive"}
          >
            {loading
              ? "En cours..."
              : isBanned
                ? "Debannir"
                : "Bannir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
