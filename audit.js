#!/usr/bin/env node
/* NeelyBot one-command health gate.  Run:  node audit.js
   HARD checks (exit 1 on failure):
     - every on*="fn(...)" calls a function that is defined
     - the app's <script> passes `node --check` (syntax)
   SOFT checks (reported, never fail the build):
     - every SCR screen is reachable from somewhere (nav/go/hash/data)
     - em-/en-dashes in user-facing copy (house rule: none)
     - controls whose handler body is only toast() (preview stubs)
     - inventory of destination URLs / tel / mailto for a manual spot-check */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');
const file = path.join(__dirname, 'index.html');
const html = fs.readFileSync(file, 'utf8');
const lines = html.split('\n');
let hardFail = false;

// ---------- defined names + screens ----------
const defined = new Set();
let m;
for (const re of [/function\s+([A-Za-z_$][\w$]*)/g, /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/g]) {
  while ((m = re.exec(html))) defined.add(m[1]);
}
const screens = new Set();
const reScr = /SCR\.([A-Za-z_$][\w$]*)\s*=/g;
while ((m = reScr.exec(html))) { screens.add(m[1]); defined.add(m[1]); }
const IGNORE = new Set(['if','for','while','switch','return','catch','function','typeof','new','else','do',
  'void','delete','in','of','await','async','try','case','yield','this','super',
  'window','document','event','location','console','Math','JSON','Array','Object','String','Number','Date',
  'setTimeout','setInterval','clearTimeout','clearInterval','alert','open','reload','toggle','stopPropagation',
  'preventDefault','focus','blur','scrollIntoView','requestAccessToken','revoke','getToken','setToken','filter','map','forEach','split','slice','indexOf']);

// ---------- HARD 1: handlers resolve ----------
const reOn = /\son[a-z]+="([^"]*)"/g;
const handlers = [];
while ((m = reOn.exec(html))) handlers.push(m[1]);
const calledNames = new Set();
handlers.forEach(v => {
  const code = v.replace(/'[^']*'/g, "''").replace(/`[^`]*`/g, '``');
  let c; const reCall = /(^|[^.\w$])([A-Za-z_$][\w$]*)\s*\(/g;
  while ((c = reCall.exec(code))) calledNames.add(c[2]);
});
const brokenHandlers = [...calledNames].filter(n => !defined.has(n) && !IGNORE.has(n)).sort();

// ---------- HARD 2: syntax check of the app <script> ----------
let syntaxOk = true, syntaxErr = '';
try {
  const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x => x[1]);
  const main = blocks.sort((a, b) => b.length - a.length)[0] || '';
  const tmp = path.join(os.tmpdir(), 'neelybot_syntax_check.js');
  fs.writeFileSync(tmp, main);
  execSync('node --check ' + JSON.stringify(tmp), { stdio: 'pipe' });
} catch (e) { syntaxOk = false; syntaxErr = (e.stderr || e.message || '').toString().split('\n').slice(0, 3).join(' '); }

// ---------- SOFT 1: screen reachability ----------
// a screen counts as reachable if its key appears as a quoted literal or #hash anywhere but its own SCR.x= def
const unreached = [...screens].filter(k => {
  if (k === 'home') return false;
  const q = new RegExp("(['\"#]" + k + "['\"])|(#" + k + "\\b)");
  // strip the definition token so SCR.k= itself doesn't count
  const withoutDef = html.replace(new RegExp('SCR\\.' + k + '\\s*='), '');
  return !q.test(withoutDef);
}).sort();

