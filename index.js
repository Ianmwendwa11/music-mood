function changeBackground(mood) {
    const body = document.body;

    const moodBackgrounds = {
        happy: "url('images/happy.jpeg')",
        sad: "url('images/sad.jpg')",
        chill: "url('images/chill.jpeg')",
        romantic: "url('images/romantic.jpeg')",
        hype: "url('images/hypiano.jpg')", 
        healing: "url('images/healing.jpeg')",
        inlove: "url('images/inlove.jpg')"
    };

    body.style.backgroundImage = moodBackgrounds[mood] || "none";
    body.style.backgroundSize = "cover";
    body.style.backgroundPosition = "center";
    body.style.transition = "background 0.5s ease-in-out";
}
