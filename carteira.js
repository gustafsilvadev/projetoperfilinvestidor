const CLASSES = {
  liquidez: {
    nome: "Reserva e liquidez",
    exemplos: "Tesouro Selic, CDB com liquidez diária",
    funcao: "Dinheiro disponível a qualquer momento, com baixo risco.",
    cor: "#5aa38d"
  },
  rendaFixa: {
    nome: "Renda fixa",
    exemplos: "Tesouro IPCA+, CDBs, LCIs e LCAs",
    funcao: "Retorno mais previsível e proteção contra a inflação.",
    cor: "#2b6f60"
  },
  fiis: {
    nome: "Fundos imobiliários",
    exemplos: "FIIs de tijolo e de papel",
    funcao: "Renda mensal de aluguéis e exposição ao mercado imobiliário.",
    cor: "#e3b04b"
  },
  acoes: {
    nome: "Ações brasileiras",
    exemplos: "ETFs de índice e ações de empresas sólidas",
    funcao: "Potencial de crescimento no longo prazo, com oscilações.",
    cor: "#d9822b"
  },
  internacional: {
    nome: "Internacional",
    exemplos: "ETFs de bolsas globais",
    funcao: "Diversificação fora do Brasil e do real.",
    cor: "#b5482f"
  }
};

const PERFIS = {
  conservador: {
    nome: "Conservador",
    descricao: "Você prioriza segurança e previsibilidade. Prefere ver o dinheiro crescer de forma estável, mesmo que o retorno seja menor."
  },
  moderado: {
    nome: "Moderado",
    descricao: "Você busca equilíbrio. Aceita algumas oscilações em troca de um retorno maior no médio e no longo prazo."
  },
  arrojado: {
    nome: "Arrojado",
    descricao: "Você foca em crescimento e tolera oscilações maiores. Aceita ver a carteira cair em alguns períodos em busca de retornos mais altos."
  }
};

/* Divisão inicial de cada perfil, em porcentagem. Cada linha soma 100. */
const CARTEIRAS_BASE = {
  conservador: { liquidez: 40, rendaFixa: 45, fiis: 5, acoes: 5, internacional: 5 },
  moderado: { liquidez: 20, rendaFixa: 35, fiis: 15, acoes: 15, internacional: 15 },
  arrojado: { liquidez: 10, rendaFixa: 20, fiis: 15, acoes: 30, internacional: 25 }
};

const LIMITE_RENDA_VARIAVEL_OBJETIVO_COM_DATA = 20;
const MINIMO_LIQUIDEZ_SEM_RESERVA = 50;

function definirPerfil(pontos) {
  if (pontos <= 6) return "conservador";
  if (pontos <= 9) return "moderado";
  return "arrojado";
}

/* Garante que a soma seja exatamente 100, jogando a sobra na maior classe. */
function normalizar(alocacao) {
  const chaves = Object.keys(alocacao);
  const soma = chaves.reduce(function (total, chave) { return total + alocacao[chave]; }, 0);
  const diferenca = 100 - soma;
  if (diferenca === 0) return;

  const maior = chaves.reduce(function (a, b) { return alocacao[a] >= alocacao[b] ? a : b; });
  alocacao[maior] += diferenca;
}

/* Move pontos percentuais de uma classe para outra, sem deixar a origem negativa. */
function moverPontos(alocacao, de, para, pontos) {
  const movido = Math.min(pontos, alocacao[de]);
  alocacao[de] -= movido;
  alocacao[para] += movido;
}

function textoPrazo(prazoPontos) {
  if (prazoPontos <= 2) {
    return "Seu prazo é curto, por isso a carteira mantém boa parte do dinheiro em ativos de baixa oscilação.";
  }
  if (prazoPontos === 3) {
    return "Seu prazo é intermediário, então a carteira combina renda fixa com uma parte em renda variável.";
  }
  return "Seu prazo é longo, o que dá tempo para atravessar as oscilações da renda variável.";
}

