# Configurar um projeto novo (≈ 20 minutos, uma vez por projeto)

Por que isso não vem pronto: cada app precisa do **próprio** banco, das **próprias**
chaves e do **próprio** endereço autorizado no Google. Chaves nunca ficam no
repositório (se ficassem, qualquer um que visse o código entraria no seu banco).
Este roteiro deixa tudo no mesmo lugar para você só seguir.

## 1. Criar o repositório a partir do starter
No GitHub, abra o `starter-andre` e clique em **Use this template → Create a new repository**.
Depois, no computador:
```bash
git clone https://github.com/SEU-USUARIO/NOVO-APP.git
cd NOVO-APP
npm install
cp .env.example .env.local
```
Troque "Nome do App" em `app/layout.tsx` e preencha o topo do `CLAUDE.md`.

## 2. Supabase (banco + login)
1. Em supabase.com → **New project**. Anote a senha do banco num gerenciador de senhas.
2. **Project Settings → API**: copie a *Project URL* e a *Publishable key* para o
   `.env.local` (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
3. Aplicar as migrações (cria a tabela `profiles`):
   ```bash
   npx supabase login
   npx supabase link --project-ref SEU_PROJECT_REF
   npx supabase db push
   ```
   (O *project ref* é o código que aparece na URL do painel do Supabase.)
4. **Authentication → URL Configuration**:
   - *Site URL*: `http://localhost:3000` (troque pelo domínio da Vercel depois do deploy).
     **Importante:** os links dos e-mails (confirmar cadastro, recuperar senha) usam a
     *Site URL* e abrem `/auth/confirm`. Com ela errada, o link do e-mail não funciona.
   - *Redirect URLs*: adicione `http://localhost:3000/auth/callback` e, depois do
     deploy, `https://SEU-APP.vercel.app/auth/callback`. Para o login funcionar também
     nas prévias da Vercel: `https://*-SEU-TIME.vercel.app/auth/callback`.

## 3. Login com Google
1. No Google Cloud Console → **APIs e serviços → Credenciais → Criar credenciais →
   ID do cliente OAuth** → tipo *Aplicativo da Web*.
   (Na primeira vez ele pede para configurar a *Tela de consentimento OAuth*: nome do
   app, seu e-mail; pode deixar em modo de teste.)
2. Em **URIs de redirecionamento autorizados**, cole a URL de callback que aparece no
   Supabase em **Authentication → Providers → Google** (algo como
   `https://SEU_PROJECT_REF.supabase.co/auth/v1/callback`).
3. Copie o *Client ID* e o *Client Secret* do Google para o Supabase
   (**Authentication → Providers → Google**) e ative o provedor.

> Dica de economia de tempo: você pode reaproveitar a MESMA tela de consentimento e
> criar só um novo "ID do cliente OAuth" por app.

## 4. Testar local
```bash
npm run dev
```
Abra http://localhost:3000/painel → deve mandar para o login. Teste os dois jeitos
de entrar. Depois de entrar, o painel mostra seu nome (vindo do Google) ou e-mail.

## 5. Publicar na Vercel
1. vercel.com → **Add New → Project** → importe o repositório.
2. Em **Environment Variables**, cadastre as mesmas variáveis do `.env.local`.
3. Deploy. Depois, volte ao passo 2.4 e adicione o domínio da Vercel nas URLs do Supabase.

> Lembrete: o plano grátis da Vercel (Hobby) é para uso pessoal/não comercial.
> App de cliente pagante: use a conta da Vercel e do Supabase do próprio cliente,
> ou o plano Pro.

## 6. Lembrete diário (Web Push, D10)
1. Gere as chaves: `npx web-push generate-vapid-keys` e um segredo longo e aleatório.
2. Na Vercel, cadastre `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` (sensível) e
   `CRON_SECRET` (sensível). A Vercel manda o `CRON_SECRET` sozinha ao chamar o cron.
3. No SQL Editor do Supabase, guarde só o **hash** do segredo:
   `insert into private.segredos values ('lembrete', decode('<sha256 em hex>', 'hex'))
   on conflict (nome) do update set hash = excluded.hash;`
   (hash em hex: `printf %s "$CRON_SECRET" | sha256sum`).
4. O horário fica em `vercel.json` (UTC). No plano grátis, o cron roda 1 vez por dia, com
   até 1 hora de atraso.

## Checklist rápido
- [ ] `.env.local` preenchido (e fora do Git: `git status` não pode mostrar ele)
- [ ] `supabase db push` feito
- [ ] URLs de redirect no Supabase (local e produção)
- [ ] Google OAuth configurado e ativado no Supabase
- [ ] Variáveis cadastradas na Vercel
- [ ] Login por e-mail e por Google testados
