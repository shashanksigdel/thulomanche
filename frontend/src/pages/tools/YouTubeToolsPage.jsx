import React, { useEffect, useRef, useState } from 'react';
import '../../styles/tool-page.css';

const YT_API_BASE = (import.meta.env.VITE_YT_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

const QUALITY_OPTIONS = [
  { label: '4K', value: '2160' },
  { label: '1080p', value: '1080' },
  { label: '720p', value: '720' },
  { label: '480p', value: '480' },
  { label: 'Best', value: 'best' }
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const formatTime = (seconds) => {
  const s = Math.max(0, Math.round(Number(seconds) || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }

  return `${m}:${String(sec).padStart(2, '0')}`;
};

const parseTime = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return null;

  const parts = raw.split(':').map((part) => Number(part.trim()));
  if (parts.some(Number.isNaN)) return null;

  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0];
};

const formatViews = (viewCount) => {
  const value = Number(viewCount || 0);
  if (!value) return '';
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B views`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M views`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K views`;
  return `${value} views`;
};

export const YouTubeToolsPage = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);

  const [videoInfo, setVideoInfo] = useState(null);
  const [totalSec, setTotalSec] = useState(0);
  const [startSec, setStartSec] = useState(0);
  const [endSec, setEndSec] = useState(0);
  const [quality, setQuality] = useState('1080');

  const [dragSide, setDragSide] = useState(null);

  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('idle');
  const [progressMessage, setProgressMessage] = useState('Downloading...');
  const [downloadLink, setDownloadLink] = useState('');

  const timelineRef = useRef(null);
  const pollTimerRef = useRef(null);
  const startRef = useRef(0);
  const endRef = useRef(0);
  const totalRef = useRef(0);

  useEffect(() => {
    startRef.current = startSec;
  }, [startSec]);

  useEffect(() => {
    endRef.current = endSec;
  }, [endSec]);

  useEffect(() => {
    totalRef.current = totalSec;
  }, [totalSec]);

  const clearPollTimer = () => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearPollTimer();
    };
  }, []);

  const resetProgress = () => {
    clearPollTimer();
    setIsDownloading(false);
    setProgress(0);
    setProgressStatus('idle');
    setProgressMessage('Downloading...');
    setDownloadLink('');
  };

  const getSecondsFromPointerEvent = (event) => {
    const timelineEl = timelineRef.current;
    if (!timelineEl || totalRef.current <= 0) return 0;

    const rect = timelineEl.getBoundingClientRect();
    const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    return ratio * totalRef.current;
  };

  const updateRangeFromPointer = (seconds, side) => {
    const total = totalRef.current;
    const minGap = total > 1 ? 1 : 0;
    let nextStart = startRef.current;
    let nextEnd = endRef.current;

    if (side === 'L') {
      nextStart = clamp(seconds, 0, Math.max(0, nextEnd - minGap));
    } else {
      nextEnd = clamp(seconds, Math.min(total, nextStart + minGap), total);
    }

    setStartSec(nextStart);
    setEndSec(nextEnd);
  };

  const loadVideo = async () => {
    const url = youtubeUrl.trim();
    setErrorMsg('');

    if (!url) {
      setErrorMsg('Please paste a YouTube URL.');
      return;
    }

    setIsLoadingInfo(true);

    try {
      const response = await fetch(`${YT_API_BASE}/info?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to load video info');
      }

      const duration = Number(data.duration || 0);

      setVideoUrl(url);
      setVideoInfo({
        id: data.id || '',
        title: data.title || 'Unknown title',
        uploader: data.uploader || '',
        duration,
        thumbnail: data.thumbnail || '',
        viewCount: Number(data.view_count || 0)
      });
      setTotalSec(duration);
      setStartSec(0);
      setEndSec(duration);
      setQuality('1080');
      resetProgress();
    } catch (error) {
      setVideoInfo(null);
      setErrorMsg(`Error: ${error.message}`);
    } finally {
      setIsLoadingInfo(false);
    }
  };

  const pollStatus = (jobId) => {
    clearPollTimer();

    pollTimerRef.current = setInterval(async () => {
      try {
        const response = await fetch(`${YT_API_BASE}/status/${jobId}`);
        const job = await response.json();

        if (!response.ok || job.error) {
          throw new Error(job.error || 'Failed to get download status');
        }

        const pct = clamp(Math.round(Number(job.progress || 0)), 0, 100);
        setProgress(pct);

        if (job.status === 'done') {
          clearPollTimer();
          setIsDownloading(false);
          setProgress(100);
          setProgressStatus('done');
          setProgressMessage('Clip ready');
          setDownloadLink(`${YT_API_BASE}/file/${jobId}`);
          return;
        }

        if (job.status === 'error') {
          clearPollTimer();
          setIsDownloading(false);
          setProgressStatus('error');
          setProgressMessage(`Error: ${job.error || 'Download failed'}`);
        }
      } catch (error) {
        clearPollTimer();
        setIsDownloading(false);
        setProgressStatus('error');
        setProgressMessage(`Error: ${error.message}`);
      }
    }, 800);
  };

  const startDownload = async () => {
    setErrorMsg('');

    if (!videoUrl) {
      setErrorMsg('Load a video first.');
      return;
    }

    if (endSec <= startSec) {
      setErrorMsg('End time must be greater than start time.');
      return;
    }

    setIsDownloading(true);
    setProgress(0);
    setProgressStatus('downloading');
    setProgressMessage('Downloading...');
    setDownloadLink('');

    try {
      const response = await fetch(`${YT_API_BASE}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: videoUrl,
          start: startSec,
          end: endSec,
          quality
        })
      });

      const data = await response.json();

      if (!response.ok || data.error || !data.job_id) {
        throw new Error(data.error || 'Failed to start download');
      }

      pollStatus(data.job_id);
    } catch (error) {
      setIsDownloading(false);
      setProgressStatus('error');
      setProgressMessage(`Error: ${error.message}`);
    }
  };

  const onTimeInput = (which, value) => {
    const parsed = parseTime(value);
    if (parsed === null || parsed < 0) return;

    if (which === 'start') {
      const maxStart = Math.max(0, endRef.current - 1);
      setStartSec(clamp(parsed, 0, maxStart));
      return;
    }

    const maxEnd = totalRef.current;
    const minEnd = Math.min(maxEnd, startRef.current + 1);
    setEndSec(clamp(parsed, minEnd, maxEnd));
  };

  const safeTotal = totalSec > 0 ? totalSec : 1;
  const leftPercent = clamp((startSec / safeTotal) * 100, 0, 100);
  const rightPercent = clamp((endSec / safeTotal) * 100, leftPercent, 100);
  const selectionDuration = Math.max(0, Math.round(endSec - startSec));

  const handleTimelinePointerDown = (event) => {
    if (totalRef.current <= 0) return;
    event.preventDefault();

    const seconds = getSecondsFromPointerEvent(event);
    const nearestSide =
      Math.abs(seconds - startRef.current) <= Math.abs(seconds - endRef.current) ? 'L' : 'R';

    setDragSide(nearestSide);
    updateRangeFromPointer(seconds, nearestSide);

    if (event.currentTarget.setPointerCapture) {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // no-op
      }
    }
  };

  const handleTimelinePointerMove = (event) => {
    if (!dragSide) return;
    event.preventDefault();

    const seconds = getSecondsFromPointerEvent(event);
    updateRangeFromPointer(seconds, dragSide);
  };

  const handleTimelinePointerUp = (event) => {
    if (event.currentTarget.releasePointerCapture) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // no-op
      }
    }
    setDragSide(null);
  };

  return (
    <div className="tool-page">
      <div className="tool-container yt-tool">
        <h1>YouTube Tools</h1>
        <p className="tool-description">Download and trim YouTube videos</p>

        <div className="yt-url-card">
          <div className="yt-url-row">
            <input
              className="yt-url-input"
              type="url"
              value={youtubeUrl}
              onChange={(event) => setYoutubeUrl(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') loadVideo();
              }}
              placeholder="Paste a YouTube URL..."
            />
            <button className="yt-load-btn" onClick={loadVideo} disabled={isLoadingInfo}>
              {isLoadingInfo ? 'Loading...' : 'Load'}
            </button>
          </div>
          {errorMsg && <div className="yt-err-msg">{errorMsg}</div>}
        </div>

        {videoInfo && (
          <>
            <div className="yt-preview">
              <div className="yt-thumb-wrap">
                <img className="yt-thumb" src={videoInfo.thumbnail} alt="thumbnail" />
                <div className="yt-thumb-overlay" />
                <div className="yt-dur-pill">{formatTime(videoInfo.duration)}</div>

                <div className="yt-thumb-meta">
                  <div className="yt-thumb-title">{videoInfo.title}</div>
                  <div className="yt-thumb-sub">
                    {videoInfo.uploader}
                    {videoInfo.viewCount ? ` · ${formatViews(videoInfo.viewCount)}` : ''}
                  </div>
                </div>
              </div>
            </div>

            <div className="yt-trim-card">
              <div className="yt-card-title">Trim</div>

              <div
                className="yt-timeline"
                ref={timelineRef}
                onPointerDown={handleTimelinePointerDown}
                onPointerMove={handleTimelinePointerMove}
                onPointerUp={handleTimelinePointerUp}
                onPointerCancel={handleTimelinePointerUp}
              >
                <div className="yt-tl-bg" />

                <div
                  className="yt-tl-selection"
                  style={{ left: `${leftPercent}%`, width: `${rightPercent - leftPercent}%` }}
                />

                <div className="yt-tl-handle" style={{ left: `${leftPercent}%` }}>
                  <div className="yt-tl-handle-bar" />
                </div>

                <div className="yt-tl-handle" style={{ left: `${rightPercent}%` }}>
                  <div className="yt-tl-handle-bar" />
                </div>
              </div>

              <div className="yt-time-row">
                <div className="yt-time-group">
                  <label>Start</label>
                  <input
                    className="yt-time-input"
                    value={formatTime(startSec)}
                    onChange={(event) => onTimeInput('start', event.target.value)}
                  />
                </div>

                <div className="yt-time-arrow">→</div>

                <div className="yt-time-group">
                  <label>End</label>
                  <input
                    className="yt-time-input"
                    value={formatTime(endSec)}
                    onChange={(event) => onTimeInput('end', event.target.value)}
                  />
                </div>
              </div>

              <div className="yt-sel-dur">
                Selection: <strong>{formatTime(selectionDuration)}</strong>
              </div>

              <div className="yt-quality-label">Quality</div>
              <div className="yt-quality-row">
                {QUALITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    className={`yt-q-btn ${quality === option.value ? 'active' : ''}`}
                    onClick={() => setQuality(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <button className="yt-dl-btn" onClick={startDownload} disabled={isDownloading}>
                {isDownloading ? 'Starting...' : 'Download clip'}
              </button>
            </div>
          </>
        )}

        {progressStatus !== 'idle' && (
          <div className="yt-progress-card">
            <div className="yt-progress-label">{progressMessage}</div>
            <div className="yt-progress-bar-wrap">
              <div className="yt-progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <div className="yt-progress-pct">{progress}%</div>

            {progressStatus === 'done' && downloadLink && (
              <a className="yt-dl-link" href={downloadLink} target="_blank" rel="noreferrer">
                Save clip
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
