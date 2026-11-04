# Próximos passos

Leia no começo da sessão; atualize no fim. Meia página, sem histórico.

## Onde paramos (2026-11-04, fim do dia)

- **App no ar:** https://caderno-de-libras.vercel.app (Vercel `caderno-de-libras`, deploy
  automático do `main`). Supabase **na conta dela** (D8), projeto `zgiqidfjddnxgicueqnv`; a
  integração Supabase ↔ GitHub NÃO está ligada a ele: migração nova = colar o SQL no SQL Editor.
- No `main`: fase 1 completa, aulas das unidades 1–3 (D9), tela inicial nova com barra de
  navegação, correção do vídeo que seguia tocando (Next 16 esconde a página: ver CLAUDE.md).
- Fase 2 A e B no `main`: frases para conversar, data/hora/dinheiro no Soletrar, quiz
  "que sinal é este?" e vídeo em câmera lenta.
- **Jogos aprovados pelo André (2026-11-04)**, protótipos visuais em
  https://claude.ai/artifact/FAWdhWNQxGETDTLu7ahUaZ. O André **não** sabe Libras: nenhum jogo
  pode depender de ele sinalizar (no máximo ele confere, vendo o sinal certo na tela).

## O André precisa

1. Dizer "pode juntar" nos PRs novos (o Claude não junta sem OK explícito).
2. Assistir aos vídeos das aulas (unidades 1–3) com ela e dizer quais trocar.
3. Desligar a integração Supabase ↔ GitHub do projeto antigo `dpeluwtwvifkhnxwwves`.
4. Login com Google (passo 3 do `docs/SETUP.md`) — combinado para depois.
5. Testar se https://www.spreadthesign.com/pt.br/search/?q=casa abre a busca.

## Depois (Claude) — Fase 2, na ordem combinada em 2026-11-04

- **Jogos (todos aprovados), nesta ordem:**
  1. **Trilha de estrelas** — no `main` (`/aulas`). Falta: sequência de dias no topo
     (precisa da tabela da parte C).
  2–5. **Memória, relâmpago, espelho e caça ao sinal** — feitos no PR `jogos-memoria-relampago`
     (em `/revisar/jogos`). Ideias para depois: no espelho, opção de guardar o vídeo dela
     como mídia do sinal; atalho "Jogos" na tela inicial.
- **C. Meta da semana + lembrete diário** — feito no PR `meta-lembrete` (D10). Chaves já na
  Vercel. O André cola no Supabase a migração `20261105120000_meta_e_lembrete.sql` + o insert
  do hash (mandado no chat). Depois: ela liga o lembrete no Início, **no app instalado**.
  Falta: sequência de semanas no topo da trilha (opcional).
- **D. Aulas da unidade 4** — feito no PR `aulas-unidade-4` (3 aulas: família, ser/estar e ir,
  sentimentos; 9 vídeos `conferido: false`, todos no ar segundo o CI).
  Próximo lote (unidade 5) quando ela chegar lá.
- **E. Mini questionário de opinião** (5 perguntas, como o primeiro, envio pelo WhatsApp).
- **F. Guardar sinal sem internet** (fila no IndexedDB, sincroniza ao voltar a conexão) e
  vídeos offline — **perguntar ao André antes** (tamanho/espaço no celular).
- **G. Compartilhar com o André e com a turma** — **decidir antes**: o caderno todo ou só
  alguns sinais? só leitura? colegas precisam de conta no app (Supabase dela).
- Vídeos ainda não ficam guardados offline (respostas com Range).
