(function () {

    function handleAds() {
        const video = document.querySelector('video');
        if (!video) return;

        const adPlaying = document.querySelector('.ad-showing');

        if (adPlaying) {
            // Mute ad
            video.muted = true;

            // Store user speed only once
            if (!video.dataset.userSpeed) {
                video.dataset.userSpeed = video.playbackRate;
            }

            // Speed up ad temporarily
            if (isFinite(video.currentTime)) {
                video.currentTime += 2;
            }

            // Click skip button if available
            const skipBtn = document.querySelector(
                '.ytp-ad-skip-button, .ytp-ad-skip-button-modern'
            );
            if (skipBtn) skipBtn.click();

            // Close overlay ads
            const bannerBtn = document.querySelector('.ytp-ad-overlay-close-button');
            if (bannerBtn) bannerBtn.click();

        } else {
            // Restore user speed after ad
            if (video.dataset.userSpeed) {
                video.playbackRate = video.dataset.userSpeed;
                delete video.dataset.userSpeed;
            }

            // Unmute
            video.muted = false;
        }
    }

    // Observe DOM for instant ad detection
    const observer = new MutationObserver(handleAds);
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });

    // Run initially
    handleAds();

})();
