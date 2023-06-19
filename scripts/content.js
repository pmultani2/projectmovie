import { options } from "./config.js";

const contentTitle = document.getElementById("content-title");
const contentDescription = document.getElementById("content-description");
const image = document.getElementById("poster-img");
const contentInfo = document.getElementById("content-info");

let initialUrl = window.location.href.substring(0, location.href.lastIndexOf("/")+1)

const url = window.location.search;
const contentID = new URLSearchParams(url).get("id");

const backgroundElement = document.getElementById("background-div");

async function getData(url) {
  const response = await fetch("https://api.themoviedb.org/3/movie/" + contentID, options);
  const data = await response.json();

  contentTitle.innerText = data.title;
  contentDescription.innerText = data.overview;
  contentInfo.innerText = data.release_date.substring(0, 4) + ", " + data.genres.map(genre => genre.name).join("/") + ", " + data.runtime + "m";
  image.setAttribute("src", (data.poster_path === null ? "https://t4.ftcdn.net/jpg/02/51/95/53/360_F_251955356_FAQH0U1y1TZw3ZcdPGybwUkH90a3VAhb.jpg" : "https://image.tmdb.org/t/p/original/" + data.poster_path));
  backgroundElement.style.backgroundImage = "url('https://image.tmdb.org/t/p/original/" + data.backdrop_path + "')";
  backgroundElement.style.backgroundSize = "cover";
  backgroundElement.style.backgroundPosition = "center";
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