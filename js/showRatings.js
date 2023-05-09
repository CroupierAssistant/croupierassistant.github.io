const showRatings = (game) => {
  if (game === '') return

  document.getElementById('ratings').innerHTML = `
    <div class="ratings-header"><h2>TOP-10</h2></div>
    <div class="ratings-description">
      In order to get to TOP-10 you have to be logged in and get 100% in
      specific test
    </div>
  `

  db.collection(game)
    .get()
    .then((querySnapshot) => {
      var chart = []
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        var element = {}
        element.name = doc.data().username
        element.time = doc.data().time

        chart.push(element)
      });
      function compare(a, b) {
        if (a.time < b.time) {
          return -1;
        }
        if (a.time > b.time) {
          return 1;
        }
        return 0;
      }

      const newChart = chart.sort(compare);
      const newChartFiltered = newChart.filter(person => person.name !== 'test')
      if (newChartFiltered.length > 10) newChartFiltered.length = 10

      newChartFiltered.map((item, index) => {
        var newRatingsItem = document.createElement('div')
        newRatingsItem.classList.add("ratings-item")
        document.getElementById('ratings').appendChild(newRatingsItem)

        newRatingsItem.outerHTML = `
        <div class="ratings-item">
          <div class="ratings-name">
            <span class="ratings-index" data-index=${index + 1}>${index + 1}</span>
            ${item.name}
          </div>
          <div class="ratings-time">${item.time}</div>
        </div>`
      })

      let isInChart = newChartFiltered.some(findInChart);

      function findInChart(value) {
        return value.name === localStorage.getItem('username');
      }

      if (!isInChart) {
        db.collection('tests').doc(game).collection(localStorage.getItem('username'))
          .get()
          .then((querySnapshot) => {
            var personalChart = []
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              var element = {}
              element.correctAnswers = doc.data().correctAnswers
              element.time = doc.data().time

              personalChart.push(element)

            });


            function comparePersonalBest(a, b) {
              if (a.correctAnswers > b.correctAnswers) {
                return -1;
              }
              if (a.correctAnswers < b.correctAnswers) {
                return 1;
              }
              return 0;
            }
            personalBest = personalChart.sort(comparePersonalBest)

            var newRatingsItem = document.createElement('div')
            newRatingsItem.classList.add("ratings-item")
            document.getElementById('ratings').appendChild(newRatingsItem)

            newRatingsItem.outerHTML = `
              <div class="ratings-item ratings-personal">
                <div class="ratings-name">
                  Your personal best is ${personalBest[0].correctAnswers}% in ${personalBest[0].time}
                </div >
                
              </div > `
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });



      }
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}
