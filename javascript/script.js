// Lista de materias de computacao para teste de desenho das materias
// JSON com
const bancoDados = {
  "Ciência da Computação": [
    {
      id: 1,
      nome: "Cálculo Diferencial e Integral I",
      horario: "24T34",
      professor: "Paulo Alexandre",
    },
    {
      id: 2,
      nome: "Informática e Sociedade",
      horario: "24T56",
      professor: "Weslley Emmanuel",
    },
    {
      id: 3,
      nome: "Inglês Técnico e Científico",
      horario: "24M34",
      professor: "Francisco Wellington",
    },
    {
      id: 4,
      nome: "Introdução à Lógica",
      horario: "35M34",
      professor: "Kelson Romulo",
    },
    {
      id: 5,
      nome: "Introdução à Metodologia Científica",
      horario: "24M56",
      professor: "Atila Brandão",
    },
    {
      id: 6,
      nome: "Programação Estruturada",
      horario: "35M56",
      professor: "Rosianni de Oliveira",
    },
  ],
};

const turnoHorario = {
  M: { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5 },
  T: { 1: 6, 2: 7, 3: 8, 4: 9, 5: 10, 6: 11 },
  N: { 1: 12, 2: 13, 3: 14, 4: 15 },
};

function gerarGrade() {
  const tbody = document.getElementById("grid-body");
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

function decodificaHorario(horario) {
  const regex = /(\d+)([MTN])(\d+)/;
  const match = horario.match(regex);

  if (!match) {
    return [];
  }

  const dias = match[1].split("");

  const turno = match[2];

  const horas = match[3].split("");

  let posicao = [];

  dias.forEach((dia) => {
    horas.forEach((hora) => {
      let indexX = dia - 1;
      let indexY = turnoHorario[turno][hora]; // Define com o turno e hora, o numero da linha na tabela

      posicao.push({
        coluna: indexX,
        linha: indexY,
      });
    });
  });

  return posicao; // retorna um dict com o x e y da materia
}

function desenhaMateria(posicao, nome) {
  posicao.forEach((posicoes) => {
    const id = `cell-${posicoes.coluna}-${posicoes.linha}`;
    const celula = document.getElementById(id);
    if (celula) {
      celula.style.background = "green";
      celula.textContent = nome;
      return true;
    } else {
      console.log("Deu merda");
      return false;
    }
  });
}

function apagaMateria(posicao) {
  posicao.forEach((posicoes) => {
    const id = `cell-${posicoes.coluna}-${posicoes.linha}`;
    const celula = document.getElementById(id);
    if (celula) {
      celula.innerText = "";
      celula.style.backgroundColor = "";
      celula.classList.remove("celula-ocupada");
      celula.removeAttribute("data-materia-nome");
    }
  });
}

function carregaListaMaterias(curso) {
  const listaContainer = document.querySelector(".lista-materias");
  listaContainer.innerHTML = "";

  const materias = bancoDados[curso];

  materias.forEach((materia) => {
    const div = document.createElement("div");
    div.className = "item-materia";
    div.innerHTML = ` 
    <label>
      <input type="checkbox" data-id="${materia.id}" class="checkbox-materia">
      <span>${materia.nome}</span>
      <small>${materia.horario} - ${materia.professor}</small>
    </label>`;

    listaContainer.appendChild(div);
  });
}

function toggleMateria() {
  // Pegar os dados da matéria clicada
  const idMateria = this.dataset.id;
  const cursoAtual = document.getElementById("curso-select").value;

  console.log("Curso selecionado no HTML:", cursoAtual);
  console.log("Cursos disponíveis no JS:", Object.keys(bancoDados));

  // Busca a matéria pelo ID, independente da posição no array
  const info = bancoDados[cursoAtual].find((m) => m.id == idMateria);

  const marcados = document.querySelectorAll(".checkbox-materia:checked");

  const posicao = decodificaHorario(info.horario);

  if (this.checked) {
    const idMateria = this.dataset.id;

    const sucesso = desenhaMateria(posicao, info.nome);

    console.log("Regex da materia carregado:" + info.horario);
  } else {
    apagaMateria(posicao);
  }

  console.log("Selecionados agora:", marcados.length);
}

// Gera a tabela dos horarios

gerarGrade();

// Carrega a lista de materias
let curso = "Ciência da Computação";
carregaListaMaterias(curso);

const botoes = document.querySelectorAll(".checkbox-materia");

botoes.forEach((btn) => {
  btn.addEventListener("change", toggleMateria);
});

console.log("Sistema de monitoramento de checkboxes iniciado!");
