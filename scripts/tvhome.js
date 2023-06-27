import { options } from "./config.js";

const trendingSeriesContainer = document.getElementById("trending-series-container");
const airingTodaySeriesContainer = document.getElementById("airing-today-series-container");
const onTheAirSeriesContainer = document.getElementById("on-the-air-series-container");
const popularSeriesContainer = document.getElementById("popular-series-container");
const topRatedSeriesContainer = document.getElementById("top-rated-series-container");

const trendingSeriesLoadMoreButton = document.getElementById("trending-series-load-more-btn");
const airingTodaySeriesLoadMoreButton = document.getElementById("airing-today-series-load-more-btn");
const onTheAirSeriesLoadMoreButton = document.getElementById("on-the-air-series-load-more-btn");
const popularSeriesLoadMoreButton = document.getElementById("popular-series-load-more-btn");
const topRatedSeriesLoadMoreButton = document.getElementById("top-rated-series-load-more-btn");

let trendingSeriesPage = 1;
let airingTodaySeriesPage = 1;
let onTheAirSeriesPage = 1;
let popularSeriesPage = 1;
let topRatedSeriesPage = 1;

loadData("https://api.themoviedb.org/3/trending/tv/day?language=en-US", trendingSeriesPage, trendingSeriesContainer, trendingSeriesLoadMoreButton);
loadData("https://api.themoviedb.org/3/tv/airing_today?language=en-US", airingTodaySeriesPage, airingTodaySeriesContainer, airingTodaySeriesLoadMoreButton);
loadData("https://api.themoviedb.org/3/tv/on_the_air?language=en-US", onTheAirSeriesPage, onTheAirSeriesContainer, onTheAirSeriesLoadMoreButton);
loadData("https://api.themoviedb.org/3/tv/popular?language=en-US", popularSeriesPage, popularSeriesContainer, popularSeriesLoadMoreButton);
loadData("https://api.themoviedb.org/3/tv/top_rated?language=en-US", topRatedSeriesPage, topRatedSeriesContainer, topRatedSeriesLoadMoreButton);

async function loadData(url, page, container, button) {
  const response = await fetch(url + "&page=" + page, options);
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
    containerTitle.innerText = data.results[i].name;
    singleContainer.appendChild(containerTitle);

    container.insertBefore(singleContainer, button);

    singleContainer.onclick = function() {
      window.location.href = "tvcontent.html?" + "id=" + data.results[i].id;
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
  window.location.href = "results.html?search=" + input.value + "&list=tv";
}

const root = document.querySelector(":root");
const themeSelect = document.getElementById("select-theme");
const localTheme = localStorage.getItem("theme");

for (let i = 0; i < themeSelect.options.length; i ++) {
  if (themeSelect.options[i].value == localTheme) themeSelect.value = localTheme;
}

const theme = JSON.parse(themeSelect.value);
root.style.setProperty("--background-color", theme.background);
root.style.setProperty("--font-color", theme.color);
root.style.setProperty("--border-color", theme.border);

themeSelect.onchange = function() {
  const theme = JSON.parse(themeSelect.value);
  root.style.setProperty("--background-color", theme.background);
  root.style.setProperty("--font-color", theme.color);
  root.style.setProperty("--border-color", theme.border);
  localStorage.setItem("theme", JSON.stringify(theme));
};


