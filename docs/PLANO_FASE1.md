# Plano técnico — Fase 1 (MVP "Incluir")

Aprovado pelo André em 2026-11-03 (D3, D4, D5). Cada parte vira um PR pequeno, com
typecheck, lint, testes e build passando.

| Parte | O que entrega | Depende de |
| --- | --- | --- |
| 1. Base ✅ | Identidade (azul e branco, tema claro, letra 18px), nome Incluir, home, PWA instalável (manifest + ícones) | — |
| 2. Banco | Tabela `signs` (sinal + agenda de revisão), bucket privado `sign-media`, RLS, regras da agenda (Leitner) com testes | — (testado em Postgres local) |
| 3. Caderno | `/caderno` (lista, busca, categorias), `/caderno/novo` e `/caderno/[id]` (foto/vídeo da galeria ou câmera, palavra, aula, tipo sinal/frase, 5 parâmetros opcionais) | 2 + projeto Supabase |
| 4. Revisar | `/revisar`: cartões com a mídia, Errei / Com dúvida / Acertei, limite diário | 2, 3 |
| 5. Treinos | `/soletrar`: alfabeto manual e números (letras ou dígitos um a um) | 1 |
| 6. Offline básico | Service worker com cache do app e das mídias já vistas | 1–5 |

## Banco (parte 2)
`signs` — um sinal ou frase do caderno dela.

| Coluna | Tipo | Observação |
| --- | --- | --- |
| `id` | uuid | chave |
| `user_id` | uuid | dono; `auth.users`, apaga junto |
| `kind` | enum `sign_kind` (`sinal`, `frase`) | |
| `word` | text | palavra ou frase em português (1–120) |
| `category`, `lesson` | text | opcionais |
| `hand_shape`, `location`, `movement`, `palm_orientation`, `non_manual`, `tip` | text | 5 parâmetros e dica, opcionais |
| `media_path` | text | caminho no bucket `sign-media` (`<user_id>/<arquivo>`) |
| `media_type` | enum `sign_media_type` (`foto`, `video`) | |
| `review_level` | smallint 0–5 | caixa de Leitner |
| `review_due_at` | timestamptz | próxima revisão |
| `reviewed_at` | timestamptz | última revisão |
| `created_at`, `updated_at` | timestamptz | padrão do starter |

RLS: cada usuária lê, cria, edita e apaga só os próprios sinais. Bucket `sign-media` privado,
limite de 20 MB por arquivo, tipos de imagem e vídeo; políticas pela primeira pasta do caminho
= `auth.uid()`. A Fase 3 (compartilhar) cria tabelas próprias, sem mexer nestas regras.

Agenda: intervalos de 0, 1, 2, 4, 8 e 16 dias (protótipo). Errei → nível 0, volta hoje;
Com dúvida → nível mínimo 1, amanhã; Acertei → sobe um nível.
