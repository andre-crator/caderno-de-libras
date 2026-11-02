import Link from "next/link";

export default function Home() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "var(--spacing-16) var(--spacing-4)" }}>
      <h1 style={{ fontFamily: "var(--font-family-display)", fontSize: "2.5rem", margin: 0 }}>
        Caderno de Libras
      </h1>
      <p style={{ color: "var(--muted-foreground)" }}>
        Anote os sinais das aulas, revise e treine a datilologia.
      </p>
      <Link href="/painel" style={{ color: "var(--primary)", fontWeight: 500 }}>
        Ir para o painel →
      </Link>
    </main>
  );
}
