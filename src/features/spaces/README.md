# Spaces — Server Actions

Fichier : `src/features/spaces/space.ts`

---

**Fonction** : `getSpaces`

**Utilité** : Retourne tous les espaces disponibles

**Params entrée** : aucun

**Sortie** : `Space[]` (tableau vide si aucun espace)

---

**Fonction** : `getSpacesById`

**Utilité** : Retourne un espace par son ID

**Params entrée** :
- `spaceId: string` — ID de l'espace

**Sortie** : `Space` ou `null` si introuvable

---

**Fonction** : `getSpaceQuery`

**Utilité** : Cherche des espaces par nom (insensible à la casse)

**Params entrée** :
- `query: string` — texte à chercher dans le nom

**Sortie** : `Space[]` (tableau vide si aucun résultat)
