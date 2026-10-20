# MC Flowbook — iPhone Edition
**By Daniel Singh and Orbital Trance Records**

This is the iPhone-ready web version of MC Flowbook, designed to add to the Home Screen from Safari without an Apple developer account.

## Install from Safari
1. Open https://vegadubstep-star.github.io/MC-Flowbook2/ in **Safari**.
2. Tap **Share** (square with up arrow).
3. Choose **Add to Home Screen**.
4. Enable **Open as Web App** if shown, then tap **Add**.

## Features
Projects, autosaved lyrics, instrumental MP3/WAV references, SoundCloud links, metronome, looping, vocal recordings where supported, and a rhyme assistant showing 12 closely matched suggestions. The **Find 20 Rhymes in ChatGPT** button opens ChatGPT with a prepared prompt; users may have to tap Send.

**Limitations:** This is a web app, not an App Store IPA. iOS has browser limitations around microphone capture, audio, storage, and export; test those on the device. SoundCloud playback cannot be mixed into exports. User data is held locally on each device; export backups before uninstalling or clearing Safari data.

## Publishing
GitHub Pages is deployed by `.github/workflows/deploy-pages.yml`. For the very first deployment, repository owner may need to enable Pages in Settings → Pages → Build and deployment → Source → **GitHub Actions**.
