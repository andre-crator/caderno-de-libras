"use client";
import { useState } from "react";
import { marcarAula } from "@/lib/aulas/acoes";
import styles from "@/app/aulas/aulas.module.css";

export function BotaoConcluir({ slug, concluida }: { slug: string; concluida: boolean }) {
  const [feita, setFeita] = useState(concluida);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(false);

  async function alternar() {
    setSalvando(true);
    setErro(false);
    let ok = false;
    try {
      ok = (await marcarAula(slug, !feita)).ok;
    } catch {
      ok = false;
    }
    setSalvando(false);
    if (ok) setFeita(!feita);
    else setErro(true);
  }

  return (
    <div className={styles.concluir}>
      <button
        type="button"
        className={feita ? styles.botaoFeito : styles.botaoPrincipal}
        onClick={alternar}
        disabled={salvando}
        aria-pressed={feita}
      >
        {salvando ? "Salvando…" : feita ? "✓ Aula concluída" : "Concluí esta aula"}
      </button>
      {erro && <p className={styles.erro} role="status">Não deu para salvar. Confira a internet e tente de novo.</p>}
    </div>
  );
}
