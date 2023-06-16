import { options } from "./config.js";

const url = window.location.search;
const searchParam = new URLSearchParams(url).get("search");
document.title = searchParam + " | Project Movie";
let initialUrl = window.location.href.split('/')[0];

const loadMoreElement = document.getElementById("load-more-btn");
const loadingElement = document.getElementById("loading-text");

let page = 1;

const contentContainer = document.getElementById("content-container");
const heading = document.getElementById("content-heading");
heading.innerText += " \"" + searchParam + "\"";

async function loadResults(page) {
  const response = await fetch('https://api.themoviedb.org/3/search/movie?query=' + searchParam.toLowerCase() + '&include_adult=false&language=en-US&page=' + page, options);
  const data = await response.json();
  loadingElement.remove();
  if (page == data.total_pages || page >= 500) {
    loadMoreElement.remove();
  }
  createContainers(data);
}

loadResults(page);

function createContainers(data) {
  for (let i = 0; i < data.results.length; i ++) {
    let singleContainer = document.createElement("div");
    singleContainer.className = "single-container";

    let containerHeader = document.createElement("h2");
    containerHeader.className = "movie-title";
    containerHeader.innerText = data.results[i].title;

    let containerYear = document.createElement("span");
    containerYear.innerText = (data.results[i].release_date === "" ? "Unreleased" : data.results[i].release_date.substring(0, 4));
    containerYear.className = "movie-title";

    let containerAverage = document.createElement("span");
    containerAverage.innerText = (data.results[i].vote_average == 0 ? "Not Rated" : parseInt(data.results[i].vote_average*10) + "%");
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

loadMoreElement.onclick = function() {
  loadResults(page += 1);
};