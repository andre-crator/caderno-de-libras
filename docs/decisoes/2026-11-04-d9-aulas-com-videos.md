---
data: 2026-11-04
status: valida
---

# D9 — Aulas com texto nosso e vídeos do YouTube no app

**Decisão:** o app ganha **Aulas**, uma por tema da ementa (como no prevoo): explicação curta
escrita por nós (`lib/aulas/conteudo.ts`), vídeos do YouTube tocados **dentro do app pelo
player oficial** (`youtube-nocookie`, com título e canal; nada baixado, guardado ou desenhado
em cima do player) e "Pratique" com a lista de estudo do tema (D7). Atualiza a D2: vídeo do
YouTube pode tocar no app pelo player oficial; dicionários e outros sites continuam só como link.

**Regras do conteúdo:**
- Texto nunca descreve **como fazer** um sinal (D2) nem copia a apostila (D6).
- Vídeos de professores de Libras, de preferência surdos, e de instituições (INES, IFs, universidades).
- Todo vídeo nasce `conferido: false` (`content/aulas/videos.json`): o André ou ela assistem e
  confirmam que o sinal bate com o da professora. Sinais variam por região; vale o da professora.
- `npm run verificar:videos` (também no CI, sem travar o PR) pergunta ao YouTube se cada vídeo
  existe e pode tocar fora do YouTube.

**Por quê:** ela é aluna e precisa assistir e entender além de anotar. A sessão do Claude não
abre o YouTube, então os vídeos são achados pela busca e conferidos por pessoas e pelo CI.

**Impacto:** tabela `lesson_progress` (aulas concluídas, RLS por usuária); rotas `/aulas` e
`/aulas/[slug]` (privadas). Lote 1 = unidades 1 a 3 (ela estava na página 24 em 2026-11-04).
Lote 2 (2026-11-04) = unidade 4.
