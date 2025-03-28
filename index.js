document.addEventListener("DOMContentLoaded", async () => {
    console.log("MeloMood App Loaded!");

    // Attach event listeners for mood selection links
    document.querySelectorAll(".dropdown-content a").forEach(link => {
        link.addEventListener("click", () => {
            const mood = link.innerText.toLowerCase();
            console.log(`Navigating to ${mood} mood page...`);
            handleMoodSelection(mood);
        });
    });

    // Fetch songs initially
    await fetchSongs();
});

// Function to go back to the homepage
function goBack() {
    sessionStorage.removeItem("visitedMoodPage");
    window.location.href = "index.html"; 
}

// API URL for fetching songs
const API_URL = "https://your-vercel-project.vercel.app/songs.json"; // Replace with your actual Vercel URL
let allSongs = {}; // Stores all songs data

// Function to fetch all songs from JSON
async function fetchSongs() {
    try {
        const response = await fetch(API_URL);
        allSongs = await response.json();
        console.log("Songs data loaded:", allSongs);
    } catch (error) {
        console.error("Error fetching songs:", error);
    }
}

// Function to get 5 random songs for a mood
function getRandomSongs(mood) {
    if (!allSongs[mood]) {
        console.error(`No songs found for mood: ${mood}`);
        return [];
    }

    return [...allSongs[mood]].sort(() => 0.5 - Math.random()).slice(0, 5);
}

// Function to display songs dynamically
function displaySongs(mood) {
    const songsContainer = document.getElementById("songs-list");
    songsContainer.innerHTML = ""; // Clear previous songs

    const songs = getRandomSongs(mood);
    if (songs.length === 0) {
        songsContainer.innerHTML = "<p>No songs available for this mood.</p>";
        return;
    }

    songs.forEach(song => {
        const songDiv = document.createElement("div");
        songDiv.innerHTML = `
            <p>${song.title} - ${song.artist}</p>
            <a href="${song.url}" target="_blank">Listen</a>
        `;
        songsContainer.appendChild(songDiv);
    });
}

// Function to handle mood selection
function handleMoodSelection(mood) {
    console.log(`Displaying songs for mood: ${mood}`);
    displaySongs(mood);
}

// Function to refresh songs (loads new random set)
document.getElementById("refresh-songs").addEventListener("click", () => {
    const selectedMood = document.querySelector(".active-mood")?.dataset.mood;
    if (selectedMood) displaySongs(selectedMood);
});
