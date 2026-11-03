# Levantamento de requisitos

**Questionário dela:** https://questionario-libras-blue.vercel.app (Vercel, sem login; fonte
em `docs/prototipo/questionario.html`). **Versão do André:** https://claude.ai/artifact/VgCFfYRmU1vMQqgjU1Hmkc

## Status
Respostas recebidas em 2026-11-03. Fases **aprovadas** pelo André em 2026-11-03 (D3 a D5).
Plano técnico: `docs/PLANO_FASE1.md`.

## O que aprendemos
Ela está no **básico**, faz **1 aula por semana** no Instituto Chaves com **professora surda**, e
quer **conversar com uma pessoa surda em um ano** (motivos: trabalho e ajudar as pessoas).
Hoje guarda o que aprende **na memória e em fotos**, e estuda 1 ou 2 vezes por semana.

| Tema | Resposta | O que significa para o app |
| --- | --- | --- |
| Material do curso | Apostila (12 unidades; uso em D6) e grupo de WhatsApp | Fotos e vídeos chegam pelo WhatsApp: importar da galeria precisa ser fácil |
| Como guarda | Memória e fotos | O cadastro do sinal começa pela **foto/vídeo**, texto é opcional |
| Dificuldades | Lembrar sinais, alfabeto, entender quem sinaliza rápido, números | Revisão com mídia, datilologia, **leitura de sinais** (quiz) e números |
| Aparelho | Celular Android | App instalável (PWA) funciona bem no Android |
| Quando estuda | Ônibus, intervalo, antes de dormir, fim de semana, depois da aula | Sessões curtas e uso **sem internet** |
| Tempo por vez | 10 a 15 minutos | Revisão diária com limite de cartões (ex.: 20) |
| Internet | Pulou | Tratar como "às vezes não": offline importa (ela marcou "Preciso") |
| Login | Conta Google | Google como entrada principal (passo 3 do `docs/SETUP.md`) |
| Compartilhar | Com o André e colegas da turma | Compartilhamento entra numa fase própria (privacidade) |
| Tela | Clara, **letras maiores**, azul e branco | Tema claro padrão, fonte base 18px, acento azul |
| Nome | **Incluir** | Nome do app (D4); o repositório continua `caderno-de-libras` |

Ela marcou **"Preciso" nas 11 funções**. A ordem abaixo é proposta nossa, pelo que destrava o
objetivo dela primeiro (lembrar sinais e entender quem sinaliza) e pelo esforço técnico.

## Fases (D3)

### Fase 1 — MVP "Incluir" (ela usa no dia a dia)
- [ ] Login com Google.
- [ ] Caderno de sinais: **foto ou vídeo** (galeria ou câmera, inclusive gravar a si mesma),
      palavra, aula, categoria; 5 parâmetros e dica **opcionais**.
- [ ] Frases como cartões (tipo "frase"), com sugestões de frases do dia a dia **só em
      português** para ela gravar como a professora ensinar (D2: o app não inventa sinais).
- [ ] Revisão com cartões (repetição espaçada do protótipo), mostrando a foto/vídeo; meta
      diária de 10 a 15 minutos.
- [ ] Treino de datilologia e de **números** (mesmo motor: letras ou dígitos um a um).
- [ ] Instalável no Android (PWA) e abre sem internet com o que já foi carregado.
- [ ] Visual: claro, azul e branco, letras maiores.

### Fase 2 — Treino de leitura e hábito
- [ ] Quiz: ver a foto/vídeo do sinal e escolher a palavra (treina "entender quem sinaliza").
- [ ] Vídeo em velocidade reduzida e repetição no quiz e na revisão.
- [ ] Datas e horas no treino de números.
- [ ] Lembrete diário (notificação no Android).
- [ ] Offline completo: cadastrar e revisar sem internet, sincroniza depois.

### Fase 3 — Compartilhar
- [ ] Compartilhar o caderno com o André (só leitura ou edição).
- [ ] Turma: um caderno compartilhado com colegas, com convite.

## Requisitos não funcionais
- Android (Chrome), tela clara, fonte base 18px, alvos de toque de 48px ou mais.
- Fotos e vídeos privados (Storage privado + RLS). Fotos redimensionadas no celular antes do
  envio; vídeos curtos (até 15 s) para caber no plano grátis (D5).
- Sessão de estudo em 10 a 15 minutos; nada que exija conexão para revisar o que já baixou.

## Respostas originais (2026-11-03)
```
1. Onde você faz o curso de Libras? → Istituto chaves
2. Em que nível você está? → Básico (começando)
3. Quantas aulas você tem por semana? → 1 aula
4. Sua professora ou professor é… → Surdo(a)
5. O curso passa algum material? → Apostila, Grupo de WhatsApp
6. Por que você quer aprender Libras? → Trabalho, Ajudar as pessoas
7. Daqui a um ano, o que você gostaria de conseguir fazer em Libras? → Conseguir conversar com uma pessoa surda
8. Depois da aula, como você guarda o que aprendeu? → Fica só na memória, Tiro foto
9. Você estuda fora da aula? → 1 ou 2 vezes por semana
10. O que está mais difícil até agora? → Lembrar os sinais, O alfabeto manual, Entender quem sinaliza rápido, Números
11. O que o app precisa ter? → Preciso em todas: anotar sinais, cartões de revisão, alfabeto manual,
    foto/vídeo do sinal, me gravar, quiz, números/datas/horas, frases prontas, lembrete,
    funcionar sem internet, compartilhar com a turma
12. Tem mais alguma ideia para o app? → (pulou)
13. Onde você vai usar o app? → Celular Android
14. Em que momento você estudaria? → Ônibus ou carro, intervalo do trabalho, antes de dormir, fim de semana, logo depois da aula
15. Quanto tempo de cada vez? → 10 a 15 minutos
16. Nesses momentos você tem internet? → (pulou)
17. Como prefere entrar no app? → Com a conta Google
18. Com quem você gostaria de compartilhar seu caderno? → Com o André, Com colegas da turma
19. Você prefere a tela… → Clara
20. As letras precisam ser maiores? → Sim, maiores
21. Quais cores você gostaria no app? → Azul branco
22. Que nome você daria ao app? → Incluir
23. Você já mexeu no Caderno de Libras? O que achou? → (pulou)
```
