const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export interface ParsedFile {
  buffer: Buffer;
  mime: string;
  name: string;
}

function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return "Formato não suportado. Use JPEG, PNG, WebP ou AVIF.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "Arquivo muito grande (máx. 5MB)";
  }
  return null;
}

export async function parseSingleImage(
  form: FormData,
  field = "file"
): Promise<{ file: ParsedFile; folder?: string } | { error: string; status: number }> {
  const entry = form.get(field);
  if (!entry || !(entry instanceof File)) {
    return { error: "Arquivo obrigatório (campo: file)", status: 400 };
  }
  const err = validateFile(entry);
  if (err) return { error: err, status: 400 };
  const buffer = Buffer.from(await entry.arrayBuffer());
  const folder = form.get("folder");
  return {
    file: { buffer, mime: entry.type, name: entry.name },
    folder: typeof folder === "string" ? folder : undefined,
  };
}

export async function parseMultipleImages(
  form: FormData,
  field = "files",
  max = 12
): Promise<{ files: ParsedFile[]; folder?: string } | { error: string; status: number }> {
  const entries = form.getAll(field).filter((e): e is File => e instanceof File);
  if (!entries.length) {
    return { error: "Envie ao menos um arquivo (campo: files)", status: 400 };
  }
  if (entries.length > max) {
    return { error: `Máximo de ${max} arquivos`, status: 400 };
  }
  const files: ParsedFile[] = [];
  for (const entry of entries) {
    const err = validateFile(entry);
    if (err) return { error: err, status: 400 };
    files.push({
      buffer: Buffer.from(await entry.arrayBuffer()),
      mime: entry.type,
      name: entry.name,
    });
  }
  const folder = form.get("folder");
  return {
    files,
    folder: typeof folder === "string" ? folder : undefined,
  };
}
