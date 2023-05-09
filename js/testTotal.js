
function testTotal() {
  if (gameName === "roulette-pictures") {
    var tableRow = document.querySelectorAll("#testResult table tbody tr");

    tableRow.forEach((row) => {
      if (row.children[1].textContent == row.children[2].textContent) {
        row.children[2].style.backgroundColor = "#3aee3a";
        correctAnswers++;
      } else {
        row.children[2].style.backgroundColor = "#db3333";
      }
    });
  } else {
    for (let i = 0; i < 10; i++) {
      var newResultRow = document.createElement("tr");
      if (betCells[i].dataset.uanswer == undefined) {
        betCells[i].dataset.uanswer = "";
      }

      newResultRow.innerHTML = `
      <td>${betCells[i].children[0].textContent} ${betCells[i].children[1].textContent}</td>
      <td>${betCells[i].dataset.ranswer}</td>
      <td>${betCells[i].dataset.uanswer}</td>`;

      testResult.appendChild(newResultRow);

      if (
        newResultRow.children[1].textContent ===
        newResultRow.children[2].textContent
      ) {
        newResultRow.children[2].style.backgroundColor = "#3aee3a";
        correctAnswers++;
      } else {
        newResultRow.children[2].style.backgroundColor = "#db3333";
      }
    }
  }
  // var timer = new Date(timePassed)

  // var timerString = timer.toISOString().slice(14, -2)

  var percentCorrect = ((correctAnswers * 100) / numberOfBets).toFixed(2) + "%";

  document.querySelector("#game-content").style.display = "none";

  document.querySelector("#correctPercent").textContent = percentCorrect
  document.querySelector("#testResult").style.display = "block";
  // document.querySelector("#calculationTime").textContent = timerString;
  document.querySelector("#calculationTime").textContent = formatTime(timePassed, 'full');


  saveData(gameName, percentCorrect, formatTime(timePassed, 'full'));
}
