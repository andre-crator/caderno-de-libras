"use client";
// Formulário de guardar/editar sinal. A foto ou o vídeo vai direto do celular para
// a pasta dela no bucket privado (RLS confere a pasta); depois a Server Action grava
// a linha. Fotos são reduzidas no celular; vídeos têm a duração conferida.

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { apagarSinal, atualizarSinal, criarSinal, descartarMidia } from "@/lib/sinais/acoes";
import {
  BUCKET_MIDIA,
  type EntradaSinal,
  type TipoMidia,
  novoCaminhoMidia,
  problemaNoArquivo,
  tamanhoReduzido,
  tipoDaMidia,
} from "@/lib/sinais/formato";
import { rotuloUnidade, temasEmOrdem, unidadeDoTema } from "@/lib/curso/unidades";
import styles from "@/app/caderno/caderno.module.css";
import { VideoPausavel } from "@/components/VideoPausavel";

export type ValoresIniciais = EntradaSinal & { id?: string; media_url?: string | null };

const PARAMETROS: { campo: keyof EntradaSinal; sigla: string; nome: string; dica: string }[] = [
  { campo: "hand_shape", sigla: "CM", nome: "Configuração de mão", dica: "Formato da mão" },
  { campo: "location", sigla: "PA", nome: "Ponto de articulação", dica: "Onde o sinal acontece" },
  { campo: "movement", sigla: "M", nome: "Movimento", dica: "Como a mão se move" },
  { campo: "palm_orientation", sigla: "Or", nome: "Orientação da palma", dica: "Para onde a palma aponta" },
  { campo: "non_manual", sigla: "ENM", nome: "Expressão não manual", dica: "Rosto e corpo" },
];

function duracaoDoVideo(arquivo: File): Promise<number | undefined> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(arquivo);
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(Number.isFinite(v.duration) ? v.duration : undefined);
    };
    v.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(undefined);
    };
    v.src = url;
  });
}

async function reduzirFoto(arquivo: File): Promise<Blob> {
  try {
    const img = await createImageBitmap(arquivo);
    const { largura, altura } = tamanhoReduzido(img.width, img.height);
    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;
    canvas.getContext("2d")?.drawImage(img, 0, 0, largura, altura);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.85));
    return blob ?? arquivo;
  } catch {
    return arquivo; // navegador sem suporte: envia o original
  }
}

