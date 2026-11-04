---
data: 2026-11-05
status: valida
---

# D10 — Meta da semana e lembrete diário

**Decisão:** ela escolhe uma meta de 2, 3, 4 ou 5 dias de estudo por semana (padrão 3).
O Início mostra os dias de segunda a domingo e quantas semanas seguidas a meta foi cumprida.
Conta como dia estudado: revisar um cartão, terminar um jogo ou quiz, guardar um sinal,
concluir uma aula ou começar um treino de soletrar. O lembrete chega 1 vez por dia, ao
meio-dia de Brasília (escolha do André). Ele só é enviado se ela ainda não estudou naquele
dia: fala dos sinais para revisar ou, se não houver nenhum, de quantos dias faltam para a
meta. Com a meta cumprida e nada para revisar, não manda nada.

**Por quê:** ela estuda 1 a 2 vezes por semana, em momentos soltos (ônibus, intervalo). A
meta por semana combina mais com isso do que uma sequência diária. O lembrete convida e não
cobra.

**Impacto:** a coluna `profiles.weekly_goal` e as tabelas `study_days` e `push_subscriptions`
(com RLS). O envio sai de `/api/lembrete` (Vercel Cron, `vercel.json`, 15h UTC; no plano
grátis pode atrasar até 1 hora). A Vercel chama a rota com `CRON_SECRET`. A lista vem da
função `lembretes_do_dia(segredo)`, que confere o hash SHA-256 do segredo em
`private.segredos`, por isso o app não usa a chave secreta (service role) do Supabase. As
chaves VAPID e o `CRON_SECRET` ficam só nas variáveis da Vercel.
