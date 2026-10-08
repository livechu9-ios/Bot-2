// ==================== CẤU HÌNH ====================
const REQUIRED_FILENAME = 'assetindexer.H5ak1JM1Eck~2FxRcJrEp~2FMzeuqmY~3D';

// ==================== TRẠNG THÁI ====================
let fileBytes = null;
let fileBytesBackup = null;
let currentFileName = '';
let modified = false;
let step = 'idle';
let bones = {};
let pendingAction = null;

// ==================== DOM ====================
const chatBody   = document.getElementById('chatBody');
const chatInput  = document.getElementById('chatInput');
const btnSend    = document.getElementById('btnSend');
const fileInput  = document.getElementById('fileInputChat');

// ==================== TIỆN ÍCH ====================
function scrollBottom() { chatBody.scrollTop = chatBody.scrollHeight; }
function addMsg(text, who = 'bot') {
  const div = document.createElement('div');
  div.className = 'msg ' + who;
  div.innerHTML = text;
  chatBody.appendChild(div);
  scrollBottom();
  return div;
}
function addTyping() {
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.innerHTML = '<span class="typing"><span></span><span></span><span></span></span>';
  chatBody.appendChild(div);
  scrollBottom();
  return div;
}
function botSay(text, delay = 400) {
  const t = addTyping();
  return new Promise(resolve => {
    setTimeout(() => { t.remove(); addMsg(text, 'bot'); resolve(); }, delay);
  });
}
function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ==================== MD5 ====================
function md5(input) {
  function safeAdd(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }
  function bitRotateLeft(num, cnt) { return (num << cnt) | (num >>> (32 - cnt)); }
  function md5cmn(q, a, b, x, s, t) { return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b); }
  function md5ff(a, b, c, d, x, s, t) { return md5cmn((b & c) | (~b & d), a, b, x, s, t); }
  function md5gg(a, b, c, d, x, s, t) { return md5cmn((b & d) | (c & ~d), a, b, x, s, t); }
  function md5hh(a, b, c, d, x, s, t) { return md5cmn(b ^ c ^ d, a, b, x, s, t); }
  function md5ii(a, b, c, d, x, s, t) { return md5cmn(c ^ (b | ~d), a, b, x, s, t); }
  function binlMD5(x, len) {
    x[len >> 5] |= 0x80 << (len % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    var i, olda, oldb, oldc, oldd;
    var a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
    for (i = 0; i < x.length; i += 16) {
      olda = a; oldb = b; oldc = c; oldd = d;
      a = md5ff(a, b, c, d, x[i], 7, -680876936);
      d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
      b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = md5gg(b, c, d, a, x[i], 20, -373897302);
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
      a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
      d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = md5hh(d, a, b, c, x[i], 11, -358537222);
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
      a = md5ii(a, b, c, d, x[i], 6, -198630844);
      d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
      a = safeAdd(a, olda); b = safeAdd(b, oldb);
      c = safeAdd(c, oldc); d = safeAdd(d, oldd);
    }
    return [a, b, c, d];
  }
  function binl2rstr(input) {
    var i, output = '';
    var length32 = input.length * 32;
    for (i = 0; i < length32; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
    }
    return output;
  }
  function rstr2binl(input) {
    var i, output = [];
    output[(input.length >> 2) - 1] = undefined;
    for (i = 0; i < output.length; i += 1) output[i] = 0;
    var length8 = input.length * 8;
    for (i = 0; i < length8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
    }
    return output;
  }
  function rstrMD5(s) { return binl2rstr(binlMD5(rstr2binl(s), s.length * 8)); }
  function rstr2hex(input) {
    var hexTab = '0123456789abcdef', output = '', x, i;
    for (i = 0; i < input.length; i += 1) {
      x = input.charCodeAt(i);
      output += hexTab.charAt((x >>> 4) & 0x0F) + hexTab.charAt(x & 0x0F);
    }
    return output;
  }
  function str2rstrUTF8(input) { return unescape(encodeURIComponent(input)); }
  return rstr2hex(rstrMD5(str2rstrUTF8(input)));
}
function md5Bytes(bytes) {
  var s = '';
  var chunk = 8192;
  for (var i = 0; i < bytes.length; i += chunk) {
    s += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + chunk, bytes.length)));
  }
  return md5(s);
}

// ==================== ĐỌC FLOAT ====================
function readFloat32(bytes, offset) {
  const view = new DataView(bytes.buffer, bytes.byteOffset + offset, 4);
  return view.getFloat32(0, true);
}
function writeFloat32(bytes, offset, value) {
  const view = new DataView(bytes.buffer, bytes.byteOffset + offset, 4);
  view.setFloat32(0, value, true);
}

// ==================== PARSE BONE ====================
function parseBinary(bytes) {
  bones = {};
  const data = bytes;
  const len = data.length;
  const decoder = new TextDecoder('utf-8');
  let pos = 0;
  while (pos < len - 30) {
    if (data[pos] === 0x62 && data[pos+1] === 0x6F &&
        data[pos+2] === 0x6E && data[pos+3] === 0x65 &&
        data[pos+4] === 0x5F) {
      let end = pos + 5;
      while (end < len && data[end] !== 0) end++;
      const name = decoder.decode(data.subarray(pos, end));
      if (name.length > 5 && !bones[name]) {
        const startSearch = Math.max(0, pos - 100);
        const endSearch = Math.min(len - 24, pos + 100);
        for (let offset = startSearch; offset < endSearch; offset++) {
          try {
            const x = readFloat32(data, offset);
            const y = readFloat32(data, offset + 4);
            const z = readFloat32(data, offset + 8);
            if (x > -10 && x < 10 && y > -10 && y < 10 && z > -10 && z < 10) {
              let scaleOff = null;
              let scale = [1, 1, 1];
              for (let sOff = offset + 12; sOff < offset + 40; sOff += 4) {
                if (sOff + 12 <= len) {
                  try {
                    const sx = readFloat32(data, sOff);
                    const sy = readFloat32(data, sOff + 4);
                    const sz = readFloat32(data, sOff + 8);
                    if (sx > 0.01 && sx < 100 && sy > 0.01 && sy < 100 && sz > 0.01 && sz < 100) {
                      scaleOff = sOff;
                      scale = [sx, sy, sz];
                      break;
                    }
                  } catch (e) {}
                }
              }
              bones[name] = { name, posOffset: offset, scaleOffset: scaleOff, position: [x, y, z], scale };
              break;
            }
          } catch (e) {}
        }
      }
      pos = end;
    } else { pos++; }
  }
  return Object.keys(bones).length;
}

