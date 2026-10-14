const PASSOS = [
  {
    id: "objetivo",
    tipo: "opcoes",
    titulo: "Qual é o seu principal objetivo com este dinheiro?",
    opcoes: [
      { valor: "reserva", texto: "Formar uma reserva de emergência" },
      { valor: "medio", texto: "Realizar um objetivo com data (viagem, carro, entrada de imóvel)" },
      { valor: "longo", texto: "Construir patrimônio para o longo prazo ou a aposentadoria" },
      { valor: "renda", texto: "Gerar uma renda extra mensal" }
    ]
  },
  {
    id: "prazo",
    tipo: "opcoes",
    pontua: true,
    titulo: "Em quanto tempo você pretende usar esse dinheiro?",
    opcoes: [
      { valor: "ate1", texto: "Em até 1 ano", pontos: 1 },
      { valor: "1a3", texto: "Entre 1 e 3 anos", pontos: 2 },
      { valor: "3a5", texto: "Entre 3 e 5 anos", pontos: 3 },
      { valor: "mais5", texto: "Em mais de 5 anos", pontos: 4 }
    ]
  },
  {
    id: "reserva",
    tipo: "opcoes",
    mostrarSe: function (respostas) { return respostas.objetivo !== "reserva"; },
    titulo: "Você já tem uma reserva de emergência?",
    opcoes: [
      { valor: "sim", texto: "Sim, tenho pelo menos 6 meses de despesas guardados" },
      { valor: "nao", texto: "Ainda não" }
    ]
  },
  {
    id: "queda",
    tipo: "opcoes",
    pontua: true,
    titulo: "Imagine que seus investimentos caiam 15% em um mês. O que você faria?",
    opcoes: [
      { valor: "vender", texto: "Venderia tudo para não perder mais", pontos: 1 },
      { valor: "parte", texto: "Venderia uma parte para me proteger", pontos: 2 },
      { valor: "esperar", texto: "Não mexeria e esperaria a recuperação", pontos: 3 },
      { valor: "comprar", texto: "Aproveitaria para investir mais", pontos: 4 }
    ]
  },
  {
    id: "cenario",
    tipo: "opcoes",
    pontua: true,
    titulo: "Qual destes cenários de um ano você aceitaria?",
    opcoes: [
      { valor: "a", texto: "Pior resultado: 0%. Melhor resultado: +8%", pontos: 1 },
      { valor: "b", texto: "Pior resultado: -5%. Melhor resultado: +14%", pontos: 2 },
      { valor: "c", texto: "Pior resultado: -15%. Melhor resultado: +25%", pontos: 3 },
      { valor: "d", texto: "Pior resultado: -30%. Melhor resultado: +45%", pontos: 4 }
    ]
  },
  {
    id: "valor",
    tipo: "valor",
    titulo: "Quanto você pretende investir? (opcional)"
  }
];

const PONTOS_POR_PERGUNTA = 4;

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const moedaInteira = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

const elQuiz = document.getElementById("quiz");
const elResultado = document.getElementById("resultado");
const formulario = document.getElementById("form-passo");
const elCampo = document.getElementById("campo-passo");
const elErro = document.getElementById("erro");
const elProgressoTexto = document.getElementById("progresso-texto");
const elProgressoBarra = document.getElementById("progresso-barra");
const btnVoltar = document.getElementById("btn-voltar");
const btnProximo = document.getElementById("btn-proximo");
const btnRefazer = document.getElementById("btn-refazer");

let respostas = {};
let indice = 0;

function passosAtivos() {
  return PASSOS.filter(function (passo) {
    return !passo.mostrarSe || passo.mostrarSe(respostas);
  });
}

function criarOpcoes(passo) {
  const grupo = document.createElement("div");
  grupo.className = "opcoes";

  passo.opcoes.forEach(function (opcao) {
    const rotulo = document.createElement("label");
    rotulo.className = "opcao";

    const entrada = document.createElement("input");
    entrada.type = "radio";
    entrada.name = "resposta";
    entrada.value = opcao.valor;
    entrada.checked = respostas[passo.id] === opcao.valor;

    const texto = document.createElement("span");
    texto.className = "opcao-texto";
    texto.textContent = opcao.texto;

    rotulo.append(entrada, texto);
    grupo.appendChild(rotulo);
  });

  return grupo;
}

function criarCampoValor(passo) {
  const grupo = document.createElement("div");
  grupo.className = "campo-valor";

  const rotulo = document.createElement("label");
  rotulo.htmlFor = "valor-investido";
  rotulo.textContent = "Valor em reais (R$)";

  const entrada = document.createElement("input");
  entrada.id = "valor-investido";
  entrada.type = "number";
  entrada.min = "0";
  entrada.step = "0.01";
  entrada.inputMode = "decimal";
  entrada.placeholder = "5000";
  entrada.value = respostas[passo.id] || "";

  const dica = document.createElement("p");
  dica.className = "dica";
  dica.textContent = "Se preencher, mostramos também a divisão em reais. Pode deixar em branco.";

  grupo.append(rotulo, entrada, dica);
  return grupo;
}

function renderizarPasso(focar) {
  const ativos = passosAtivos();
  const passo = ativos[indice];

  elProgressoTexto.textContent = "Pergunta " + (indice + 1) + " de " + ativos.length;
  elProgressoBarra.style.width = ((indice + 1) / ativos.length) * 100 + "%";
  elErro.textContent = "";

  const legenda = document.createElement("legend");
  legenda.textContent = passo.titulo;
  legenda.tabIndex = -1;

  elCampo.replaceChildren(legenda, passo.tipo === "opcoes" ? criarOpcoes(passo) : criarCampoValor(passo));

  btnVoltar.hidden = indice === 0;
  btnProximo.textContent = indice === ativos.length - 1 ? "Ver minha carteira" : "Próxima";

  if (focar) legenda.focus();
}

