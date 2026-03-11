# Reservations — Server Actions

Fichier : `src/features/reservations/reservations.ts`

---

## `getUserReservations()`

Retourne toutes les réservations de l'utilisateur connecté, triées par date de début croissante.

- **Auth** : requise
- **Paramètres** : aucun
- **Retourne** : `Reservation[]`

---

## `createReservation(startTime, endTime, idSpace, is_private, is_recurrent, reason)`

Crée une réservation après vérification de la disponibilité du space.

- **Auth** : requise

| Paramètre | Type | Description |
|---|---|---|
| `startTime` | `Date` | Début de la réservation |
| `endTime` | `Date` | Fin de la réservation |
| `idSpace` | `string` | ID du space à réserver |
| `is_private` | `boolean` | Réservation privée |
| `is_recurrent` | `boolean` | Réservation récurrente |
| `reason` | `string` | Motif de la réservation |

- **Retourne** : `true` si créée, `false` si space indisponible

---

## `checkSpaceAvailability(idSpace, startTime, endTime)`

Vérifie si un space est disponible sur un créneau donné.

- **Auth** : non requise
- Comportement selon le type de space :
  - **`meeting_room`** : vérifie qu'aucune réservation non annulée ne se chevauche
  - **`open_space`** : vérifie que la capacité maximale n'est pas atteinte

| Paramètre | Type | Description |
|---|---|---|
| `idSpace` | `string` | ID du space |
| `startTime` | `Date` | Début du créneau |
| `endTime` | `Date` | Fin du créneau |

- **Retourne** : `true` si disponible, `false` sinon

---

## `checkCapacityMeetingRoom(idEspace, startTime, endTime)`

Retourne le nombre de places restantes dans un open space sur un créneau donné.

- **Auth** : non requise

| Paramètre | Type | Description |
|---|---|---|
| `idEspace` | `string` | ID de l'open space |
| `startTime` | `Date` | Début du créneau |
| `endTime` | `Date` | Fin du créneau |

- **Retourne** :

| Valeur | Signification |
|---|---|
| `-1` | Space invalide ou pas un open_space |
| `0` | Complet |
| `> 0` | Nombre de places disponibles |
