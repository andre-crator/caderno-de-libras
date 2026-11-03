import type { Metadata } from "next";
import Link from "next/link";
import { Soletrar } from "./Soletrar";
import styles from "./soletrar.module.css";

export const metadata: Metadata = { title: "Soletrar" };

// Página pública: o treino não usa dados dela, então funciona sem login.
export default function SoletrarPage() {
  return (
    <main className={styles.page}>
      <Link href="/painel" className={styles.voltar}>
        ← Início
      </Link>
      <header>
        <h1 className={styles.titulo}>Soletrar</h1>
        <p className={styles.sub}>
          As letras ou os números aparecem um de cada vez. Faça o sinal junto, no seu ritmo.
        </p>
      </header>
      <Soletrar />
      <section className={styles.links}>
        <h2>Para conferir um sinal</h2>
        <ul>
          <li>
            <a href="https://www.ines.gov.br/dicionario-de-libras/" target="_blank" rel="noopener noreferrer">
              Dicionário de Libras do INES
            </a>
          </li>
          <li>
            <a href="https://www.spreadthesign.com/pt.br/" target="_blank" rel="noopener noreferrer">
              Spread The Sign
            </a>
          </li>
        </ul>
        <p>Sinais variam por região. Na dúvida, vale o que a professora ensinou.</p>
      </section>
    </main>
  );
}
