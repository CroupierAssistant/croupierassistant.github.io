
function saveResult() {
  
  if (gameName === "roulette-pictures") {

    var activePicture = document.querySelectorAll("#layout > div")[betIndex];

    var tableCell = document.querySelectorAll("#testResult table tbody td");

    activePicture?.setAttribute("data-result", input.value);
    tableCell.forEach((cell) => {
      if (cell.dataset.pictureAnswer == betIndex + 1) {
        cell.textContent = input.value;
      }
    });

    input.value = "";
    activePicture.style.display = "none";

    betIndex++;

    if (betIndex === 21) {
      onTimesUp();
      testTotal();
    }
  } else if (gameName === "roulette-sector") {
    var activeBet = document.querySelector(".newBetActive");

    activeBet.setAttribute("data-uanswer", input.value);

    activeBet.classList.remove("newBetActive");
    if (activeBet.nextElementSibling) {
      activeBet.nextElementSibling.classList.add("newBetActive");
    } else {
      onTimesUp();
      testTotal();
    }

    input.value = "";
    numberOfBets.textContent = +numberOfBets.textContent + 1;
    betIndex++;
  } else {
    var activeBet = document.querySelector(".newBetActive");

    activeBet.setAttribute("data-uanswer", input.value);

    activeBet.classList.remove("newBetActive");
    if (activeBet.nextElementSibling) {
      activeBet.nextElementSibling.classList.add("newBetActive");
    } else {
      onTimesUp();
      testTotal();
    }
    input.value = "";
    numberOfBets.textContent = +numberOfBets.textContent + 1;
  }
}

