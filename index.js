function getMoodFromURL() {
    const path = window.location.pathname;
    return path.split("/").pop().replace(".html", "");
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
    return songs.sort(() => 0.5 - Math.random()).slice(0, 5);
}

async function displaySongs(mood) {
    const songsContainer = document.getElementById("songs-list");
    songsContainer.innerHTML = "<p>Loading songs...</p>";

    const songs = await fetchSongsFromLocalServer(mood);

    if (!songs || songs.length === 0) {
        songsContainer.innerHTML = "<p>No songs available for this mood.</p>";
        return;
    }

    const randomSongs = getRandomSongs(songs);
    songsContainer.innerHTML = "";

    randomSongs.forEach(song => {
        const songDiv = document.createElement("div");
        songDiv.innerHTML = `
            <p><strong>${song.title}</strong> - ${song.artist}</p>
            <a href="${song.url}" target="_blank">🎵 Listen</a>
        `;
        songsContainer.appendChild(songDiv);
    });
}

async function handleMoodPage() {
    const mood = getMoodFromURL();
    if (mood) {
        await displaySongs(mood);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    handleMoodPage();

    document.getElementById("refresh-songs").addEventListener("click", async () => {
        const mood = getMoodFromURL();
        if (mood) await displaySongs(mood);
    });
});

function goBack() {
    sessionStorage.removeItem("visitedMoodPage");
    window.location.href = "index.html";
}
