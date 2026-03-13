# Invite — Server Actions & Cron

Fichier : `src/features/invite/invite.ts`

---

**Fonction** : `inviteUserToReservation`

**Utilité** : Invite un utilisateur à une réservation `meeting_room`. Crée un `ReservationParticipant` (status `pending`) et une `Notification` de type `confirmation` pour l'invité. Owner uniquement, vérifie la capacité

**Params entrée** :
- `reservationId: string` — ID de la réservation
- `invitedUserId: string` — ID de l'utilisateur à inviter

**Sortie** : `true` si invité, `false` sinon (non owner, pas une meeting_room, capacité atteinte)

---

**Fonction** : `sendReminder`

**Utilité** : Fonction cron — envoie un email de rappel aux owner + participants `accepted` dont la réservation `confirmed` démarre dans moins d'une heure. Crée une `Notification` de type `reminder` par personne notifiée. Ne pas appeler depuis le front

**Params entrée** : aucun

**Sortie** : `void`

---

**Fonction** : `respondToInvitation`

**Utilité** : Permet à l'invité de répondre à une invitation

**Params entrée** :
- `idReservation: string`
- `status: "accepted" | "declined"`

**Sortie** : `true`

---

**Fonction** : `getMyInvitations`

**Utilité** : Retourne les invitations de l'utilisateur connecté, groupées par statut

**Params entrée** : aucun

**Sortie** : `{ pending: [], accepted: [], declined: [] }` — chaque entrée inclut la réservation avec son espace et son owner

---

**Fonction** : `searchUser`

**Utilité** : Cherche des utilisateurs par nom (insensible à la casse) — utilisé pour l'UI d'invitation

**Params entrée** :
- `query: string` — texte à chercher dans le nom

**Sortie** : `{ id, name, email, image }[]`

---

## Séparation des responsabilités

| Modèle | Rôle |
|---|---|
| `ReservationParticipant` | Qui participe (`pending` / `accepted` / `declined`) |
| `Notification` | Historique des communications envoyées (`confirmation`, `reminder`, `cancellation`) |
