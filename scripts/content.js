import { options } from "./config.js";

const contentTitle = document.getElementById("content-title");
const contentDescription = document.getElementById("content-description");
const image = document.getElementById("poster-img");
let contentInfo = document.getElementById("content-info");
const budgetSpan = document.getElementById("budget-span");
const boxOfficeSpan = document.getElementById("box-office-span");
const ratingCircle = document.getElementById("rating-circle");
const ratingSpan = document.getElementById("rating-span");
const basedOnSpan = document.getElementById("based-on-span");
const contentCastList = document.getElementById("content-cast");
const releaseSpan = document.getElementById("release-date-span");
const directedBySpan = document.getElementById("director-span");
const producedSpan = document.getElementById("producer-span");
const videoDiv = document.getElementById("videos-container");
const seeAlsoDiv = document.getElementById("seealso-container");

let initialUrl = window.location.href.substring(0, location.href.lastIndexOf("/")+1)

const url = window.location.search;
const contentID = new URLSearchParams(url).get("id");

const backgroundElement = document.getElementById("background-div");

async function getData(url) {
  const response = await fetch("https://api.themoviedb.org/3/movie/" + contentID + "?append_to_response=credits,videos,recommendations", options);
  const data = await response.json();

  if (response.status != 404) {
    contentTitle.innerText = data.title;
    if (data.overview == "") {
      contentDescription.previousElementSibling.remove();
      contentDescription.remove();
    } else {
      contentDescription.innerText = data.overview;
    }

    if (data.release_date != "") {
      contentInfo.innerText = data.release_date.substring(0, 4);
    }
    if (data.genres.length > 0) {
      if (contentInfo.innerText.length > 0) contentInfo.innerText += ", ";
      contentInfo.innerText += data.genres.map(genre => genre.name).join("/");
    }
    if (data.runtime != 0) {
      if (contentInfo.innerText.length > 0) contentInfo.innerText += ", ";
      contentInfo.innerText += data.runtime + "m";
    }
    if (contentInfo.innerText.length == 0) {
      contentInfo.remove();
    }

    if (data.release_date == "") {
      releaseSpan.parentElement.remove();
    } else {
      releaseSpan.innerText = new Date(data.release_date).toLocaleDateString();
    }
    
    image.setAttribute("src", (data.poster_path === null ? "https://t4.ftcdn.net/jpg/02/51/95/53/360_F_251955356_FAQH0U1y1TZw3ZcdPGybwUkH90a3VAhb.jpg" : "https://image.tmdb.org/t/p/original/" + data.poster_path));
    backgroundElement.style.backgroundImage = "url('https://image.tmdb.org/t/p/original/" + data.backdrop_path + "')";
    backgroundElement.style.backgroundSize = "cover";
    backgroundElement.style.backgroundPosition = "center";

    if (data.budget == 0) {
      budgetSpan.parentElement.remove();
    } else {
      budgetSpan.innerText = (data.budget == 0 ? "N/A" : "$" + data.budget.toLocaleString());
    }

    if (data.revenue == 0) {
      boxOfficeSpan.parentElement.remove();
    } else {
      boxOfficeSpan.innerText = (data.revenue == 0 ? "N/A" : "$" + data.revenue.toLocaleString());
    }
    

    const rating = data.vote_average*10;
    if (rating >= 80) {
      ratingCircle.style.backgroundColor = "green";
    } else if (rating >= 70) {
      ratingCircle.style.backgroundColor = "#FFCC00";
    } else {
      ratingCircle.style.backgroundColor = "red";
    }

    if (rating == 0) {
      ratingCircle.parentElement.remove();
    } else {
      ratingSpan.innerText = parseInt(data.vote_average *10) + "%";
      basedOnSpan.innerText = data.vote_count.toLocaleString();
    }

    if (data.credits.crew.find(element => element.job === "Director") != null) {
      const director = data.credits.crew.find(element => element.job === "Director").name;
      if (director == "") {
        directedBySpan.parentElement.remove();
      } else {
        directedBySpan.innerText = director;
      }
    } else {
      directedBySpan.parentElement.remove();
    }

    if (data.production_companies.length > 0) {
      producedSpan.innerText = data.production_companies.map(company => company.name).join(', ');    
    } else {
      producedSpan.parentElement.remove();
    }


    if (data.credits.cast.length > 0) {
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
    } else {
      contentCastList.previousElementSibling.remove();
      contentCastList.remove();
    }
    

    if (data.videos.results.length > 0) {
      for (let i = 0; i < data.videos.results.length; i ++) {
        const video = data.videos.results[i];
        if (video.site == "YouTube") {
          const youtubeKey = video.key;
          const youtubeLink = "https://www.youtube-nocookie.com/embed/" + youtubeKey + "?SameSite=Strict";
          const videoElement = document.createElement("iframe");
          videoElement.src = youtubeLink;
          videoElement.allowFullscreen = true;
          
          videoDiv.appendChild(videoElement);
        }
      }
    } else {
      videoDiv.previousElementSibling.remove();
      videoDiv.remove();
    }

    if (data.recommendations.results.length > 0) {
      for (let i = 0; i < data.recommendations.results.length; i ++) {
        const recommendation = data.recommendations.results[i];
        const singleContainer = document.createElement("div");
        const containerImage = document.createElement("img");
        containerImage.src = (recommendation.poster_path === null ? "https://t4.ftcdn.net/jpg/02/51/95/53/360_F_251955356_FAQH0U1y1TZw3ZcdPGybwUkH90a3VAhb.jpg" : "https://image.tmdb.org/t/p/original" + recommendation.poster_path);
        singleContainer.appendChild(containerImage);
    
        const contentName = document.createElement("span");
        contentName.innerText = recommendation.title;
        singleContainer.appendChild(contentName);
        
        seeAlsoDiv.appendChild(singleContainer);
    
        singleContainer.onclick = function() {
          window.location.href = initialUrl + "content.html?id=" + recommendation.id;
        }
      }
    } else {
      seeAlsoDiv.previousElementSibling.remove();
      seeAlsoDiv.remove();
    }
    

    document.title = data.title + " | Project Movie";
  } else {
    window.location.href = "index.html";
  }
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