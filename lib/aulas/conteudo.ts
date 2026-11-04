// Aulas do Incluir (D9). Textos escritos por nós, nada da apostila (D6), e nenhum
// sinal descrito (D2): como fazer cada sinal fica com os vídeos e a professora.
// Lote 1: unidades 1 a 3 (ela estava na página 24, fim da unidade 2, em 2026-11-04).
// Lote 2: unidade 4 (família, ser/estar, ir, sentimentos).
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
    temas: ["Saudações", "Cumprimentos", "Frases para conversar"],
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
  {
    slug: "u4-familia",
    unidade: 4,
    titulo: "Família",
    objetivo: "Apresentar a sua família e perguntar sobre a família de alguém.",
    temas: ["Família", "Pronomes"],
    secoes: [
      {
        titulo: "Um dos primeiros assuntos de conversa",
        paragrafos: [
          "Quando duas pessoas se conhecem, logo aparecem perguntas como \"você tem irmãos?\" ou \"você é casada?\". Por isso a família vem cedo no curso: com ela, você já consegue contar um pouco da sua vida.",
        ],
      },
      {
        titulo: "Sinais que se parecem",
        paragrafos: [
          "Muitos sinais de parentes são **parecidos entre si** ou formados juntando dois sinais. Repare nos vídeos o que muda de um para outro (pai e mãe, irmão e irmã, avô e avó) e anote no caderno a diferença que a professora mostrar.",
          "Sinais de família variam bastante de uma região para outra. Se o vídeo mostrar um jeito diferente do da professora, vale o dela.",
        ],
      },
      {
        titulo: "Juntando com o que você já sabe",
        paragrafos: ["Os pronomes da unidade 2 entram aqui o tempo todo:"],
        itens: [
          "**Meu, minha, seu, sua:** \"minha mãe\", \"seu irmão\".",
          "**Números:** \"tenho dois irmãos\", \"meu filho tem cinco anos\".",
          "**Perguntas:** lembre que a pergunta aparece no rosto (unidade 3).",
        ],
      },
      {
        titulo: "Treine",
        paragrafos: [
          "Guarde no caderno os parentes da lista e depois tente se apresentar: quem é da sua família, quantos irmãos você tem, se é casada. Grave e compare com a professora na próxima aula.",
        ],
      },
    ],
  },
  {
    slug: "u4-verbos-ser-estar-ir",
    unidade: 4,
    titulo: "Verbos ser, estar e ir",
    objetivo: "Entender como a Libras diz \"eu sou\", \"eu estou\" e \"eu vou\", que funcionam diferente do português.",
    temas: ["Verbo ir"],
    secoes: [
      {
        titulo: "O verbo não muda de forma",
        paragrafos: [
          "Em português, o verbo muda conforme a pessoa e o tempo: \"eu sou\", \"ela é\", \"nós fomos\". Na Libras, o verbo **não ganha terminação**: quem faz a ação aparece pelo pronome ou pelo espaço, e o tempo aparece por sinais como ontem e amanhã (unidade 3).",
        ],
      },
      {
        titulo: "Ser e estar",
        paragrafos: [
          "Em muitas frases, a Libras **não usa um sinal para \"ser\" ou \"estar\"**: \"eu sou ouvinte\" pode ficar só \"eu ouvinte\", e \"ela está cansada\", só \"ela cansada\". Isso não é frase errada nem incompleta: é a gramática da língua.",
          "Há também sinais para \"estar\" em alguns sentidos, como estar presente num lugar. Veja nos vídeos quando eles aparecem e anote o que a professora ensinar.",
        ],
      },
      {
        titulo: "Ir, vir e o espaço",
        paragrafos: [
          "Alguns verbos usam o **espaço** para mostrar de onde e para onde vai a ação. Eles são chamados de verbos **direcionais** (ou de concordância). Ir, vir e voltar costumam funcionar assim: o movimento do sinal mostra o caminho.",
          "Outros verbos, como gostar ou conhecer, são **simples**: o sinal fica igual, e quem faz a ação vem pelo pronome. Repare nos vídeos a diferença entre os dois tipos.",
        ],
      },
      {
        titulo: "Treine",
        paragrafos: [
          "Monte frases curtas com o que você já sabe: \"eu ouvinte\", \"amanhã eu ir trabalhar\", \"ontem minha mãe vir casa\". Na Libras, a ordem das palavras pode ser diferente do português: siga a da professora.",
        ],
      },
    ],
  },
  {
    slug: "u4-sentimentos",
    unidade: 4,
    titulo: "Sentimentos",
    objetivo: "Dizer como você está e entender como alguém se sente.",
    temas: ["Sentimentos"],
    secoes: [
      {
        titulo: "Sem o rosto, o sinal fica pela metade",
        paragrafos: [
          "Na unidade 3 você viu as expressões **afetivas**, que mostram sentimento. Nos sinais de sentimento elas são obrigatórias: sinalizar \"feliz\" com o rosto sério confunde quem está vendo.",
        ],
      },
      {
        titulo: "Mais ou menos intenso",
        paragrafos: [
          "Para dizer \"muito triste\" ou \"um pouco cansada\", a Libras costuma mudar a **intensidade** da expressão e do movimento, em vez de só acrescentar a palavra \"muito\". Repare nos vídeos como isso aparece.",
        ],
      },
      {
        titulo: "Na conversa",
        paragrafos: [],
        itens: [
          "Responder a **tudo bem?** (unidade 2) com mais do que \"bem\": feliz, cansada, preocupada.",
          "Perguntar como a pessoa se sente: lembre da expressão de pergunta.",
          "Sem verbo \"estar\": \"eu cansada\" já é a frase completa (veja a aula de verbos).",
        ],
      },
      {
        titulo: "Treine",
        paragrafos: [
          "No jogo **Espelho**, grave você fazendo os sentimentos da lista e compare com o caderno. Preste atenção mais no rosto do que nas mãos.",
        ],
      },
    ],
  },
];
