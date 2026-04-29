import React, { useState } from 'react';
import '../../styles/tool-page.css';
import '../../styles/unicode-converter.css';

// ==================== MAPPING TABLE (matches Python reference exactly) ====================

const UNICODE_TO_PREETI = {
  'अ': 'c',  'आ': 'cf', 'ा': 'f',
  'इ': 'O',  'ई': 'O{',
  'उ': 'p',  'ऊ': 'pm',
  'ए': 'P',  'ै': '}',
  'ो': 'f]', 'ौ': 'f}',
  'ओ': 'cf]','औ': 'cf}',
  'े': ']',
  'ि': 'l',  'ी': 'L',
  'ु': "'",  'ू': '"',
  'ृ': '[',
  'ं': '+',  'ँ': 'F',  'ः': 'M',
  'क': 's',  'ख': 'v',  'ग': 'u',  'घ': '3',  'ङ': 'ª',
  'च': 'r',  'छ': '5',  'ज': 'h',  'झ': '´',  'ञ': '`',
  'ट': '6',  'ठ': '7',  'ड': '8',  'ढ': '9',  'ण': '0f',
  'त': 't',  'थ': 'y',  'द': 'b',  'ध': 'w',  'न': 'g',
  'प': 'k',  'फ': 'km', 'ब': 'a',  'भ': 'e',  'म': 'd',
  'य': 'o',  'र': '/',  'ल': 'n',  'व': 'j',
  'श': 'z',  'ष': 'if', 'स': ';',  'ह': 'x',
  'ज्ञ': '1',
  '१': '!',  '२': '@',  '३': '#',  '४': '$',  '५': '%',
  '६': '^',  '७': '&',  '८': '*',  '९': '(',  '०': ')',
  '।': '.',  '्': '\\',
  '-': ' ',  '(': '-',  ')': '_',
};

const HALANT_UPPER_SET = new Set(['w','e','r','t','y','u','x','a','s','d','g','h','j','k','z','v','n']);

function normalizeUnicode(text) {
  const ch = [...text];
  let normalized = '';
  let i = 0;

  while (i < ch.length) {
    const c = ch[i];

    if (c !== 'र') {
      const n1 = ch[i + 1];
      const n2 = ch[i + 2];
      if (n1 === '्' && n2 !== undefined && n2 !== ' ' && n2 !== '।' && n2 !== ',') {
        if (n2 !== 'र') {
          const pv = UNICODE_TO_PREETI[c];
          if (pv !== undefined && HALANT_UPPER_SET.has(pv)) {
            normalized += pv.toUpperCase();
            i += 2;
            continue;
          } else if (c === 'स') {
            normalized += ':';
            i += 2;
            continue;
          } else if (c === 'ष') {
            normalized += 'i';
            i += 2;
            continue;
          }
        }
      }
    }

    if (c === '्' && ch[i + 1] === 'र' && ch[i - 1] !== 'र') {
      const prev = ch[i - 1];
      if (prev !== 'ट' && prev !== 'ठ' && prev !== 'ड') {
        normalized += '|';
      } else {
        normalized += '«';
      }
      i += 2;
      continue;
    }

    normalized += c;
    i++;
  }

  normalized = normalized.replace(/त\|/g, 'q');
  return normalized;
}

