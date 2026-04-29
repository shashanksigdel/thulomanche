import React, { useState } from 'react';
import '../../styles/tool-page.css';
import '../../styles/unicode-converter.css';

export const UnicodeToPreetiConverter = () => {
  const [unicodeText, setUnicodeText] = useState('');
  const [preetiText, setPreetiText] = useState('');
  const [copied, setCopied] = useState(false);

  // Unicode to Preeti conversion mapping
  const CONSONANTS = {
    'क':'s','ख':'v','ग':'u','घ':'3','ङ':'ª',
    'च':'r','छ':'5','ज':'h','झ':'em','ञ':'~',
    'ट':'6','ठ':'7','ड':'8','ढ':'9','ण':';',
    'त':'t','थ':'y','द':'b','ध':'w','न':'g',
    'प':'k','फ':'km','ब':'a','भ':'e','म':'d',
    'य':'o','र':'/','ल':'n','व':'j','श':'z',
    'ष':'if','स':'s','ह':'x',
  };

  const VOWELS = {
    'अ':'c','आ':'cfv','इ':'bf','ई':'wf',
    'उ':'@','ऊ':'Ö','ए':'P','ऐ':'Psf',
    'ओ':'cf]','औ':'cfp','ऋ':'¿',
  };

  const VOWEL_MARKS = {
    'ा':'f',
    'ि':'i',
    'ी':'L',
    'ु':'@',
    'ू':'Ö',
    'े':']',
    'ै':'s',
    'ो':'f]',
    'ौ':'fp',
    'ृ':'[',
  };

  const SPECIALS = {
    'ं':'',
    'ः':',',
    'ँ':'F',
    '्':'-',
    'ऽ':'&',
    '।':'.',
    '॥':'..',
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
      if (SPECIALS[c] !== undefined) { result += SPECIALS[c]; i++; continue; }
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
    const sample = 'नमस्ते\nमेरो नाम राम हो।\nकाठमाडौं नेपालको राजधानी हो।';
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
              placeholder="यहाँ नेपाली टाइप गर्नुहोस् वा टाँस्नुहोस्…"
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
