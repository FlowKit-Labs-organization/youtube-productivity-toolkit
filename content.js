(function () {

    let userMuted = false;
    let userPlaybackRate = 1;
    let adWasPlaying = false;

    // --- 1️⃣ Handle ads ---
    function handleAds() {
        const video = document.querySelector('video');
        if (!video) return;

        const adPlaying = document.querySelector('.ad-showing');

        if (adPlaying) {
            if (!adWasPlaying) {
                userMuted = video.muted;
                userPlaybackRate = video.playbackRate;
                adWasPlaying = true;
            }

            video.muted = true;
            if (video.playbackRate !== 16) video.playbackRate = 16;

            const skipBtn = document.querySelector(
                '.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, .videoAdUiSkipButton'
            );
            if (skipBtn) skipBtn.click();

            const bannerBtn = document.querySelector('.ytp-ad-overlay-close-button');
            if (bannerBtn) bannerBtn.click();

        } else if (adWasPlaying) {
            adWasPlaying = false;
            video.muted = userMuted;
            video.playbackRate = userPlaybackRate;
        }
    }

    // --- 2️⃣ Productivity features (page-aware) ---
    function applyProductivityFeatures() {
        const path = window.location.pathname;

        // ✅ Hide Shorts links — but ONLY in the sidebar/nav, not in the feed itself
        // Targets the left nav Shorts button, not feed thumbnails
        document.querySelectorAll(
            'ytd-guide-entry-renderer a[href="/shorts"], ytd-mini-guide-entry-renderer a[href="/shorts"]'
        ).forEach(el => el.closest('ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer').style.display = 'none');

        // ✅ Hide sidebar recommendations — ONLY on watch pages
        if (path === '/watch') {
            const sidebar = document.getElementById('related');
            if (sidebar) sidebar.style.display = 'none';
        } else {
            // ✅ Restore sidebar on non-watch pages (homepage, search, etc.)
            const sidebar = document.getElementById('related');
            if (sidebar) sidebar.style.display = '';
        }
    }

    // --- 3️⃣ Observe DOM ---
    function observeDOM() {
        if (!document.body) {
            document.addEventListener('DOMContentLoaded', observeDOM);
            return;
        }

        let debounceTimer;
        const observer = new MutationObserver(() => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(applyProductivityFeatures, 300);
        });

        observer.observe(document.body, { childList: true, subtree: true });
        applyProductivityFeatures();
    }

    setInterval(handleAds, 300);
    observeDOM();

})();