function convertUnicodeToPreeti(inputText) {
  const normalized = normalizeUnicode(inputText);
  const ch = [...normalized];
  let out = '';
  let i = 0;

  while (i < ch.length) {
    const c = ch[i];

    if (c === '\uFEFF') { i++; continue; }

    const n1 = ch[i + 1];
    const n2 = ch[i + 2];
    const n3 = ch[i + 3];

    if (n1 === 'ि') {
      if (c === 'q') {
        out += 'l' + c;
      } else {
        const pv = UNICODE_TO_PREETI[c];
        out += 'l' + (pv !== undefined ? pv : c);
      }
      i += 2;
      continue;
    }

    // ि two ahead after halant consonant: e.g. त्ति (uppercase halant + consonant + ि)
    if (n2 === 'ि' && 'WERTYUXASDGHJK:ZVN'.includes(c)) {
      if (n1 !== 'q') {
        const pv = UNICODE_TO_PREETI[n1];
        out += 'l' + c + (pv !== undefined ? pv : n1);
      } else {
        out += 'l' + c + n1;
      }
      i += 3;
      continue;
    }

    // ि two ahead after | or « marker: e.g. क्रि → s|ि → ls|
    if ((n1 === '|' || n1 === '«') && n2 === 'ि') {
      const pv = UNICODE_TO_PREETI[c];
      out += 'l' + (pv !== undefined ? pv : c) + n1;
      i += 3;
      continue;
    }

    if (c === 'र' && n1 === '्' && n2 !== undefined) {
      if (n3 === 'ा' || n3 === 'ो' || n3 === 'ौ' || n3 === 'े' || n3 === 'ै' || n3 === 'ी') {
        const p2 = UNICODE_TO_PREETI[n2] ?? n2;
        const p3 = UNICODE_TO_PREETI[n3] ?? n3;
        out += p2 + p3 + '{';
        i += 4;
        continue;
      } else if (n3 === 'ि') {
        const p2 = UNICODE_TO_PREETI[n2] ?? n2;
        out += 'l' + p2 + '{';
        i += 4;
        continue;
      }
      const p2 = UNICODE_TO_PREETI[n2] ?? n2;
      out += p2 + '{';
      i += 3;
      continue;
    }

    if (n3 === 'ि' && (n2 === '|' || n2 === '«') && 'WERTYUXASDGHJK:ZVNIi'.includes(c)) {
      const p1 = UNICODE_TO_PREETI[n1] ?? n1;
      out += 'l' + c + p1 + n2;
      i += 4;
      continue;
    }

    const pv = UNICODE_TO_PREETI[c];
    out += pv !== undefined ? pv : c;
    i++;
  }

  out = out.replace(/Si/g,    'I');
  out = out.replace(/H`/g,    '1');
  out = out.replace(/b\\w/g,  '4');
  out = out.replace(/z\|/g,   '>');
  out = out.replace(/\/'/g,   '?');
  out = out.replace(/\/"/g,   '¿');
  out = out.replace(/Tt/g,    'Q');
  out = out.replace(/b\\lj/g, 'lå');
  out = out.replace(/b\\j/g,  'å');
  out = out.replace(/0f\\/g,  '0');
  out = out.replace(/`\\/g,   '~');

  return out;
}

export const UnicodeToPreetiConverter = () => {
  const [unicodeText, setUnicodeText] = useState('');
  const [preetiText, setPreetiText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    setPreetiText(convertUnicodeToPreeti(unicodeText));
  };

  const handleCopy = () => {
    if (!preetiText) return;
    navigator.clipboard.writeText(preetiText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadSample = () => {
    const sample = `इन्धनको मूल्य बढेसँगै यातायात व्यवस्था विभागले पुनः सार्वजनिक यातायातको भाडा वृद्धि गरेको छ।
विभागका अनुसार अन्तरप्रदेश सञ्चालन हुने सवारीसाधनमा लागु हुने गरी आज बुधबारदेखि नयाँ भाडादर कार्यान्वयनमा आएको छ।
विभागले अन्तरप्रदेश यात्रुवाहक सवारी, पहाडी मार्गमा र तथा तराई क्षेत्रमा सञ्चालन हुने मालवाहक सवारीमा समान रूपमा ५–५ प्रतिशतले भाडा बढाएको उल्लेख गरेको छ।
यसअघि चैत २५ गते पनि भाडा समायोजन गरिएको थियो।
भौतिक पूर्वाधार तथा यातायात मन्त्रालयले भाडा वृद्धिका लागि १२ वैशाखमा सहमति दिएको थियो। 
विद्युतीय सवारीसाधनमा भने भाडा वृद्धि गर्न नपाइने र यस्तो गरिएमा कारबाही गरिने चेतावनी पनि दिइएको छ।`;
    setUnicodeText(sample);
    setPreetiText(convertUnicodeToPreeti(sample));
  };

  const handleClear = () => {
    setUnicodeText('');
    setPreetiText('');
  };

  return (
    <div className="tool-page">
      <div className="tool-container">
        <h1>Unicode to Preeti Converter</h1>
        <p className="tool-description">Improved to match shresthasushil.com.np</p>

        <div className="converter-wrapper">
          <div className="panel">
            <div className="panel-head">
              <span>Unicode Input</span>
              <span className="char-count">{[...unicodeText].length} chars</span>
            </div>
            <textarea
              value={unicodeText}
              onChange={(e) => setUnicodeText(e.target.value)}
              placeholder="Paste Unicode Nepali text here..."
              className="panel-textarea"
            />
            <div className="panel-foot">
              <button className="btn-sm" onClick={handleLoadSample}>Load Sample Text</button>
              <button className="btn-sm" onClick={handleClear}>Clear</button>
            </div>
          </div>

          <div className="converter-buttons">
            <button className="convert-btn-large" onClick={handleConvert}>
              Convert →
            </button>
          </div>

          <div className="panel">
            <div className="panel-head">
              <span>Preeti Output</span>
              {preetiText && (
                <button className="btn-sm" onClick={handleCopy}>
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              )}
            </div>
            <textarea
              value={preetiText}
              readOnly
              placeholder="Preeti output will appear here..."
              className="panel-textarea output"
            />
          </div>
        </div>
      </div>
    </div>
  );
};