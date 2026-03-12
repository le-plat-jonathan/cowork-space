# Invite — Server Actions & Cron

Fichier : `src/features/invite/invite.ts`

---

## `inviteUserToReservation(reservationId, invitedUserId)`

Invite un utilisateur à une réservation de type `meeting_room`. Crée une entrée `ReservationParticipant` (status `pending`) et une `Notification` de type `confirmation` pour l'invité.

- **Auth** : requise (propriétaire de la réservation uniquement)
- **Conditions** :
  - Le space doit être de type `meeting_room`
  - La capacité (participants non refusés + owner) ne doit pas être atteinte

| Paramètre | Type | Description |
|---|---|---|
| `reservationId` | `string` | ID de la réservation |
| `invitedUserId` | `string` | ID de l'utilisateur à inviter |

- **Retourne** : `true` si invité, `false` sinon

---

## `sendReminder()`

Fonction cron — ne pas appeler depuis le front.

Envoie un email de rappel à tous les utilisateurs concernés par une réservation `confirmed` démarrant dans moins d'une heure. Crée une `Notification` de type `reminder` pour chaque personne notifiée.

- **Destinataires** : owner + participants avec statut `accepted`
- **Auth** : non requise
- **Déclenchement** : via `app/api/cron/reminder/route.ts`

---

## Séparation des responsabilités

| Modèle | Rôle |
|---|---|
| `ReservationParticipant` | Qui participe à la réservation (`pending` / `accepted` / `declined`) |
| `Notification` | Historique des communications envoyées (`confirmation`, `reminder`, `cancellation`) |
