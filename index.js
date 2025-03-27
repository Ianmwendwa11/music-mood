import { authenticateUser, searchTracksByMood } from "./spotifyAPI.js";

// Handles Background Change & UI Effects
function changeBackground(mood) {
    const body = document.body;
    const content = document.getElementById("content");
    const backButton = document.getElementById("backButton");

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

// Restore Main UI
function restorePage() {
    const content = document.getElementById("content");
    const backButton = document.getElementById("backButton");

    content.style.display = "block";
    content.style.opacity = "1";   
    backButton.style.display = "none";
    document.body.style.backgroundImage = "url('images/ui2.jpg')";
}

// Fetch Songs Based on Mood
async function fetchMoodSongs(mood) {
    const songs = await searchTracksByMood(mood);
    displaySongs(songs);
}

// Display Songs
function displaySongs(songs) {
    // Remove old list if exists
    const existingList = document.getElementById("song-list");
    if (existingList) existingList.remove();

    // Create new song container
    const songContainer = document.createElement('div');
    songContainer.id = "song-list";
    songContainer.classList.add("song-container");

    if (songs.length === 0) {
        songContainer.innerHTML = "<p>No songs found for this mood. Try another one!</p>";
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

    document.body.appendChild(songContainer);
}

// Event Listeners
document.getElementById("login-btn").addEventListener("click", authenticateUser);
document.getElementById("get-mood-music").addEventListener("click", async () => {
    const mood = document.getElementById("mood-input").value.toLowerCase();
    changeBackground(mood);
    fetchMoodSongs(mood);
});
