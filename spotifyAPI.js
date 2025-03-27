// spotifyAPI.js

const CLIENT_ID = "8c3ce0d1c89d4394b9f26d5324f0eeea";  // 🔥 Replace with your Spotify Client ID
const CLIENT_SECRET = "28c075f810c743c18d133776db08b86e";  // 🔥 Replace with your Client Secret (Backend use)
const REDIRECT_URI = "http://localhost:5500/callback.html"; // 🔥 Replace if deploying online

let accessToken = "";

// Step 1: Redirect User for Authentication
function authenticateUser() {
    const authURL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user-read-private user-read-email playlist-read-private`;
    window.location.href = authURL;
}

// Step 2: Extract Access Token from Redirect URL
function handleRedirect() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    accessToken = params.get("access_token");

    if (accessToken) {
        localStorage.setItem("spotify_access_token", accessToken);
        window.location.href = "index.html"; // Redirect back to main page
    }
}

// Step 3: Get Featured Playlists (Example API Call)
async function getFeaturedPlaylists() {
    const storedToken = localStorage.getItem("spotify_access_token");
    if (!storedToken) {
        authenticateUser();
        return;
    }

    try {
        const response = await fetch("https://api.spotify.com/v1/browse/featured-playlists", {
            headers: { "Authorization": `Bearer ${storedToken}` }
        });
        const data = await response.json();
        return data.playlists.items; // Returns an array of playlists
    } catch (error) {
        console.error("Error fetching playlists:", error);
    }
}

// Step 4: Search for Songs by Mood
async function searchTracksByMood(mood) {
    const storedToken = localStorage.getItem("spotify_access_token");
    if (!storedToken) {
        authenticateUser();
        return;
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${mood}&type=track&limit=10`, {
            headers: { "Authorization": `Bearer ${storedToken}` }
        });
        const data = await response.json();
        return data.tracks.items; // Returns an array of songs
    } catch (error) {
        console.error("Error searching tracks:", error);
    }
}

// Export Functions
export { authenticateUser, handleRedirect, getFeaturedPlaylists, searchTracksByMood };