// ==================== SCALE / MOVE ====================
function scaleBone(name, sx, sy, sz) {
  if (!bones[name]) return false;
  const b = bones[name];
  if (b.scaleOffset === null || b.scaleOffset + 12 > fileBytes.length) return false;
  writeFloat32(fileBytes, b.scaleOffset,     readFloat32(fileBytes, b.scaleOffset) * sx);
  writeFloat32(fileBytes, b.scaleOffset + 4, readFloat32(fileBytes, b.scaleOffset + 4) * sy);
  writeFloat32(fileBytes, b.scaleOffset + 8, readFloat32(fileBytes, b.scaleOffset + 8) * sz);
  return true;
}
function moveBone(name, dx, dy, dz) {
  if (!bones[name]) return false;
  const b = bones[name];
  if (b.posOffset === null || b.posOffset + 12 > fileBytes.length) return false;
  writeFloat32(fileBytes, b.posOffset,     readFloat32(fileBytes, b.posOffset) + dx);
  writeFloat32(fileBytes, b.posOffset + 4, readFloat32(fileBytes, b.posOffset + 4) + dy);
  writeFloat32(fileBytes, b.posOffset + 8, readFloat32(fileBytes, b.posOffset + 8) + dz);
  return true;
}
function scaleBonesMatch(keywords, sx, sy, sz, exclude) {
  let n = 0;
  for (const name in bones) {
    const ln = name.toLowerCase();
    if (keywords.some(k => ln.includes(k.toLowerCase()))) {
      if (exclude && exclude.some(e => ln.includes(e.toLowerCase()))) continue;
      if (scaleBone(name, sx, sy, sz)) n++;
    }
  }
  return n;
}
function moveBonesMatch(keywords, dx, dy, dz, exclude) {
  let n = 0;
  for (const name in bones) {
    const ln = name.toLowerCase();
    if (keywords.some(k => ln.includes(k.toLowerCase()))) {
      if (exclude && exclude.some(e => ln.includes(e.toLowerCase()))) continue;
      if (moveBone(name, dx, dy, dz)) n++;
    }
  }
  return n;
}
// Scale từng trục cho khớp keyword
function scaleBonesAxis(keywords, sx, sy, sz, exclude) {
  let n = 0;
  for (const name in bones) {
    const ln = name.toLowerCase();
    if (keywords.some(k => ln.includes(k.toLowerCase()))) {
      if (exclude && exclude.some(e => ln.includes(e.toLowerCase()))) continue;
      if (scaleBone(name, sx, sy, sz)) n++;
    }
  }
  return n;
}

// ==================== RNG ====================
function makeRng(seed) {
  let s = (seed >>> 0) || 1;
  return function() { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

// ==================== CHECKSUM ====================
function fixChecksum() {
  const cabPattern = [0x43, 0x41, 0x42, 0x2D];
  let cabPos = -1;
  for (let i = 0; i < fileBytes.length - 4; i++) {
    if (fileBytes[i] === cabPattern[0] && fileBytes[i+1] === cabPattern[1] &&
        fileBytes[i+2] === cabPattern[2] && fileBytes[i+3] === cabPattern[3]) {
      cabPos = i; break;
    }
  }
  if (cabPos === -1) return null;
  const start = cabPos + 4;
  const end = start + 32;
  if (end > fileBytes.length) return null;
  for (let i = start; i < end; i++) fileBytes[i] = 0x30;
  const hash = md5Bytes(fileBytes).toUpperCase();
  const hashBytes = new TextEncoder().encode(hash);
  for (let i = 0; i < 32 && i < hashBytes.length; i++) fileBytes[start + i] = hashBytes[i];
  return hash;
}

// ==================== XUẤT FILE ====================
async function downloadFile(useBackup = false) {
  const bytes = useBackup ? fileBytesBackup : fileBytes;
  if (!bytes) { addMsg('Khong co du lieu de chia se', 'err'); return; }
  if (!useBackup) fixChecksum();
  const blob = new Blob([bytes], { type: 'application/octet-stream' });
  const file = new File([blob], currentFileName, { type: 'application/octet-stream' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'UMA Asset da chinh', text: currentFileName });
      addMsg('Da chia se file: <b>' + esc(currentFileName) + '</b>', 'sys');
    } catch (err) {
      if (err.name === 'AbortError') addMsg('Ban da huy chia se', 'sys');
      else { addMsg('Share loi, dung cach tai thuong', 'sys'); fallbackDownload(bytes); }
    }
    return;
  }
  fallbackDownload(bytes);
}
function fallbackDownload(bytes) {
  const blob = new Blob([bytes], { type: 'application/octet-stream' });
  const reader = new FileReader();
  reader.onload = function() {
    const link = document.getElementById('downloadLink');
    link.href = reader.result;
    link.download = currentFileName;
    link.click();
    addMsg('Da tai file: <b>' + esc(currentFileName) + '</b>', 'sys');
  };
  reader.readAsDataURL(blob);
}

