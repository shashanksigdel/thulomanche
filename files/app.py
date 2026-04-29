from flask import Flask, request, jsonify, send_from_directory
import yt_dlp, os, subprocess, threading, uuid, json

app = Flask(__name__, static_folder="static")
DOWNLOADS_DIR = os.path.join(os.path.dirname(__file__), "downloads")
os.makedirs(DOWNLOADS_DIR, exist_ok=True)

jobs = {}  # job_id -> {status, progress, file, error}

@app.route("/")
def index():
    return send_from_directory("static", "index.html")

@app.route("/api/info")
def get_info():
    url = request.args.get("url", "").strip()
    if not url:
        return jsonify({"error": "No URL provided"}), 400
    try:
        opts = {"quiet": True, "skip_download": True, "no_warnings": True}
        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(url, download=False)
        vid_id = info.get("id", "")
        return jsonify({
            "id": vid_id,
            "title": info.get("title", "Unknown"),
            "uploader": info.get("uploader", ""),
            "duration": info.get("duration", 0),
            "thumbnail": info.get("thumbnail", f"https://img.youtube.com/vi/{vid_id}/maxresdefault.jpg"),
            "view_count": info.get("view_count", 0),
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/api/download", methods=["POST"])
def start_download():
    data = request.json
    url = data.get("url", "")
    start = data.get("start", 0)
    end = data.get("end", 0)
    quality = data.get("quality", "1080")

    if not url:
        return jsonify({"error": "No URL"}), 400

    job_id = str(uuid.uuid4())[:8]
    jobs[job_id] = {"status": "starting", "progress": 0, "file": None, "error": None}

    def run():
        try:
            jobs[job_id]["status"] = "downloading"
            out_tmpl = os.path.join(DOWNLOADS_DIR, f"clip_{job_id}.%(ext)s")
            
            def to_hms(s):
                s = int(s)
                return f"{s//3600:02d}:{(s%3600)//60:02d}:{s%60:02d}"

            if quality == "best":
                fmt = "bestvideo+bestaudio/best"
            else:
                fmt = f"bestvideo[height<={quality}]+bestaudio/best[height<={quality}]"

            def hook(d):
                if d["status"] == "downloading":
                    pct = d.get("_percent_str", "0%").strip().replace("%", "")
                    try:
                        jobs[job_id]["progress"] = float(pct)
                    except:
                        pass
                elif d["status"] == "finished":
                    jobs[job_id]["progress"] = 99

            opts = {
                "format": fmt,
                "outtmpl": out_tmpl,
                "download_sections": [{"start_time": to_hms(start), "end_time": to_hms(end)}],
                "force_keyframes_at_cuts": True,
                "quiet": True,
                "no_warnings": True,
                "progress_hooks": [hook],
                "postprocessors": [{"key": "FFmpegVideoConvertor", "preferedformat": "mp4"}],
            }
            with yt_dlp.YoutubeDL(opts) as ydl:
                ydl.download([url])

            # find output file
            for f in os.listdir(DOWNLOADS_DIR):
                if f.startswith(f"clip_{job_id}"):
                    jobs[job_id]["file"] = f
                    break
            jobs[job_id]["status"] = "done"
            jobs[job_id]["progress"] = 100
        except Exception as e:
            jobs[job_id]["status"] = "error"
            jobs[job_id]["error"] = str(e)

    threading.Thread(target=run, daemon=True).start()
    return jsonify({"job_id": job_id})

@app.route("/api/status/<job_id>")
def job_status(job_id):
    job = jobs.get(job_id)
    if not job:
        return jsonify({"error": "Not found"}), 404
    return jsonify(job)

@app.route("/api/file/<job_id>")
def get_file(job_id):
    job = jobs.get(job_id)
    if not job or not job.get("file"):
        return jsonify({"error": "File not ready"}), 404
    return send_from_directory(DOWNLOADS_DIR, job["file"], as_attachment=True)

if __name__ == "__main__":
    print("\n✅  YTrimmer running at http://localhost:5000\n")
    app.run(debug=False, port=5000)
