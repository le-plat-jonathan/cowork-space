# Invite — Server Actions & Cron

Fichier : `src/features/invite/invite.ts`

---

**fonction** : `inviteUserToReservation`
**utilité** : Invite un utilisateur à une réservation `meeting_room`. Crée un `ReservationParticipant` (status `pending`) et une `Notification` de type `confirmation` pour l'invité. Owner uniquement, vérifie la capacité
**params entrée** :
- `reservationId: string` — ID de la réservation
- `invitedUserId: string` — ID de l'utilisateur à inviter

**sortie** : `true` si invité, `false` sinon (non owner, pas une meeting_room, capacité atteinte)

---

**fonction** : `sendReminder`
**utilité** : Fonction cron — envoie un email de rappel aux owner + participants `accepted` dont la réservation `confirmed` démarre dans moins d'une heure. Crée une `Notification` de type `reminder` par personne notifiée. Ne pas appeler depuis le front
**params entrée** : aucun
**sortie** : `void`

---

**fonction** : `respondToInvitation`
**utilité** : Permet à l'invité de répondre à une invitation
**params entrée** :
- `idReservation: string`
- `status: "accepted" | "declined"`

**sortie** : `true`

---

**fonction** : `getMyInvitations`
**utilité** : Retourne les invitations de l'utilisateur connecté, groupées par statut
**params entrée** : aucun
**sortie** : `{ pending: [], accepted: [], declined: [] }` — chaque entrée inclut la réservation avec son espace et son owner

---

**fonction** : `searchUser`
**utilité** : Cherche des utilisateurs par nom (insensible à la casse) — utilisé pour l'UI d'invitation
**params entrée** :
- `query: string` — texte à chercher dans le nom

**sortie** : `{ id, name, email, image }[]`

---

## Séparation des responsabilités

| Modèle | Rôle |
|---|---|
| `ReservationParticipant` | Qui participe (`pending` / `accepted` / `declined`) |
| `Notification` | Historique des communications envoyées (`confirmation`, `reminder`, `cancellation`) |
