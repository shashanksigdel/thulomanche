import React, { useState } from 'react';
import '../../styles/tool-page.css';
import '../../styles/unicode-converter.css';

export const UnicodeToPreetiConverter = () => {
  const [unicodeText, setUnicodeText] = useState('');
  const [preetiText, setPreetiText] = useState('');
  const [copied, setCopied] = useState(false);

  // Correct mappings from the proper Preeti engine
  const CONSONANTS = {
    'क': 'k',
    'ख': 'v',
    'ग': 'u',
    'घ': 'Ô',
    'ङ': 'ª',
    'च': 'r',
    'छ': 'R',
    'ज': 'h',
    'झ': 'em',
    'ञ': '~',
    'ट': '{',
    'ठ': '}',
    'ड': 'M',
    'ढ': 'N',
    'ण': 'K',
    'त': 't',
    'थ': 'y',
    'द': 'b',
    'ध': 'w',
    'न': 'g',
    'प': 'k',
    'फ': 'km',
    'ब': 'a',
    'भ': 'e',
    'म': 'd',
    'य': 'o',
    'र': 'r',
    'ल': 'n',
    'व': 'j',
    'श': 'z',
    'ष': 'if',
    'स': 's',
    'ह': 'x',
  };

  const VOWELS = {
    'अ': 'c',
    'आ': 'cf',
    'इ': 'b',
    'ई': 'O',
    'उ': 'pf',
    'ऊ': 'Q',
    'ए': 'P',
    'ऐ': 'P',
    'ओ': 'cf]',
    'औ': 'cfO',
    'ऋ': '_',
    'ॠ': '_',
    'अं': 'c+',
    'अः': 'cM',
  };

  const VOWEL_MARKS = {
    'ा': 'f',
    'ि': 'f',
    'ी': 'L',
    'ु': 'M',
    'ू': 'N',
    'े': 'e',
    'ै': 'O',
    'ो': 'f]',
    'ौ': 'fO',
    'ृ': '[',
    'ॅ': 'y',
  };

  const SPECIALS = {
    'ं': '+',
    'ः': 'M',
    'ँ': 'F',
    '्': '',
    'ऽ': '&',
    '।': '.',
    '॥': '..',
    '\u200c': '',
    '\u200d': '',
  };

  const DIGITS = {
    '०':'0','१':'1','२':'2','३':'3','४':'4',
    '५':'5','६':'6','७':'7','८':'8','९':'9',
  };

  const convertUnicodeToPreeti = (text) => {
    const chars = [...text];
    let result = '';
    let i = 0;

    while (i < chars.length) {
      const c = chars[i];

      if (c === '\n' || c === '\r' || c === ' ' || c === '\t') {
        result += c; i++; continue;
      }

      if (c === '\u200d' || c === '\u200c') { i++; continue; }

      if (DIGITS[c] !== undefined) { result += DIGITS[c]; i++; continue; }
      if (SPECIALS[c] !== undefined && c !== '्') { result += SPECIALS[c]; i++; continue; }
      if (VOWELS[c] !== undefined) { result += VOWELS[c]; i++; continue; }
      if (c.charCodeAt(0) < 128) { result += c; i++; continue; }

      if (CONSONANTS[c] !== undefined) {
        const base = CONSONANTS[c];
        const next = chars[i + 1];

        if (next === 'ि') {
          result += 'f' + base;
          i += 2;
          continue;
        }

        result += base;
        i++;
        const vm = chars[i];
        if (vm && VOWEL_MARKS[vm] !== undefined && vm !== 'ि') {
          result += VOWEL_MARKS[vm];
          i++;
        }
        continue;
      }

      result += c;
      i++;
    }

    return result;
  };

  const handleConvert = () => {
    const converted = convertUnicodeToPreeti(unicodeText);
    setPreetiText(converted);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(preetiText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadSample = () => {
    const sample =
      'नमस्ते\n' +
      'मेरो नाम राम हो।\n' +
      'काठमाडौं नेपालको राजधानी हो।\n' +
      'नेपाल एक सुन्दर देश हो।\n' +
      'हिमालय विश्वकै उच्च पर्वत हो।\n' +
      'राष्ट्रिय झण्डा रातो, नीलो र सेतो रङको छ।';
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
        <h1>Unicode to Preeti</h1>
        <p className="tool-description">Convert Nepali Unicode text to Preeti font encoding</p>

        <div className="converter-wrapper">
          <div className="panel">
            <div className="panel-head">
              <span>Unicode Input</span>
              <span className="char-count">{unicodeText.length} chars</span>
            </div>
            <textarea
              value={unicodeText}
              onChange={(e) => setUnicodeText(e.target.value)}
              placeholder="यहाँ युनिकोड नेपाली टाइप गर्नुहोस् वा टाँस्नुहोस्…&#10;&#10;उदाहरण: नमस्ते नेपाल"
              className="panel-textarea"
            />
            <div className="panel-foot">
              <button className="btn-sm" onClick={handleLoadSample}>Load sample</button>
              <button className="btn-sm" onClick={handleClear}>Clear</button>
            </div>
          </div>

          <div className="converter-buttons">
            <button className="convert-btn-large" onClick={handleConvert}>
              <span>→</span>
              Convert
            </button>
          </div>

          <div className="panel">
            <div className="panel-head">
              <span>Preeti Output</span>
              {preetiText && <button className="btn-sm" onClick={handleCopy}>{copied ? '✓ Copied' : 'Copy'}</button>}
            </div>
            <textarea
              value={preetiText}
              readOnly
              placeholder="Converted Preeti text will appear here…"
              className="panel-textarea output"
            />
            <div className="panel-foot">
              <span style={{ fontSize: '11px', color: '#999' }}>Apply Preeti font when pasting</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