// ==================== DANH SÁCH CHỨC NĂNG ====================
const ACTIONS = {
  // ===== ĐẦU (HEAD) =====
  dauto:        { label: 'Dau to',              group: 'head', unit: 'scale' },
  daunho:       { label: 'Dau nho',             group: 'head', unit: 'scale' },
  daudai:       { label: 'Dau dai',             group: 'head', unit: 'scale' },
  daungan:      { label: 'Dau ngan',            group: 'head', unit: 'scale' },
  daurong:      { label: 'Dau rong ngang',      group: 'head', unit: 'scale' },
  daumong:      { label: 'Dau mong',            group: 'head', unit: 'scale' },
  dautrai:      { label: 'Dau nghieng trai',    group: 'head', unit: 'move'  },
  dauphai:      { label: 'Dau nghieng phai',    group: 'head', unit: 'move'  },
  daucui:       { label: 'Dau cui xuong',       group: 'head', unit: 'move'  },
  daungua:      { label: 'Dau ngua len',        group: 'head', unit: 'move'  },
  daumep:       { label: 'Dau mep (bep)',       group: 'head', unit: 'scale' },
  dauguong:     { label: 'Dau guong (doc)',     group: 'head', unit: 'scale' },
  matmeo:       { label: 'Mat meo',             group: 'head', unit: 'scale' },
  matxo:        { label: 'Mat xoay',            group: 'head', unit: 'scale' },
  co_dai:       { label: 'Co dai',              group: 'head', unit: 'scale' },
  co_ngan:      { label: 'Co ngan',             group: 'head', unit: 'scale' },
  co_to:        { label: 'Co to',               group: 'head', unit: 'scale' },
  co_nho:       { label: 'Co nho',              group: 'head', unit: 'scale' },
  co_veo_trai:  { label: 'Co veo trai',         group: 'head', unit: 'move'  },
  co_veo_phai:  { label: 'Co veo phai',         group: 'head', unit: 'move'  },

  // ===== CÁNH TAY (ARM) =====
  tayto:        { label: 'Tay to (2 ben)',      group: 'arm', unit: 'scale' },
  taynho:       { label: 'Tay nho (2 ben)',     group: 'arm', unit: 'scale' },
  taydai:       { label: 'Tay dai',             group: 'arm', unit: 'scale' },
  tayngan:      { label: 'Tay ngan',            group: 'arm', unit: 'scale' },
  tayphai_to:   { label: 'Tay phai to',         group: 'arm', unit: 'scale' },
  taytrai_to:   { label: 'Tay trai to',         group: 'arm', unit: 'scale' },
  tayphai_dai:  { label: 'Tay phai dai',        group: 'arm', unit: 'scale' },
  taytrai_dai:  { label: 'Tay trai dai',        group: 'arm', unit: 'scale' },
  tayphai_ngan: { label: 'Tay phai ngan',       group: 'arm', unit: 'scale' },
  taytrai_ngan: { label: 'Tay trai ngan',       group: 'arm', unit: 'scale' },
  tayphai_veo:  { label: 'Tay phai veo',        group: 'arm', unit: 'move'  },
  taytrai_veo:  { label: 'Tay trai veo',        group: 'arm', unit: 'move'  },
  fore_to:      { label: 'Cang tay to',         group: 'arm', unit: 'scale' },
  fore_nho:     { label: 'Cang tay nho',        group: 'arm', unit: 'scale' },
  fore_dai:     { label: 'Cang tay dai',        group: 'arm', unit: 'scale' },
  fore_ngan:    { label: 'Cang tay ngan',       group: 'arm', unit: 'scale' },
  ban_tay_to:   { label: 'Ban tay to',          group: 'arm', unit: 'scale' },
  ban_tay_nho:  { label: 'Ban tay nho',         group: 'arm', unit: 'scale' },
  ban_tay_dai:  { label: 'Ban tay dai',         group: 'arm', unit: 'scale' },
  ban_tay_rong: { label: 'Ban tay rong',        group: 'arm', unit: 'scale' },
  ngon_to:      { label: 'Ngon tay to',         group: 'arm', unit: 'scale' },
  ngon_dai:     { label: 'Ngon tay dai',        group: 'arm', unit: 'scale' },
  vai_to:       { label: 'Vai to',              group: 'arm', unit: 'scale' },
  vai_rong:     { label: 'Vai rong',            group: 'arm', unit: 'scale' },
  vai_cao:      { label: 'Vai cao',             group: 'arm', unit: 'move'  },
  vai_thap:     { label: 'Vai thap',            group: 'arm', unit: 'move'  },
  khuyu_to:     { label: 'Khuyu tay to',        group: 'arm', unit: 'scale' },

  // ===== THÂN (BODY) =====
  than_to:      { label: 'Than to',             group: 'body', unit: 'scale' },
  than_nho:     { label: 'Than nho',            group: 'body', unit: 'scale' },
  than_dai:     { label: 'Than dai',            group: 'body', unit: 'scale' },
  than_ngan:    { label: 'Than ngan',           group: 'body', unit: 'scale' },
  than_rong:    { label: 'Than rong',           group: 'body', unit: 'scale' },
  than_mong:    { label: 'Than mong',           group: 'body', unit: 'scale' },
  lung_to:      { label: 'Lung to',             group: 'body', unit: 'scale' },
  lung_gu:      { label: 'Lung gu',             group: 'body', unit: 'move'  },
  lung_thang:   { label: 'Lung thang',          group: 'body', unit: 'move'  },
  nguc_to:      { label: 'Nguc to',             group: 'body', unit: 'scale' },
  nguc_nho:     { label: 'Nguc nho',            group: 'body', unit: 'scale' },
  nguc_rong:    { label: 'Nguc rong',           group: 'body', unit: 'scale' },
  bung_to:      { label: 'Bung to',             group: 'body', unit: 'scale' },
  bung_phe:     { label: 'Bung phe',            group: 'body', unit: 'scale' },
  bung_thon:    { label: 'Bung thon',           group: 'body', unit: 'scale' },
  hong_to:      { label: 'Hong to',             group: 'body', unit: 'scale' },
  hong_nho:     { label: 'Hong nho',            group: 'body', unit: 'scale' },
  hong_rong:    { label: 'Hong rong',           group: 'body', unit: 'scale' },
  eo_thon:      { label: 'Eo thon',             group: 'body', unit: 'scale' },
  cot_song_cong:{ label: 'Cot song cong',       group: 'body', unit: 'move'  },
  cot_song_xoan:{ label: 'Cot song xoan',       group: 'body', unit: 'move'  },
  nghieng_nguoi:{ label: 'Nghieng nguoi',       group: 'body', unit: 'move'  },
  cui_nguoi:    { label: 'Cui nguoi',           group: 'body', unit: 'move'  },
  ngua_nguoi:   { label: 'Ngua nguoi',          group: 'body', unit: 'move'  },

  // ===== CÁNH (WING) =====
  canh_to:      { label: 'Canh to',             group: 'wing', unit: 'scale' },
  canh_nho:     { label: 'Canh nho',            group: 'wing', unit: 'scale' },
  canh_dai:     { label: 'Canh dai',            group: 'wing', unit: 'scale' },
  canh_ngan:    { label: 'Canh ngan',           group: 'wing', unit: 'scale' },
  canh_rong:    { label: 'Canh rong',           group: 'wing', unit: 'scale' },
  canh_mong:    { label: 'Canh mong',           group: 'wing', unit: 'scale' },
  canh_phai_to: { label: 'Canh phai to',        group: 'wing', unit: 'scale' },
  canh_trai_to: { label: 'Canh trai to',        group: 'wing', unit: 'scale' },
  canh_phai_dai:{ label: 'Canh phai dai',       group: 'wing', unit: 'scale' },
  canh_trai_dai:{ label: 'Canh trai dai',       group: 'wing', unit: 'scale' },
  canh_xoe:     { label: 'Canh xoe',            group: 'wing', unit: 'scale' },
  canh_cup:     { label: 'Canh cup',            group: 'wing', unit: 'scale' },
  canh_vong:    { label: 'Canh vong len',       group: 'wing', unit: 'move'  },
  canh_xuong:   { label: 'Canh xuong',          group: 'wing', unit: 'move'  },
  long_canh_to: { label: 'Long canh to',        group: 'wing', unit: 'scale' },
  long_canh_dai:{ label: 'Long canh dai',       group: 'wing', unit: 'scale' },
  duoi_to:      { label: 'Duoi to',             group: 'wing', unit: 'scale' },
  duoi_dai:     { label: 'Duoi dai',            group: 'wing', unit: 'scale' },
  duoi_xoe:     { label: 'Duoi xoe',            group: 'wing', unit: 'scale' },
  duoi_cup:     { label: 'Duoi cup',            group: 'wing', unit: 'scale' },

  // ===== CHÂN (LEG) =====
  chanto:       { label: 'Chan to (2 ben)',     group: 'leg', unit: 'scale' },
  channho:      { label: 'Chan nho (2 ben)',    group: 'leg', unit: 'scale' },
  chandai:      { label: 'Chan dai',            group: 'leg', unit: 'scale' },
  channgan:     { label: 'Chan ngan',           group: 'leg', unit: 'scale' },
  chanphai_to:  { label: 'Chan phai to',        group: 'leg', unit: 'scale' },
  chantrai_to:  { label: 'Chan trai to',        group: 'leg', unit: 'scale' },
  chanphai_dai: { label: 'Chan phai dai',       group: 'leg', unit: 'scale' },
  chantrai_dai: { label: 'Chan trai dai',       group: 'leg', unit: 'scale' },
  chanphai_ngan:{ label: 'Chan phai ngan',      group: 'leg', unit: 'scale' },
  chantrai_ngan:{ label: 'Chan trai ngan',      group: 'leg', unit: 'scale' },
  chanphai_veo: { label: 'Chan phai veo',       group: 'leg', unit: 'move'  },
  chantrai_veo: { label: 'Chan trai veo',       group: 'leg', unit: 'move'  },
  dui_to:       { label: 'Dui to',              group: 'leg', unit: 'scale' },
  dui_nho:      { label: 'Dui nho',             group: 'leg', unit: 'scale' },
  dui_dai:      { label: 'Dui dai',             group: 'leg', unit: 'scale' },
  dui_ngan:     { label: 'Dui ngan',            group: 'leg', unit: 'scale' },
  bap_chan_to:  { label: 'Bap chan to',         group: 'leg', unit: 'scale' },
  bap_chan_nho: { label: 'Bap chan nho',        group: 'leg', unit: 'scale' },
  bap_chan_dai: { label: 'Bap chan dai',        group: 'leg', unit: 'scale' },
  ban_chan_to:  { label: 'Ban chan to',         group: 'leg', unit: 'scale' },
  ban_chan_nho: { label: 'Ban chan nho',        group: 'leg', unit: 'scale' },
  ban_chan_dai: { label: 'Ban chan dai',        group: 'leg', unit: 'scale' },
  ban_chan_rong:{ label: 'Ban chan rong',       group: 'leg', unit: 'scale' },
  ngon_chan_to: { label: 'Ngon chan to',        group: 'leg', unit: 'scale' },
  ngon_chan_dai:{ label: 'Ngon chan dai',       group: 'leg', unit: 'scale' },
  goi_to:       { label: 'Goi to',              group: 'leg', unit: 'scale' },
  co_chan_to:   { label: 'Co chan to',          group: 'leg', unit: 'scale' },
  khuyu_chan_to:{ label: 'Khuyu chan to',       group: 'leg', unit: 'scale' },

  // ===== BIẾN DẠNG TỔNG HỢP =====
  phinh:        { label: 'Phinh toan than',     group: 'combo', unit: 'scale' },
  teo:          { label: 'Teo toan than',       group: 'combo', unit: 'scale' },
  tihon:        { label: 'Ti hon',              group: 'combo', unit: 'scale' },
  khonglo:      { label: 'Khong lo',            group: 'combo', unit: 'scale' },
  nguennhen:    { label: 'Nguoi nhen',          group: 'combo', unit: 'scale' },
  quecui:       { label: 'Que cui',             group: 'combo', unit: 'scale' },
  dautothan:    { label: 'Dau to than nho',     group: 'combo', unit: 'scale' },
  taydaichan:   { label: 'Tay dai chan ngan',   group: 'combo', unit: 'scale' },
  chanvoi:      { label: 'Chan voi',            group: 'combo', unit: 'scale' },
  daqua:        { label: 'Dau qua kho',         group: 'combo', unit: 'scale' },
  reset:        { label: 'Reset ve goc',        group: 'combo', unit: 'none'  },
  randomall:    { label: 'Random toan bo',      group: 'combo', unit: 'seed'  },
  invert:       { label: 'Lat nguoc scale',     group: 'combo', unit: 'none'  }
};

