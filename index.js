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

async function fetchSongsFromVercel(mood) {
    try {
        const response = await fetch("https://your-project-name.vercel.app/songs.json");
        const data = await response.json();
        
        if (!data[mood]) {
            console.error("No songs found for mood:", mood);
            return [];
        }

        
        const shuffled = data[mood].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 5);
    } catch (error) {
        console.error("Error fetching songs:", error);
        return [];
    }
}


fetchSongsFromVercel("happy").then(songs => console.log(songs));

document.getElementById("refresh-songs").addEventListener("click", async () => {
    const songs = await fetchSongsFromVercel("happy"); 
    displaySongs(songs);
});

function displaySongs(songs) {
    const songList = document.getElementById("song-list");
    songList.innerHTML = ""; 
    songs.forEach(song => {
        const songDiv = document.createElement("div");
        songDiv.innerHTML = `
            <p>${song.title} - ${song.artist}</p>
            <a href="${song.url}" target="_blank">Listen</a>
        `;
        songList.appendChild(songDiv);
    });
}
