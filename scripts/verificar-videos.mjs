// Confere cada vídeo das aulas no YouTube (oEmbed público, sem chave):
//   200 = existe e toca no app · 401 = o dono bloqueou o player incorporado · 404 = saiu do ar.
// Falha (exit 1) se algum vídeo estiver fora do ar ou bloqueado. Erro de rede, 403 e 429
// (o YouTube barrando o servidor) só avisam. No CI o passo não trava o PR (continue-on-error).
// Uso: npm run verificar:videos           (só confere)
//      npm run verificar:videos -- --atualizar   (também grava o nome do canal no JSON)
import { readFileSync, writeFileSync } from "node:fs";

const ARQUIVO = new URL("../content/aulas/videos.json", import.meta.url);
const dados = JSON.parse(readFileSync(ARQUIVO, "utf8"));
const atualizar = process.argv.includes("--atualizar");
let problemas = 0;
let verificados = 0;
let mudou = false;

for (const v of dados.videos) {
  const url = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${v.id}`)}`;
  let linha;
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (r.status === 200) {
      verificados++;
      const info = await r.json();
      linha = `ok         ${v.id}  ${info.author_name} — ${info.title}`;
      if (atualizar && info.author_name && v.canal !== info.author_name) {
        v.canal = info.author_name;
        mudou = true;
      }
    } else if (r.status === 401) {
      linha = `BLOQUEADO  ${v.id}  o dono não deixa tocar fora do YouTube (${v.aula})`;
      problemas++;
    } else if (r.status === 404 || r.status === 400) {
      linha = `FORA DO AR ${v.id}  (${v.aula})`;
      problemas++;
    } else {
      linha = `?          ${v.id}  resposta ${r.status}, não verificado`;
    }
  } catch (e) {
    linha = `?          ${v.id}  sem conexão com o YouTube (${e.name}), não verificado`;
  }
  console.log(linha);
}

if (mudou) writeFileSync(ARQUIVO, JSON.stringify(dados, null, 2) + "\n");
const total = dados.videos.length;
if (problemas) console.log(`\n${problemas} vídeo(s) com problema: troque em content/aulas/videos.json.`);
else if (verificados === total) console.log(`\nOs ${total} vídeos estão no ar e tocam no app.`);
else console.log(`\n${verificados} de ${total} vídeos verificados; os outros ficaram sem resposta (sem conexão?).`);
process.exit(problemas ? 1 : 0);
