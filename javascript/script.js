// Lista de materias de computacao para teste de desenho das materias
let bancoDados = {};

let listaServicos = {};

let cursoAtualGlobal = ""; // Variável global para o curso selecionado

let indiceCor = 0;

let celulasOcupadas = {};

let materiasAtivas = []; // Array para guardar os objetos das matérias marcadas

let materiasSelecionadas = new Set(); // Armazena os IDs das matérias marcadas

// Objeto para guardar as cores das matérias que já estão na grade
const coresAtribuidas = {};

const turnoHorario = {
  M: { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6 },
  T: { 1: 6, 2: 7, 3: 8, 4: 9, 5: 10, 6: 11 },
  N: { 1: 12, 2: 13, 3: 14, 4: 15 },
};

const paletaCores = [
  "#4A90E2",
  "#a80536",
  "#F5A623",
  "#e465e9",
  "#8B572A",
  "#7ED321",
  "#BD10E0",
  "#9013FE",
  "#417505",
  "#F8E71C",
];

function gerarGrade() {
  const corpoGrade = document.getElementById("corpo-grade");
  if (!corpoGrade) return;

  // Limpeza da grade para garantir que ela nao seja duplicada
  corpoGrade.innerHTML = "";

  const tbody = document.getElementById("corpo-grade");
  const horas = [
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00", // Fim do turno da Manhã
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00", // Fim do turno Tarde
    "19:00",
    "20:00",
    "21:00",
    "22:00", // Fim do turno da Noite
  ];

  horas.forEach((hora, indexLinha) => {
    const tr = document.createElement("tr");

    // Coluna da hora
    tr.innerHTML = `<td>${hora}</td>`;
    if (hora == "12:00" || hora == "18:00") {
      tr.classList.add("divisorDeTurno");
    }

    // Criar 7 colunas para os dias (Dom-Sáb)
    for (let indexColuna = 0; indexColuna < 7; indexColuna++) {
      const td = document.createElement("td");
      td.id = `cell-${indexLinha}-${indexColuna}`;
      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  });
}

// Ao escolher um modulo
function mudaModulo(moduloId) {
  document
    .querySelectorAll(".modulo-content")
    .forEach((div) => (div.style.display = "none"));

  const view = document.getElementById(`view-${moduloId}`);
  if (view) view.style.display = "block";

  if (moduloId === "cronograma") {
    console.log("Renderizando grade...");
    gerarGrade(); // Desenha as linhas
    atualizarGrade(); // Pinta as matérias
  }
}

// Quando o botao cronograma for selecionado
function abrirModuloCronograma(moduloId = "cronograma") {
  // Garante que a sidebar de matérias também apareça
  const sidebarCronograma = document.getElementById("sidebar-cronograma");
  if (sidebarCronograma) sidebarCronograma.style.display = "block";
  document.getElementById(`view-${moduloId}`).style.display = "block";

  gerarGrade();
  atualizarGrade();
  // Grade, seletor de curso, filtro de materias e botao limpar ja estao na div do modulo-cronograma
  // Entao sao exibidos automaticamente

  console.log("Módulo de Cronograma montado.");
}

function abrirModalCursos() {
  document
    .getElementById("busca-curso-input")
    .addEventListener("input", (e) => {
      const termoDeBusca = e.target.value.toLowerCase().trim();

      renderizarCursosNoModal(termoDeBusca);
    });

  console.log("Executando abertura visual do modal...");
  const modal = document.getElementById("modal-cursos");

  if (modal) {
    // Força o display flex e remove qualquer impedimento
    modal.style.setProperty("display", "flex", "important");
    modal.style.opacity = "1";
    modal.style.visibility = "visible";

    // Foca no campo de busca para facilitar a vida do aluno
    const inputBuscaModal = document.getElementById("busca-curso-input");
    if (inputBuscaModal) setTimeout(() => inputBuscaModal.focus(), 100);

    // Chama a função que popula os cursos (garanta que ela exista!)
    renderizarCursosNoModal("");
  } else {
    console.error("ERRO: Elemento #modal-cursos não existe no HTML.");
  }
}

function fecharModalCursos() {
  const modal = document.getElementById("modal-cursos");
  const inputBuscaModal = document.getElementById("busca-curso-input");

  if (modal) {
    // 1. Esconde o modal (usando o método mais forte)
    modal.style.setProperty("display", "none", "important");

    // 2. Limpa o campo de busca para a próxima vez
    if (inputBuscaModal) {
      inputBuscaModal.value = "";
    }

    // 3. Opcional: Resetar a lista de cursos para mostrar todos
    // Isso evita que o usuário abra o modal e veja apenas um filtro antigo
    renderizarCursosNoModal("");

    console.log("Modal fechado e limpo.");
  }
}

function renderizarCursosNoModal(filtro) {
  const container = document.getElementById("lista-cursos-full");
  container.innerHTML = "";

  // Pega as chaves do seu banco de dados (os nomes dos cursos)
  const nomesCursos = Object.keys(bancoDados);

  nomesCursos
    .filter((nome) => nome.toLowerCase().startsWith(filtro))
    .forEach((nome) => {
      const card = document.createElement("div");
      card.className = "card-curso";
      card.innerText = nome;
      card.onclick = () => selecionarCurso(nome);
      container.appendChild(card);
    });
}

function selecionarCurso(nome) {
  console.log("Curso atual: " + nome);

  resetarTudo();

  cursoAtualGlobal = nome; // Atualiza a variável global de curso atual

  fecharModalCursos();

  mudaModulo("cronograma");

  renderizaMaterias(nome);
}

function decodificaHorario(horario) {
  if (!horario) {
    console.log("Leitura nao foi bem sucedida");
    return [];
  }

  // Se o horário tiver espaço, quebra em partes e processa cada uma
  const partes = horario.trim().split(/\s+/);
  let todosHorarios = [];

  const regex = /(\d+)([MTN])(\d+)/;

  partes.forEach((parte) => {
    const match = parte.match(regex);

    // Verificacao do match do regex
    if (!match) {
      console.warn(`Padrão de horário inválido: ${parte}`);
      return; // Pula esta parte e vai para a próxima
    }

    const dias = match[1].split("");
    const turno = match[2];
    const horas = match[3].split("");

    dias.forEach((dia) => {
      horas.forEach((hora) => {
        // Traducao para as coordenadas da tabela
        let indexX = parseInt(dia) - 1;
        let indexY = turnoHorario[turno][parseInt([hora])]; // Define com o turno e hora, o numero da linha na tabela

        todosHorarios.push({
          coluna: indexY,
          linha: indexX,
        });
      });
    });
  });

  return todosHorarios; // retorna um dict com o x e y da materia
}
/*
function gerenciarSelecao(checkbox, idMateria) {
    if (checkbox.checked) {
        materiasSelecionadas.add(idMateria);
        // Aqui você chamaria sua função original de adicionar na grade
        desenhaMateria(idMateria); 
    } else {
        materiasSelecionadas.delete(idMateria);
        // Aqui você chamaria sua função original de remover da grade
        removerDaGrade(idMateria);
    }
}
    */

function desenhaMateria(posicao, nomeMateria, cor, turma) {
  const codigoMateria = `${nomeMateria} (T-${turma})`;

  posicao.forEach((posicoes) => {
    const id = `cell-${posicoes.coluna}-${posicoes.linha}`;
    const celula = document.getElementById(id);

    if (celula) {
      const materiaExistente = celulasOcupadas[id];

      if (materiaExistente && materiaExistente !== nomeMateria) {
        exibirConflito(celula, materiaExistente, nomeMateria);
        console.log("cheguei aqui");
      } else {
        celula.classList.remove("conflito-ativo");

        celula.style.backgroundColor = cor;
        celula.innerHTML = `<span>${codigoMateria}</span>`;
        celula.classList.add("ocupada");
        celulasOcupadas[id] = codigoMateria;
      }
    } else {
      console.log("Deu merda");
    }
  });
}

function corMateriaAtual(indice) {
  cor = paletaCores[indice];
  indiceCor++;
  return cor;
}

function apagaMateria(posicao) {
  const codigoMateria = `${nomeMateria} (T${turma})`;

  posicao.forEach((posicoes) => {
    const id = `cell-${posicoes.coluna}-${posicoes.linha}`;
    const celula = document.getElementById(id);

    if (celula) {
      celula.innerText = "";
      celula.style.backgroundColor = "";
      celula.classList.remove("celula-ocupada");
      celula.removeAttribute("data-materia-nome");
      delete celulasOcupadas[id];
      if (indiceCor > 0) {
        indiceCor--;
      }
    }
  });
}

function exibirConflito(celula, materiaAntiga, materiaNova) {
  const celulaConflito = celula;

  celulaConflito.style.background = "red";
  celulaConflito.style.color = "white";
  celulaConflito.style.fontWeight = "bold";
  celulaConflito.style.fontSize = "10px";

  // Adiciona a mensagem de conflito
  celula.innerHTML = `
        <div class="conflito-ativo">
            ⚠️ CONFLITO<br>
            ${materiaAntiga} + ${materiaNova}
        </div>
    `;
}

function atualizarGrade() {
  limparGradeVisualmente();

  // Zera o nosso controle lógico de ocupação
  celulasOcupadas = {};

  // Redesenha apenas as matérias que estão no array de ativas
  materiasAtivas.forEach((materia) => {
    const slots = decodificaHorario(materia.horario);

    // Recuperamos a cor que já tínhamos definido para essa matéria
    // Se você ainda não tem o objeto coresAtribuidas, podemos gerar na hora:
    if (!coresAtribuidas[materia.nome]) {
      coresAtribuidas[materia.nome] = corMateriaAtual(indiceCor);
    }

    const cor = coresAtribuidas[materia.nome];

    // Chamamos a sua função de desenho original
    desenhaMateria(slots, materia.nome, cor, materia.turma);
  });
}

function limparGradeVisualmente() {
  // Seleciona todas as células que têm o ID começando com 'cell-'
  const celulas = document.querySelectorAll('[id^="cell-"]');

  celulas.forEach((celula) => {
    // Remove estilos inline
    celula.style.backgroundColor = "";
    celula.style.color = "";
    celula.style.fontWeight = "";
    celula.style.fontSize = "";

    // Remove o conteúdo interno
    celula.innerHTML = "";

    // Remove as classes da materia nao mais existente
    celula.classList.remove("ocupada", "conflito-ativo");
  });
}

function carregarCursoEscolhido() {
  const selectedCurso = document.getElementById("curso-select");
  const listaContainer = document.querySelector(".lista-materias");
  listaContainer.innerHTML = "";
  if (!listaContainer) return; // Segurança caso o container não exista na página

  const cursoAtual = selectedCurso.value;

  resetarTudo();
  if (cursoAtual) {
    renderizaMaterias(cursoAtual);
    console.log("Deu certo");
  } else console.log("Deu errado");
}

function renderizaMaterias(curso) {
  const listaContainer = document.getElementById("sidebar-materias");

  if (!listaContainer) {
    console.log("Nao carregou lista-container");
    return;
  }

  listaContainer.innerHTML = "";

  const materias = bancoDados[curso];

  if (!materias || materias.length === 0) {
    listaContainer.innerHTML = `<div class="aviso-container">
      <p class="aviso">Aviso! Nenhuma matéria encontrada.</p>
      <p class="reportar-texto">
        Acha que isso é um erro? 
        <a href="mailto:hillan1236@gmail.com?subject=Erro no Curso: ${curso}" class="link-reportar">
        ➡️  Reportar ao desenvolvedor📧 ⬅️
        </a>
      </p>
    </div>
  `;

    return;
  }

  const materiasPorPeriodo = {};
  materias.forEach((materia) => {
    const p = materia.periodo;
    if (!materiasPorPeriodo[p]) {
      materiasPorPeriodo[p] = [];
    }
    materiasPorPeriodo[p].push(materia);
  });

  const periodosOrdenados = Object.keys(materiasPorPeriodo).sort(
    (a, b) => a - b,
  );

  periodosOrdenados.forEach((periodo) => {
    const header = document.createElement("div");
    header.className = "periodo-header fechado";
    header.innerHTML = `
        <span>${periodo}º Período</span>
        <i class="seta-icon">▼</i>
    `;

    const corpo = document.createElement("div");
    corpo.className = "periodo-corpo escondido"; // Parte que sofrera o efeito sanfona

    // Adicionar o evento de clique para abrir/fechar
    header.addEventListener("click", () => {
      corpo.classList.toggle("escondido");
      header.classList.toggle("fechado");
    });

    materiasPorPeriodo[periodo].forEach((materia) => {
      const isChecked = materiasSelecionadas.has(materia.id) ? "checked" : "";

      const div = document.createElement("div");
      div.className = "item-materia";
      div.innerHTML = ` 
      <label>
        <input type="checkbox" 
              ${isChecked} 
              onchange="toggleMateria('${materia.id}', this.checked)"
        />
        <span>${materia.nome} - </span>
        <small> -- ${materia.horario}</small>
      </label>`;

      corpo.appendChild(div);
    });

    listaContainer.append(header);
    listaContainer.append(corpo);
  });
}

function renderizarResultadosBusca(materias) {
  const resultadosBusca = document.getElementById(
    "container-resultado-busca-materias",
  );
  // Garante que o container existe antes de limpar
  if (!resultadosBusca) return;
  resultadosBusca.innerHTML = "";

  // Caso não encontre nada
  if (materias.length === 0) {
    resultadosBusca.innerHTML = "";
    console.log("esta vazio?");
    return;
  }

  // Renderiza os resultados
  materias.forEach((m) => {
    // Verifica no Set global se esta matéria já está marcada
    const isChecked = materiasSelecionadas.has(m.id) ? "checked" : "";

    const div = document.createElement("div");
    div.className = "item-materia item-busca";
    div.innerHTML = `
            <label>
                <input type="checkbox" 
                       ${isChecked} 
                       onchange="toggleMateria('${m.id}', this.checked)">
                <div class="materia-info">
                    <strong>${m.nome}</strong>
                    <small>P${m.periodo} - T${m.turma}</small>
                </div>
            </label>
        `;
    resultadosBusca.appendChild(div);
  });
}

// Função auxiliar para manter o checkbox sincronizado com a grade
function estaSelecionada(id) {
  return materiasAtivas.some((m) => m.id === id);
}

function resetarTudo() {
  // Limpa a lista de matérias que o JS estava guardando
  materiasAtivas = [];

  // Limpa o controle de ocupação (conflitos)
  celulasOcupadas = {};

  // Limpa todas as cores e nomes da grade visual (HTML)
  limparGradeVisualmente();

  const checkboxes = document.querySelectorAll(".checkbox-materia");
  checkboxes.forEach((cb) => (cb.checked = false));

  console.log("Grade e memória resetadas para o novo curso.");
}

// Função para buscar os dados
async function carregaDadosIniciais() {
  try {
    const respostaCursos = await fetch("../assets/cursos/cursos.json");
    bancoDados = await respostaCursos.json();
    console.log("Banco de dados da UFPI carregado!");
  } catch (erro) {
    console.error("Erro ao carregar o JSON:", erro);
  }

  try {
    const respostaServicos = await fetch("../assets/servicos/servicos.json");
    listaServicos = await respostaServicos.json();
    console.log("Lista de servicos carregada");
  } catch (erro) {
    console.erro("Erro ao carregar o JSON:", erro);
  }
}

function toggleMateria(id, estaMarcado) {
  const todasAsMateriasDoCurso = bancoDados[cursoAtualGlobal] || [];
  // Encontra o objeto completo da matéria pelo ID
  const materiaObjeto = todasAsMateriasDoCurso.find((m) => m.id === id);

  if (estaMarcado) {
    materiasSelecionadas.add(id);

    // Evita duplicatas no array de desenho
    if (!materiasAtivas.find((m) => m.id === id) && materiaObjeto) {
      materiasAtivas.push(materiaObjeto);
    }
  } else {
    materiasSelecionadas.delete(id);
    // Filtra comparando o ID diretamente (m.id)
    materiasAtivas = materiasAtivas.filter((m) => m.id !== id);
  }

  console.log("Matérias ativas para desenho:", materiasAtivas);

  // Agora a grade tem os objetos com .horario e .dia para trabalhar
  atualizarGrade();
}

// INICIA JUNTO COM O SITE

document.addEventListener("DOMContentLoaded", () => {
  carregaDadosIniciais();

  mudaModulo("inicio");

  resetarTudo();
  gerarGrade();

  console.log("Portal UFPI 2026 inicializado na Home.");
});

const inputMateria = document.getElementById("input-busca-materia");
inputMateria.addEventListener("input", (e) => {
  const termoBusca = e.target.value.trim();

  if (termoBusca === "") {
    renderizarResultadosBusca([]); // Passa um array vazio de propósito
    return;
  }

  const todasMaterias = bancoDados[cursoAtualGlobal];
  // Filter de materias com o texto que vem do input
  const filtradas = todasMaterias.filter((m) => {
    const nomeNormalizado = m.nome
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    const termoNormalizado = termoBusca
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    return nomeNormalizado.startsWith(termoNormalizado); // Retorna true ou false para o filter
  });

  renderizarResultadosBusca(filtradas);
});
