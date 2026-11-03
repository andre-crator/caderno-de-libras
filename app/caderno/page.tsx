import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { listarSinais } from "@/lib/sinais/dados";
import { MidiaSinal } from "@/components/caderno/MidiaSinal";
import styles from "./caderno.module.css";

export const metadata: Metadata = { title: "Meu caderno" };

type SearchParams = Promise<{ q?: string; tema?: string }>;

export default function CadernoPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className={styles.page}>
      <Link href="/painel" className={styles.voltar}>
        ← Início
      </Link>
      <header className={styles.topo}>
        <h1 className={styles.titulo}>Meu caderno</h1>
        <div className={styles.acoes}>
          <Link href="/caderno/novo" className={styles.botaoPrincipal}>
            + Guardar sinal
          </Link>
          <Link href="/caderno/temas" className={styles.botaoSecundario}>
            Listas de estudo
          </Link>
        </div>
      </header>
      <Suspense fallback={<div className={styles.esqueleto} aria-busy="true" />}>
        <Lista searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

function normal(t: string) {
  return t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLocaleLowerCase("pt-BR");
}

async function Lista({ searchParams }: { searchParams: SearchParams }) {
  const sinais = await listarSinais();
  if (!sinais) redirect("/login?next=/caderno");
  const { q = "", tema = "" } = await searchParams;

  if (sinais.length === 0) {
    return (
      <div className={styles.vazio}>
        <h2>Seu caderno ainda está vazio</h2>
        <p>
          Depois da aula, guarde cada sinal novo com uma foto ou um vídeo curtinho. Ou abra as listas de estudo
          e escolha uma palavra.
        </p>
        <Link href="/caderno/novo" className={styles.botaoPrincipal}>
          Guardar o primeiro sinal
        </Link>
      </div>
    );
  }

  const temas = [...new Set(sinais.map((s) => s.category).filter((c): c is string => !!c))].sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );
  const busca = normal(q.trim());
  const visiveis = sinais.filter(
    (s) => (!tema || s.category === tema) && (!busca || normal(s.word).includes(busca) || normal(s.tip ?? "").includes(busca)),
  );

  return (
    <>
      <form className={styles.busca} role="search">
        <input
          id="caderno-busca"
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar palavra"
          aria-label="Buscar palavra"
        />
        {tema && <input type="hidden" name="tema" value={tema} />}
        <button type="submit" className={styles.botaoSecundario}>
          Buscar
        </button>
      </form>
      {temas.length > 0 && (
        <nav className={styles.chips} aria-label="Filtrar por tema">
          <Link href={q ? `/caderno?q=${encodeURIComponent(q)}` : "/caderno"} aria-current={!tema ? "page" : undefined}>
            Todos ({sinais.length})
          </Link>
          {temas.map((t) => (
            <Link
              key={t}
              href={`/caderno?tema=${encodeURIComponent(t)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              aria-current={tema === t ? "page" : undefined}
            >
              {t}
            </Link>
          ))}
        </nav>
      )}
      {visiveis.length === 0 ? (
        <p className={styles.ajuda}>Nada encontrado com esse filtro.</p>
      ) : (
        <ul className={styles.lista}>
          {visiveis.map((s) => (
            <li key={s.id}>
              <Link href={`/caderno/${s.id}`} className={styles.item}>
                <MidiaSinal url={s.media_url} tipo={s.media_type} palavra={s.word} pequena />
                <span className={styles.itemTexto}>
                  <strong>{s.word}</strong>
                  <span>{[s.kind === "frase" ? "Frase" : null, s.category, s.lesson].filter(Boolean).join(" · ") || "Sem tema"}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
