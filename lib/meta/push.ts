// Só aceitamos inscrições de serviços de notificação conhecidos: o envio diário faz um
// POST do servidor para esse endereço, e um endereço qualquer viraria uma porta de abuso.
const HOSTS_PERMITIDOS = [/^fcm\.googleapis\.com$/, /^[a-z0-9.-]+\.push\.services\.mozilla\.com$/, /^[a-z0-9.-]+\.push\.apple\.com$/, /^[a-z0-9.-]+\.notify\.windows\.com$/];

export function endpointPermitido(endpoint: unknown): endpoint is string {
  if (typeof endpoint !== "string" || endpoint.length > 1000) return false;
  try {
    const u = new URL(endpoint);
    return u.protocol === "https:" && !u.port && HOSTS_PERMITIDOS.some((h) => h.test(u.hostname));
  } catch {
    return false;
  }
}