// ---------- SOFT 2: em-/en-dash copy lint ----------
const dashHits = [];
lines.forEach((ln, i) => {
  if (/^\s*\/\//.test(ln)) return;                 // skip comment lines
  if (/[—–]/.test(ln)) {
    const snip = ln.trim().slice(0, 90);
    dashHits.push((i + 1) + ': ' + snip);
  }
});

// ---------- SOFT 3: toast-only stub handlers ----------
const stubs = [];
const reFnBody = /function\s+([A-Za-z_$][\w$]*)\s*\([^)]*\)\{([^{}]*)\}/g;
while ((m = reFnBody.exec(html))) {
  const name = m[1], body = m[2];
  if (/\btoast\(/.test(body) && body.length < 130 && !/(=|push\(|splice\(|fetch\(|open\(|window\.|innerHTML)/.test(body)) {
    stubs.push(name);
  }
}

// ---------- URL inventory ----------
const urls = new Set();
const reUrl = /(?:'|"|`)(https?:\/\/[^'"`\s]+)(?:'|"|`)/g;
while ((m = reUrl.exec(html))) { const u = m[1]; if (!u.includes('${') && !u.includes("'+") && u.length > 9) urls.add(u); }
const reHref = /href="([^"]*)"/g; const hrefs = [];
while ((m = reHref.exec(html))) hrefs.push(m[1]);
const tel = [...new Set(hrefs.filter(h => h.startsWith('tel:')))];
const mailto = [...new Set(hrefs.filter(h => h.startsWith('mailto:')))];

// ---------- report ----------
const bar = '='.repeat(52);
console.log(bar + '\n NeelyBot health gate\n' + bar);
console.log(`defined names ${defined.size} · screens ${screens.size} · handlers ${handlers.length} · URLs ${urls.size}\n`);

console.log('HARD CHECKS');
if (brokenHandlers.length) { hardFail = true; console.log('  [FAIL] broken handlers: ' + brokenHandlers.map(n => n + '()').join(', ')); }
else console.log(`  [pass] all ${calledNames.size} handler functions are defined`);
if (!syntaxOk) { hardFail = true; console.log('  [FAIL] script syntax: ' + syntaxErr); }
else console.log('  [pass] app <script> passes node --check');

console.log('\nSOFT CHECKS (warnings, do not fail the build)');
console.log(unreached.length ? '  [warn] screens with no link/nav in to them: ' + unreached.join(', ')
                             : '  [ok]   every screen is reachable');
console.log(dashHits.length ? '  [warn] ' + dashHits.length + ' line(s) with em/en-dashes in copy (house rule: none):'
                            : '  [ok]   no em/en-dashes in copy');
dashHits.forEach(h => console.log('           ' + h));
console.log(stubs.length ? '  [note] toast-only "preview" handlers (wire or label as Preview): ' + stubs.join(', ')
                         : '  [ok]   no toast-only stub handlers');

console.log('\nDESTINATION URLS (spot-check these resolve to the RIGHT place):');
[...urls].sort().forEach(u => console.log('  ' + u));
console.log('tel: ' + tel.join('  ') + '   mailto: ' + mailto.join('  '));

// ---------- auto-stamp sw.js cache version from the app's content hash ----------
// Removes the manual "remember to bump the version" step: the version changes whenever
// index.html changes, which is what makes the kiosk auto-reload pick up a new deploy.
if (!hardFail) {
  try {
    const crypto = require('crypto');
    const swPath = path.join(__dirname, 'sw.js');
    let sw = fs.readFileSync(swPath, 'utf8');
    const want = 'neelybot-' + crypto.createHash('sha1').update(html).digest('hex').slice(0, 8);
    const cur = (sw.match(/const CACHE\s*=\s*'([^']+)'/) || [])[1];
    if (cur !== want) {
      sw = sw.replace(/const CACHE\s*=\s*'[^']+'/, "const CACHE = '" + want + "'");
      fs.writeFileSync(swPath, sw);
      console.log('\n[auto] stamped sw.js cache version -> ' + want + ' (was ' + cur + ')');
    } else {
      console.log('\n[auto] sw.js cache version already current (' + want + ')');
    }
  } catch (e) { console.log('\n[auto] could not stamp sw.js: ' + e.message); }
}

console.log('\n' + bar);
console.log(hardFail ? 'RESULT: FAIL (fix hard checks above)' : 'RESULT: PASS (hard checks green; review warnings)');
process.exitCode = hardFail ? 1 : 0;
