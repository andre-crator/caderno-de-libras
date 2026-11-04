// Tela inicial do app (privada). O proxy.ts já barra quem não está logado, mas a
// página confere de novo: defesa em camadas.
// Desenho: 1 botão grande com o que fazer agora, 3 números de progresso,
// "primeiros passos" para quem está começando e atalhos para as 4 áreas.
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { resumoDoPainel } from "@/lib/painel/resumo";
import { dataDeHoje, primeiroNome, primeirosPassos, saudacao, sugestaoDeAgora } from "@/lib/painel/agora";
import { AULAS } from "@/lib/aulas/conteudo";
import { lerMeta } from "@/lib/meta/dados";
import { resumoDaSemana } from "@/lib/meta/semana";
import { CartaoMeta } from "@/components/meta/CartaoMeta";
import { Icone, type NomeIcone } from "@/components/Icone";
import styles from "./painel.module.css";

export const metadata: Metadata = { title: "Início" };

const ATALHOS: { href: string; titulo: string; texto: string; icone: NomeIcone }[] = [
  { href: "/aulas", titulo: "Aulas", texto: "Explicação e vídeos de cada tema", icone: "aulas" },
  { href: "/caderno", titulo: "Meu caderno", texto: "Seus sinais com foto ou vídeo", icone: "caderno" },
  { href: "/revisar", titulo: "Revisar", texto: "Cartões rápidos para não esquecer", icone: "revisar" },
  { href: "/soletrar", titulo: "Soletrar", texto: "Alfabeto manual e números", icone: "soletrar" },
];

export default function PainelPage() {
  return (
    <main className={styles.page}>
      <Suspense fallback={<Esqueleto />}>
        <Conteudo />
      </Suspense>
    </main>
  );
}

function Esqueleto() {
  return (
    <div aria-busy="true" className={styles.esqueletoBloco}>
      <div className={styles.esqTitulo} />
      <div className={styles.esqHero} />
      <div className={styles.esqLinha} />
    </div>
  );
}

async function Conteudo() {
  const [r, m] = await Promise.all([resumoDoPainel(), lerMeta()]);
  if (!r || !m) redirect("/login?next=/painel");
  const semana = resumoDaSemana(m.dias, m.meta, new Date());

  const agora = sugestaoDeAgora(r);
  const passos = primeirosPassos({ aulasFeitas: r.feitas.size, sinais: r.sinais, revisados: r.revisados });
  const mostrarPassos = passos.some((p) => !p.feito);
  const nome = primeiroNome(r.nome);
  const pctAulas = Math.round((r.feitas.size / AULAS.length) * 100);

  return (
    <>
      <header className={styles.topo}>
        <div>
          <p className={styles.data}>{dataDeHoje(new Date())}</p>
          <h1 className={styles.ola}>
            {saudacao(new Date())}
            {nome ? `, ${nome}` : ""}!
          </h1>
        </div>
        <form action="/auth/signout" method="post">
          <button type="submit" className={styles.sair}>
            <Icone nome="sair" tamanho={20} />
            Sair
          </button>
        </form>
      </header>

      {r.erro && (
        <p className={styles.aviso} role="status">
          Alguns números não carregaram. Confira a internet e abra de novo.
        </p>
      )}

      <section className={styles.hero} aria-labelledby="agora-titulo">
        <p className={styles.heroRotulo}>Agora</p>
        <h2 id="agora-titulo" className={styles.heroTitulo}>
          {agora.titulo}
        </h2>
        <p className={styles.heroTexto}>{agora.detalhe}</p>
        <Link href={agora.href} className={styles.heroBotao}>
          {agora.botao}
          <Icone nome="seta" tamanho={20} />
        </Link>
      </section>

      <section aria-label="Seu progresso" className={styles.numeros}>
        <Link href="/aulas" className={styles.numero}>
          <strong>
            {r.feitas.size}
            <small>/{AULAS.length}</small>
          </strong>
          <span>aulas</span>
          <span className={styles.barrinha} aria-hidden="true">
            <span style={{ width: `${pctAulas}%` }} />
          </span>
        </Link>
        <Link href="/caderno" className={styles.numero}>
          <strong>{r.sinais}</strong>
          <span>{r.sinais === 1 ? "sinal guardado" : "sinais guardados"}</span>
        </Link>
        <Link href="/revisar" className={styles.numero} data-alerta={r.vencidos > 0 ? "" : undefined}>
          <strong>{r.vencidos}</strong>
          <span>para revisar</span>
        </Link>
      </section>

      <CartaoMeta semana={semana} />

      {mostrarPassos && (
        <section className={styles.passos} aria-labelledby="passos-titulo">
          <h2 id="passos-titulo">Primeiros passos</h2>
          <ol>
            {passos.map((p) => (
              <li key={p.texto} data-feito={p.feito ? "" : undefined}>
                <span className={styles.bolinha} aria-hidden="true">
                  {p.feito && <Icone nome="check" tamanho={16} />}
                </span>
                {p.feito ? (
                  <span className={styles.passoFeito}>
                    {p.texto} <span className={styles.somenteLeitor}>(feito)</span>
                  </span>
                ) : (
                  <Link href={p.href}>{p.texto}</Link>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      <section aria-labelledby="atalhos-titulo">
        <h2 id="atalhos-titulo" className={styles.secaoTitulo}>
          Estudar
        </h2>
        <ul className={styles.atalhos}>
          {ATALHOS.map((a) => (
            <li key={a.href}>
              <Link href={a.href} className={styles.atalho} data-area={a.icone}>
                <span className={styles.atalhoIcone}>
                  <Icone nome={a.icone} tamanho={26} />
                </span>
                <strong>{a.titulo}</strong>
                <span>{a.texto}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