const GROUP_INFO = {
  head:  { title: 'DAU - CO - MAT',   cls: 'head' },
  arm:   { title: 'CANH TAY',         cls: 'arm' },
  body:  { title: 'THAN NGUOI',       cls: 'body' },
  wing:  { title: 'CANH - DUOI',      cls: 'wing' },
  leg:   { title: 'CHAN',             cls: 'leg' },
  combo: { title: 'BIEN DANG TONG HOP', cls: '' }
};

// ==================== MENU ====================
function showMenu() {
  step = 'menu';
  pendingAction = null;

  const groups = {};
  for (const key in GROUP_INFO) groups[key] = { ...GROUP_INFO[key], items: [] };
  for (const key in ACTIONS) {
    const a = ACTIONS[key];
    if (groups[a.group]) groups[a.group].items.push({ key, ...a });
  }

  const menu = document.createElement('div');
  menu.className = 'menu';
  let html = '<div class="menu-title">CHON CHUC NANG</div>';

  for (const gKey in groups) {
    const g = groups[gKey];
    if (!g.items.length) continue;
    html += `<div class="menu-cat ${g.cls}">${g.title}</div>`;
    html += `<div class="menu-grid">`;
    for (const it of g.items) {
      html += `<button class="menu-btn ${g.cls}" data-act="${it.key}">${it.label}</button>`;
    }
    html += `</div>`;
  }

  menu.innerHTML = html;
  chatBody.appendChild(menu);
  scrollBottom();

  menu.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const act = btn.dataset.act;
      addMsg(esc(btn.textContent.trim()), 'user');
      menu.remove();
      askNumber(act);
    });
  });
}

