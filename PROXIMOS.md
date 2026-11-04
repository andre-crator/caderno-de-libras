# Próximos passos

Leia no começo da sessão; atualize no fim. Meia página, sem histórico.

## Onde paramos (2026-11-04)

- **App no ar e funcionando:** https://caderno-de-libras.vercel.app (Vercel `caderno-de-libras`,
  deploy automático do `main`). Supabase **na conta dela** (D8), projeto `zgiqidfjddnxgicueqnv`;
  banco criado colando o SQL das migrações no SQL Editor (a integração Supabase ↔ GitHub não
  está ligada a este projeto). Login por e-mail testado por eles com sucesso.
- **Aulas (D9), lote 1** em PR: unidades 1 a 3, 9 aulas, 20 vídeos sugeridos (`conferido: false`).
  Ela estava na página 24 da apostila (fim da unidade 2).
- PR #10 (mensagens de login em português) aguardando OK para juntar. O #9 foi substituído por este PROXIMOS.

## O André precisa

1. Colar no SQL Editor do projeto dela o SQL de `supabase/migrations/20261104120000_criar_lesson_progress.sql`
   (antes de juntar o PR das aulas; sem ele, as aulas abrem mas não salvam "concluída").
2. Assistir aos vídeos do lote 1 (com ela) e dizer quais trocar; os bons viram `conferido: true`.
3. Desligar a integração Supabase ↔ GitHub do projeto antigo `dpeluwtwvifkhnxwwves`.
4. Login com Google (passo 3 do `docs/SETUP.md`), quando quiserem.
5. Testar se https://www.spreadthesign.com/pt.br/search/?q=casa abre a busca (`lib/curso/dicionarios.ts`).

## Depois (Claude)

- Aulas: próximos lotes (unidade 4 em diante) conforme o curso; trocar vídeos reprovados.
- Fase 2 (quiz, câmera lenta, datas e horas, lembrete, offline completo).
- Vídeos ainda não ficam guardados offline (respostas com Range); avaliar na Fase 2.
