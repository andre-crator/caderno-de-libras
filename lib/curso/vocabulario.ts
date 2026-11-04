// Listas de estudo por tema (D7): palavras comuns do português, escritas por nós,
// para ela saber o que falta aprender em cada tema da ementa. NÃO vêm da apostila
// (D6) e não trazem sinal nenhum: o sinal é o que ela guarda com foto ou vídeo,
// do jeito que a professora ensinou. Temas sem lista (teoria e gramática) ficam de fora.

/** Listas que não são de uma unidade da ementa: valem para o curso todo. */
export const TEMAS_EXTRA = ["Frases para conversar"] as const;

export const VOCABULARIO: Readonly<Record<string, readonly string[]>> = {
  // Frases que salvam uma conversa com uma pessoa surda (todas viram cartão do tipo "frase").
  "Frases para conversar": [
    "Estou aprendendo Libras",
    "Não entendi",
    "Pode repetir?",
    "Mais devagar, por favor",
    "Pode soletrar?",
    "Como é o sinal de…?",
    "O que significa?",
    "Você é surdo?",
    "Eu sou ouvinte",
    "Qual é o seu sinal?",
    "Obrigada pela paciência",
    "Até mais",
  ],
  Pronomes: ["eu", "você", "ele", "ela", "nós", "vocês", "eles", "meu", "seu", "nosso", "este", "aquele"],
  Saudações: ["oi", "tchau", "bom dia", "boa tarde", "boa noite", "obrigado", "por favor", "desculpa", "com licença"],
  Cumprimentos: ["tudo bem?", "bem", "mais ou menos", "prazer", "qual é o seu nome?", "até logo", "até amanhã"],
  Números: ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "cem"],
  "Tempo e clima": ["sol", "chuva", "frio", "calor", "vento", "nublado", "dia", "noite", "estação"],
  "Advérbios de tempo": ["hoje", "ontem", "amanhã", "agora", "depois", "antes", "cedo", "tarde", "já", "ainda"],
  Família: ["pai", "mãe", "filho", "filha", "irmão", "irmã", "avô", "avó", "tio", "tia", "primo", "marido", "esposa"],
  "Verbo ir": ["ir", "vir", "voltar", "chegar", "sair", "viajar"],
  Sentimentos: ["feliz", "triste", "bravo", "medo", "saudade", "amor", "cansado", "preocupado", "calmo", "surpreso"],
  Dinheiro: ["dinheiro", "real", "centavo", "caro", "barato", "pagar", "troco", "cartão", "comprar", "vender"],
  "Horas e duração": ["hora", "minuto", "meio-dia", "meia-noite", "manhã", "tarde", "noite", "atrasado", "semana", "mês", "ano"],
  "Sinais operacionais": ["somar", "subtrair", "multiplicar", "dividir", "igual", "mais", "menos"],
  Cores: ["vermelho", "azul", "amarelo", "verde", "branco", "preto", "rosa", "roxo", "laranja", "marrom", "cinza"],
  Adjetivos: ["grande", "pequeno", "bonito", "feio", "alto", "baixo", "novo", "velho", "fácil", "difícil", "rápido", "devagar"],
  "Material escolar": ["caderno", "lápis", "caneta", "borracha", "livro", "mochila", "tesoura", "cola", "régua", "apontador"],
  "Meios de transporte": ["carro", "ônibus", "moto", "bicicleta", "avião", "trem", "metrô", "barco", "táxi", "caminhão"],
  "Meios de comunicação": ["celular", "telefone", "televisão", "rádio", "jornal", "internet", "computador", "carta", "mensagem"],
  "Estados brasileiros": [
    "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", "Espírito Santo", "Goiás",
    "Maranhão", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco",
    "Piauí", "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", "Roraima", "Santa Catarina",
    "São Paulo", "Sergipe", "Tocantins",
  ],
  Alimentos: ["arroz", "feijão", "carne", "frango", "peixe", "ovo", "pão", "leite", "café", "água", "fruta", "banana", "salada", "bolo"],
  "Advérbios de frequência": ["sempre", "nunca", "às vezes", "todo dia", "raramente", "de novo"],
  Profissões: ["professor", "médico", "enfermeiro", "policial", "motorista", "cozinheiro", "advogado", "vendedor", "dentista", "intérprete"],
  "Pronomes indefinidos e qualificadores": ["algum", "nenhum", "todo", "tudo", "nada", "outro", "muito", "pouco", "cada", "alguém", "ninguém"],
  Animais: ["cachorro", "gato", "cavalo", "vaca", "porco", "galinha", "pássaro", "peixe", "cobra", "macaco", "leão", "elefante"],
  Saúde: ["hospital", "remédio", "dor", "febre", "gripe", "doente", "vacina", "sangue", "emergência", "ambulância"],
};

/**
 * Compara palavras sem ligar para maiúsculas, espaços e "?". Acentos CONTAM:
 * "avô" e "avó" são palavras diferentes.
 */
export function normalizarPalavra(p: string): string {
  return p
    .normalize("NFC")
    .replace(/[?!.¿¡]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("pt-BR");
}

export type ItemDeEstudo = { palavra: string; guardada: boolean };

/** Lista de um tema marcando o que ela já guardou no caderno. */
export function listaDoTema(tema: string, palavrasGuardadas: readonly string[]): ItemDeEstudo[] {
  const guardadas = new Set(palavrasGuardadas.map(normalizarPalavra));
  return (VOCABULARIO[tema] ?? []).map((palavra) => ({
    palavra,
    guardada: guardadas.has(normalizarPalavra(palavra)),
  }));
}

/** Progresso do tema, ex.: { feitas: 6, total: 13 }. */
export function progressoDoTema(tema: string, palavrasGuardadas: readonly string[]) {
  const lista = listaDoTema(tema, palavrasGuardadas);
  return { feitas: lista.filter((i) => i.guardada).length, total: lista.length };
}

/** Link para guardar a palavra no caderno; as listas extras (frases) já abrem como "frase". */
export function linkGuardar(palavra: string, tema: string): string {
  const frase = (TEMAS_EXTRA as readonly string[]).includes(tema);
  return `/caderno/novo?palavra=${encodeURIComponent(palavra)}&tema=${encodeURIComponent(tema)}${frase ? "&tipo=frase" : ""}`;
}
