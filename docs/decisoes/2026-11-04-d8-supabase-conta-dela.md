---
data: 2026-11-04
status: valida
---

# D8 — Projeto Supabase na conta dela

**Decisão:** o projeto Supabase do Incluir fica na **conta da esposa do André** (organização
e projeto dela), com o André convidado como **Developer**. O conector do Claude continua
na organização do André; o Claude recebe só a Project URL e a Publishable key, e as
migrações entram pela integração Supabase ↔ GitHub ao juntar os PRs no `main`.

**Por quê:** o plano grátis permite 2 projetos ativos **por pessoa** (contando todas as
organizações onde ela é dona ou admin). O André já usa os 2 (Bíblia da Noiva e
minhas-financas). A organização "Incluir" criada por ele não resolve (mesmo limite).
O app é dela, então faz sentido o projeto ser dela; como Developer, o André não conta no limite.

**Impacto:** pagamentos e exclusão do projeto passam pela conta dela. O Claude não acessa o
banco direto: a conferência da RLS no banco real é feita pelo André no painel ou com a URL
e a chave pública. A organização vazia "Incluir" na conta do André pode ser apagada.
