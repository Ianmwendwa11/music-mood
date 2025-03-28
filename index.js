// Function to get the mood from the current page URL
function getMoodFromURL() {
    const path = window.location.pathname; // Example: "/happy.html"
    const mood = path.split("/").pop().replace(".html", ""); // Extract "happy"
    return mood;
}

// API URL for fetching songs (Replace with your actual Vercel URL)
const API_URL = "https://your-vercel-project.vercel.app/songs.json"; 
let allSongs = {}; // Stores all songs data

// Function to fetch songs from JSON
async function fetchSongs() {
    try {
        const response = await fetch(API_URL);
        allSongs = await response.json();
        console.log("Songs data loaded:", allSongs);
    } catch (error) {
        console.error("Error fetching songs:", error);
    }
}

// Function to get 5 random songs from a mood category
function getRandomSongs(mood) {
    if (!allSongs[mood]) {
        console.error(`No songs found for mood: ${mood}`);
        return [];
    }
    return [...allSongs[mood]].sort(() => 0.5 - Math.random()).slice(0, 5);
}

// Function to display songs on the page
function displaySongs(mood) {
    const songsContainer = document.getElementById("songs-list");
    songsContainer.innerHTML = ""; // Clear previous songs

    if (!allSongs[mood]) {
        songsContainer.innerHTML = "<p>No songs available for this mood.</p>";
        return;
    }

    const songs = getRandomSongs(mood);
    songs.forEach(song => {
        const songDiv = document.createElement("div");
        songDiv.innerHTML = `
            <p><strong>${song.title}</strong> - ${song.artist}</p>
            <a href="${song.url}" target="_blank">🎵 Listen</a>
        `;
        songsContainer.appendChild(songDiv);
    });
}

// Function to handle mood selection and display songs
async function handleMoodPage() {
    const mood = getMoodFromURL(); // Get the mood from the URL
    if (mood) {
        await fetchSongs(); // Fetch all songs
        displaySongs(mood); // Display songs for this mood
    }
}

// Event listener for refreshing songs
document.addEventListener("DOMContentLoaded", () => {
    handleMoodPage(); // Load songs when the page loads

    document.getElementById("refresh-songs").addEventListener("click", () => {
        const mood = getMoodFromURL();
        if (mood) displaySongs(mood);
    });
});

// Function to go back to homepage
function goBack() {
    sessionStorage.removeItem("visitedMoodPage");
    window.location.href = "index.html"; 
}
        