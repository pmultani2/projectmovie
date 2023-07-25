import { options } from "./config.js";

const url = window.location.search;
const urlParams = new URLSearchParams(url);
const searchParam = urlParams.get("search");
document.title = searchParam + " | Project Movie";
const listParam = urlParams.get("list");

const movieButton = document.getElementById("movie-btn");
const tvButton = document.getElementById("tv-btn");
movieButton.onclick = function () {
  window.location.href = "results?search=" + searchParam + "&list=movie";
}
tvButton.onclick = function() {
  window.location.href = "results?search=" + searchParam + "&list=tv";
}

const loadMoreElement = document.getElementById("load-more-btn");

let page = 1;

const contentContainer = document.getElementById("content-container");

const heading = document.getElementById("content-heading");
heading.innerText += " \"" + searchParam + "\"";

async function loadResults(page) {
  const response = await fetch("https://api.themoviedb.org/3/search/" + listParam + "?query=" + searchParam.toLowerCase() + '&language=en-US&page=' + page, options);
  const data = await response.json();

  if (page == data.total_pages || page >= 500) {
    loadMoreElement.remove();
  }
  createContainers(data);
}

loadResults(page);

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
    if (listParam == "movie") containerTitle.innerText = data.results[i].title;
    else if (listParam == "tv") containerTitle.innerText = data.results[i].name;
    singleContainer.appendChild(containerTitle);
  
    contentContainer.appendChild(singleContainer);
  
    singleContainer.onclick = function() {
      if (listParam == "movie") window.location.href = "movie?" + "id=" + data.results[i].id;
      else if (listParam == "tv") window.location.href = "tv?" + "id=" + data.results[i].id;
    }
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
  window.location.href = "results?search=" + input.value + "&list=" + listParam;
}

loadMoreElement.onclick = function() {
  loadResults(page += 1);
};

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