"use client";

import { useEffect, useRef, useState } from "react";
import {
  CONTEXTOS,
  FAIXAS,
  type FaixaId,
  type Modo,
  itensParaSoletrar,
  limitarTempo,
  sortearNumero,
  sortearPalavra,
} from "@/lib/soletrar/sequencia";
import styles from "./soletrar.module.css";

// Treino de datilologia e números: mostra um item por vez, no ritmo escolhido,
// para ela sinalizar junto. "Esconder" serve para alguém soletrar e ela ler.
export function Soletrar() {
  const [modo, setModo] = useState<Modo>("letras");
  const [faixa, setFaixa] = useState<FaixaId>("10-99");
  const [texto, setTexto] = useState("LIBRAS");
  const [tempo, setTempo] = useState(1.2);
  const [esconder, setEsconder] = useState(false);
  const [atual, setAtual] = useState(-1); // índice do item na tela; -1 = parado
  const [fim, setFim] = useState(false);
  const [rodando, setRodando] = useState(false);
  const itens = itensParaSoletrar(texto, modo);
  const emGrupos = modo === "numeros" && /[/:,]|R\$/.test(texto);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!rodando) return;
    timer.current = setTimeout(() => {
      if (atual + 1 >= itens.length) {
        setRodando(false);
        setFim(true);
      } else {
        setAtual(atual + 1);
      }
    }, tempo * 1000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [rodando, atual, itens.length, tempo]);

  function iniciar(novoTexto = texto) {
    if (itensParaSoletrar(novoTexto, modo).length === 0) return;
    setFim(false);
    setAtual(0);
    setRodando(true);
  }

  function parar() {
    setRodando(false);
    setAtual(-1);
    setFim(false);
  }

  function sortear() {
    const novo = modo === "letras" ? sortearPalavra() : sortearNumero(faixa);
    setTexto(novo);
    setFim(false);
    setAtual(-1);
    setRodando(false);
    if (esconder) {
      // No modo de leitura a palavra nem aparece: já começa a soletrar.
      setAtual(0);
      setRodando(true);
    }
  }

  function trocarModo(m: Modo) {
    parar();
    setModo(m);
    setTexto(m === "letras" ? "LIBRAS" : sortearNumero(faixa));
  }

  const grande = fim ? "✓" : atual >= 0 ? itens[atual] : (itens[0] ?? "?");
  const progresso = itens.length ? Math.round(((fim ? itens.length : atual + 1) / itens.length) * 100) : 0;

  return (
    <div className={styles.treino}>
      <div className={styles.abas} role="group" aria-label="O que treinar">
        <button type="button" aria-pressed={modo === "letras"} onClick={() => trocarModo("letras")}>
          Alfabeto
        </button>
        <button type="button" aria-pressed={modo === "numeros"} onClick={() => trocarModo("numeros")}>
          Números
        </button>
      </div>

      <div className={styles.palco} aria-live="polite">
        <span key={`${atual}-${fim}`} className={styles.letra}>
          {grande}
        </span>
        <span className={styles.linha} aria-label={esconder && !fim ? "Palavra escondida" : texto}>
          {emGrupos
            ? // Data, hora e dinheiro: mostra o texto como se escreve, destacando o grupo atual.
              texto.split(/(\d+)/).map((parte, k) => {
                if (!/^\d+$/.test(parte)) return <span key={k}>{esconder && !fim ? "" : parte}</span>;
                const i = texto.split(/(\d+)/).slice(0, k).filter((x) => /^\d+$/.test(x)).length;
                return (
                  <span
                    key={k}
                    className={i === atual && !fim ? styles.atualItem : i < atual || fim ? styles.feito : undefined}
                  >
                    {esconder && !fim ? "•" : parte}
                  </span>
                );
              })
            : itens.map((c, i) => (
                <span
                  key={i}
                  className={i === atual && !fim ? styles.atualItem : i < atual || fim ? styles.feito : undefined}
                >
                  {esconder && !fim ? "•" : c}
                </span>
              ))}
        </span>
      </div>
      <div className={styles.barra} aria-hidden="true">
        <div style={{ width: `${progresso}%` }} />
      </div>

      {modo === "numeros" && (
        <div className={styles.faixas} role="group" aria-label="Faixa de números">
          {[...FAIXAS, ...CONTEXTOS].map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={faixa === f.id}
              onClick={() => {
                setFaixa(f.id);
                parar();
                setTexto(sortearNumero(f.id));
              }}
            >
              {f.rotulo}
            </button>
          ))}
        </div>
      )}

      <div className={styles.linhaEntrada}>
        <input
          id="soletrar-texto"
          type={esconder ? "password" : "text"}
          inputMode="text"
          autoComplete="off"
          maxLength={30}
          value={texto}
          aria-label={modo === "letras" ? "Palavra ou nome para soletrar" : "Número para treinar"}
          placeholder={modo === "letras" ? "Digite uma palavra ou nome" : "Digite um número"}
          onChange={(e) => {
            parar();
            setTexto(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") iniciar();
          }}
        />
        <button type="button" className={styles.secundario} onClick={sortear}>
          Sortear
        </button>
      </div>

      <label className={styles.tempo} htmlFor="soletrar-tempo">
        <span>
          Tempo por {modo === "letras" ? "letra" : "número"}:{" "}
          <strong>{tempo.toLocaleString("pt-BR", { minimumFractionDigits: 1 })} s</strong>
        </span>
        <input
          id="soletrar-tempo"
          type="range"
          min={0.5}
          max={2.5}
          step={0.1}
          value={tempo}
          onChange={(e) => setTempo(limitarTempo(Number(e.target.value)))}
        />
      </label>

      <div className={styles.acoes}>
        <button type="button" className={styles.principal} onClick={() => (rodando ? parar() : iniciar())}>
          {rodando ? "Parar" : fim ? "De novo" : "Começar"}
        </button>
        <button
          type="button"
          className={styles.secundario}
          aria-pressed={esconder}
          onClick={() => setEsconder(!esconder)}
        >
          {esconder ? "Mostrar a palavra" : "Esconder a palavra"}
        </button>
      </div>
      <p className={styles.dica}>
        Com “Esconder a palavra”, peça para alguém tocar em Sortear e soletrar para você. Tente ler antes de
        ver a resposta.
      </p>
    </div>
  );
}