// ==================== HỎI SỐ ====================
function askNumber(action) {
  pendingAction = action;
  step = 'wait_number';
  const act = ACTIONS[action];
  if (!act) { addMsg('Chuc nang khong ton tai!', 'err'); return; }

  if (act.unit === 'none') {
    step = 'menu';
    pendingAction = null;
    applyAction(action, 1);
    return;
  }

  let question = '', hint = '', defaultValue = '';
  if (act.unit === 'scale') {
    question = 'Nhap he so scale';
    hint = 'Vi du: 0.5 = nho mot nua | 1.5 = to gap ruoi | 2.0 = to gap doi';
    defaultValue = '1.5';
  } else if (act.unit === 'move') {
    question = 'Nhap do dich chuyen';
    hint = 'Vi du: 0.05 | 0.1 | 0.2 | -0.1 (am = nguoc huong)';
    defaultValue = '0.1';
  } else if (act.unit === 'seed') {
    question = 'Nhap seed (so nguyen)';
    hint = 'Vi du: 12345 | 99999';
    defaultValue = '12345';
  }

  botSay(
    'CHUC NANG: ' + act.label + '\n\n' +
    question + '\n\n' + hint + '\n\n' +
    'Go /huy de quay lai menu.',
    400
  ).then(() => {
    chatInput.placeholder = 'Nhap so... (' + defaultValue + ')';
    chatInput.focus();
  });
}

