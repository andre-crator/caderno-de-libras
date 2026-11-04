"use client";
// Liga/desliga o lembrete diário (Web Push). Funciona no app instalado ou no Chrome
// do Android; precisa do service worker (só em produção) e da permissão dela.
import { useEffect, useState } from "react";
import { apagarInscricao, type Inscricao, salvarInscricao } from "@/lib/meta/acoes";
import styles from "./meta.module.css";

const CHAVE_PUBLICA = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

type Estado = "carregando" | "sem-suporte" | "bloqueado" | "desligado" | "ligado" | "ocupado" | "erro";

function paraBytes(base64url: string): Uint8Array<ArrayBuffer> {
  const b64 = (base64url + "=".repeat((4 - (base64url.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const bytes = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function registro(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return null;
  return (await navigator.serviceWorker.getRegistration()) ?? null;
}

export function Lembrete() {
  const [estado, setEstado] = useState<Estado>("carregando");

  useEffect(() => {
    let vivo = true;
    (async () => {
      const reg = CHAVE_PUBLICA ? await registro() : null;
      let novo: Estado;
      if (!reg) novo = "sem-suporte";
      else if (Notification.permission === "denied") novo = "bloqueado";
      else {
        const sub = await reg.pushManager.getSubscription();
        // Confere com o servidor: se a linha sumiu (ex.: saiu da conta), grava de novo.
        novo = sub ? ((await salvarInscricao(sub.toJSON() as Inscricao)).ok ? "ligado" : "desligado") : "desligado";
      }
      if (vivo) setEstado(novo);
    })().catch(() => vivo && setEstado("sem-suporte"));
    return () => {
      vivo = false;
    };
  }, []);

  async function ligar() {
    setEstado("ocupado");
    try {
      const reg = await registro();
      if (!reg) return setEstado("sem-suporte");
      const permissao = await Notification.requestPermission();
      if (permissao !== "granted") return setEstado(permissao === "denied" ? "bloqueado" : "desligado");
      const sub =
        (await reg.pushManager.getSubscription()) ??
        (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: paraBytes(CHAVE_PUBLICA) }));
      const r = await salvarInscricao(sub.toJSON() as Inscricao);
      if (!r.ok) {
        // Sem a linha no banco o lembrete nunca chegaria: desfaz para não mostrar "ligado".
        await sub.unsubscribe().catch(() => {});
        return setEstado("erro");
      }
      setEstado("ligado");
    } catch {
      setEstado("erro");
    }
  }

  async function desligar() {
    setEstado("ocupado");
    try {
      const sub = await (await registro())?.pushManager.getSubscription();
      if (sub) {
        const r = await apagarInscricao(sub.endpoint);
        if (!r.ok) return setEstado("erro");
        await sub.unsubscribe();
      }
      setEstado("desligado");
    } catch {
      setEstado("erro");
    }
  }

  if (estado === "carregando" || estado === "sem-suporte") {
    return estado === "sem-suporte" ? (
      <p className={styles.lembreteInfo}>
        O lembrete funciona no app instalado no celular (Chrome do Android).
      </p>
    ) : null;
  }
  if (estado === "bloqueado") {
    return (
      <p className={styles.lembreteInfo}>
        As notificações estão bloqueadas. Para ligar o lembrete, permita notificações do Incluir nas configurações do
        celular.
      </p>
    );
  }
  return (
    <div className={styles.lembrete}>
      <span>
        🔔 Lembrete diário ao meio-dia: <strong>{estado === "ligado" ? "ligado" : "desligado"}</strong>
      </span>
      {estado === "ligado" ? (
        <button type="button" className={styles.link} onClick={desligar}>
          Desligar
        </button>
      ) : (
        <button type="button" className={styles.botao} onClick={ligar} disabled={estado === "ocupado"}>
          {estado === "ocupado" ? "Ligando…" : "Ligar"}
        </button>
      )}
      {estado === "erro" && (
        <p role="alert" className={styles.erro}>
          Não deu certo. Confira a internet e tente de novo.
        </p>
      )}
    </div>
  );
}
