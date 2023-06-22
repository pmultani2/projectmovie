import { options } from "./config.js";

const url = window.location.search;
const searchParam = new URLSearchParams(url).get("search");
document.title = searchParam + " | Project Movie";
let initialUrl = window.location.href.substring(0, location.href.lastIndexOf("/")+1)

const loadMoreElement = document.getElementById("load-more-btn");

let page = 1;

const contentContainer = document.getElementById("content-container");

const heading = document.getElementById("content-heading");
heading.innerText += " \"" + searchParam + "\"";

async function loadResults(page) {
  const response = await fetch('https://api.themoviedb.org/3/search/movie?query=' + searchParam.toLowerCase() + '&include_adult=false&language=en-US&page=' + page, options);
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
    containerTitle.innerText = data.results[i].title;
    singleContainer.appendChild(containerTitle);
  
    contentContainer.appendChild(singleContainer);
  
    singleContainer.onclick = function() {
      window.location.href = "content.html?" + "id=" + data.results[i].id;
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
  window.location.href = "results.html?search=" + input.value;
}

loadMoreElement.onclick = function() {
  loadResults(page += 1);
};