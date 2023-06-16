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

const loadingElement = document.getElementById("loading-text");

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
  loadingElement.remove();
}

loadData(initialAPIUrl, page);

function createContainers(data) {
  for (let i = 0; i < data.results.length; i ++) {
    let singleContainer = document.createElement("div");
    singleContainer.className = "single-container";

    let containerHeader = document.createElement("h2");
    containerHeader.className = "movie-title";
    containerHeader.innerText = data.results[i].title;

    let containerYear = document.createElement("span");
    containerYear.innerText = data.results[i].release_date.substring(0, 4);
    containerYear.className = "movie-title";

    let containerAverage = document.createElement("span");
    containerAverage.innerText = (data.results[i].vote_average == 0 ? "Not Rated" :  parseInt(data.results[i].vote_average*10) + "%");
    containerAverage.className = "movie-title";

    let imagePath = (data.results[i].poster_path === null ? "https://t4.ftcdn.net/jpg/02/51/95/53/360_F_251955356_FAQH0U1y1TZw3ZcdPGybwUkH90a3VAhb.jpg" : "https://image.tmdb.org/t/p/original/" + data.results[i].poster_path); 
    singleContainer.style.backgroundImage = "url(" + imagePath + ")";

    singleContainer.appendChild(containerHeader);
    singleContainer.appendChild(containerYear);
    singleContainer.appendChild(containerAverage);
    contentContainer.appendChild(singleContainer);

    singleContainer.onclick = function() {
      window.location.href = initialUrl + "content.html?" + "id=" + data.results[i].id;
    }
  }
}

popularButton.onclick = function() {
  window.location.href = initialUrl + "?list=popular"
}

nowPlayingButton.onclick = function() {
  window.location.href = initialUrl + "?list=now_playing";
}

topRatedButton.onclick = function() {
  window.location.href = initialUrl + "?list=top_rated";
}

upcomingButton.onclick = function() {
  window.location.href = initialUrl + "?list=upcoming";
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
  window.location.href = initialUrl + "results.html?search=" + input.value;
}


