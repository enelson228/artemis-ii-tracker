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

    // Simulated Telemetry Data
    let velocity = 0;
    let altitude = 0;
    const velEl = document.getElementById('vel-val');
    const altEl = document.getElementById('alt-val');
    
    // Smooth random walk for telemetry
    setInterval(() => {
        // T-minus stage (pre-launch check)
        // just simulate nominal fluctuations around 0 before launch
        const distance = targetDate - new Date().getTime();
        
        if (distance > 0) {
            // Still in countdown
            velocity = Math.max(0, velocity + (Math.random() * 2 - 1));
            altitude = 0.0;
        } else {
            // "Launched" simulation
            velocity += 15 + Math.random() * 5;
            altitude += 0.5 + Math.random() * 0.2;
        }
        
        if (velEl) {
            velEl.innerText = Math.abs(velocity).toFixed(0).padStart(5, '0');
        }
        if (altEl) {
            altEl.innerText = altitude.toFixed(1).padStart(5, '0');
        }
    }, 100);

    // Starfield Parallax Animation
    const canvas = document.getElementById('starfield');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        
        const setSize = () => {
            const parent = canvas.parentElement;
            width = parent.clientWidth;
            height = parent.clientHeight;
            canvas.width = width;
            canvas.height = height;
        };
        setSize();
        // Resize observer for dynamic container changes
        new ResizeObserver(setSize).observe(canvas.parentElement);

        const stars = Array.from({length: 250}, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.2,
            speed: Math.random() * 0.3 + 0.05,
            alpha: Math.random()
        }));

        function drawStars() {
            ctx.clearRect(0, 0, width, height);
            stars.forEach(star => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
                ctx.fill();
                
                // Move stars leftward to simulate forward motion
                star.x -= star.speed;
                
                // Twinkle effect
                star.alpha += (Math.random() * 0.05 - 0.025);
                if (star.alpha < 0.1) star.alpha = 0.1;
                if (star.alpha > 0.8) star.alpha = 0.8;

                if (star.x < 0) {
                    star.x = width;
                    star.y = Math.random() * height;
                }
            });
            requestAnimationFrame(drawStars);
        }
        drawStars();
    }
});
