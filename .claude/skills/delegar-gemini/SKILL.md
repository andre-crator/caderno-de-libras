---
name: delegar-gemini
description: Delega ao Gemini CLI a geração de conteúdo em volume (rascunhos de questões, resumos, guias de estudo, traduções longas, variações de texto) para economizar o limite do Claude. Use quando a tarefa for produzir muito texto a partir de uma fonte; não use para código, banco de dados ou decisões de arquitetura.
---

# Delegar conteúdo em volume ao Gemini

O Gemini rascunha; o Claude revisa e decide. Assim o texto longo (a parte mais
cara) não consome o limite do Claude, e a qualidade continua garantida pela revisão.

## Quando usar
- Rascunhar muitas questões ou resumos a partir de uma apostila/manual.
- Traduzir ou reescrever textos longos.
- Gerar variações de texto (posts, descrições, alternativas de questões).

## Quando NÃO usar
- Código, SQL, migrações, segurança, arquitetura: o Claude faz.
- Qualquer coisa com dados pessoais de usuários, segredos, `.env` ou chaves de API:
  nunca envie isso ao Gemini.

## Passo a passo
1. **Montar o pedido em um arquivo temporário** (ex: `/tmp/gemini/pedido.md`) com:
   - o objetivo e o formato EXATO de saída (ex: JSON com campos definidos, ou
     Markdown com estrutura fixa);
   - o trecho da fonte (só o necessário, não o documento inteiro);
   - as regras do projeto que importam (ex: 4 alternativas, uma correta, sem
     "todas as anteriores", explicação curta).
2. **Rodar o Gemini em modo não interativo**, dentro de uma pasta temporária que
   só contenha o pedido (nunca dentro do projeto: lá o Gemini consegue ler os
   arquivos, inclusive `.env`), e salvar a saída em arquivo:
   ```bash
   cd /tmp/gemini && GEMINI_CLI_TRUST_WORKSPACE=true gemini -p "$(cat pedido.md)" > saida.md
   ```
   Sem `GEMINI_CLI_TRUST_WORKSPACE=true` o Gemini recusa pastas que ainda não
   foram marcadas como confiáveis (exit 55, "not running in a trusted directory").
   No Windows, use a pasta de rascunho da sessão no lugar de `/tmp/gemini`.
   Erro 503 ("high demand") é temporário: o próprio Gemini tenta de novo.
3. **Revisar a saída (obrigatório)**. Conferir:
   - fidelidade à fonte (nada inventado; corrigir erros técnicos);
   - formato exatamente o pedido;
   - duplicatas com o conteúdo que já existe no projeto/banco;
   - qualidade: resposta correta não pode ser sempre a alternativa mais longa.
   Corrigir o que precisar antes de usar.
4. **Só então** transformar em código/SQL/arquivo do projeto, seguindo as regras
   do `CLAUDE.md` do projeto.
5. Informar ao André em uma linha: "Rascunho feito pelo Gemini, revisado por mim:
   X itens aproveitados, Y corrigidos, Z descartados."

## Se o Gemini falhar
Se o comando `gemini` não existir, der erro de autenticação ou de cota/limite:
não tente de novo em loop. Avise o André e pergunte se quer que o Claude faça
a tarefa (gastando o limite do Claude) ou se prefere esperar a cota do Gemini voltar.
