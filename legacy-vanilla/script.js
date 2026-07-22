document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize AOS Animations
    AOS.init({
        duration: 1000,
        once: true,
        offset: 50
    });

    // 2. Language Switcher Logic
    const langToggleBtn = document.getElementById("langToggle");
    const htmlElement = document.documentElement;
    
    // Auto-detect language
    const userLang = navigator.language || navigator.userLanguage;
    let currentLang = userLang.toLowerCase().startsWith("ar") ? "ar" : "en";

    function updateLanguage() {
        const elements = document.querySelectorAll("[data-en][data-ar]");
        elements.forEach(el => {
            el.innerHTML = currentLang === "en" ? el.getAttribute("data-en") : el.getAttribute("data-ar");
        });
        htmlElement.setAttribute("lang", currentLang);
        htmlElement.setAttribute("dir", currentLang === "en" ? "ltr" : "rtl");
    }

    // Initial language setup
    updateLanguage();

    langToggleBtn.addEventListener("click", () => {
        currentLang = currentLang === "en" ? "ar" : "en";
        updateLanguage();
    });

    // 3. Open Invitation Logic
    const overlay = document.getElementById("invitation-overlay");
    const openBtn = document.getElementById("openInvitationBtn");
    const mainContent = document.getElementById("main-content");
    const quranAudio = document.getElementById("quran-audio");

    openBtn.addEventListener("click", () => {
        // Hide overlay
        overlay.classList.add("hidden");
        
        // Show main content
        mainContent.style.display = "block";
        setTimeout(() => {
            AOS.refresh(); // Refresh animations after display block
        }, 100);

        // Play audio
        if(quranAudio) {
            quranAudio.play().catch(error => console.log("Audio playback prevented by browser policy", error));
        }

        // Remove overlay from DOM after animation
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 1500);
    });

    // 4. Countdown Timer Logic (Target: July 28, 2026, 8:00 PM)
    const targetDate = new Date('July 28, 2026 20:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            document.getElementById("days").innerText = "00";
            document.getElementById("hours").innerText = "00";
            document.getElementById("minutes").innerText = "00";
            document.getElementById("seconds").innerText = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days < 10 ? "0" + days : days;
        document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
        document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // Ensure AOS refreshes after all images load
    window.addEventListener("load", () => {
        AOS.refresh();
    });
});
