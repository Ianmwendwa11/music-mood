import { authenticateUser, searchTracksByMood } from "./spotifyAPI.js";

// Redirects to the dedicated mood page
function redirectToMoodPage(mood) {
    window.location.href = `moods/${mood}.html`;
}

// Restore Main UI (for the back button)
function restorePage() {
    window.location.href = "index.html";
}

// Fetch Songs Based on Mood (for mood pages)
async function fetchMoodSongs(mood) {
    try {
        const songs = await searchTracksByMood(mood);
        displaySongs(songs);
    } catch (error) {
        console.error("Error fetching songs:", error);
        document.getElementById("song-list").innerHTML = "<p>Failed to load songs. Please try again later.</p>";
    }
}

// Display Songs
function displaySongs(songs) {
    const songContainer = document.getElementById("song-list");
    songContainer.innerHTML = ""; // Clear previous content

    if (!songs || songs.length === 0) {
        songContainer.innerHTML = "<p>No songs found for this mood. Try another one!</p>";
        return;
    }

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

// Event Listeners
document.getElementById("login-btn")?.addEventListener("click", authenticateUser);
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const mood = urlParams.get("mood");

    if (mood) {
        fetchMoodSongs(mood);
    }
});
