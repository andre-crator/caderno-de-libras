-- A função do gatilho de cadastro é SECURITY DEFINER e, por estar no schema
-- public, ficava exposta em /rest/v1/rpc/handle_new_user para anon e authenticated
-- (alerta do Security Advisor do Supabase). Só o gatilho precisa dela; gatilhos
-- não dependem do privilégio EXECUTE de quem dispara, então o cadastro segue igual.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
