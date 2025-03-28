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
    if (!songList) {
        console.error("Song list container not found.");
        return;
    }

    const songs = await fetchSongsFromLocalServer(mood);
    if (songs.length === 0) {
        songList.innerHTML = "<p>No songs available for this mood.</p>";
        return;
    }

    songList.innerHTML = ""; // Clear previous songs

    getRandomSongs(songs).forEach(song => {
        const songDiv = document.createElement("div");
        songDiv.innerHTML = `
            <p><strong>${song.title}</strong> - ${song.artist}</p>
            <a href="${song.url}" target="_blank">🎵 Listen</a>
        `;
        songList.appendChild(songDiv);
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