// ==================== ÁP DỤNG ACTION ====================
function applyAction(theme, v) {
  if (!fileBytes) { addMsg('Chua co file!', 'err'); return; }

  let applied = 0;
  const HEAD_KW    = ['head'];
  const NECK_KW    = ['neck'];
  const ARM_R_KW   = ['rightarm','rightforearm','righthand','rightshoulder'];
  const ARM_L_KW   = ['leftarm','leftforearm','lefthand','leftshoulder'];
  const ARM_KW     = ['arm','forearm','hand','shoulder','elbow','wrist','finger','thumb'];
  const FORE_KW    = ['forearm'];
  const HAND_KW    = ['hand','finger','thumb','wrist'];
  const BODY_KW    = ['spine','spine1','spine2','chest','torso'];
  const CHEST_KW   = ['spine2','chest','torso'];
  const SPINE_KW   = ['spine','spine1'];
  const HIPS_KW    = ['hips','pelvis'];
  const WING_R_KW  = ['rightwing','rightwing1','rightwing2','rightfeather'];
  const WING_L_KW  = ['leftwing','leftwing1','leftwing2','leftfeather'];
  const WING_KW    = ['wing','feather'];
  const TAIL_KW    = ['tail','tail1','tail2'];
  const LEG_R_KW   = ['rightleg','rightupleg','rightknee','rightfoot','righttoe','rightthigh'];
  const LEG_L_KW   = ['leftleg','leftupleg','leftknee','leftfoot','lefttoe','leftthigh'];
  const LEG_KW     = ['leg','upleg','knee','foot','toe','thigh'];

  switch (theme) {
    // ===== ĐẦU =====
    case 'dauto':        applied += scaleBonesMatch(HEAD_KW, v, v, v); break;
    case 'daunho':       applied += scaleBonesMatch(HEAD_KW, v, v, v); break;
    case 'daudai':       applied += scaleBonesMatch(HEAD_KW, 1, v, 1); break;
    case 'daungan':      applied += scaleBonesMatch(HEAD_KW, 1, v, 1); break;
    case 'daurong':      applied += scaleBonesMatch(HEAD_KW, v, 1, v); break;
    case 'daumong':      applied += scaleBonesMatch(HEAD_KW, v, 1, 1); break;
    case 'dautrai':      applied += moveBonesMatch(HEAD_KW, -v, 0, 0); break;
    case 'dauphai':      applied += moveBonesMatch(HEAD_KW, v, 0, 0); break;
    case 'daucui':       applied += moveBonesMatch(HEAD_KW, 0, 0, -v); break;
    case 'daungua':      applied += moveBonesMatch(HEAD_KW, 0, 0, v); break;
    case 'daumep':       applied += scaleBonesMatch(HEAD_KW, v, 1, 1); break;
    case 'dauguong':     applied += scaleBonesMatch(HEAD_KW, 1, v, 1); break;
    case 'matmeo':       applied += scaleBonesMatch(HEAD_KW, v*2, v*0.6, v); break;
    case 'matxo':        applied += scaleBonesMatch(HEAD_KW, v, v*0.7, v*1.3); break;
    case 'co_dai':       applied += scaleBonesMatch(NECK_KW, 1, v, 1); break;
    case 'co_ngan':      applied += scaleBonesMatch(NECK_KW, 1, v, 1); break;
    case 'co_to':        applied += scaleBonesMatch(NECK_KW, v, v, v); break;
    case 'co_nho':       applied += scaleBonesMatch(NECK_KW, v, v, v); break;
    case 'co_veo_trai':  applied += moveBonesMatch(NECK_KW, -v, 0, 0); break;
    case 'co_veo_phai':  applied += moveBonesMatch(NECK_KW, v, 0, 0); break;

    // ===== TAY =====
    case 'tayto':        applied += scaleBonesMatch(ARM_KW, v, v, v); break;
    case 'taynho':       applied += scaleBonesMatch(ARM_KW, v, v, v); break;
    case 'taydai':       applied += scaleBonesMatch(ARM_KW, 1, v, 1); break;
    case 'tayngan':      applied += scaleBonesMatch(ARM_KW, 1, v, 1); break;
    case 'tayphai_to':   applied += scaleBonesMatch(ARM_R_KW, v, v, v); break;
    case 'taytrai_to':   applied += scaleBonesMatch(ARM_L_KW, v, v, v); break;
    case 'tayphai_dai':  applied += scaleBonesMatch(ARM_R_KW, 1, v, 1); break;
    case 'taytrai_dai':  applied += scaleBonesMatch(ARM_L_KW, 1, v, 1); break;
    case 'tayphai_ngan': applied += scaleBonesMatch(ARM_R_KW, 1, v, 1); break;
    case 'taytrai_ngan': applied += scaleBonesMatch(ARM_L_KW, 1, v, 1); break;
    case 'tayphai_veo':  applied += moveBonesMatch(ARM_R_KW, v, v*0.5, v); break;
    case 'taytrai_veo':  applied += moveBonesMatch(ARM_L_KW, v, v*0.5, v); break;
    case 'fore_to':      applied += scaleBonesMatch(FORE_KW, v, v, v); break;
    case 'fore_nho':     applied += scaleBonesMatch(FORE_KW, v, v, v); break;
    case 'fore_dai':     applied += scaleBonesMatch(FORE_KW, 1, v, 1); break;
    case 'fore_ngan':    applied += scaleBonesMatch(FORE_KW, 1, v, 1); break;
    case 'ban_tay_to':   applied += scaleBonesMatch(HAND_KW, v, v, v); break;
    case 'ban_tay_nho':  applied += scaleBonesMatch(HAND_KW, v, v, v); break;
    case 'ban_tay_dai':  applied += scaleBonesMatch(HAND_KW, 1, v, 1); break;
    case 'ban_tay_rong': applied += scaleBonesMatch(HAND_KW, v, 1, v); break;
    case 'ngon_to':      applied += scaleBonesMatch(['finger','thumb'], v, v, v); break;
    case 'ngon_dai':     applied += scaleBonesMatch(['finger','thumb'], 1, v, 1); break;
    case 'vai_to':       applied += scaleBonesMatch(['shoulder'], v, v, v); break;
    case 'vai_rong':     applied += scaleBonesMatch(['shoulder'], v, 1, v); break;
    case 'vai_cao':      applied += moveBonesMatch(['shoulder'], 0, v, 0); break;
    case 'vai_thap':     applied += moveBonesMatch(['shoulder'], 0, -v, 0); break;
    case 'khuyu_to':     applied += scaleBonesMatch(['elbow'], v, v, v); break;

    // ===== THÂN =====
    case 'than_to':      applied += scaleBonesMatch(BODY_KW, v, v, v); break;
    case 'than_nho':     applied += scaleBonesMatch(BODY_KW, v, v, v); break;
    case 'than_dai':     applied += scaleBonesMatch(BODY_KW, 1, v, 1); break;
    case 'than_ngan':    applied += scaleBonesMatch(BODY_KW, 1, v, 1); break;
    case 'than_rong':    applied += scaleBonesMatch(BODY_KW, v, 1, v); break;
    case 'than_mong':    applied += scaleBonesMatch(BODY_KW, v, 1, 1); break;
    case 'lung_to':      applied += scaleBonesMatch(['spine','spine1'], v, v, v); break;
    case 'lung_gu':      applied += moveBonesMatch(['spine','spine1'], 0, -v, -v); break;
    case 'lung_thang':   applied += moveBonesMatch(['spine','spine1'], 0, v*0.3, v*0.3); break;
    case 'nguc_to':      applied += scaleBonesMatch(CHEST_KW, v, v, v); break;
    case 'nguc_nho':     applied += scaleBonesMatch(CHEST_KW, v, v, v); break;
    case 'nguc_rong':    applied += scaleBonesMatch(CHEST_KW, v, 1, v); break;
    case 'bung_to':      applied += scaleBonesMatch(HIPS_KW, v, v, v); break;
    case 'bung_phe':     applied += scaleBonesMatch(HIPS_KW, v*1.3, v, v*1.3); break;
    case 'bung_thon':    applied += scaleBonesMatch(HIPS_KW, v, v, v); break;
    case 'hong_to':      applied += scaleBonesMatch(['hips','pelvis','hip'], v, v, v); break;
    case 'hong_nho':     applied += scaleBonesMatch(['hips','pelvis','hip'], v, v, v); break;
    case 'hong_rong':    applied += scaleBonesMatch(['hips','pelvis','hip'], v, 1, v); break;
    case 'eo_thon':      applied += scaleBonesMatch(SPINE_KW, v, 1, v); break;
    case 'cot_song_cong':applied += moveBonesMatch(['spine','spine1','spine2'], 0, 0, v); break;
    case 'cot_song_xoan':applied += moveBonesMatch(['spine','spine1','spine2'], v, 0, 0); break;
    case 'nghieng_nguoi':applied += moveBonesMatch(['spine','hips','chest'], v, 0, 0); break;
    case 'cui_nguoi':    applied += moveBonesMatch(['spine','spine1','spine2'], 0, 0, -v); break;
    case 'ngua_nguoi':   applied += moveBonesMatch(['spine','spine1','spine2'], 0, 0, v); break;

    // ===== CÁNH =====
    case 'canh_to':      applied += scaleBonesMatch(WING_KW, v, v, v); break;
    case 'canh_nho':     applied += scaleBonesMatch(WING_KW, v, v, v); break;
    case 'canh_dai':     applied += scaleBonesMatch(WING_KW, 1, v, 1); break;
    case 'canh_ngan':    applied += scaleBonesMatch(WING_KW, 1, v, 1); break;
    case 'canh_rong':    applied += scaleBonesMatch(WING_KW, v, 1, v); break;
    case 'canh_mong':    applied += scaleBonesMatch(WING_KW, 1, 1, v); break;
    case 'canh_phai_to': applied += scaleBonesMatch(WING_R_KW, v, v, v); break;
    case 'canh_trai_to': applied += scaleBonesMatch(WING_L_KW, v, v, v); break;
    case 'canh_phai_dai':applied += scaleBonesMatch(WING_R_KW, 1, v, 1); break;
    case 'canh_trai_dai':applied += scaleBonesMatch(WING_L_KW, 1, v, 1); break;
    case 'canh_xoe':     applied += scaleBonesMatch(WING_KW, v, 1, v); break;
    case 'canh_cup':     applied += scaleBonesMatch(WING_KW, 1, v, 1); break;
    case 'canh_vong':    applied += moveBonesMatch(WING_KW, 0, v, 0); break;
    case 'canh_xuong':   applied += moveBonesMatch(WING_KW, 0, -v, 0); break;
    case 'long_canh_to': applied += scaleBonesMatch(['feather'], v, v, v); break;
    case 'long_canh_dai':applied += scaleBonesMatch(['feather'], 1, v, 1); break;
    case 'duoi_to':      applied += scaleBonesMatch(TAIL_KW, v, v, v); break;
    case 'duoi_dai':     applied += scaleBonesMatch(TAIL_KW, 1, v, 1); break;
    case 'duoi_xoe':     applied += scaleBonesMatch(TAIL_KW, v, 1, v); break;
    case 'duoi_cup':     applied += scaleBonesMatch(TAIL_KW, 1, v, 1); break;

    // ===== CHÂN =====
    case 'chanto':       applied += scaleBonesMatch(LEG_KW, v, v, v); break;
    case 'channho':      applied += scaleBonesMatch(LEG_KW, v, v, v); break;
    case 'chandai':      applied += scaleBonesMatch(LEG_KW, 1, v, 1); break;
    case 'channgan':     applied += scaleBonesMatch(LEG_KW, 1, v, 1); break;
    case 'chanphai_to':  applied += scaleBonesMatch(LEG_R_KW, v, v, v); break;
    case 'chantrai_to':  applied += scaleBonesMatch(LEG_L_KW, v, v, v); break;
    case 'chanphai_dai': applied += scaleBonesMatch(LEG_R_KW, 1, v, 1); break;
    case 'chantrai_dai': applied += scaleBonesMatch(LEG_L_KW, 1, v, 1); break;
    case 'chanphai_ngan':applied += scaleBonesMatch(LEG_R_KW, 1, v, 1); break;
    case 'chantrai_ngan':applied += scaleBonesMatch(LEG_L_KW, 1, v, 1); break;
    case 'chanphai_veo': applied += moveBonesMatch(LEG_R_KW, v, 0, 0); break;
    case 'chantrai_veo': applied += moveBonesMatch(LEG_L_KW, v, 0, 0); break;
    case 'dui_to':       applied += scaleBonesMatch(['thigh','upleg'], v, v, v); break;
    case 'dui_nho':      applied += scaleBonesMatch(['thigh','upleg'], v, v, v); break;
    case 'dui_dai':      applied += scaleBonesMatch(['thigh','upleg'], 1, v, 1); break;
    case 'dui_ngan':     applied += scaleBonesMatch(['thigh','upleg'], 1, v, 1); break;
    case 'bap_chan_to':  applied += scaleBonesMatch(['calf','lowerleg'], v, v, v); break;
    case 'bap_chan_nho': applied += scaleBonesMatch(['calf','lowerleg'], v, v, v); break;
    case 'bap_chan_dai': applied += scaleBonesMatch(['calf','lowerleg'], 1, v, 1); break;
    case 'ban_chan_to':  applied += scaleBonesMatch(['foot','ankle'], v, v, v); break;
    case 'ban_chan_nho': applied += scaleBonesMatch(['foot','ankle'], v, v, v); break;
    case 'ban_chan_dai': applied += scaleBonesMatch(['foot','ankle'], 1, v, 1); break;
    case 'ban_chan_rong':applied += scaleBonesMatch(['foot','ankle'], v, 1, v); break;
    case 'ngon_chan_to': applied += scaleBonesMatch(['toe'], v, v, v); break;
    case 'ngon_chan_dai':applied += scaleBonesMatch(['toe'], 1, v, 1); break;
    case 'goi_to':       applied += scaleBonesMatch(['knee'], v, v, v); break;
    case 'co_chan_to':   applied += scaleBonesMatch(['ankle'], v, v, v); break;
    case 'khuyu_chan_to':applied += scaleBonesMatch(['knee','elbow'], v, v, v); break;

    // ===== TỔNG HỢP =====
    case 'phinh':
      applied += scaleBonesMatch(['head','neck','spine','hips','arm','leg','hand','foot','toe','shoulder'], v, v, v);
      break;
    case 'teo':
      applied += scaleBonesMatch(['head','neck','spine','hips','arm','leg','hand','foot','toe','shoulder'], v, v, v);
      break;
    case 'tihon':
      applied += scaleBonesMatch(['head','neck','spine','hips','arm','leg','hand','foot','toe','shoulder'], v, v, v);
      break;
    case 'khonglo':
      applied += scaleBonesMatch(['head','neck','spine','hips','arm','leg','hand','foot','toe','shoulder'], v, v, v);
      break;
    case 'nguennhen':
      applied += scaleBonesMatch(['arm','forearm','leg'], v*0.7, v*3.5, v*0.7);
      applied += scaleBonesMatch(['hand'], v*0.7, v*0.7, v*0.7);
      break;
    case 'quecui':
      applied += scaleBonesMatch(['spine','hips','arm','leg','forearm','chest','shoulder'], v, v*1.2, v);
      break;
    case 'dautothan':
      applied += scaleBonesMatch(['head'], v*2, v*2, v*2);
      applied += scaleBonesMatch(['spine','hips','arm','leg'], v*0.5, v*0.5, v*0.5);
      break;
    case 'taydaichan':
      applied += scaleBonesMatch(['arm','forearm','hand'], v, v*2, v);
      applied += scaleBonesMatch(['leg','foot','thigh'], v, v*0.5, v);
      break;
    case 'chanvoi':
      applied += scaleBonesMatch(['leg','foot','thigh','calf'], v*1.5, v*1.2, v*1.5);
      break;
    case 'daqua':
      applied += scaleBonesMatch(['head'], v*2, v*2, v*2);
      applied += scaleBonesMatch(['neck'], v*0.7, v*0.7, v*0.7);
      break;
    case 'reset':
      fileBytes = new Uint8Array(fileBytesBackup);
      parseBinary(fileBytes);
      modified = false;
      addMsg('DA RESET!\nFile da tro ve trang thai goc.\nBone: ' + Object.keys(bones).length, 'sys');
      step = 'menu';
      return;
    case 'randomall': {
      const rng = makeRng(v);
      let count = 0;
      for (const name in bones) {
        if (scaleBone(name, rs(rng,0.7,1.5), rs(rng,0.7,1.5), rs(rng,0.7,1.5))) count++;
      }
      applied = count;
      break;
    }
    case 'invert':
      applied += scaleBonesMatch(['head','neck','spine','hips','arm','leg','hand','foot','toe','wing','tail'], -1, -1, -1);
      break;

    default:
      addMsg('Chuc nang chua ho tro: ' + esc(theme), 'err');
      step = 'menu';
      return;
  }

  function rs(rng, lo, hi) { return Math.round((lo + rng() * (hi - lo)) * 100) / 100; }

  modified = true;
  const act = ACTIONS[theme];
  addMsg(
    'HOAN TAT!\n' +
    'Chuc nang: ' + act.label + '\n' +
    'Gia tri: ' + v + '\n' +
    'Da ap dung: ' + applied + ' bone\n' +
    'Go /menu de chon chuc nang khac.\n' +
    'Go /luufile "luu xong roi chia se" de xuat file.',
    'sys'
  );

  step = 'menu';
  pendingAction = null;
  chatInput.placeholder = 'Nhap lenh... (/menu, /luufile)';
}

