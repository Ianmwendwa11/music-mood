function changeBackground(mood) {
    const body = document.body;
    
    
    const moodBackgrounds = {
        happy: "url('images/happy.jpg')",
        sad: "url('images/sad.jpg')",
        chill: "url('images/chill.jpg')",
        romantic: "url('images/romantic.jpg')",
        hype: "url('images/hype.jpg')",
        healing: "url('images/healing.jpg')",
        "in love": "url('images/inlove.jpg')"
    };

   
    body.style.backgroundImage = moodBackgrounds[mood] || "none";
    body.style.transition = "background 0.5s ease-in-out";
}