function salvarRespostaAtual(passo) {
  if (passo.tipo === "opcoes") {
    const marcada = formulario.querySelector('input[name="resposta"]:checked');
    if (marcada) respostas[passo.id] = marcada.value;
  } else {
    respostas[passo.id] = document.getElementById("valor-investido").value.trim();
  }
}

function validarPasso(passo) {
  if (passo.tipo === "opcoes") {
    return respostas[passo.id] ? "" : "Escolha uma opção para continuar.";
  }

  const texto = respostas[passo.id];
  if (texto === "") return "";

  const valor = parseFloat(texto);
  if (!Number.isFinite(valor) || valor <= 0) {
    return "Informe um valor maior que zero ou deixe o campo em branco.";
  }
  return "";
}

function pontosDaResposta(idPasso) {
  const passo = PASSOS.find(function (p) { return p.id === idPasso; });
  const opcao = passo.opcoes.find(function (o) { return o.valor === respostas[idPasso]; });
  return opcao.pontos;
}

function calcularPontos() {
  const perguntasPontuadas = PASSOS.filter(function (passo) { return passo.pontua; });
  const total = perguntasPontuadas.reduce(function (soma, passo) {
    return soma + pontosDaResposta(passo.id);
  }, 0);

  return { total: total, maximo: perguntasPontuadas.length * PONTOS_POR_PERGUNTA };
}

function criarItemClasse(classe, percentual, valorInvestido) {
  const item = document.createElement("li");
  item.className = "item-classe";

  const amostra = document.createElement("span");
  amostra.className = "amostra";
  amostra.style.background = classe.cor;

  const texto = document.createElement("div");
  const nome = document.createElement("span");
  nome.className = "item-nome";
  nome.textContent = classe.nome;
  const funcao = document.createElement("span");
  funcao.className = "item-detalhe";
  funcao.textContent = classe.funcao;
  const exemplos = document.createElement("span");
  exemplos.className = "item-detalhe";
  exemplos.textContent = "Exemplos: " + classe.exemplos;
  texto.append(nome, funcao, exemplos);

  const numeros = document.createElement("div");
  numeros.className = "item-numeros";
  const pct = document.createElement("span");
  pct.className = "item-percentual";
  pct.textContent = percentual + "%";
  numeros.appendChild(pct);

  if (valorInvestido) {
    const reais = document.createElement("span");
    reais.className = "item-reais";
    reais.textContent = moeda.format((valorInvestido * percentual) / 100);
    numeros.appendChild(reais);
  }

  item.append(amostra, texto, numeros);
  return item;
}

function desenharCarteira(alocacao, valorInvestido) {
  const lista = document.getElementById("lista-classes");
  const rosca = document.getElementById("rosca");
  const fatias = [];
  const itens = document.createDocumentFragment();
  let acumulado = 0;

  Object.keys(CLASSES).forEach(function (chave) {
    const percentual = alocacao[chave];
    if (percentual <= 0) return;

    const classe = CLASSES[chave];
    fatias.push(classe.cor + " " + acumulado + "% " + (acumulado + percentual) + "%");
    acumulado += percentual;
    itens.appendChild(criarItemClasse(classe, percentual, valorInvestido));
  });

  lista.replaceChildren(itens);
  rosca.style.background = "conic-gradient(" + fatias.join(", ") + ")";

  document.getElementById("rosca-valor").textContent = valorInvestido ? moedaInteira.format(valorInvestido) : "100%";
  document.getElementById("rosca-legenda").textContent = valorInvestido ? "investidos" : "da carteira";
}

function mostrarResultado() {
  const pontos = calcularPontos();
  const resultado = montarCarteira({
    pontos: pontos.total,
    pontosMaximos: pontos.maximo,
    prazoPontos: pontosDaResposta("prazo"),
    objetivo: respostas.objetivo,
    temReserva: respostas.reserva === "sim"
  });

  const texto = respostas.valor;
  const valorInvestido = texto ? parseFloat(texto) : 0;

  document.getElementById("resultado-titulo").textContent = "Seu perfil é " + resultado.perfil.nome;
  document.getElementById("perfil-descricao").textContent = resultado.perfil.descricao;

  ["conservador", "moderado", "arrojado"].forEach(function (id) {
    const item = document.getElementById("escala-" + id);
    if (id === resultado.perfilId) {
      item.setAttribute("aria-current", "true");
    } else {
      item.removeAttribute("aria-current");
    }
  });

  desenharCarteira(resultado.alocacao, valorInvestido);

  const motivos = document.getElementById("lista-motivos");
  motivos.replaceChildren();
  resultado.motivos.forEach(function (motivo) {
    const item = document.createElement("li");
    item.textContent = motivo;
    motivos.appendChild(item);
  });

  elQuiz.hidden = true;
  elResultado.hidden = false;
  document.getElementById("resultado-titulo").focus();
}

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const ativos = passosAtivos();
  const passo = ativos[indice];

  salvarRespostaAtual(passo);

  const erro = validarPasso(passo);
  if (erro) {
    elErro.textContent = erro;
    return;
  }

  if (indice < ativos.length - 1) {
    indice++;
    renderizarPasso(true);
  } else {
    mostrarResultado();
  }
});

btnVoltar.addEventListener("click", function () {
  salvarRespostaAtual(passosAtivos()[indice]);
  indice--;
  renderizarPasso(true);
});

btnRefazer.addEventListener("click", function () {
  respostas = {};
  indice = 0;
  elResultado.hidden = true;
  elQuiz.hidden = false;
  renderizarPasso(true);
});

renderizarPasso(false);
