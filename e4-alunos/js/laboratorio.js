(function () {
  "use strict";
  const ts = window.ts;
  const LIBS = window.TS_LIBS;
  const PTBR = window.TS_PTBR;
  const EXS = window.EXERCICIOS;

  const $ = (id) => document.getElementById(id);
  const escolha = $("escolha"), codigo = $("codigo"), linhas = $("linhas");
  const listaErros = $("erros"), contagem = $("contagem"), saida = $("saida"), estado = $("estado");
  const btnExecutar = $("executar"), btnJs = $("ver-js"), btnResposta = $("resposta"), btnRestaurar = $("restaurar");

  const opcoesVerificacao = {
    strict: true,
    noEmit: true,
    target: ts.ScriptTarget.ES2020,
    moduleDetection: ts.ModuleDetectionKind.Force,
  };
  const ARQUIVO = "exercicio.ts";
  const cacheLibs = {};

  function guardar(chave, valor) { try { localStorage.setItem(chave, valor); } catch (e) {} }
  function ler(chave) { try { return localStorage.getItem(chave); } catch (e) { return null; } }

  function criarHost(texto) {
    return {
      getSourceFile(nome, versao) {
        if (nome === ARQUIVO) return ts.createSourceFile(nome, texto, versao, true);
        if (LIBS[nome] === undefined) return undefined;
        if (!cacheLibs[nome]) cacheLibs[nome] = ts.createSourceFile(nome, LIBS[nome], versao);
        return cacheLibs[nome];
      },
      getDefaultLibFileName: () => "lib.es2020.full.d.ts",
      writeFile: () => {},
      getCurrentDirectory: () => "",
      getDirectories: () => [],
      fileExists: (nome) => nome === ARQUIVO || LIBS[nome] !== undefined,
      readFile: (nome) => (nome === ARQUIVO ? texto : LIBS[nome]),
      getCanonicalFileName: (nome) => nome,
      useCaseSensitiveFileNames: () => true,
      getNewLine: () => "\n",
    };
  }

  function diagnosticos(texto, emPortugues) {
    ts.setLocalizedDiagnosticMessages(emPortugues ? PTBR : undefined);
    const programa = ts.createProgram([ARQUIVO], opcoesVerificacao, criarHost(texto));
    return ts.getPreEmitDiagnostics(programa).map((d) => ({
      linha: d.file ? d.file.getLineAndCharacterOfPosition(d.start).line + 1 : 0,
      inicio: d.start || 0,
      texto: ts.flattenDiagnosticMessageText(d.messageText, "\n"),
    }));
  }

  let atual = null;
  let ultimos = [];

  function desenharLinhas() {
    const total = codigo.value.split("\n").length;
    const comErro = new Set(ultimos.map((e) => e.linha));
    linhas.textContent = "";
    for (let i = 1; i <= total; i++) {
      const s = document.createElement("span");
      s.textContent = i + "\n";
      if (comErro.has(i)) s.className = "erro";
      linhas.append(s);
    }
    linhas.scrollTop = codigo.scrollTop;
  }

  function verificar() {
    const texto = codigo.value;
    let pt, en;
    try {
      pt = diagnosticos(texto, true);
      en = diagnosticos(texto, false);
    } catch (e) {
      contagem.textContent = "Não foi possível verificar: " + e.message;
      contagem.className = "contagem ruim";
      return;
    }
    ultimos = pt;
    listaErros.textContent = "";
    if (pt.length === 0) {
      contagem.textContent = "Nenhum erro. ✓";
      contagem.className = "contagem ok";
    } else {
      contagem.textContent = pt.length === 1 ? "1 erro" : `${pt.length} erros`;
      contagem.className = "contagem ruim";
    }
    pt.forEach((erro, i) => {
      const li = document.createElement("li");
      const b = document.createElement("button");
      b.type = "button";
      const forte = document.createElement("b");
      forte.textContent = `Linha ${erro.linha}: `;
      const msg = document.createElement("span");
      msg.textContent = erro.texto;
      const orig = document.createElement("small");
      orig.textContent = en[i] ? en[i].texto : "";
      b.append(forte, msg, orig);
      b.addEventListener("click", () => irPara(erro.inicio));
      li.append(b);
      listaErros.append(li);
    });
    desenharLinhas();
  }

  function irPara(posicao) {
    codigo.focus();
    codigo.setSelectionRange(posicao, posicao);
    const linha = codigo.value.slice(0, posicao).split("\n").length;
    codigo.scrollTop = Math.max(0, (linha - 5) * 23);
  }

  function transpilar() {
    return ts.transpileModule(codigo.value, {
      compilerOptions: { target: ts.ScriptTarget.ES2020, removeComments: false },
      reportDiagnostics: false,
    }).outputText;
  }

  function executar() {
    const linhasSaida = [];
    const formatar = (v) => (typeof v === "string" ? v : JSON.stringify(v, null, 2));
    const consoleFalso = {
      log: (...a) => linhasSaida.push(a.map(formatar).join(" ")),
      error: (...a) => linhasSaida.push("Erro: " + a.map(formatar).join(" ")),
    };
    try {
      new Function("console", transpilar())(consoleFalso);
    } catch (e) {
      linhasSaida.push("Erro ao executar: " + e.message);
    }
    saida.textContent = linhasSaida.length ? linhasSaida.join("\n") : "(nada foi escrito com console.log)";
  }

  function carregar(ex) {
    atual = ex;
    $("titulo").textContent = ex.titulo;
    $("instrucoes").innerHTML = ex.instrucoes;
    codigo.value = ler("lab-ts-" + ex.id) || ex.codigo;
    btnExecutar.hidden = !ex.executavel;
    btnResposta.hidden = !ex.resposta;
    saida.textContent = ex.executavel ? "" : "Este exercício trabalha com elementos de uma página: aqui o foco é zerar os erros.";
    guardar("lab-ts-atual", ex.id);
    verificar();
  }

  let espera;
  codigo.addEventListener("input", () => {
    guardar("lab-ts-" + atual.id, codigo.value);
    desenharLinhas();
    clearTimeout(espera);
    espera = setTimeout(verificar, 350);
  });
  codigo.addEventListener("scroll", () => { linhas.scrollTop = codigo.scrollTop; });

  btnExecutar.addEventListener("click", executar);
  btnJs.addEventListener("click", () => { saida.textContent = transpilar(); });
  btnResposta.addEventListener("click", () => {
    if (!atual.resposta) return;
    codigo.value = atual.resposta;
    guardar("lab-ts-" + atual.id, codigo.value);
    verificar();
  });
  btnRestaurar.addEventListener("click", () => {
    codigo.value = atual.codigo;
    guardar("lab-ts-" + atual.id, codigo.value);
    saida.textContent = "";
    verificar();
  });

  EXS.forEach((ex) => {
    const op = document.createElement("option");
    op.value = ex.id;
    op.textContent = ex.titulo;
    escolha.append(op);
  });
  escolha.addEventListener("change", () => carregar(EXS.find((e) => e.id === escolha.value)));

  const inicial = new URLSearchParams(location.search).get("ex") || ler("lab-ts-atual") || EXS[0].id;
  const ex0 = EXS.find((e) => e.id === inicial) || EXS[0];
  escolha.value = ex0.id;
  setTimeout(() => {
    carregar(ex0);
    estado.textContent = "TypeScript " + ts.version + " pronto";
  }, 30);
})();
