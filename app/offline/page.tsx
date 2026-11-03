import type { Metadata } from "next";
import Link from "next/link";
import styles from "./offline.module.css";

export const metadata: Metadata = { title: "Sem internet" };

// Tela mostrada pelo service worker quando não há internet e a página nunca foi aberta.
export default function OfflinePage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.titulo}>Sem internet agora</h1>
      <p>Esta tela ainda não foi aberta neste celular, então não dá para mostrar sem internet.</p>
      <ul className={styles.lista}>
        <li>O treino de <strong>soletrar</strong> funciona sem internet.</li>
        <li>O caderno e os sinais que você já abriu continuam aparecendo.</li>
        <li>Guardar sinal e salvar a revisão precisam de internet.</li>
      </ul>
      <div className={styles.acoes}>
        <Link href="/soletrar" className={styles.botao}>
          Treinar soletrar
        </Link>
        <Link href="/caderno" className={styles.botaoSecundario}>
          Abrir o caderno
        </Link>
      </div>
    </main>
  );
}
