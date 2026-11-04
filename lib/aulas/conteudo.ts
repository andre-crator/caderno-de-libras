// Aulas do Incluir (D9). Textos escritos por nós, nada da apostila (D6), e nenhum
// sinal descrito (D2): como fazer cada sinal fica com os vídeos e a professora.
// Lote 1: unidades 1 a 3 (ela estava na página 24, fim da unidade 2, em 2026-11-04).
// Negrito: **assim**. Vídeos ficam em content/aulas/videos.json.

export type Secao = { titulo: string; paragrafos: string[]; itens?: string[] };

export type Aula = {
  slug: string;
  unidade: number;
  titulo: string;
  objetivo: string;
  secoes: Secao[];
  /** Temas de lib/curso/vocabulario.ts usados no "Pratique". */
  temas: string[];
  /** Atalho para o treino de soletrar (alfabeto ou números). */
  soletrar?: "letras" | "numeros";
};

export const AULAS: readonly Aula[] = [
  {
    slug: "u1-historia-dos-surdos",
    unidade: 1,
    titulo: "Um pouco de história",
    objetivo: "Entender de onde vem a Libras e por que a comunidade surda lutou tanto por ela.",
    temas: [],
    secoes: [
      {
        titulo: "Por muito tempo, sinalizar foi proibido",
        paragrafos: [
          "Durante séculos, a educação de surdos tentou ensiná-los só a falar e a ler os lábios. Esse jeito de ensinar se chama **oralismo**.",
          "Em 1880, um congresso de educadores em **Milão**, na Itália, decidiu que o método oral era o melhor e recomendou tirar as línguas de sinais das escolas. Essa decisão pesou por quase cem anos: em muitos lugares, crianças surdas eram impedidas de sinalizar na sala de aula.",
        ],
      },
      {
        titulo: "No Brasil, tudo começa no Rio de Janeiro",
        paragrafos: [
          "O professor surdo francês **E. Huet** veio ao Brasil com o apoio de D. Pedro II para educar crianças surdas. A escola que ele começou foi oficializada em 1857 no Rio de Janeiro como Imperial Instituto de Surdos-Mudos. Hoje ela se chama **INES**, Instituto Nacional de Educação de Surdos, e continua funcionando.",
          "A Libras nasceu do encontro da língua de sinais francesa, trazida por Huet, com os sinais que os surdos brasileiros já usavam. Por isso o **26 de setembro**, data ligada à fundação do instituto, é o Dia Nacional do Surdo.",
        ],
      },
      {
        titulo: "O que isso muda para você",
        paragrafos: [
          "A Libras é a língua de uma comunidade que precisou lutar para poder usá-la. Aprender com uma professora surda é aprender a língua com quem é dono dela.",
        ],
        itens: [
          "Diga **surdo**, não \"surdo-mudo\": a maioria dos surdos tem voz, só não usa a fala como língua principal.",
          "Quem ouve é chamado de **ouvinte**.",
        ],
      },
    ],
  },
  {
    slug: "u1-libras-e-uma-lingua",
    unidade: 1,
    titulo: "Libras é uma língua",
    objetivo: "Saber o que a Libras é (e o que não é) e o que a lei garante.",
    temas: [],
    secoes: [
      {
        titulo: "Uma língua de verdade, não mímica",
        paragrafos: [
          "A Libras tem vocabulário, gramática e regras próprias. Ela **não é português feito com as mãos**: a ordem das palavras e o jeito de montar as frases são diferentes.",
          "É uma língua **visual-espacial**: usa as mãos, o rosto, o corpo e o espaço em volta de quem sinaliza. E não é universal: cada país tem a sua. A língua de sinais dos Estados Unidos, por exemplo, é outra.",
        ],
      },
      {
        titulo: "O que a lei diz",
        paragrafos: [
          "A **Lei 10.436, de 24 de abril de 2002**, reconhece a Libras como meio legal de comunicação e expressão da comunidade surda brasileira. A mesma lei diz que a Libras não substitui o português escrito.",
          "O **Decreto 5.626, de 2005**, regulamenta essa lei: entre outras coisas, torna a Libras disciplina obrigatória na formação de professores e de fonoaudiólogos e trata da formação de professores e intérpretes de Libras.",
        ],
      },
      {
        titulo: "Comunidade surda",
        paragrafos: [
          "Muitos surdos se identificam pela **língua e pela cultura** (identidade surda), e não pela perda de audição. A comunidade surda reúne surdos e também ouvintes que usam a Libras: familiares, intérpretes, professores e alunos como você.",
        ],
      },
    ],
  },
  {
    slug: "u2-parametros",
    unidade: 2,
    titulo: "Os 5 parâmetros",
    objetivo: "Saber em que reparar para aprender e lembrar qualquer sinal.",
    temas: [],
    secoes: [
      {
        titulo: "Como um sinal é formado",
        paragrafos: [
          "Em 1960, o linguista William Stokoe mostrou que a língua de sinais dos Estados Unidos tem estrutura de língua: cada sinal combina partes menores. Na Libras, essas partes são estudadas como **5 parâmetros**:",
        ],
        itens: [
          "**CM, configuração de mão:** o formato da mão.",
          "**PA, ponto de articulação:** onde o sinal acontece (no rosto, no peito, no espaço na frente do corpo).",
          "**M, movimento:** se a mão se move, para onde e como.",
          "**Or, orientação da palma:** para onde a palma aponta.",
          "**ENM, expressões não manuais:** rosto e corpo (sobrancelhas, boca, cabeça).",
        ],
      },
      {
        titulo: "Mudou um parâmetro, mudou o sinal",
        paragrafos: [
          "Existem sinais iguais em quase tudo que mudam de sentido por causa de **um parâmetro só**. É como \"pato\" e \"gato\" no português: uma letra muda a palavra.",
          "Por isso, ao ver um sinal novo, repare nos 5. No seu caderno, os campos \"Como fazer o sinal\" são exatamente esses parâmetros.",
        ],
      },
    ],
  },
  {
    slug: "u2-alfabeto-manual",
    unidade: 2,
    titulo: "Alfabeto manual e datilologia",
    objetivo: "Saber quando soletrar com as mãos e treinar o alfabeto manual.",
    temas: [],
    soletrar: "letras",
    secoes: [
      {
        titulo: "Para que serve",
        paragrafos: [
          "Soletrar com o alfabeto manual se chama **datilologia**. Ela é usada para nomes próprios, siglas e palavras que ainda não têm sinal ou cujo sinal a pessoa não conhece.",
          "A datilologia **não é a língua**: em uma conversa, quase tudo é dito com sinais. Soletrar cada palavra deixa a conversa lenta e cansativa.",
        ],
      },
      {
        titulo: "Sinal de nome",
        paragrafos: [
          "Na comunidade surda, cada pessoa costuma receber um **sinal de nome**, geralmente dado por uma pessoa surda e ligado a alguma característica. Primeiro você soletra o seu nome; depois mostra o seu sinal, se já tiver um.",
        ],
      },
      {
        titulo: "Dicas para soletrar bem",
        paragrafos: [],
        itens: [
          "Repare no vídeo onde fica a mão e para onde a palma aponta enquanto a pessoa soletra.",
          "Ritmo constante: devagar e firme é melhor que rápido e embolado.",
          "Algumas letras têm movimento. Repare nelas no vídeo.",
        ],
      },
    ],
  },
  {
    slug: "u2-pronomes",
    unidade: 2,
    titulo: "Pronomes",
    objetivo: "Entender como a Libras indica eu, você, ele e ela usando o espaço.",
    temas: ["Pronomes"],
    secoes: [
      {
        titulo: "Apontar faz parte da gramática",
        paragrafos: [
          "Em português, apontar para alguém pode parecer falta de educação. Na Libras, **apontar é gramática**: é assim que muitos pronomes pessoais são feitos.",
          "Se a pessoa de quem você fala está presente, aponta-se para ela. Se não está, quem sinaliza **marca um ponto no espaço** para aquela pessoa e, dali em diante, aponta para esse ponto sempre que se referir a ela.",
        ],
      },
      {
        titulo: "Repare nisto",
        paragrafos: [],
        itens: [
          "Na Libras, o pronome apontado não muda para homem ou mulher: quem é fica claro pelo contexto.",
          "Plural, possessivos (meu, seu) e demonstrativos (este, aquele) também usam a direção e o espaço. Veja nos vídeos.",
          "Mantenha os pontos que você marcou: se a mãe ficou à sua direita, ela continua à direita até o fim da conversa.",
        ],
      },
    ],
  },
  {
    slug: "u2-saudacoes-e-cumprimentos",
    unidade: 2,
    titulo: "Saudações e cumprimentos",
    objetivo: "Cumprimentar uma pessoa surda e se apresentar com naturalidade.",
    temas: ["Saudações", "Cumprimentos"],
    secoes: [
      {
        titulo: "Antes de sinalizar: chamar a atenção",
        paragrafos: ["Como a conversa é pelo olhar, primeiro é preciso que a pessoa esteja olhando para você."],
        itens: [
          "Toque de leve no ombro ou no braço.",
          "Acene dentro do campo de visão dela.",
          "Em grupo, piscar a luz da sala também é comum.",
        ],
      },
      {
        titulo: "Durante a conversa",
        paragrafos: [
          "Mantenha o **contato visual**: desviar o olhar é como tapar os ouvidos numa conversa falada. E o rosto acompanha o cumprimento: um \"tudo bem?\" é uma pergunta, então a expressão também pergunta.",
          "Ao se apresentar, é comum dizer o nome soletrando e depois mostrar o sinal de nome.",
        ],
      },
    ],
  },
  {
    slug: "u2-numeros",
    unidade: 2,
    titulo: "Números",
    objetivo: "Conhecer os números e entender que a forma pode mudar conforme o uso.",
    temas: ["Números"],
    soletrar: "numeros",
    secoes: [
      {
        titulo: "Número de quê?",
        paragrafos: [
          "Na Libras, o jeito de fazer um número pode mudar conforme o que ele representa: **quantidade** (três pessoas), **ordem** (terceiro lugar) ou **código** (telefone, CEP, número da casa). Os vídeos mostram as diferenças. Na dúvida, vale o que a professora ensinar.",
        ],
      },
      {
        titulo: "Onde os números aparecem",
        paragrafos: [],
        itens: [
          "Idade, horas e dias do mês.",
          "Telefone e documentos: costumam ser sinalizados dígito por dígito.",
          "Dinheiro e preços.",
        ],
      },
      {
        titulo: "Treine",
        paragrafos: [
          "No treino de Soletrar, escolha **Números** e a faixa \"Telefone\": os dígitos aparecem um a um, no seu ritmo.",
        ],
      },
    ],
  },
  {
    slug: "u3-tempo-e-calendario",
    unidade: 3,
    titulo: "Tempo, calendário e clima",
    objetivo: "Dizer quando algo aconteceu e falar de dias, meses e do tempo lá fora.",
    temas: ["Advérbios de tempo", "Tempo e clima"],
    secoes: [
      {
        titulo: "O verbo não muda, o tempo vem antes",
        paragrafos: [
          "Em português, o verbo muda para mostrar o tempo: \"fui\", \"vou\", \"irei\". Na Libras, o tempo costuma ser marcado por sinais como **ontem, hoje, amanhã** ou **semana passada**, que muitas vezes vêm no começo da frase.",
        ],
      },
      {
        titulo: "O tempo no espaço",
        paragrafos: [
          "Muitos sinais de tempo usam o espaço em volta do corpo como se fosse uma **linha do tempo**. Repare nos vídeos como o passado, o presente e o futuro aparecem nesse espaço.",
        ],
      },
      {
        titulo: "Calendário e clima",
        paragrafos: [
          "Dias da semana, meses, frio, calor, chuva e sol são vocabulário do dia a dia: aparecem em quase toda conversa. Guarde no caderno os que a professora ensinar.",
        ],
      },
    ],
  },
  {
    slug: "u3-expressoes-e-frases",
    unidade: 3,
    titulo: "Expressões faciais e tipos de frases",
    objetivo: "Entender por que o rosto faz parte da gramática da Libras.",
    temas: [],
    secoes: [
      {
        titulo: "O rosto também fala",
        paragrafos: [
          "Existem dois tipos de expressão facial na Libras. As **afetivas** mostram sentimento (alegria, tristeza, surpresa). As **gramaticais** mudam o sentido da frase: sem elas, a frase fica errada ou quer dizer outra coisa.",
        ],
      },
      {
        titulo: "Tipos de frases",
        paragrafos: ["Os mesmos sinais podem virar frases diferentes conforme o rosto e a cabeça:"],
        itens: [
          "**Afirmativa:** o rosto neutro, de quem conta algo.",
          "**Negativa:** além do sinal de negação, é comum balançar a cabeça.",
          "**Interrogativa:** a pergunta aparece no rosto. Perguntas de \"sim ou não\" e perguntas com o que, onde e quem costumam usar expressões diferentes. Repare nas sobrancelhas nos vídeos.",
          "**Exclamativa:** a expressão é mais intensa.",
        ],
      },
      {
        titulo: "Treine",
        paragrafos: [
          "Expressão não é exagero: é gramática. Grave você mesma fazendo uma pergunta e uma afirmação com os mesmos sinais e compare. O caderno aceita vídeos de até 15 segundos.",
        ],
      },
    ],
  },
];
