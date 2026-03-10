## stats-cards.tsx

`getRecentAccounts()` -> `prisma.user.findMany` -> `createdAt >= 7 jours`.

## reservations-chart.tsx

placeholders vides -> attente schema prisma

## attendance-chart.tsx

placeholders vides -> attente schema prisma

## users-management-dialog.tsx

Modale avec bouton "Gerer les utilisateurs"

affiche : nom, email, rôle, statut, date d'inscription
20 utilisateurs max par page
filtre par nom ou email
Actions possible pour l'admin :
  - Modifier -> `authClient.admin.updateUser` + `setRole`
  - Bannir/débannir -> `authClient.admin.banUser` / `unbanUser`
  - Supprimer ->`authClient.admin.removeUser`

Récupération des users  `listUsers(page, search)` -> `prisma.user.findMany`


Les server actions appellent `requireAdmin()`
Côté client, les actions admin passent par `authClient.admin`.