function ajustarPorObjetivo(alocacao, objetivo, motivos) {
  if (objetivo === "reserva") {
    alocacao.liquidez = 80;
    alocacao.rendaFixa = 20;
    alocacao.fiis = 0;
    alocacao.acoes = 0;
    alocacao.internacional = 0;
    motivos.push("Reserva de emergência deve ficar em investimentos seguros e de resgate rápido, por isso a carteira não tem renda variável.");
    return;
  }

  if (objetivo === "medio") {
    const variaveis = ["fiis", "acoes", "internacional"];
    const risco = alocacao.fiis + alocacao.acoes + alocacao.internacional;

    if (risco > LIMITE_RENDA_VARIAVEL_OBJETIVO_COM_DATA) {
      const fator = LIMITE_RENDA_VARIAVEL_OBJETIVO_COM_DATA / risco;
      let novoRisco = 0;
      variaveis.forEach(function (classe) {
        alocacao[classe] = Math.floor(alocacao[classe] * fator);
        novoRisco += alocacao[classe];
      });
      alocacao.rendaFixa += risco - novoRisco;
      motivos.push("Como seu objetivo tem data para acontecer, limitamos a renda variável a " + LIMITE_RENDA_VARIAVEL_OBJETIVO_COM_DATA + "% da carteira.");
    }
    return;
  }

  if (objetivo === "longo") {
    moverPontos(alocacao, "rendaFixa", "internacional", 5);
    motivos.push("Para o longo prazo, aumentamos a parte internacional para diversificar além do Brasil.");
    return;
  }

  if (objetivo === "renda") {
    moverPontos(alocacao, "rendaFixa", "fiis", 10);
    motivos.push("Para gerar renda mensal, aumentamos os fundos imobiliários, que costumam distribuir rendimentos todo mês.");
  }
}

/* Sem reserva de emergência, a liquidez passa a ser, no mínimo, metade da carteira. */
function garantirReserva(alocacao) {
  if (alocacao.liquidez >= MINIMO_LIQUIDEZ_SEM_RESERVA) return false;

  const outras = Object.keys(alocacao).filter(function (classe) { return classe !== "liquidez"; });
  const totalOutras = outras.reduce(function (total, classe) { return total + alocacao[classe]; }, 0);
  const fator = (100 - MINIMO_LIQUIDEZ_SEM_RESERVA) / totalOutras;

  outras.forEach(function (classe) {
    alocacao[classe] = Math.round(alocacao[classe] * fator);
  });
  alocacao.liquidez = MINIMO_LIQUIDEZ_SEM_RESERVA;
  return true;
}

/* dados = { pontos, pontosMaximos, prazoPontos, objetivo, temReserva } */
function montarCarteira(dados) {
  const perfilId = definirPerfil(dados.pontos);
  const alocacao = Object.assign({}, CARTEIRAS_BASE[perfilId]);
  const motivos = [];

  motivos.push(
    "Suas respostas somaram " + dados.pontos + " de " + dados.pontosMaximos +
    " pontos de tolerância a risco, o que corresponde ao perfil " + PERFIS[perfilId].nome.toLowerCase() + "."
  );
  motivos.push(textoPrazo(dados.prazoPontos));

  ajustarPorObjetivo(alocacao, dados.objetivo, motivos);

  if (dados.objetivo !== "reserva" && !dados.temReserva) {
    if (garantirReserva(alocacao)) {
      motivos.push("Como você ainda não tem reserva de emergência, metade da carteira fica em liquidez diária até que ela esteja completa.");
    }
  }

  normalizar(alocacao);

  return { perfilId: perfilId, perfil: PERFIS[perfilId], alocacao: alocacao, motivos: motivos };
}

if (typeof module !== "undefined") {
  module.exports = { montarCarteira, definirPerfil, CLASSES, CARTEIRAS_BASE };
}