export function FormSinal({ userId, inicial }: { userId: string; inicial: ValoresIniciais }) {
  const router = useRouter();
  const editando = Boolean(inicial.id);
  const [valores, setValores] = useState<EntradaSinal>(inicial);
  const [preview, setPreview] = useState<{ url: string; tipo: TipoMidia } | null>(
    inicial.media_url && inicial.media_type
      ? { url: inicial.media_url, tipo: inicial.media_type as TipoMidia }
      : null,
  );
  const [enviando, setEnviando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erros, setErros] = useState<string[]>([]);
  const [confirmarApagar, setConfirmarApagar] = useState(false);
  const enviadaNestaTela = useRef<string | null>(null);
  const urlLocal = useRef<string | null>(null);
  const cancelarRef = useRef<HTMLButtonElement>(null);

  // Saiu da tela sem salvar: descarta o arquivo enviado e libera a prévia da memória.
  // (Fechar a aba no meio do envio ainda pode deixar um arquivo sem uso: ver ROADMAP.)
  useEffect(() => {
    return () => {
      if (enviadaNestaTela.current) void descartarMidia(enviadaNestaTela.current);
      if (urlLocal.current) URL.revokeObjectURL(urlLocal.current);
    };
  }, []);

  useEffect(() => {
    if (confirmarApagar) cancelarRef.current?.focus();
  }, [confirmarApagar]);

  function trocarPrevia(nova: { url: string; tipo: TipoMidia } | null, local: boolean) {
    if (urlLocal.current) URL.revokeObjectURL(urlLocal.current);
    urlLocal.current = nova && local ? nova.url : null;
    setPreview(nova);
  }

  const temas = temasEmOrdem();

  function mudar(campo: keyof EntradaSinal, valor: string) {
    setValores((v) => {
      const novo = { ...v, [campo]: valor };
      // Escolheu um tema da ementa e a aula está vazia: sugere a unidade.
      if (campo === "category" && !v.lesson) {
        const n = unidadeDoTema(valor);
        if (n) novo.lesson = rotuloUnidade(n);
      }
      return novo;
    });
  }

  async function escolherArquivo(e: ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    e.target.value = "";
    if (!arquivo) return;
    setErros([]);
    const tipo = tipoDaMidia(arquivo.type);
    const segundos = tipo === "video" ? await duracaoDoVideo(arquivo) : undefined;
    const problema = problemaNoArquivo(arquivo.type, arquivo.size, segundos);
    if (problema) return setErros([problema]);

    setEnviando(true);
    const conteudo = tipo === "foto" ? await reduzirFoto(arquivo) : arquivo;
    const mime = tipo === "foto" && conteudo !== arquivo ? "image/jpeg" : arquivo.type;
    const caminho = novoCaminhoMidia(userId, mime, new Date(), crypto.randomUUID());
    const supabase = createClient();
    const { error } = await supabase.storage.from(BUCKET_MIDIA).upload(caminho, conteudo, {
      contentType: mime,
      upsert: false,
    });
    setEnviando(false);
    if (error) return setErros(["Não deu para enviar o arquivo. Confira a internet e tente de novo."]);

    // Se já tinha enviado outro arquivo nesta tela, ele não será usado: apaga.
    if (enviadaNestaTela.current) void descartarMidia(enviadaNestaTela.current);
    enviadaNestaTela.current = caminho;
    setValores((v) => ({ ...v, media_path: caminho, media_type: tipo }));
    trocarPrevia({ url: URL.createObjectURL(conteudo), tipo: tipo! }, true);
  }

  function tirarMidia() {
    if (enviadaNestaTela.current) void descartarMidia(enviadaNestaTela.current);
    enviadaNestaTela.current = null;
    setValores((v) => ({ ...v, media_path: null, media_type: null }));
    trocarPrevia(null, false);
  }

  async function salvar(e: FormEvent) {
    e.preventDefault();
    if (enviando || salvando) return;
    setSalvando(true);
    setErros([]);
    const r = editando ? await atualizarSinal(inicial.id!, valores) : await criarSinal(valores);
    setSalvando(false);
    if (!r.ok) return setErros(r.erros);
    enviadaNestaTela.current = null;
    router.push(`/caderno/${r.id}`);
    router.refresh();
  }

  async function apagar() {
    if (!inicial.id) return;
    setSalvando(true);
    const r = await apagarSinal(inicial.id);
    setSalvando(false);
    if (!r.ok) return setErros(["Não deu para apagar agora. Tente de novo."]);
    router.push("/caderno");
    router.refresh();
  }

  return (
    <form className={styles.form} onSubmit={salvar} noValidate>
      <fieldset className={styles.midia} disabled={enviando || salvando}>
        <legend>Foto ou vídeo do sinal</legend>
        {preview ? (
          <div className={styles.previewBox}>
            {preview.tipo === "foto" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview.url} alt="Foto do sinal" className={styles.previewMidia} />
            ) : (
              <VideoPausavel src={preview.url} className={styles.previewMidia} controls playsInline loop />
            )}
            <button type="button" className={styles.botaoSecundario} onClick={tirarMidia}>
              Tirar {preview.tipo === "foto" ? "a foto" : "o vídeo"}
            </button>
          </div>
        ) : (
          <p className={styles.ajuda}>Fotografe a professora, a lousa ou grave você mesma fazendo o sinal (até 15 s).</p>
        )}
        <div className={styles.botoesMidia}>
          <label className={styles.botaoMidia}>
            Tirar foto
            <input type="file" accept="image/*" capture="environment" onChange={escolherArquivo} className={styles.escondido} />
          </label>
          <label className={styles.botaoMidia}>
            Gravar vídeo
            <input type="file" accept="video/*" capture="user" onChange={escolherArquivo} className={styles.escondido} />
          </label>
          <label className={styles.botaoMidia}>
            Da galeria
            <input type="file" accept="image/*,video/*" onChange={escolherArquivo} className={styles.escondido} />
          </label>
        </div>
        {enviando && <p className={styles.ajuda} role="status">Enviando…</p>}
      </fieldset>

      <div className={styles.tipo} role="group" aria-label="É um sinal ou uma frase?">
        {(["sinal", "frase"] as const).map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={(valores.kind ?? "sinal") === k}
            onClick={() => mudar("kind", k)}
          >
            {k === "sinal" ? "Sinal" : "Frase"}
          </button>
        ))}
      </div>

      <label className={styles.campo}>
        {valores.kind === "frase" ? "Frase em português" : "Palavra em português"}
        <input
          id="sinal-word"
          value={valores.word ?? ""}
          onChange={(e) => mudar("word", e.target.value)}
          maxLength={120}
          required
          autoComplete="off"
          placeholder={valores.kind === "frase" ? "Ex.: Prazer em conhecer" : "Ex.: Mãe"}
        />
      </label>

      <div className={styles.duasColunas}>
        <label className={styles.campo}>
          Tema
          <input
            id="sinal-category"
            list="temas-curso"
            value={valores.category ?? ""}
            onChange={(e) => mudar("category", e.target.value)}
            maxLength={40}
            placeholder="Ex.: Família"
          />
        </label>
        <label className={styles.campo}>
          Aula
          <input
            id="sinal-lesson"
            value={valores.lesson ?? ""}
            onChange={(e) => mudar("lesson", e.target.value)}
            maxLength={40}
            placeholder="Ex.: Unidade 4"
          />
        </label>
      </div>
      <datalist id="temas-curso">
        {temas.map((t) => (
          <option key={t} value={t} />
        ))}
      </datalist>

      <details className={styles.detalhes} open={PARAMETROS.some((p) => valores[p.campo])}>
        <summary>Como fazer o sinal (opcional)</summary>
        <div className={styles.parametros}>
          {PARAMETROS.map((p) => (
            <label key={p.campo} className={styles.campo}>
              <span>
                <abbr title={p.nome}>{p.sigla}</abbr> · {p.nome} <small>{p.dica}</small>
              </span>
              <textarea
                id={`sinal-${p.campo}`}
                value={(valores[p.campo] as string) ?? ""}
                onChange={(e) => mudar(p.campo, e.target.value)}
                maxLength={400}
                rows={2}
              />
            </label>
          ))}
        </div>
      </details>

      <label className={styles.campo}>
        Dica para lembrar (opcional)
        <textarea
          id="sinal-tip"
          value={valores.tip ?? ""}
          onChange={(e) => mudar("tip", e.target.value)}
          maxLength={600}
          rows={2}
          placeholder="Ex.: parece que estou…"
        />
      </label>

      {erros.length > 0 && (
        <ul className={styles.erros} role="alert">
          {erros.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      <div className={styles.acoes}>
        <button type="submit" className={styles.botaoPrincipal} disabled={enviando || salvando}>
          {salvando ? "Salvando…" : editando ? "Salvar mudanças" : "Guardar no caderno"}
        </button>
        {editando && !confirmarApagar && (
          <button type="button" className={styles.botaoPerigo} onClick={() => setConfirmarApagar(true)}>
            Apagar
          </button>
        )}
      </div>
      {confirmarApagar && (
        <div className={styles.confirmar} role="alertdialog" aria-labelledby="confirmar-apagar-texto">
          <p id="confirmar-apagar-texto">Apagar este sinal e a foto ou vídeo dele? Não dá para desfazer.</p>
          <div className={styles.acoes}>
            <button type="button" className={styles.botaoPerigo} onClick={apagar} disabled={salvando}>
              Sim, apagar
            </button>
            <button
              ref={cancelarRef}
              type="button"
              className={styles.botaoSecundario}
              onClick={() => setConfirmarApagar(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