// ==================== XỬ LÝ LỆNH ====================
async function handleCommand(text) {
  const raw = text.trim();
  if (!raw) return;
  addMsg(esc(raw), 'user');
  const lower = raw.toLowerCase();

  if (lower === '/huy' || lower === 'huy' || lower === 'hủy') {
    if (step === 'wait_number') {
      pendingAction = null;
      step = 'menu';
      chatInput.placeholder = 'Nhap lenh... (/menu, /luufile)';
      await botSay('Da huy. Quay lai menu.', 300);
      showMenu();
      return;
    }
    addMsg('Khong co gi de huy.', 'sys');
    return;
  }

  if (lower === '/menu' || lower === 'menu') {
    if (!fileBytes) { addMsg('Chua co file! Go /nhapfile truoc.', 'err'); return; }
    await botSay('Hien menu chuc nang:', 300);
    showMenu();
    return;
  }

  if (lower === '/start' || lower === 'start' || lower === '/bat dau' || lower === 'bat dau') {
    step = 'idle';
    pendingAction = null;
    chatInput.placeholder = 'Nhap lenh... /start';
    await botSay(
      'Xin chao! Toi la UMA BOT.\n\n' +
      'Cac lenh kha dung:\n' +
      '- /start - bat dau\n' +
      '- /nhapfile "assetindexer.H5ak1JM1Eck2FxRc" - nhap file\n' +
      '- /menu - hien menu chuc nang\n' +
      '- /huy - huy nhap so\n' +
      '- /luufile "luu xong roi chia se" - xuat file\n\n' +
      'Hay go /nhapfile de tiep tuc.'
    );
    return;
  }

  if (lower.startsWith('/nhapfile') || lower.startsWith('nhapfile') ||
      lower.includes('assetindexer')) {
    if (fileBytes) {
      await botSay('File da co san: ' + esc(currentFileName) + '\nHien menu chuc nang ben duoi');
      showMenu();
      return;
    }
    step = 'wait_file';
    pendingAction = null;
    await botSay(
      'NHAP FILE\n\nVui long chon file:\n' + REQUIRED_FILENAME +
      '\n\nBam nut ben duoi de mo trinh chon file.',
      500
    );
    const btnWrap = document.createElement('div');
    btnWrap.className = 'menu';
    btnWrap.innerHTML = `
      <div class="menu-grid">
        <button class="menu-btn" id="btnPickFile">Chon file asset</button>
      </div>
    `;
    chatBody.appendChild(btnWrap);
    scrollBottom();
    btnWrap.querySelector('#btnPickFile').addEventListener('click', () => fileInput.click());
    return;
  }

  if (lower.startsWith('/luufile') || lower.startsWith('luufile') ||
      lower.includes('chia se') || lower.includes('chia sẻ')) {
    if (!fileBytes) { addMsg('Chua co file nao! Go /nhapfile truoc.', 'err'); return; }
    if (!modified) addMsg('File chua co thay doi nao. Van xuat file goc?', 'sys');
    else await botSay('DANG LUU FILE...\nDang tinh checksum va mo chia se...', 400);
    await downloadFile(false);
    return;
  }

  if (step === 'wait_number' && pendingAction) {
    const num = parseFloat(raw.replace(',', '.'));
    if (isNaN(num)) { addMsg('Gia tri khong hop le! Nhap so (vi du: 1.5). Hoac go /huy de huy.', 'err'); return; }
    if (num === 0) { addMsg('Gia tri phai khac 0!', 'err'); return; }
    const action = pendingAction;
    pendingAction = null;
    step = 'menu';
    await botSay('Dang ap dung ' + esc(ACTIONS[action].label) + ' voi gia tri ' + num + '...', 300);
    applyAction(action, num);
    return;
  }

  if (step === 'wait_file') {
    if (raw === 'file' || raw === 'chon file' || raw === 'chọn file') { fileInput.click(); return; }
    addMsg('Dang cho file... Bam nut Chon file asset phia tren.', 'sys');
    return;
  }

  if (step === 'menu' && fileBytes) {
    addMsg('Hay chon chuc nang trong menu phia tren, hoac go /luufile de xuat file.', 'sys');
    return;
  }

  addMsg('Toi khong hieu lenh nay.\nGo /start de xem huong dan.', 'sys');
}

