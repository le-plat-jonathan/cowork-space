import { getRequiredUser } from "@/lib/auth/auth-user";
import { nanoid } from "nanoid";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 500 * 1024; // 500 Ko

export async function POST(request: Request) {
  await getRequiredUser();

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return Response.json({ error: "Aucun fichier fourni" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json({ error: "Format non supporté" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return Response.json(
      { error: "Image trop grande (max 500 Ko)" },
      { status: 400 },
    );
  }

  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const filename = `${new Date().toISOString().slice(0, 10)}-${nanoid(5)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await writeFile(path.join(uploadDir, filename), buffer);

  return Response.json({ url: `/uploads/${filename}` });
}
