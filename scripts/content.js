const contentTitle = document.getElementById("content-title");
const contentDescription = document.getElementById("content-description");
const image = document.getElementById("poster-img");
const contentInfo = document.getElementById("content-info");

const initialUrl = window.location.href.split('?')[0];

const url = window.location.search;
const contentID = new URLSearchParams(url).get("id");

const backgroundElement = document.getElementById("background-div");

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNzI3OTUyMWQ2OGZhMGU3ZmMwNzYyYWRkNTBkOWIyYSIsInN1YiI6IjY0Njg1YmY1MDA2YjAxMDBlNmI0MDY0ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JXmoEYsUAEX4uHnSnIrzR5tTN0yg3lV2fau5Jc-g2nk'
  }
};

async function getData(url) {
  const response = await fetch("https://api.themoviedb.org/3/movie/" + contentID, options);
  const data = await response.json();
  console.log(data);

  contentTitle.innerText = data.title;
  contentDescription.innerText = data.overview;
  contentInfo.innerText = data.release_date.substring(0, 4) + ", " + data.genres.map(genre => genre.name).join("/") + ", " + data.runtime + "m";
  image.setAttribute("src", (data.poster_path === null ? "https://t4.ftcdn.net/jpg/02/51/95/53/360_F_251955356_FAQH0U1y1TZw3ZcdPGybwUkH90a3VAhb.jpg" : "https://image.tmdb.org/t/p/original/" + data.poster_path));
  backgroundElement.style.backgroundImage = "url('https://image.tmdb.org/t/p/original/" + data.backdrop_path + "')";
  backgroundElement.style.backgroundSize = "cover";
  document.title = data.title + " | Project Movie";
}

getData();

const input = document.getElementById("search-input");
const inputButton = document.getElementById("search-button");

input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    inputButton.click();
  }
});

inputButton.onclick = function() {
  window.location.href = initialUrl + "results.html?search=" + input.value;
}