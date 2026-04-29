# YTrimmer

A local web app to preview YouTube videos, trim a clip, and download it in up to 1080p.

## Requirements

- Python 3.8+
- ffmpeg (for trimming)

## Setup

```bash
# 1. Install Python dependencies
pip install -r requirements.txt

# 2. Install ffmpeg (if not already installed)
# macOS:
brew install ffmpeg

# Ubuntu/Debian:
sudo apt install ffmpeg

# Windows: download from https://ffmpeg.org/download.html

# 3. Run the app
python app.py
```

Then open **http://localhost:5000** in your browser.

## How it works

1. Paste a YouTube URL and click **Load** — title, thumbnail, and duration are fetched automatically via yt-dlp
2. Drag the handles on the timeline (or type timestamps) to set your trim range
3. Pick your quality (4K / 1080p / 720p / 480p)
4. Click **Download clip** — progress bar updates live, then a save link appears

Clips are saved to the `downloads/` folder next to `app.py`.
