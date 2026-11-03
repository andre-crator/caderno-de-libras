---
data: 2026-11-03
status: valida
---

# D7 — Listas de estudo por tema e links para dicionários

**Decisão:** o caderno nasce com uma **lista de estudo** por tema da ementa
(`lib/curso/vocabulario.ts`): palavras comuns em português, escritas por nós, que aparecem
como "falta aprender" até ela guardar o sinal com foto ou vídeo. Cada palavra tem o botão
**"ver o sinal"**, que abre um dicionário da internet (`lib/curso/dicionarios.ts`): o app
só leva até lá, não copia vídeo nem imagem. Cada unidade mostra o progresso
("Família: 6 de 13").

**Por quê:** com a apostila fora do app (D6), ela precisa saber o que estudar em cada
tema e onde conferir um sinal. Sinais variam por região: o que vale é o que ela guarda.

**Impacto:** a parte 3 (caderno) ganha a tela de temas com lista e progresso. Acentos
contam na comparação ("avô" ≠ "avó"). Os formatos de link dos dicionários estão marcados
`confirmado: false` até o André testar no celular (a sessão do Claude não acessa esses sites).
