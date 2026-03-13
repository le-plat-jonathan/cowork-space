# Reservations — Server Actions

Fichier : `src/features/reservations/reservations.ts`

---

**fonction** : `getUserReservations`
**utilité** : Retourne toutes les réservations de l'utilisateur connecté, triées par date de début croissante
**params entrée** : aucun
**sortie** : `Reservation[]`

---

**fonction** : `createReservation`
**utilité** : Crée une réservation après vérification de la disponibilité du space, puis invite les participants
**params entrée** :
- `startTime: Date` — début de la réservation
- `endTime: Date` — fin de la réservation
- `idSpace: string` — ID du space à réserver
- `is_private: boolean` — réservation privée
- `is_recurrent: boolean` — réservation récurrente
- `reason: string` — motif
- `participantIds: string[]` — IDs des utilisateurs à inviter (meeting_room uniquement)

**sortie** : `true` si créée, `false` si space indisponible

---

**fonction** : `checkSpaceAvailability`
**utilité** : Vérifie si un space est disponible sur un créneau donné. Pour un `meeting_room`, vérifie l'absence de conflit. Pour un `open_space`, vérifie que la capacité n'est pas atteinte
**params entrée** :
- `idSpace: string`
- `startTime: Date`
- `endTime: Date`

**sortie** : `true` si disponible, `false` sinon

---

**fonction** : `checkCapacityMeetingRoom`
**utilité** : Retourne le nombre de places restantes dans un open space sur un créneau donné
**params entrée** :
- `idEspace: string`
- `startTime: Date`
- `endTime: Date`

**sortie** : `-1` si espace invalide, `0` si complet, `> 0` nombre de places disponibles

---

**fonction** : `canceledReservation`
**utilité** : Annule une réservation (owner uniquement)
**params entrée** :
- `idReservation: string`

**sortie** : `true` si annulée, `false` si introuvable ou non propriétaire

---

**fonction** : `updateReservation`
**utilité** : Modifie les champs d'une réservation existante (owner uniquement). Tous les champs sauf `idReservation` sont optionnels
**params entrée** :
- `idReservation: string`
- `startTime?: Date`
- `endTime?: Date`
- `idSpace?: string`
- `is_private?: boolean`
- `is_recurrent?: boolean`
- `reason?: string`

**sortie** : `true` si modifiée, `false` si introuvable ou non propriétaire

---

**fonction** : `getReservationById`
**utilité** : Retourne le détail d'une réservation avec ses participants. Accessible uniquement au owner ou aux participants
**params entrée** :
- `reservationId: string`

**sortie** : `Reservation & { participants }` ou `null` si introuvable / accès refusé

---

**fonction** : `getReservationParticipants`
**utilité** : Retourne le owner et la liste des participants d'une réservation. Accessible uniquement au owner ou aux participants
**params entrée** :
- `reservationId: string`

**sortie** : `{ owner: User, participants: (User & { status })[] }` ou `null` si introuvable / accès refusé

---

**fonction** : `getAllReservation`
**utilité** : Retourne toutes les réservations (admin uniquement)
**params entrée** : aucun
**sortie** : `Reservation[]` ou `null` si aucune réservation
