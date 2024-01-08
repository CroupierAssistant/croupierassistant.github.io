const showRatings = (game) => {
  if (game === '') return;

  const ratingsElement = document.getElementById('ratings');
  ratingsElement.innerHTML = `
    <div class="ratings-header"><h2>TOP-10</h2></div>
    <div class="ratings-description">
      In order to get to TOP-10 you have to be logged in and get 100% in
      specific test
    </div>
  `;

  const query = db.collection(game)
    .orderBy('time')
    .limit(10);

  query.get()
    .then((querySnapshot) => {
      const chart = [];
      querySnapshot.forEach((doc) => {
        const element = {
          name: doc.data().username,
          time: doc.data().time
        };
        chart.push(element);
      });

      chart.forEach((item, index) => {
        const newRatingsItem = document.createElement('div');
        newRatingsItem.classList.add("ratings-item");
        newRatingsItem.innerHTML = `
            <div class="ratings-name">
              <span class="ratings-index" data-index=${index + 1}>${index + 1}</span>
              ${item.name}
            </div>
            <div class="ratings-time">${item.time}</div>`;
        ratingsElement.appendChild(newRatingsItem);
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
};