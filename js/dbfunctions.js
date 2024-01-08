const firebaseConfig = {
  apiKey: "AIzaSyDOYALzWbCOa3nrzZlUOBendAbAvv8C31A",
  authDomain: "test-b19d4.firebaseapp.com",
  projectId: "test-b19d4",
  storageBucket: "test-b19d4.appspot.com",
  messagingSenderId: "1066232540176",
  appId: "1:1066232540176:web:a120057fe558e9b7002e95",
  measurementId: "G-PSD9VKBZ2W",
};

function getMachineId() {
  let machineId = localStorage.getItem("MachineId");

  if (!machineId) {
    machineId = crypto.randomUUID();
    localStorage.setItem("MachineId", machineId);
  }
  return machineId;
}
function getUsername() {
  let username = localStorage.getItem("username").trim();

  if (!username) {
    return false;
  }
  return username;
}

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();

let date = new Date();
let formattedDate = date.toLocaleDateString("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric"
});

const saveData = (game, percentage, time) => {
  var percents = +percentage.slice(0, -1);
  const username = getUsername();
  const userId = username ? username : getMachineId();

  const currentDate = formattedDate + ' ' + date.toString().slice(16, 33);
  const userData = {
    game: game,
    correctAnswers: percents,
    timeSpent: time,
    timeAt: date.toString().slice(16, -12)
  };

  const usersRef = db.collection("users").doc(username);

  db.collection("tests")
    .doc(game)
    .collection(userId)
    .doc(currentDate)
    .set(userData)
    .then(() => {
      if (username) {
        usersRef.update({ lastVisit: `${new Date()}` });

        if (percents === 100) {
          const gameDocRef = db.collection(game).doc(username);

          gameDocRef.get()
            .then((doc) => {
              const gameData = {
                username: username,
                time: time,
                timeCode: currentDate
              };

              if (doc.exists) {
                if (doc.data().time > time) {
                  gameDocRef.set(gameData);
                }
              } else {
                gameDocRef.set(gameData);
              }
            })
            .catch((error) => {
              console.log("Error getting document:", error);
            });
        }
      }
      console.log("Document written");
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
};

