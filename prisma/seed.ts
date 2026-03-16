import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import * as dotenv from "dotenv"

dotenv.config()

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding open_space tables…")

  // Ne touche pas aux meeting rooms
  await prisma.space.deleteMany({ where: { type: "open_space" } })

  const tables = [
    // 1 table capacity 10 — poste isolé (grand)
    { nom: "Table Grande", capacity: 10, position_x: 336, position_y: 520 },

    // 3 tables capacity 6 — rangée haute
    { nom: "Table A1", capacity: 6, position_x: 654, position_y: 348 },
    { nom: "Table A2", capacity: 6, position_x: 728, position_y: 348 },
    { nom: "Table A3", capacity: 6, position_x: 795, position_y: 348 },

    // 6 tables capacity 6 — rangée y=440
    { nom: "Table B1", capacity: 6, position_x: 438, position_y: 440 },
    { nom: "Table B2", capacity: 6, position_x: 512, position_y: 440 },
    { nom: "Table B3", capacity: 6, position_x: 584, position_y: 440 },
    { nom: "Table B4", capacity: 6, position_x: 656, position_y: 440 },
    { nom: "Table B5", capacity: 6, position_x: 728, position_y: 440 },
    { nom: "Table B6", capacity: 6, position_x: 795, position_y: 440 },

    // 3 tables capacity 6 — première moitié rangée y=512
    { nom: "Table C1", capacity: 6, position_x: 438, position_y: 512 },
    { nom: "Table C2", capacity: 6, position_x: 512, position_y: 512 },
    { nom: "Table C3", capacity: 6, position_x: 584, position_y: 512 },

    // 3 tables capacity 4 — deuxième moitié rangée y=512
    { nom: "Table C4", capacity: 4, position_x: 656, position_y: 512 },
    { nom: "Table C5", capacity: 4, position_x: 728, position_y: 512 },
    { nom: "Table C6", capacity: 4, position_x: 795, position_y: 512 },

    // 6 tables capacity 4 — rangée y=584
    { nom: "Table D1", capacity: 4, position_x: 438, position_y: 584 },
    { nom: "Table D2", capacity: 4, position_x: 512, position_y: 584 },
    { nom: "Table D3", capacity: 4, position_x: 584, position_y: 584 },
    { nom: "Table D4", capacity: 4, position_x: 656, position_y: 584 },
    { nom: "Table D5", capacity: 4, position_x: 728, position_y: 584 },
    { nom: "Table D6", capacity: 4, position_x: 795, position_y: 584 },

    // 6 tables capacity 4 — rangée y=658
    { nom: "Table E1", capacity: 4, position_x: 438, position_y: 658 },
    { nom: "Table E2", capacity: 4, position_x: 512, position_y: 658 },
    { nom: "Table E3", capacity: 4, position_x: 584, position_y: 658 },
    { nom: "Table E4", capacity: 4, position_x: 656, position_y: 658 },
    { nom: "Table E5", capacity: 4, position_x: 728, position_y: 658 },
    { nom: "Table E6", capacity: 4, position_x: 795, position_y: 658 },
  ]

  for (const t of tables) {
    await prisma.space.create({
      data: {
        nom: t.nom,
        type: "open_space",
        capacity: t.capacity,
        description: `Table open space — ${t.capacity} place${t.capacity > 1 ? "s" : ""}`,
        plan: "plan.png",
        position_x: t.position_x,
        position_y: t.position_y,
      },
    })
  }

  const cap10 = tables.filter((t) => t.capacity === 10).length
  const cap6 = tables.filter((t) => t.capacity === 6).length
  const cap4 = tables.filter((t) => t.capacity === 4).length
  console.log(`✓ ${tables.length} tables créées (capacity 10: ${cap10}, capacity 6: ${cap6}, capacity 4: ${cap4})`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
