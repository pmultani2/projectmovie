import { options } from "./config.js";

const trendingContainer = document.getElementById("trending-container");
const popularContainer = document.getElementById("popular-container");
const nowPlayingContainer = document.getElementById("now-playing-container");
const topRatedContainer = document.getElementById("top-rated-container");
const upcomingContainer = document.getElementById("upcoming-container");

const trendingLoadMoreButton = document.getElementById("trending-load-more-btn");
const popularLoadMoreButton = document.getElementById("popular-load-more-btn");
const nowPlayingLoadMoreButton = document.getElementById("now-playing-load-more-btn");
const topRatedLoadMoreButton = document.getElementById("top-rated-load-more-btn");
const upcomingLoadMoreButton = document.getElementById("upcoming-load-more-btn");

let trendingPage = 1;
let popularPage = 1;
let nowPlayingPage = 1;
let topRatedPage = 1;
let upcomingPage = 1;

loadData("https://api.themoviedb.org/3/trending/movie/day", trendingPage, trendingContainer, trendingLoadMoreButton);
loadData("https://api.themoviedb.org/3/movie/popular", popularPage, popularContainer, popularLoadMoreButton);
loadData("https://api.themoviedb.org/3/movie/now_playing", nowPlayingPage, nowPlayingContainer, nowPlayingLoadMoreButton);
loadData("https://api.themoviedb.org/3/movie/top_rated", topRatedPage, topRatedContainer, topRatedLoadMoreButton);
loadData("https://api.themoviedb.org/3/movie/upcoming", upcomingPage, upcomingContainer, upcomingLoadMoreButton);

async function loadData(url, page, container, button) {
  const response = await fetch(url + "?page=" + page, options);
  const data = await response.json();

  if (page == data.total_pages || page >= 500) {
    button.remove();
  }

  createContainers(data, container, button, url, page);
}

function createContainers(data, container, button, url, page) {
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

    container.insertBefore(singleContainer, button);

    singleContainer.onclick = function() {
      window.location.href = "content.html?" + "id=" + data.results[i].id;
    }
  }
  button.onclick = function() {
    loadData(url, page += 1, container, button);
  }
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


