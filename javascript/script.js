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

function gerarGrade() {
  const tbody = document.getElementById("grid-body");
  const horas = [
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
  const regex = /(\d+)([MTN])(d+)/;
  const match = horario.match(regex);

  if (!match) {
    return [];
  }

  const dias = match[1].split("");

  const turno = match[2];

  const hora = match[3].split("");

  let posicao = [];

  dias.forEach((dias) => {
    hora.forEach((hora) => {
      posicao.push({
        coluna: dias - 1,
        linha: [turno, hora],
      });
    });
  });

  return posicao;
}

function desenhaMateria(posicao) {
  const id = `cell-${posicao[0]}-${posicao[1]}`;
  const celula = document.getElementById(id);
  if (celula) {
    celula.style.background = "black";
  } else console.log("nao achou celula");
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
  const marcados = document.querySelectorAll(".checkbox-materia:checked");

  if (this.checked) {
    const idMateria = this.dataset.id;

    const info = bancoDados[curso][idMateria - 1];

    console.log("Regex da materia carregado:" + info.horario);
    desenhaMateria(decodificaHorario(info.horario));
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
