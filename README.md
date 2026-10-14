# Criador de carteira de investimentos

Site simples com um quiz de poucas perguntas que identifica o perfil de investidor (conservador, moderado ou arrojado) e sugere uma divisão de carteira entre classes de ativos, de acordo com os objetivos da pessoa.

<!-- Adicione aqui uma captura de tela: ![Prévia do site](preview.png) -->

## Como funciona

1. A pessoa responde a 5 ou 6 perguntas (a pergunta sobre reserva de emergência é pulada quando o objetivo já é formar a reserva).
2. Três perguntas valem de 1 a 4 pontos cada: prazo, reação a uma queda e cenário de retorno e risco. A soma define o perfil.
3. A carteira inicial do perfil é ajustada pelo objetivo e pela existência de reserva de emergência.
4. O resultado mostra o perfil, um gráfico de rosca, a divisão em porcentagem (e em reais, se o valor for informado) e os motivos da divisão.

### Perfil

| Pontos (de 3 a 12) | Perfil |
| --- | --- |
| 3 a 6 | Conservador |
| 7 a 9 | Moderado |
| 10 a 12 | Arrojado |

### Carteira inicial de cada perfil

| Classe | Conservador | Moderado | Arrojado |
| --- | --- | --- | --- |
| Reserva e liquidez | 40% | 20% | 10% |
| Renda fixa | 45% | 35% | 20% |
| Fundos imobiliários | 5% | 15% | 15% |
| Ações brasileiras | 5% | 15% | 30% |
| Internacional | 5% | 15% | 25% |

### Ajustes pelos objetivos

| Situação | Ajuste |
| --- | --- |
| Formar reserva de emergência | 80% em liquidez e 20% em renda fixa, sem renda variável |
| Objetivo com data (viagem, carro, imóvel) | Renda variável limitada a 20% da carteira |
| Longo prazo ou aposentadoria | 5 pontos percentuais da renda fixa vão para internacional |
| Renda extra mensal | 10 pontos percentuais da renda fixa vão para fundos imobiliários |
| Sem reserva de emergência | Liquidez de, no mínimo, 50% da carteira |

## Tecnologias

- HTML5
- CSS3 (Grid, Flexbox e `conic-gradient` para o gráfico de rosca)
- JavaScript puro, sem bibliotecas

## Como rodar

1. Baixe ou clone o repositório.
2. Abra o arquivo `index.html` no navegador.

Não precisa instalar nada.

## Estrutura

```
criador-carteira/
├── index.html    estrutura da página
├── style.css     estilos
├── carteira.js   regras: perfis, carteiras base e ajustes (sem acesso à página)
├── script.js     interface: perguntas, navegação e resultado
└── README.md
```

As regras ficam em `carteira.js`, separadas da interface, para que possam ser testadas e alteradas sem mexer na tela.

## Próximos passos

- Mais perguntas, como renda mensal e experiência com investimentos
- Explicação de cada classe de ativo ao clicar nela
- Salvar o resultado no navegador com `localStorage`
- Testes automatizados para `montarCarteira`
- Exportar o resultado em PDF

## Aviso

Projeto de estudo com caráter educacional. A carteira é uma sugestão genérica de divisão entre classes de ativos e não constitui recomendação de investimento. Os exemplos de produtos não são indicações específicas e rentabilidade passada não garante resultados futuros.

## Autor

Gustavo Ferreira Silva ([GitHub](https://github.com/gustazura))
