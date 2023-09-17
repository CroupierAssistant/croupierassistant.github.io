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

  db.collection("tests")
    .doc(game)
    .collection(getUsername() ? getUsername() : getMachineId())
    .doc(`${formattedDate} ${date.toString().slice(16, 33)}`)
    .set({
      game: game,
      correctAnswers: percents,
      timeSpent: time,
      timeAt: date.toString().slice(16, -12)
    })
    .then((docRef) => {
      if (getUsername()) {
        db.collection("users")
          .doc(getUsername())
          .update({ lastVisit: `${new Date()}` });

        if (percents === 100) {
          var docExist = db.collection(game).doc(getUsername());

          docExist
            .get()
            .then((doc) => {
              if (doc.exists) {
                if (doc.data().time > time) {
                  db.collection(game).doc(getUsername()).set({
                    username: getUsername(),
                    time: time,
                    timeCode: `${formattedDate} ${date.toString().slice(16, 33)}`
                  });
                }
              } else {
                db.collection(game).doc(getUsername()).set({
                  username: getUsername(),
                  time: time,
                  timeCode: `${formattedDate} ${date.toString().slice(16, 33)}`
                });
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

  var docDaily = db.collection("dailyUsage").doc(formattedDate).collection(getUsername() ? getUsername() : getMachineId()).doc(game);
  var docDailyByGame = db.collection("dailyUsageByGame").doc(formattedDate).collection(game).doc('totalTries');

  docDailyByGame.get().then((doc) => {
    if (doc.exists) {
      var usageValueByGame = Number(doc.data().usage)

      db.collection("dailyUsageByGame")
        .doc(formattedDate)
        .collection(game)
        .doc('totalTries')
        .set({ usage: getUsername() === 'test' ? usageValueByGame : usageValueByGame + 1 })
        .then((docRef) => {
          console.log("Document written");
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });

    } else {
      db.collection("dailyUsageByGame")
        .doc(formattedDate)
        .collection(game)
        .doc('totalTries')
        .set({ usage: getUsername() === 'test' ? 0 : 1 })
        .then((docRef) => {
          console.log("Document written");
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    }
  })

  docDaily.get().then((doc) => {
    if (doc.exists) {
      var usageValue = Number(doc.data().usage)
      db.collection("dailyUsage")
        .doc(formattedDate)
        .collection(getUsername() ? getUsername() : getMachineId())
        .doc(game).set({ usage: usageValue + 1 })
        .then((docRef) => {
          console.log("Document written");
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });

    } else {
      db.collection("dailyUsage")
        .doc(formattedDate)
        .collection(getUsername() ? getUsername() : getMachineId())
        .doc(game).set({ usage: 1 })
        .then((docRef) => {
          console.log("Document written");
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    }
  })
};
