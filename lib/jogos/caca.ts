// Caça ao sinal (jogo 5, puro e testável): 3 missões por semana com palavras do tema da
// aula em que ela está. Cumprir = guardar o sinal no caderno, aprendido com a professora
// (ou conferido num dicionário). O app só sugere a PALAVRA: o sinal vem dela (D2).
// As missões ficam fixas a semana toda: sorteio com semente = segunda-feira da semana.
import type { Aula } from "@/lib/aulas/conteudo";
import { inicioDoDiaEmBrasilia } from "@/lib/revisao/agenda";
import { normalizarPalavra, VOCABULARIO } from "@/lib/curso/vocabulario";

export const MISSOES_POR_SEMANA = 3;
const DIA_MS = 24 * 60 * 60 * 1000;

/** Meia-noite (Brasília) da segunda-feira desta semana. */
export function inicioDaSemana(agora: Date): Date {
  const hoje = inicioDoDiaEmBrasilia(agora, 0);
  // Dia da semana em Brasília: hoje + 3 h já está em UTC na mesma data local.
  const diaSemana = new Date(hoje.getTime() + 3 * 60 * 60 * 1000).getUTCDay(); // 0 = domingo
  const desdeSegunda = (diaSemana + 6) % 7;
  return new Date(hoje.getTime() - desdeSegunda * DIA_MS);
}

/** Gerador simples com semente (mulberry32): mesmo número, mesma sequência. */
function aleatorioComSemente(semente: number): () => number {
  let a = semente >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Temas da caça: os da aula atual ou, se ela for de teoria, os da próxima aula com lista. */
export function temasDaCaca(aulas: readonly Aula[], atualSlug: string | null): string[] {
  const i = Math.max(0, aulas.findIndex((a) => a.slug === atualSlug));
  const comLista = [...aulas.slice(i), ...aulas.slice(0, i)].find((a) => a.temas.some((t) => VOCABULARIO[t]));
  return comLista ? comLista.temas.filter((t) => VOCABULARIO[t]) : [];
}

export type SinalCaca = { word: string; created_at: string };
export type Missao = { palavra: string; tema: string; feita: boolean };

/**
 * 3 palavras dos temas que ela ainda não tinha guardado quando a semana começou.
 * O que ela guarda durante a semana marca a missão como feita (não troca a missão).
 */
export function missoesDaSemana(temas: readonly string[], sinais: readonly SinalCaca[], agora: Date): Missao[] {
  const semana = inicioDaSemana(agora);
  const antes = new Set(
    sinais.filter((s) => new Date(s.created_at) < semana).map((s) => normalizarPalavra(s.word)),
  );
  const agoraTem = new Set(sinais.map((s) => normalizarPalavra(s.word)));
  const candidatas = temas.flatMap((tema) =>
    (VOCABULARIO[tema] ?? []).filter((p) => !antes.has(normalizarPalavra(p))).map((palavra) => ({ palavra, tema })),
  );
  const aleatorio = aleatorioComSemente(Math.floor(semana.getTime() / DIA_MS));
  for (let i = candidatas.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [candidatas[i], candidatas[j]] = [candidatas[j], candidatas[i]];
  }
  return candidatas
    .slice(0, MISSOES_POR_SEMANA)
    .map((m) => ({ ...m, feita: agoraTem.has(normalizarPalavra(m.palavra)) }));
}
