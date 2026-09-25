# Corrected ceremony playback

Active sources: `public/video/a1.mp4` (1280×720 landscape) and `public/video/a2.mp4` (720×1280 portrait), both 240 frames at 24 fps. Originals remain untouched.

Run `node scripts/build-corrected-ceremony.mjs` to rebuild versioned posters, image-frame fallback batches, and 4K still-detail exports. Run `node scripts/pack-desktop-motion.mjs` to rebuild the efficient desktop frame packets.

Desktop uses hardware-accelerated 2560×1440 H.264 frame groups through WebCodecs with FidelityFX edge-aware upscaling, a slow encode preset, and CRF 12, rendered into a stable high-density canvas with high smoothing quality. When scrolling pauses or the hero section is viewed still, it automatically upgrades from the 4K (3840×2160) detail sources without changing the canvas resolution, avoiding the former sharp/soft size snap. There is no hero video element or playback clock to drift out of sync. Unsupported browsers use the optimized image-frame fallback.

Mobile retains the lightweight image-frame batch renderer. All active files live under `public/video/ceremony-v2/`, preventing stale original-clip frames from entering the corrected sequence. No generated garland overlay or generated family illustration is used.

The Annex B frame packaging follows the [W3C AVC WebCodecs registration](https://www.w3.org/TR/webcodecs-avc-codec-registration/), including IDR frames and their parameter sets at each group boundary.

Verified in Chrome with 4× CPU throttling, 70 ms network latency, and 1.5 MB/s throughput: 238 distinct displayed frames during a ten-second scroll, approximately 16.7 ms p95 animation callback interval, no long main-thread tasks, and 20 frame-batch requests. Also checked forward/reverse seeking, responsive assets, image fallback, reduced motion, and the hero-to-invitation transition. Results describe this local test, not a guarantee for every device or connection.
