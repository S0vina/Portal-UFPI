function gerarGrade() {
  const tbody = document.getElementById("grid-body");
  const horas = [
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00", // Manhã
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00", // Tarde
    "19:00",
    "20:00",
    "21:00",
    "22:00", // Noite
  ];

  horas.forEach((hora, indexLinha) => {
    const tr = document.createElement("tr");

    // Coluna da hora
    tr.innerHTML = `<td>${hora}</td>`;

    // Criar 7 colunas para os dias (Dom-Sáb)
    for (let indexColuna = 0; indexColuna < 7; indexColuna++) {
      const td = document.createElement("td");
      td.id = `cell-${indexLinha}-${indexColuna}`;
      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  });
}

// Gera a tabela dos horarios
window.onload = () => {
  gerarGrade();
};
