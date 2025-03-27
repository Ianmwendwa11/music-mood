const CLIENT_ID = "";  // 🔥 Replace with your Spotify Client ID
const CLIENT_SECRET = "";  // 🔥 Replace with your Client Secret (Backend use)
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

// Step 3: Get Access Token (Ensures Token is Always Available)
function getAccessToken() {
    if (!accessToken) {
        accessToken = localStorage.getItem("spotify_access_token");
    }
    return accessToken;
}

// Step 4: Search for Songs by Mood
async function searchTracksByMood(mood) {
    const token = getAccessToken();
    if (!token) {
        authenticateUser();
        return;
    }

    try {
        const query = `mood:${mood} OR genre:${mood}`;
        const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        return data.tracks.items || []; // Returns an array of songs
    } catch (error) {
        console.error("Error searching tracks:", error);
        return [];
    }
}

// Export Functions
export { authenticateUser, handleRedirect, searchTracksByMood };
