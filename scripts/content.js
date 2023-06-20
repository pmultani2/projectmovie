import { options } from "./config.js";

const contentTitle = document.getElementById("content-title");
const contentDescription = document.getElementById("content-description");
const image = document.getElementById("poster-img");
const contentInfo = document.getElementById("content-info");
const budgetSpan = document.getElementById("budget-span");
const boxOfficeSpan = document.getElementById("box-office-span");
const ratingSpan = document.getElementById("rating-span");
const basedOnSpan = document.getElementById("based-on-span");
const contentCastList = document.getElementById("content-cast");
const directedBySpan = document.getElementById("director-span");

let initialUrl = window.location.href.substring(0, location.href.lastIndexOf("/")+1)

const url = window.location.search;
const contentID = new URLSearchParams(url).get("id");

const backgroundElement = document.getElementById("background-div");

async function getData(url) {
  const response = await fetch("https://api.themoviedb.org/3/movie/" + contentID + "?append_to_response=credits", options);
  const data = await response.json();

  contentTitle.innerText = data.title;
  contentDescription.innerText = data.overview;
  contentInfo.innerText = data.release_date.substring(0, 4) + ", " + data.genres.map(genre => genre.name).join("/") + ", " + data.runtime + "m";
  image.setAttribute("src", (data.poster_path === null ? "https://t4.ftcdn.net/jpg/02/51/95/53/360_F_251955356_FAQH0U1y1TZw3ZcdPGybwUkH90a3VAhb.jpg" : "https://image.tmdb.org/t/p/original/" + data.poster_path));
  backgroundElement.style.backgroundImage = "url('https://image.tmdb.org/t/p/original/" + data.backdrop_path + "')";
  backgroundElement.style.backgroundSize = "cover";
  backgroundElement.style.backgroundPosition = "center";
  budgetSpan.innerText = "$" + data.budget.toLocaleString();
  boxOfficeSpan.innerText = "$" + data.revenue.toLocaleString();
  ratingSpan.innerText = parseInt(data.vote_average *10) + "%";
  basedOnSpan.innerText = data.vote_count;
  directedBySpan.innerText = data.credits.crew.find(element => element.job === "Director").name;

  for (let i = 0; i < data.credits.cast.length; i ++) {
    const div = document.createElement("div");

    div.className = "actor";

    const actorImage = document.createElement("img");
    actorImage.src = (data.credits.cast[i].profile_path === null ? "https://t4.ftcdn.net/jpg/02/51/95/53/360_F_251955356_FAQH0U1y1TZw3ZcdPGybwUkH90a3VAhb.jpg" : "https://image.tmdb.org/t/p/original" + data.credits.cast[i].profile_path);
    actorImage.className = "actor-image";
    div.appendChild(actorImage);

    const actorName = document.createElement("span");
    actorName.innerText = data.credits.cast[i].name;
    div.appendChild(actorName);

    const charName = document.createElement("span");
    charName.innerText = data.credits.cast[i].character;
    div.appendChild(charName);
    
    contentCastList.appendChild(div);
  }

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