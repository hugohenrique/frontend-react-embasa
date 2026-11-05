/*
  PRÁTICA DO ENCONTRO 3 — CENTRAL DE CHAMADOS INTERATIVA
  Em duplas: uma pessoa digita (piloto), a outra orienta e revisa (navegador).
  Troquem de papel na metade do tempo.

  Faça as tarefas na ordem. A cada tarefa: salve, recarregue e teste.
  Deixe o console aberto (F12): erros aparecem em vermelho, com a linha.
*/

// ===== Dados =====
// O primeiro da lista é sempre o mais recente.
const chamados = [
  { numero: 1046, assunto: "Monitor piscando", setor: "ti", prioridade: "media", abertura: "2026-11-04" },
  { numero: 1045, assunto: "Troca de senha do e-mail", setor: "ti", prioridade: "baixa", abertura: "2026-11-04" },
  { numero: 1044, assunto: "Ar-condicionado da recepção parado", setor: "atendimento", prioridade: "alta", abertura: "2026-11-03" },
  { numero: 1043, assunto: "Reembolso de despesa de viagem", setor: "financeiro", prioridade: "media", abertura: "2026-11-03" },
  { numero: 1042, assunto: "Impressora sem conexão", setor: "ti", prioridade: "alta", abertura: "2026-11-02" },
  { numero: 1041, assunto: "Acesso ao sistema de RH", setor: "rh", prioridade: "media", abertura: "2026-11-01" },
];

const nomesDosSetores = {
  atendimento: "Atendimento",
  financeiro: "Financeiro",
  rh: "Recursos Humanos",
  ti: "Tecnologia da Informação",
};

const nomesDasPrioridades = { baixa: "Baixa", media: "Média", alta: "Alta" };

// ===== Funções prontas: leiam antes de começar =====

// Converte "2026-11-05" em "05/11/2026"
function formatarData(iso) {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Data de hoje no formato "2026-11-05"
function hojeISO() {
  const hoje = new Date();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${hoje.getFullYear()}-${mes}-${dia}`;
}

// Encurta um texto longo, terminando com reticências
function resumir(texto, limite) {
  return texto.length > limite ? texto.slice(0, limite) + "…" : texto;
}

// Cria a linha <tr> da tabela para um chamado.
// Usa textContent: o texto digitado pela pessoa nunca vira HTML.
function criarLinha(chamado) {
  const linha = document.createElement("tr");

  const textos = [
    chamado.numero,
    chamado.assunto,
    nomesDosSetores[chamado.setor],
    nomesDasPrioridades[chamado.prioridade],
  ];
  textos.forEach((texto) => {
    const celula = document.createElement("td");
    celula.textContent = texto;
    linha.append(celula);
  });

  const celulaData = document.createElement("td");
  const tempo = document.createElement("time");
  tempo.dateTime = chamado.abertura;
  tempo.textContent = formatarData(chamado.abertura);
  celulaData.append(tempo);
  linha.append(celulaData);

  return linha;
}

// ===== Elementos da página =====
const formulario = document.querySelector("form");
const corpoTabela = document.querySelector("#corpo-tabela");
const mensagem = document.querySelector("#mensagem");
const filtro = document.querySelector("#filtro-prioridade");
const busca = document.querySelector("#busca");
const totalExibido = document.querySelector("#total-exibido");
const descricao = document.querySelector("#descricao");
const contador = document.querySelector("#contador-descricao");


// ===== TAREFA 1: desenhar a tabela a partir da lista =====
// Complete a função. Ela recebe uma lista de chamados e:
//   1. limpa o corpo da tabela:       corpoTabela.textContent = "";
//   2. para cada chamado da lista, cria a linha com criarLinha(chamado)
//      e acrescenta no corpo da tabela com corpoTabela.append(...)
//   3. escreve em totalExibido: "Exibindo 6 de 6 chamados"
function renderizarTabela(lista) {

}

renderizarTabela(chamados);


// ===== TAREFA 2: abrir chamado sem recarregar a página =====
// Ouça o evento "submit" do formulário e, dentro dele:
//   1. impeça o recarregamento:        evento.preventDefault();
//   2. leia os dados:                  const dados = new FormData(formulario);
//                                      dados.get("setor"), dados.get("prioridade"), dados.get("descricao")
//   3. monte o objeto do novo chamado:
//        numero:     o número do primeiro da lista + 1
//        assunto:    resumir(descrição, 40)
//        setor, prioridade
//        abertura:   hojeISO()
//   4. coloque o novo chamado no início da lista:   chamados.unshift(novo);
//   5. desenhe a tabela de novo e limpe o formulário: formulario.reset();


// ===== TAREFA 3: mensagem de confirmação =====
// Ainda dentro do "submit", escreva em "mensagem":
//   "Chamado nº 1047 aberto com sucesso."
// O parágrafo tem role="status": o leitor de tela anuncia a mensagem sozinho.


// ===== TAREFA 4: filtrar por prioridade =====
// Quando o select "filtro" mudar (evento "change"):
//   - se o valor for "todas", mostre todos os chamados;
//   - senão, mostre só os da prioridade escolhida (filter).
// Dica: crie a função atualizarTabela() que aplica o filtro e chama
// renderizarTabela. Use-a também depois de abrir um chamado, para que
// a tabela respeite o filtro escolhido.


// ===== DESAFIO 1: contador de caracteres da descrição =====
// Igual ao exercício 3, usando "descricao" e "contador".
// A classe de alerta, aqui, se chama "contador-alerta".
// Lembre de zerar o contador depois de abrir um chamado.


// ===== DESAFIO 2: busca por assunto =====
// Quando a pessoa digitar no campo "busca" (evento "input"), mostre só os
// chamados cujo assunto contém o texto digitado, sem diferenciar maiúsculas.
// Dica: assunto.toLowerCase().includes(termo)
// A busca e o filtro de prioridade devem funcionar juntos.
