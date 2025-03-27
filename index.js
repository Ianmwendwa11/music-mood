function changeBackground(mood) {
    const body = document.body;
    const content = document.getElementById("content");
    


    const moodBackgrounds = {
        happy: "url('images/happy.jpeg')",
        sad: "url('images/sad.jpg')",
        chill: "url('images/chill.jpeg')",
        romantic: "url('images/romantic.jpeg')",
        hype: "url('images/hypiano.jpg')", 
        healing: "url('images/healing.jpeg')",
        inlove: "url('images/inlove.jpg')"
    };

    body.style.backgroundImage = moodBackgrounds[mood] || "none";
    body.style.backgroundSize = "cover";
    body.style.backgroundPosition = "center";
    body.style.transition = "background 0.5s ease-in-out";

    content.style.opacity = "0";
    setTimeout(() => {
        content.style.display = "none";
        backButton.style.display = "block";  
    }, 500);
}


function restorePage() {
    const content = document.getElementById("content");
    const backButton = document.getElementById("backButton");
    content.style.display = "block";
    content.style.opacity = "1";   
    backButton.style.display = "none";
    document.body.style.backgroundImage = "url('images/ui2.jpg')"
}


async function fetchMoodSongs(mood) {
    const tokenResponse = await fetch('http://localhost:3001/get-token');
    const { access_token } = await tokenResponse.json();

    const moodParams = {
        happy: { energy: 0.8, valence: 0.9 },
        sad: { energy: 0.3, valence: 0.2 },
        chill: { energy: 0.4, valence: 0.5 },
        romantic: { energy: 0.5, valence: 0.8 },
        hype: { energy: 0.9, valence: 0.7 },
        healing: { energy: 0.4, valence: 0.6 },
        inlove: { energy: 0.7, valence: 0.8 },
    };

    const params = moodParams[mood] || { energy: 0.5, valence: 0.5 };

    const url = `https://api.spotify.com/v1/recommendations?limit=10&seed_genres=pop&target_energy=${params.energy}&target_valence=${params.valence}`;

    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${access_token}` },
    });

    const data = await response.json();
    displaySongs(data.tracks);
}

function displaySongs(songs) {
    
    const existingList = document.getElementById("song-list");
    if (existingList) existingList.remove();

   
    const songContainer = document.createElement('div');
    songContainer.id = "song-list";
    songContainer.classList.add("song-container");

   
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

   
    document.body.appendChild(songContainer);
}

// script.js
import { authenticateUser, getFeaturedPlaylists, searchTracksByMood } from "./spotifyAPI.js";

document.getElementById("login-btn").addEventListener("click", authenticateUser);
document.getElementById("get-mood-music").addEventListener("click", async () => {
    const mood = document.getElementById("mood-input").value;
    const songs = await searchTracksByMood(mood);
    
    const songList = document.getElementById("song-list");
    songList.innerHTML = ""; // Clear previous results

    songs.forEach(song => {
        const li = document.createElement("li");
        li.innerHTML = `<img src="${song.album.images[0].url}" width="50"> ${song.name} - ${song.artists[0].name}`;
        songList.appendChild(li);
    });
});
