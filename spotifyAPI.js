const clientId = "8c3ce0d1c89d4394b9f26d5324f0eeea";
const clientSecret = "28c075f810c743c18d133776db08b86e";
let accessToken = "";


async function getAccessToken() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(clientId + ":" + clientSecret),
        },
        body: "grant_type=client_credentials",
    });

    const data = await response.json();
    accessToken = data.access_token;
}

// Search for Songs Based on Mood
async function searchTracksByMood(mood) {
    if (!accessToken) await getAccessToken();

    let query = mood;  
    if (mood === "hype") query = "amapiano"; // Force Amapiano for Hype mood

    const response = await fetch(
        `https://api.spotify.com/v1/search?q=${query}&t// Fetch Spotify Access Tokenype=track&limit=5`,
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        }
    );

    const data = await response.json();
    return data.tracks.items;
}


async function displaySongs(mood) {
    const songContainer = document.getElementById("song-container");
    songContainer.innerHTML = `<p>Loading ${mood} songs...</p>`;

    const songs = await searchTracksByMood(mood);

    songContainer.innerHTML = ""; // 

    if (songs.length === 0) {
        songContainer.innerHTML = `<p>No songs found for this mood. Try refreshing!</p>`;
        return;
    }

    songs.forEach((song) => {
        const songCard = document.createElement("div");
        songCard.classList.add("song-card");

        songCard.innerHTML = `
            <img src="${song.album.images[0].url}" alt="${song.name}" class="album-cover">
            <div class="song-info">
                <p class="song-title">${song.name}</p>
                <p class="song-artist">${song.artists.map((artist) => artist.name).join(", ")}</p>
            </div>
            <a href="${song.external_urls.spotify}" target="_blank" class="play-button">▶ Play</a>
        `;

        songContainer.appendChild(songCard);
    });
}


document.getElementById("refresh-btn").addEventListener("click", () => {
    const mood = document.body.getAttribute("data-mood")
    displaySongs(mood);
});

export { displaySongs };
