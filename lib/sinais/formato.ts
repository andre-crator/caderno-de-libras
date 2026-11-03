// Regras do caderno de sinais (puras, testáveis): validação do formulário,
// tipo e caminho da mídia. As mesmas regras valem no banco (checks da tabela signs).

export const BUCKET_MIDIA = "sign-media";
export const MAX_BYTES_MIDIA = 20 * 1024 * 1024; // 20 MB, igual ao bucket
export const MAX_SEGUNDOS_VIDEO = 15;
export const LADO_MAXIMO_FOTO = 1280;

export type TipoSinal = "sinal" | "frase";
export type TipoMidia = "foto" | "video";

/** Campos que o formulário envia (texto livre dela). */
export type EntradaSinal = {
  kind?: string;
  word?: string;
  category?: string;
  lesson?: string;
  hand_shape?: string;
  location?: string;
  movement?: string;
  palm_orientation?: string;
  non_manual?: string;
  tip?: string;
  media_path?: string | null;
  media_type?: string | null;
};

export type DadosSinal = {
  kind: TipoSinal;
  word: string;
  category: string | null;
  lesson: string | null;
  hand_shape: string | null;
  location: string | null;
  movement: string | null;
  palm_orientation: string | null;
  non_manual: string | null;
  tip: string | null;
  media_path: string | null;
  media_type: TipoMidia | null;
};

const LIMITES: Record<string, number> = {
  word: 120,
  category: 40,
  lesson: 40,
  hand_shape: 400,
  location: 400,
  movement: 400,
  palm_orientation: 400,
  non_manual: 400,
  tip: 600,
};

const NOMES: Record<string, string> = {
  word: "Palavra",
  category: "Tema",
  lesson: "Aula",
  hand_shape: "Configuração de mão",
  location: "Ponto de articulação",
  movement: "Movimento",
  palm_orientation: "Orientação da palma",
  non_manual: "Expressão não manual",
  tip: "Dica",
};

/** Texto limpo: tira espaços das pontas e junta espaços repetidos; vazio vira null. */
export function limparTexto(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.replace(/\s+/g, " ").trim();
  return t === "" ? null : t;
}

/** O caminho da mídia precisa estar na pasta da dona: "<user_id>/<arquivo>". */
export function midiaNaPastaDe(userId: string, caminho: string): boolean {
  const partes = caminho.split("/");
  return partes.length === 2 && partes[0] === userId && /^[\w.-]+$/.test(partes[1]) && !partes[1].startsWith(".");
}

export type Validacao = { ok: true; dados: DadosSinal } | { ok: false; erros: string[] };

/** Valida e normaliza o formulário antes de gravar. */
export function validarSinal(entrada: EntradaSinal, userId: string): Validacao {
  const erros: string[] = [];
  const texto = Object.fromEntries(
    Object.keys(LIMITES).map((k) => [k, limparTexto(entrada[k as keyof EntradaSinal])]),
  ) as Record<string, string | null>;

  if (!texto.word) erros.push("Escreva a palavra ou a frase.");
  for (const [campo, limite] of Object.entries(LIMITES)) {
    const v = texto[campo];
    if (v && v.length > limite) erros.push(`${NOMES[campo]}: no máximo ${limite} letras.`);
  }

  const kind: TipoSinal = entrada.kind === "frase" ? "frase" : "sinal";

  const caminho = limparTexto(entrada.media_path);
  const tipo = entrada.media_type === "foto" || entrada.media_type === "video" ? entrada.media_type : null;
  if ((caminho === null) !== (tipo === null)) erros.push("A foto ou o vídeo não foi enviado direito. Tente de novo.");
  if (caminho && !midiaNaPastaDe(userId, caminho)) erros.push("A foto ou o vídeo não foi enviado direito. Tente de novo.");

  if (erros.length) return { ok: false, erros: [...new Set(erros)] };
  return {
    ok: true,
    dados: {
      kind,
      word: texto.word!,
      category: texto.category,
      lesson: texto.lesson,
      hand_shape: texto.hand_shape,
      location: texto.location,
      movement: texto.movement,
      palm_orientation: texto.palm_orientation,
      non_manual: texto.non_manual,
      tip: texto.tip,
      media_path: caminho,
      media_type: tipo,
    },
  };
}

/** Foto ou vídeo pelo tipo do arquivo; null = não aceito. */
export function tipoDaMidia(mime: string): TipoMidia | null {
  if (/^image\/(jpeg|png|webp)$/.test(mime)) return "foto";
  if (/^video\/(mp4|webm|quicktime)$/.test(mime)) return "video";
  return null;
}

const EXTENSOES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

/** Caminho novo no bucket: "<user_id>/<data>-<aleatório>.<ext>". */
export function novoCaminhoMidia(userId: string, mime: string, agora: Date, aleatorio: string): string {
  const ext = EXTENSOES[mime] ?? "bin";
  const data = agora.toISOString().slice(0, 10).replace(/-/g, "");
  const sufixo = aleatorio.replace(/[^a-z0-9]/gi, "").slice(0, 12) || "x";
  return `${userId}/${data}-${sufixo}.${ext}`;
}

/** Mensagem de erro do arquivo escolhido, ou null se estiver tudo certo. */
export function problemaNoArquivo(mime: string, bytes: number, segundosVideo?: number): string | null {
  const tipo = tipoDaMidia(mime);
  if (!tipo) return "Esse arquivo não é foto nem vídeo aceito (use JPG, PNG, MP4 ou do próprio celular).";
  if (bytes > MAX_BYTES_MIDIA) return "Arquivo grande demais (máximo 20 MB). Grave um vídeo mais curto.";
  if (tipo === "video" && segundosVideo !== undefined && segundosVideo > MAX_SEGUNDOS_VIDEO + 0.5) {
    return `Vídeo com mais de ${MAX_SEGUNDOS_VIDEO} segundos. Grave só o sinal, curtinho.`;
  }
  return null;
}

/** Novo tamanho da foto mantendo a proporção, com o lado maior até o limite. */
export function tamanhoReduzido(largura: number, altura: number, max = LADO_MAXIMO_FOTO) {
  const maior = Math.max(largura, altura);
  if (maior <= max) return { largura, altura };
  const f = max / maior;
  return { largura: Math.round(largura * f), altura: Math.round(altura * f) };
}
