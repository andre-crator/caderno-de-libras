#!/usr/bin/env bash
# Aplica as migrações num Postgres TEMPORÁRIO (com uma imitação mínima do
# Supabase) e roda os testes de RLS de supabase/tests/. Não toca no banco real.
# Requer os binários do PostgreSQL (initdb, pg_ctl, psql). Uso: npm run test:banco
set -euo pipefail
raiz="$(cd "$(dirname "$0")/.." && pwd)"
bin="$(dirname "$(command -v pg_ctl 2>/dev/null || ls -v /usr/lib/postgresql/*/bin/pg_ctl | tail -1)")"
tmp="$(mktemp -d)"
porta=54329
# O Postgres não roda como root (ex.: em containers): nesse caso usa o usuário postgres.
como=()
if [ "$(id -u)" = 0 ]; then chown postgres "$tmp"; como=(runuser -u postgres --); fi
trap '"${como[@]}" "$bin/pg_ctl" -D "$tmp/dados" -m immediate stop >/dev/null 2>&1 || true; rm -rf "$tmp"' EXIT

"${como[@]}" "$bin/initdb" -D "$tmp/dados" -U postgres --auth=trust >/dev/null
"${como[@]}" "$bin/pg_ctl" -D "$tmp/dados" -o "-p $porta -k $tmp -c listen_addresses=''" -l "$tmp/log" start -w >/dev/null
psql=(psql -h "$tmp" -p "$porta" -U postgres -d postgres -v ON_ERROR_STOP=1 -q -X)

"${psql[@]}" -f "$raiz/supabase/tests/00_imitacao_supabase.sql"
for m in "$raiz"/supabase/migrations/*.sql; do
  "${psql[@]}" -f "$m"
done
for t in "$raiz"/supabase/tests/[!0]*.sql; do
  echo "→ $(basename "$t")"
  "${psql[@]}" -f "$t"
done
