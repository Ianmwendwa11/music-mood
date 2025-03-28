document.addEventListener("DOMContentLoaded", () => {
    console.log("MeloMood App Loaded!");

    document.querySelectorAll(".dropdown-content a").forEach(link => {
        link.addEventListener("click", () => {
            console.log(`Navigating to ${link.innerText} mood page...`);
        });
    });
});

function goBack() {
    sessionStorage.removeItem("visitedMoodPage");
    window.location.href = "index.html"; 
}

import { authenticateUser, searchTracksByMood } from "./spotifyAPI.js";

function changeBackground(mood) {
    window.location.href = `${mood}.html`;
}

function restorePage() {
    window.location.href = "index.html";
}

async function fetchMoodSongs(mood) {
    let genre = mood;
    if (mood === "hype") {
        genre = "amapiano"; 
    }
    const songs = await searchTracksByMood(genre, 5); 
    displaySongs(songs);
}


function displaySongs(songs) {
    const songContainer = document.getElementById("song-list");
    songContainer.innerHTML = "";
    if (songs.length === 0) {
        songContainer.innerHTML = "<p>No songs found for this mood. Try refreshing!</p>";
    } else {
        songs.forEach(song => {
            const songCard = document.createElement('div');
            songCard.classList.add("song-card");

            songCard.innerHTML = `
                <img src="${song.album.images[0].url}" class="album-cover">
                <div class="song-info">
                    <p class="song-title">${song.name}</p>
                    <p class="song-artist">${song.artists[0].name}</p>
                </div>
                <a href="${song.external_urls.spotify}" target="_blank" class="play-button">▶</a>
            `;

            songContainer.appendChild(songCard);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const mood = document.body.dataset.mood; 
    if (mood) fetchMoodSongs(mood);
});

document.getElementById("refresh-songs").addEventListener("click", () => {
    const mood = document.body.dataset.mood;
    fetchMoodSongs(mood);
});
