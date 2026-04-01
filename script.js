const container = document.getElementById("container");

fetch("http://localhost:5000/anime")
  .then(res => res.json())
  .then(data => {
    data.forEach(anime => {
      const card = document.createElement("div");
      card.innerText = anime;
      container.appendChild(card);
    });
  });