///////////////////////////////////////////////////////////////

const FULL_DASH_ARRAY = 283;
let WARNING_THRESHOLD;
let ALERT_THRESHOLD;

let COLOR_CODES = {
  info: {
    color: "green",
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD,
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD,
  },
};

let TIME_LIMIT = 0;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

document.getElementById("testTimer").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label"></span>
</div>
`;

function onTimesUp() {
  clearInterval(timerInterval);
}

function startTimer() {
  // Get the current time
  let startTime = new Date();

  timerInterval = setInterval(() => {
    // Calculate the elapsed time
    timePassed = new Date() - startTime;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft, 'short');
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft <= 0) {
      timeLeft = 0
      timePassed = TIME_LIMIT
      clearInterval(timerInterval);
      // onTimesUp();
      testTotal();
    }
    console.log(formatTime(timeLeft), formatTime(timePassed, 'short'));
  }, 10);
}

function formatTime(time, mode) {
  var minutes = Math.floor(time / 60000).toString().padStart(2, "0");
  var seconds = Math.floor((time % 60000) / 1000).toString().padStart(2, "0");
  var milliseconds = ((time % 1000) / 10).toFixed().toString().padStart(2, "0");

  return mode === 'short'
    ? `${minutes}:${seconds}`
    : `${minutes}:${seconds}.${milliseconds}`

}
// function formatTime(time) {
//   var minutes = Math.floor(time / 60000);
//   var seconds = Math.floor((time % 60000) / 1000);

//   if (seconds < 10) {
//     seconds = `0${seconds}`;
//   }

//   return `${minutes}:${seconds}`;
// }

function setRemainingPathColor(timeLeft) {
  let { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document.getElementById("base-timer-path-remaining").classList.remove(warning.color);
    document.getElementById("base-timer-path-remaining").classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document.getElementById("base-timer-path-remaining").classList.remove(info.color);
    document.getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

///////////////////////////////////////////////////////////////
