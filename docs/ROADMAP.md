# Roadmap — Incluir (Caderno de Libras)

> Visão do que pode vir depois. **Não é compromisso de prazo**: cada item passa pelo plano →
> OK do André → código. As fases vêm do levantamento de requisitos (`docs/REQUISITOS.md`, D3).

## Princípios
- Feito para ela estudar: simples, rápido no celular, sem anúncios.
- Sinais nunca inventados pelo app; conteúdo de terceiros só como link (ver `CLAUDE.md`).
- Dados dela são dela (LGPD): fotos, vídeos e anotações privados por padrão.

## Fase 1 — MVP
- [ ] Login com Google.
- [ ] Caderno de sinais com foto/vídeo (galeria ou câmera), frases e 5 parâmetros opcionais.
- [ ] Revisão com cartões (repetição espaçada).
- [ ] Datilologia e números.
- [ ] PWA instalável no Android; tema claro, azul e branco, letras maiores.

## Fase 2 — Leitura de sinais e hábito
- [ ] Quiz: ver o sinal e escolher a palavra.
- [ ] Vídeo em câmera lenta e repetição.
- [ ] Datas e horas.
- [ ] Lembrete diário.
- [ ] Offline completo com sincronização.

## Fase 3 — Compartilhar
- [ ] Caderno compartilhado com o André.
- [ ] Caderno da turma, com convite.

## Ideias soltas
- [ ] Limpeza periódica de arquivos do `sign-media` sem linha em `signs` (ex.: aba fechada no meio do cadastro).
- [ ] Ao apagar a conta, apagar também os arquivos dela no bucket `sign-media` (hoje só as linhas de `signs` saem em cascata).
- [ ] Importar os sinais anotados no protótipo.
- [ ] Levar o questionário de requisitos para o `starter-andre`.
