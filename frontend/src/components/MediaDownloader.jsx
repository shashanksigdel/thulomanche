import React, { useState } from 'react';

const API_BASE_URL = (import.meta.env.VITE_MEDIA_API_URL || 'http://localhost:8899').replace(/\/$/, '');

const MediaDownloader = () => {
  const [urls, setUrls] = useState('');
  const [format, setFormat] = useState('video');
  const [cookies, setCookies] = useState('');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const updateCard = (index, patch) => {
    setCards((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const pickFormat = (index, formatId) => {
    updateCard(index, { selectedFormatId: formatId });
  };

  const handleGo = async () => {
    const urlList = urls.split(/[\s,]+/).map(u => u.trim()).filter(u => u.startsWith('http'));
    if (!urlList.length) return;

    setLoading(true);
    setCards([]);

    const newCards = [];
    for (let i = 0; i < urlList.length; i++) {
      const url = urlList[i];
      newCards.push({ url, status: 'loading' });
      setCards([...newCards]);

      try {
        const res = await fetch(`${API_BASE_URL}/api/info`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, cookies }),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          const errorMessage = data?.error || `Request failed (${res.status})`;
          newCards[i] = { ...newCards[i], status: 'info-error', error: errorMessage };
          setCards([...newCards]);
          continue;
        }

        if (data.error) {
          newCards[i] = { ...newCards[i], status: 'info-error', error: data.error };
        } else {
          newCards[i] = {
            ...newCards[i],
            status: 'ready',
            title: data.title || '',
            thumbnail: data.thumbnail || '',
            duration: data.duration,
            uploader: data.uploader || '',
            formats: data.formats || [],
            selectedFormatId: data.formats?.[0]?.id || null,
          };
        }
      } catch (err) {
        newCards[i] = { ...newCards[i], status: 'info-error', error: err.message };
      }
      setCards([...newCards]);
    }

    setLoading(false);
  };

  const dlCard = async (index) => {
    const c = cards[index];
    c.status = 'downloading';
    c.progress = 0;
    c.error = null;
    setCards([...cards]);

    try {
      const res = await fetch(`${API_BASE_URL}/api/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: c.url,
          format: format,
          format_id: c.selectedFormatId,
          title: c.title || '',
          cookies,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        c.status = 'error';
        c.error = data?.error || `Request failed (${res.status})`;
        setCards([...cards]);
        return;
      }

      if (data.error) {
        c.status = 'error';
        c.error = data.error;
        setCards([...cards]);
        return;
      }
      c.jobId = data.job_id;
      pollCard(index);
    } catch (err) {
      c.status = 'error';
      c.error = err.message;
      setCards([...cards]);
    }
  };

  const pollCard = (index) => {
    const c = cards[index];
    const iv = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/status/${c.jobId}`);
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          clearInterval(iv);
          c.status = 'error';
          c.error = data?.error || `Status check failed (${res.status})`;
          setCards([...cards]);
          return;
        }

        c.progress = data.progress || 0;
        if (data.status === 'done') {
          clearInterval(iv);
          c.status = 'done';
          c.filename = data.filename;
          setCards([...cards]);
          saveCard(index);
        } else if (data.status === 'error') {
          clearInterval(iv);
          c.status = 'error';
          c.error = data.error;
          setCards([...cards]);
        } else {
          setCards([...cards]);
        }
      } catch {
        clearInterval(iv);
        c.status = 'error';
        c.error = 'Lost connection to server';
        setCards([...cards]);
      }
    }, 1000);
  };

  const saveCard = (index) => {
    const c = cards[index];
    if (!c.jobId) return;
    const a = document.createElement('a');
    a.href = `${API_BASE_URL}/api/file/${c.jobId}`;
    a.download = c.filename || '';
    a.click();
  };

  return (
    <div className="tool-page">
      <div className="tool-container">
        <h1>Media Downloader</h1>

        <div style={{ marginBottom: '24px' }}>
          <textarea
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            placeholder="Paste one or more URLs..."
            rows="2"
            style={{
              width: '100%',
              padding: '18px 20px',
              border: '1.5px solid #e2ded6',
              borderRadius: '14px',
              background: '#fff',
              color: '#3a3a38',
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.88rem',
              outline: 'none',
              resize: 'none',
              minHeight: '56px',
              transition: 'border-color 0.25s, box-shadow 0.25s',
              marginBottom: '6px'
            }}
          />
          <p className="hint">Multiple links? Separate with spaces, commas, or newlines.</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', alignItems: 'center' }}>
          <div style={{
            display: 'flex',
            border: '1.5px solid #e2ded6',
            borderRadius: '10px',
            overflow: 'hidden',
            background: '#fff'
          }}>
            <button
              style={{
                padding: '9px 18px',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.76rem',
                border: 'none',
                background: format === 'video' ? '#3a3a38' : 'transparent',
                color: format === 'video' ? '#f4f1eb' : '#9c9889',
                cursor: 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.03em',
                textTransform: 'uppercase'
              }}
              onClick={() => setFormat('video')}
            >
              MP4
            </button>
            <button
              style={{
                padding: '9px 18px',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.76rem',
                border: 'none',
                background: format === 'audio' ? '#3a3a38' : 'transparent',
                color: format === 'audio' ? '#f4f1eb' : '#9c9889',
                cursor: 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.03em',
                textTransform: 'uppercase'
              }}
              onClick={() => setFormat('audio')}
            >
              MP3
            </button>
          </div>
          <button
            style={{
              flex: 1,
              padding: '10px 20px',
              border: 'none',
              borderRadius: '10px',
              background: '#222',
              color: '#fff',
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.82rem',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s, transform 0.1s',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              opacity: loading ? 0.5 : 1
            }}
            onClick={handleGo}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Fetch'}
          </button>
        </div>

        <div className="cards">
          {cards.map((card, index) => {
          if (card.status === 'loading') {
            return (
              <div className="card" key={index}>
                <div className="card-thumb loading"></div>
                <div className="card-body">
                  <div className="skeleton-line medium"></div>
                  <div className="skeleton-line short"></div>
                </div>
              </div>
            );
          }

          if (card.status === 'info-error') {
            return (
              <div className="card card-error" key={index}>
                <div className="card-thumb">
                  <div className="card-error-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                  </div>
                </div>
                <div className="card-body">
                  <div className="card-title" style={{color:'var(--error)'}}>Could not fetch video</div>
                  <div className="card-error-msg">{card.error}</div>
                  <div className="card-error-url">{card.url}</div>
                </div>
              </div>
            );
          }

          const isAudio = format === 'audio';
          let thumbHtml;
          if (isAudio) {
            thumbHtml = <div className="no-thumb" style={{color:'var(--accent)'}}>
              <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>;
          } else if (card.thumbnail) {
            thumbHtml = <img src={card.thumbnail} alt="" />;
          } else {
            thumbHtml = <div className="no-thumb">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="8" cy="8" r="1.5"/><path d="m21 15-5-5L5 21"/>
              </svg>
            </div>;
          }

          return (
            <div className="card" key={index}>
              <div className="card-thumb">{thumbHtml}</div>
              <div className="card-body">
                <div className="card-title">{card.title || 'Untitled'}</div>
                <div className="card-meta">
                  {card.uploader}{card.duration ? ` · ${Math.floor(card.duration / 60)}:${(card.duration % 60).toString().padStart(2, '0')}` : ''}
                </div>
                <div className="card-actions">
                  {card.status === 'ready' && (
                    <>
                      {!isAudio && card.formats?.length > 1 && (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', width: '100%', marginBottom: '6px' }}>
                          {card.formats.map((f) => (
                            <button
                              key={f.id}
                              className="card-dl-btn"
                              style={{
                                padding: '4px 10px',
                                background: f.id === card.selectedFormatId ? '#e85d2a' : '#ded9cf',
                                color: f.id === card.selectedFormatId ? '#fff' : '#3a3a38',
                                textTransform: 'none'
                              }}
                              onClick={() => pickFormat(index, f.id)}
                            >
                              {f.label}
                            </button>
                          ))}
                        </div>
                      )}
                      <button className="card-dl-btn" onClick={() => dlCard(index)}>
                        Download{!isAudio && card.formats?.length ? ` (${card.formats.find((f) => f.id === card.selectedFormatId)?.label || 'auto'})` : ''}
                      </button>
                    </>
                  )}
                  {card.status === 'downloading' && (
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${card.progress}%` }}></div>
                      </div>
                      <span className="card-status downloading">
                        <span className="spin"></span> {Math.round(card.progress)}% Downloading...
                      </span>
                    </div>
                  )}
                  {card.status === 'done' && (
                    <button className="card-dl-btn done" onClick={() => saveCard(index)}>Save</button>
                  )}
                  {card.status === 'error' && (
                    <div>
                      <button className="card-dl-btn" onClick={() => dlCard(index)}>Retry</button>
                      <span className="card-status error">{card.error}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
};

export default MediaDownloader;
