function getMoodFromURL() {
    console.log("Current URL:", window.location.href);

    const path = window.location.pathname;
    const mood = path.split("/").pop().replace(".html", ""); 

    console.log("Extracted mood:", mood);
    return mood || null;
}

async function fetchSongsFromLocalServer(mood) {
    try {
        const response = await fetch(`http://localhost:5000/${mood}`);
        const data = await response.json();
        console.log(`Songs for ${mood}:`, data);
        return data;
    } catch (error) {
        console.error("Error fetching songs:", error);
        return [];
    }
}

function getRandomSongs(songs) {
    return [...songs].sort(() => 0.5 - Math.random()).slice(0, 5);
}

async function displaySongs() {
    const mood = getMoodFromURL();
    if (!mood) {
        console.log("Mood not found.");
        return;
    }

    const songList = document.getElementById("song-list");
    const loadingIndicator = document.getElementById("loading");

    if (!songList || !loadingIndicator) {
        console.error("Song list container or loading indicator not found.");
        return;
    }

    // Show loading spinner
    loadingIndicator.style.display = "block";
    songList.innerHTML = "";  

    // Fetch songs from server
    const songs = await fetchSongsFromLocalServer(mood);

    // Hide loading spinner
    loadingIndicator.style.display = "none";

    if (songs.length === 0) {
        songList.innerHTML = "<p>No songs available for this mood.</p>";
        return;
    }

    // Ensure songs are unique before displaying
    const uniqueSongs = getRandomSongs(songs);

    uniqueSongs.forEach((song, index) => {
        const songDiv = document.createElement("div");
        songDiv.classList.add("song-item");
        songDiv.style.opacity = "0";  

        
        const albumCover = song.cover ? song.cover : 'https://via.placeholder.com/100x100?text=No+Cover';

        songDiv.innerHTML = `
            <img src="${albumCover}" alt="Album Cover" class="song-cover">
            <div class="song-details">
                <p class="song-title">${song.title}</p>
                <p class="song-artist">by ${song.artist}</p>
                <a href="${song.url}" target="_blank" class="listen-link">🎵 Listen</a>
            </div>
        `;

        songList.appendChild(songDiv);

      
        setTimeout(() => {
            songDiv.style.opacity = "1";
            songDiv.style.transform = "translateY(0)";
        }, index * 150);
    });
}



async function handleMoodPage() {
    await displaySongs();
}

document.addEventListener("DOMContentLoaded", () => {
    handleMoodPage();

    const refreshButton = document.getElementById("refresh-songs");
    if (refreshButton) {
        refreshButton.addEventListener("click", async () => {
            await displaySongs();
        });
    }
});

function goBack() {
    sessionStorage.removeItem("visitedMoodPage");
    window.location.href = "index.html";
}