# starter-andre

Ponto de partida padrão para apps **Next.js 16 + Supabase + Vercel**.
Todo projeto novo começa daqui, já com o que todo app precisa:

- Login por **e-mail e senha** e **Google**, com rotas privadas protegidas
- Tabela `profiles` criada automaticamente no cadastro, com **RLS**
- Clientes Supabase prontos para navegador e servidor (`@supabase/ssr`)
- Proteção contra *open redirect* no login, logout por POST
- **Design tokens** (`design/tokens.css`) com modo claro/escuro
- **Testes** (Vitest) e **CI** no GitHub Actions: typecheck, lint, testes e build
- **CLAUDE.md** e skill `nova-tabela` para o Claude Code trabalhar no padrão

## Começar um projeto novo
Siga **[docs/SETUP.md](docs/SETUP.md)** (≈ 20 minutos).

## Comandos
| Comando | O que faz |
| --- | --- |
| `npm run dev` | roda local em http://localhost:3000 |
| `npm run typecheck` | confere os tipos TypeScript |
| `npm run lint` | confere o padrão de código |
| `npm test` | roda os testes |
| `npm run build` | gera a versão de produção |

## Requisitos
Node.js 22 ou mais novo (`.nvmrc`).
