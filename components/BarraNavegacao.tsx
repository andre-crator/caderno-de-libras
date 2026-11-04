"use client";
// Barra fixa embaixo (como nos apps de celular): as 5 áreas sempre à mão.
// Não aparece na home pública, no login nem nas telas de autenticação.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icone, type NomeIcone } from "./Icone";
import styles from "./BarraNavegacao.module.css";

const ITENS: { href: string; rotulo: string; icone: NomeIcone }[] = [
  { href: "/painel", rotulo: "Início", icone: "inicio" },
  { href: "/aulas", rotulo: "Aulas", icone: "aulas" },
  { href: "/caderno", rotulo: "Caderno", icone: "caderno" },
  { href: "/revisar", rotulo: "Revisar", icone: "revisar" },
  { href: "/soletrar", rotulo: "Soletrar", icone: "soletrar" },
];

const SEM_BARRA = ["/login", "/auth", "/offline"];

export function rotaTemBarra(pathname: string): boolean {
  return pathname !== "/" && !SEM_BARRA.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function BarraNavegacao() {
  const pathname = usePathname() ?? "/";
  if (!rotaTemBarra(pathname)) return null;
  return (
    <>
      <div className={styles.espaco} aria-hidden="true" />
      <nav className={styles.barra} aria-label="Navegação principal">
        {ITENS.map((i) => {
          const ativo = pathname === i.href || pathname.startsWith(`${i.href}/`);
          return (
            <Link key={i.href} href={i.href} className={styles.item} aria-current={ativo ? "page" : undefined}>
              <Icone nome={i.icone} />
              <span>{i.rotulo}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
