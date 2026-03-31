// Countdown Timer logic targeting April 1, 2026 launch window
let targetDate = new Date("April 1, 2026 18:24:00 EDT").getTime();

// Fetch live launch data overriding the default date
async function fetchLiveLaunchData() {
    try {
        // SpaceDevs Launch Library 2 - Dev API Endpoint
        const response = await fetch("https://lldev.thespacedevs.com/2.2.0/launch/?search=Artemis+II");
        if (!response.ok) return;
        const data = await response.json();
        
        if (data && data.results && data.results.length > 0) {
            const netDateStr = data.results[0].net;
            if (netDateStr) {
                targetDate = new Date(netDateStr).getTime();
                console.log("Updated Artemis II target date from live API:", new Date(targetDate));
            }
        }
    } catch (err) {
        console.error("Failed to fetch live launch data. Falling back to default.", err);
    }
}

// Kick off fetch immediately
fetchLiveLaunchData();

function updateCountdown() {
    const now = new Date().getTime();
    let distance = targetDate - now;

    // Handle past date gracefully
    if (distance < 0) {
        document.getElementById("countdown").innerHTML = "<div class='cd-value'>T-0</div>";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Format with leading zeros for HH:MM:SS
    const format = (num) => num.toString().padStart(2, '0');

    document.getElementById("countdown").innerHTML = `
        <div class="cd-block">
            <span class="cd-value">${days}</span>
            <span class="cd-label">Days</span>
        </div>
        <div class="cd-block">
            <span class="cd-value">${format(hours)}</span>
            <span class="cd-label">Hrs</span>
        </div>
        <div class="cd-block">
            <span class="cd-value">${format(minutes)}</span>
            <span class="cd-label">Mins</span>
        </div>
        <div class="cd-block">
            <span class="cd-value">${format(seconds)}</span>
            <span class="cd-label">Secs</span>
        </div>
    `;
}

// Initial call and interval
updateCountdown();
setInterval(updateCountdown, 1000);

// Intersection Observer for Scroll Animations
document.addEventListener("DOMContentLoaded", () => {
    const fadeElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once faded in
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% visible
    });

    fadeElements.forEach(el => observer.observe(el));
});
