
function fetchData(game) {
  document.querySelector("#linkList").style.display = "none";
  document.querySelector("#game-descr").style.display = "flex";

  var gameLabel = document.querySelector("#game");
  var goalLabel = document.querySelector("#goal");
  var betsLabel = document.querySelector("#bets");
  var timeLabel = document.querySelector("#timelimit");
  var header = document.querySelector("#game-title");
  var appHeader = document.querySelector("#appTitle");

  let xhr = new XMLHttpRequest();

  xhr.open("GET", `js/data/${game}.json`, true);

  gameName = game;
  localStorage.setItem('game', game)
  showRatings(game)

  xhr.onload = function () {
    let data = JSON.parse(xhr.response);
    numberOfBets = data[0].numberOfBets;
    TIME_LIMIT = data[0].time;
    WARNING_THRESHOLD = TIME_LIMIT / 3;
    ALERT_THRESHOLD = TIME_LIMIT / 12;

    gameLabel.textContent = data[0].game;
    goalLabel.textContent = data[0].goal;
    betsLabel.textContent = data[0].bet;
    timeLabel.textContent = data[0].timelimit;
    header.textContent = data[0].title;
    appHeader.style.display = 'none'

    if (game === "roulette-pictures") {
      var chipCount = [15, 20, 20, 30, 30, 30, 40, 40, 40, 40, 50, 50, 50, 50, 50, 55, 55, 55, 55, 60, 60]
      
      for (let i = 0; i < numberOfBets; i++) {
        let newPicture = document.createElement("div");
        newPicture.innerHTML =
          data[1][getRandomIntInclusive(0, 4)] +
          `<p class='pictureLabel'>Picture ${i + 1} of 21</p>`;

        layout.appendChild(newPicture);
        randomizer(newPicture, chipCount[i]);
        calculation(newPicture);

        let newTableRow = document.createElement("tr");
        newTableRow.innerHTML = `<td>${i + 1}</td><td data-picture='${i + 1
          }'>${calculation(newPicture)}</td><td data-picture-answer='${i + 1
          }'></td>`;
        testResult.appendChild(newTableRow);

        newPicture.querySelectorAll(".red").forEach((cell) => {
          cell.style.color = "hsl(0deg 100% 48% / 1)";
        });
        newPicture.querySelectorAll(".black").forEach((cell) => {
          cell.style.color = "hsl(0deg 0% 0% / 1)";
        });
        newPicture.querySelectorAll(".green").forEach((cell) => {
          cell.style.color = "hsl(120deg 100% 25% / 1)";
        });
      }
      hideEmpty();
    } else if (game === "roulette-sector") {
      for (let i = 0; i < 10; i++) {
        var newBet = document.createElement("div");

        var sector = data[1][getRandomIntInclusive(0, 3)];

        var bet =
          getRandomIntInclusive(1, sector.maxBet / 100 - 1) * 100 +
          getRandomIntInclusive(-5, 5) * 10;

        var playsBy;
        var playsByBefore;
        var playsByAfter;

        if (bet <= sector.critical) {
          playsBy = round5(bet / sector.coefficientBeforeCritical);
        } else {
          playsByBefore = sector.critical / sector.coefficientBeforeCritical;
          playsByAfter =
            (bet - sector.critical) / sector.coefficientAfterCritical;
          playsBy = round5(playsByAfter + playsByBefore);
        }

        newBet.classList.add("newBet");
        newBet.setAttribute("data-ranswer", playsBy);
        newBet.innerHTML = `<h2>${sector.name[0].toUpperCase() + sector.name.substring(1)
          }</h2><p>${bet}</p><p class='betLabel'>Bet ${i + 1} of 10</p>`;

        layout.appendChild(newBet);
      }

      betCells = Array.from(document.querySelectorAll(".newBet"));

      betCells[0].classList.add("newBetActive");
    } else {
      
      let betsArr = new Set();
      while(betsArr.size < 10) {
        let randomNum = Math.floor(Math.random() * (500 - 25 + 1) + 25);
        if(randomNum % 5 !== 0) randomNum = Math.round(randomNum/5)*5;
        betsArr.add(randomNum);
      }
      betsArr = [...betsArr];

      for (let i = 0; i < 10; i++) {
        var newBet = document.createElement("div");
        var combination = getRandomIntInclusive(0, 5);

        if (game === "blackjack") {
          combination = 0;
        }

        newBet.classList.add("newBet");
        newBet.setAttribute(
          "data-ranswer",
          betsArr[i] * data[1][combination].coefficient
        );
        newBet.innerHTML = `<h2>${data[1][combination].name[0].toUpperCase() +
          data[1][combination].name.substring(1)
          }</h2><p>${betsArr[i]}</p><p class='betLabel'>Bet ${i + 1} of 10</p>`;

        layout.appendChild(newBet);
      }

      betCells = Array.from(document.querySelectorAll(".newBet"));

      betCells[0].classList.add("newBetActive");

      if (data[2]) {
        var startScreen = document.querySelector("#game-descr");

        var paytable = document.createElement("table");

        paytable.innerHTML = `<table>
        <thead>
          <tr>
            <th style="padding: 2px" colspan="3">${data[2].name}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 2px">&nbsp;</td>
            <td style="padding: 2px">${data[2].firstCol}</td>
            <td style="padding: 2px">${data[2].secondCol}</td>
          </tr>
        </tbody>
        </table>`;
        paytable.setAttribute(
          "style",
          "border-collapse: collapse; font-size: 14px;"
        );
        paytable.setAttribute("border", "1");

        data[2].combinations.forEach((c) => {
          var newRow = document.createElement("tr");
          newRow.innerHTML = `<td style="padding: 2px">${c.name}</td><td style="padding: 2px">${c.firstCol}</td><td style="padding: 2px">${c.secondCol}</td>`;
          paytable.tBodies[0].appendChild(newRow);
        });

        startScreen.prepend(paytable);
      }
    }
  };
  xhr.send();
}