// ==================== GỬI TIN NHẮN ====================
function sendMessage() {
  const text = chatInput.value;
  if (!text.trim()) return;
  chatInput.value = '';
  handleCommand(text);
}
btnSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); sendMessage(); }
});

// ==================== CHỌN FILE ====================
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  addMsg(esc(file.name) + ' (' + (file.size/1024).toFixed(1) + ' KB)', 'user');

  if (file.name !== REQUIRED_FILENAME) {
    botSay(
      'SAI TEN FILE!\n\nYeu cau: ' + REQUIRED_FILENAME + '\nBan chon: ' + esc(file.name) +
      '\n\nGo /nhapfile de thu lai.',
      400
    );
    return;
  }

  botSay('Dang doc file...', 300).then(() => {
    const reader = new FileReader();
    reader.onload = function(ev) {
      try {
        const buffer = ev.target.result;
        fileBytes = new Uint8Array(buffer);
        fileBytesBackup = new Uint8Array(buffer);
        currentFileName = file.name;
        modified = false;

        const t0 = performance.now();
        const count = parseBinary(fileBytes);
        const t1 = performance.now();

        if (count === 0) { botSay('Khong tim thay bone trong file!', 300); fileBytes = null; return; }

        botSay(
          'DA NHAN FILE!\n\n' +
          'Ten: ' + esc(file.name) + '\n' +
          'Kich thuoc: ' + fileBytes.length + ' bytes\n' +
          'Bone tim thay: ' + count + '\n' +
          'Thoi gian parse: ' + (t1 - t0).toFixed(1) + 'ms\n\n' +
          'Chon chuc nang ben duoi:',
          500
        ).then(() => { showMenu(); });
      } catch (err) {
        botSay('Loi xu ly file: ' + esc(err.message), 300);
      }
    };
    reader.onerror = function() { botSay('Loi doc file!', 300); };
    reader.readAsArrayBuffer(file);
  });

  fileInput.value = '';
});

// ==================== KHỞI TẠO ====================
botSay('UMA BOT da san sang!\n\nGo /start de bat dau.', 600);