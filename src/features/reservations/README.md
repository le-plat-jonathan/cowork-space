# Reservations — Server Actions

Fichier : `src/features/reservations/reservations.ts`

---

**Fonction** : `getUserReservations`

**Utilité** : Retourne toutes les réservations de l'utilisateur connecté, triées par date de début croissante

**Params entrée** : aucun

**Sortie** : `Reservation[]`

---

**Fonction** : `createReservation`

**Utilité** : Crée une réservation après vérification de la disponibilité du space, puis invite les participants

**Params entrée** :
- `startTime: Date` — début de la réservation
- `endTime: Date` — fin de la réservation
- `idSpace: string` — ID du space à réserver
- `is_private: boolean` — réservation privée
- `is_recurrent: boolean` — réservation récurrente
- `reason: string` — motif
- `participantIds: string[]` — IDs des utilisateurs à inviter (meeting_room uniquement)

**Sortie** : `true` si créée, `false` si space indisponible

---

**Fonction** : `checkSpaceAvailability`

**Utilité** : Vérifie si un space est disponible sur un créneau donné. Pour un `meeting_room`, vérifie l'absence de conflit. Pour un `open_space`, vérifie que la capacité n'est pas atteinte

**Params entrée** :
- `idSpace: string`
- `startTime: Date`
- `endTime: Date`

**Sortie** : `true` si disponible, `false` sinon

---

**Fonction** : `checkCapacityMeetingRoom`

**Utilité** : Retourne le nombre de places restantes dans un open space sur un créneau donné

**Params entrée** :
- `idEspace: string`
- `startTime: Date`
- `endTime: Date`

**Sortie** : `-1` si espace invalide, `0` si complet, `> 0` nombre de places disponibles

---

**Fonction** : `canceledReservation`

**Utilité** : Annule une réservation (owner uniquement)

**Params entrée** :
- `idReservation: string`

**Sortie** : `true` si annulée, `false` si introuvable ou non propriétaire

---

**Fonction** : `updateReservation`

**Utilité** : Modifie les champs d'une réservation existante (owner uniquement). Tous les champs sauf `idReservation` sont optionnels

**Params entrée** :
- `idReservation: string`
- `startTime?: Date`
- `endTime?: Date`
- `idSpace?: string`
- `is_private?: boolean`
- `is_recurrent?: boolean`
- `reason?: string`

**Sortie** : `true` si modifiée, `false` si introuvable ou non propriétaire

---

**Fonction** : `getReservationById`

**Utilité** : Retourne le détail d'une réservation avec ses participants. Accessible uniquement au owner ou aux participants

**Params entrée** :
- `reservationId: string`

**Sortie** : `Reservation & { participants }` ou `null` si introuvable / accès refusé

---

**Fonction** : `getReservationParticipants`

**Utilité** : Retourne le owner et la liste des participants d'une réservation. Accessible uniquement au owner ou aux participants

**Params entrée** :
- `reservationId: string`

**Sortie** : `{ owner: User, participants: (User & { status })[] }` ou `null` si introuvable / accès refusé

---

**Fonction** : `getAllReservation`

**Utilité** : Retourne toutes les réservations (admin uniquement)

**Params entrée** : aucun

**Sortie** : `Reservation[]` ou `null` si aucune réservation
