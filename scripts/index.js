import { options } from "./config.js";

var initialAPIUrl = "https://api.themoviedb.org/3/trending/movie/day";
let initialUrl = window.location.href.substring(0, location.href.lastIndexOf("/")+1)

let contentContainer = document.getElementById("content-container");

let contentHeading = document.getElementById("content-heading");

const loadMoreElement = document.getElementById("load-more-btn");

let popularButton = document.getElementById("popular-btn");
let nowPlayingButton = document.getElementById("now-playing-btn");
let topRatedButton = document.getElementById("top-rated-btn");
let upcomingButton = document.getElementById("upcoming-btn");

const url = window.location.search;
const searchParams = new URLSearchParams(url);
const listParam  = searchParams.get("list");

let page = 1;

switch(listParam) {
  case "popular":
    initialAPIUrl = "https://api.themoviedb.org/3/movie/popular";
    contentHeading.innerText = "Popular Movies"
    document.title = "Popular | Project Movie";
    break;
  case "now_playing":
    initialAPIUrl = "https://api.themoviedb.org/3/movie/now_playing";
    contentHeading.innerText = "Now Playing Movies"
    document.title = "Now Playing | Project Movie";
    break;
  case "top_rated":
    initialAPIUrl = "https://api.themoviedb.org/3/movie/top_rated";
    contentHeading.innerText = "Top Rated Movies"
    document.title = "Top Rated | Project Movie";
    break;
  case "upcoming":
    initialAPIUrl = "https://api.themoviedb.org/3/movie/upcoming";
    contentHeading.innerText = "Upcoming Movies"
    document.title = "Upcoming | Project Movie";
    break;
  default:
    initialAPIUrl = "https://api.themoviedb.org/3/trending/movie/day";
    contentHeading.innerText = "Trending Movies"
}

const paramsObject = {
  content: "popular"
}

async function loadData(url, page) {
  const response = await fetch(initialAPIUrl + "?page=" + page, options);
  const data = await response.json();
  if (page >= data.total_pages || page >= 500) {
    loadMoreElement.remove();
  }
  createContainers(data);
}

loadData(initialAPIUrl, page);
function createContainers(data) {
  for (let i = 0; i < data.results.length; i ++) {
    const singleContainer = document.createElement("div");
    singleContainer.className = "single-container";

    const posterImage = document.createElement("img");
    posterImage.src = (data.results[i].poster_path === null ? "https://t4.ftcdn.net/jpg/02/51/95/53/360_F_251955356_FAQH0U1y1TZw3ZcdPGybwUkH90a3VAhb.jpg" : "https://image.tmdb.org/t/p/original/" + data.results[i].poster_path); 
    posterImage.className = "content-poster";
    singleContainer.appendChild(posterImage);

    const containerTitle = document.createElement("span");
    containerTitle.className = "movie-title";
    containerTitle.innerText = data.results[i].title;
    singleContainer.appendChild(containerTitle);

    contentContainer.appendChild(singleContainer);

    singleContainer.onclick = function() {
      window.location.href = "content.html?" + "id=" + data.results[i].id;
    }
  }
}

popularButton.onclick = function() {
  window.location.href = "?list=popular"
}

nowPlayingButton.onclick = function() {
  window.location.href = "?list=now_playing";
}

topRatedButton.onclick = function() {
  window.location.href = "?list=top_rated";
}

upcomingButton.onclick = function() {
  window.location.href = "?list=upcoming";
}

loadMoreElement.onclick = function() {
  loadData(initialAPIUrl, page += 1);
}

const input = document.getElementById("search-input");
const inputButton = document.getElementById("search-button");

input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    inputButton.click();
  }
});

inputButton.onclick = function() {
  window.location.href = "results.html?search=" + input.value;
}


