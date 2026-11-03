import Link from "next/link";
import styles from "./page.module.css";

const PASSOS = [
  { titulo: "Guarde", texto: "Foto ou vídeo de cada sinal que a professora ensinar." },
  { titulo: "Revise", texto: "Cartões rápidos de 10 a 15 minutos, no ônibus ou antes de dormir." },
  { titulo: "Treine", texto: "Alfabeto manual e números, no seu ritmo." },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <header className={styles.marca}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/icon.svg" alt="" width={48} height={48} />
        <span>Incluir</span>
      </header>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Seu caderno de Libras</p>
        <h1 className={styles.titulo}>Aprenda um sinal por dia e não esqueça mais.</h1>
        <Link href="/login?next=/painel" className={styles.cta}>
          Começar
        </Link>
      </section>

      <ol className={styles.passos}>
        {PASSOS.map((p) => (
          <li key={p.titulo} className={styles.passo}>
            <strong>{p.titulo}</strong>
            <span>{p.texto}</span>
          </li>
        ))}
      </ol>
    </main>
  );
}
