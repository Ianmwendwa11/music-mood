document.addEventListener("DOMContentLoaded", () => {
    console.log("MeloMood App Loaded!");

    // Smooth scrolling effect for mood selection
    document.querySelectorAll(".dropdown-content a").forEach(link => {
        link.addEventListener("click", () => {
            console.log(`Navigating to ${link.innerText} mood page...`);
        });
    });
});
