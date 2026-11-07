/* =========================================================
   NetLinks Thank-You Experience
   EDIT HERE: the two lists below hold your photos and teams.
   ========================================================= */

// ---- Gallery cards: put your photos in the images/ folder ----
const photos = [
  { src: 'images/photo1.jpg', title: 'Classroom Joy',      pos: 'center 45%', text: 'Rows of laptops, quiet focus, and girls building their futures side by side.' },
  { src: 'images/photo2.jpg', title: 'Our Community',      pos: 'center 55%', text: 'Sketches, tea and laughter. We came to study and became a family.' },
  { src: 'images/photo3.jpg', title: 'Where Ideas Begin',  pos: 'center 25%', text: 'Every big dream started as a few words on this board.' },
  { src: 'images/photo4.jpg', title: 'Our Classroom',      pos: 'center 50%', text: 'A warm room and a seat that was always waiting for us.' },
  { src: 'images/photo5.jpg', title: 'Push Yourself',      pos: 'center 40%', text: 'The wall that reminded us every day to rise, and we did.' },
  { src: 'images/photo6.jpg', title: 'Our Home, NetLinks', pos: 'center 45%', text: 'Making technology work, and making our dreams work too.' }
];

// ---- Teams: add, remove or rename freely (icon, name, message) ----
const teams = [
  ['To Every Team That Supports Us', 'To every team, every volunteer and every hand that works quietly behind the scenes: we may not always see you, but we feel you in every class and every opportunity. Thank you for standing beside us.'],
  ['To Our Teachers, Mentors and Interns', 'You gave us your time, your patience and your belief. Thank you for lifting us up on the days we doubted ourselves.'],
  ['Thank You, UNICEF', 'Thank you for helping us. Your support turned closed doors into open classrooms and gave our dreams solid ground to stand on. We will never forget the hope you gave us.'],
  ['Especially, Thank You NetLinks', 'You created this place where we could study with light in our hearts. You did not just give us a classroom, you gave us a family and a future. Thank you for being our light.', true]
];

/* ---------- Helpers ---------- */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

/* ---------- Screen navigation (smooth fades) ---------- */
function go(id) {
  $$('.screen').forEach(s => s.classList.remove('active'));
  const next = document.getElementById(id);
  next.classList.add('active');
  next.scrollTop = 0;
  if (id === 's4') revealTeams();
}
$$('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));

/* ---------- Screen 1: typing text ---------- */
const message = "Thank You to the Supporters of Girls' Education";
function typeText() {
  const el = $('#typed'); let i = 0;
  setTimeout(function tick() {
    el.firstChild ? el.firstChild.nodeValue = message.slice(0, ++i) : el.prepend(message[0]);
    if (i < message.length) setTimeout(tick, 70);
    else $('#beginBtn').classList.add('show');
  }, 2600);
}
typeText();

$('#beginBtn').addEventListener('click', () => { startMusic(); go('s2'); });

/* ---------- Screen 2: build the flower ---------- */
(function buildFlower() {
  const svg = $('#flower'); let html = '';
  const layers = [
    { n: 8, len: 110, w: 30, fill: '#e9dcff', delay: 0 },
    { n: 8, len: 90,  w: 26, fill: '#b992f0', delay: .35, off: 22 },
    { n: 6, len: 66,  w: 22, fill: '#7b52b8', delay: .7, off: 10 }
  ];
  layers.forEach(L => {
    for (let i = 0; i < L.n; i++) {
      const a = (360 / L.n) * i + (L.off || 0);
      html += `<g transform="rotate(${a})"><ellipse class="petal" cx="0" cy="-${L.len / 2}" rx="${L.w / 2}" ry="${L.len / 2}"
        fill="${L.fill}" opacity=".92" style="animation-delay:${L.delay + i * .06}s"/></g>`;
    }
  });
  html += `<circle class="core" r="20" fill="#e87d2f"/><circle class="core" r="9" fill="#f4e8d6"/>`;
  svg.innerHTML = html;
})();

/* ---------- Screen 3: gallery ---------- */
$('#gallery').innerHTML = photos.map(p => `
  <div class="card">
    <div class="ph">Your photo here</div>
    <img src="${p.src}" alt="${p.title}" style="object-position:${p.pos}" onerror="this.style.display='none'">
    <div class="cap"><h3>${p.title}</h3><p>${p.text}</p></div>
  </div>`).join('');
$$('.card').forEach(c => c.addEventListener('click', () => c.classList.toggle('tap')));

/* ---------- Screen 4: teams ---------- */
$('#teamGrid').innerHTML = teams.map(t => `
  <div class="note${t[2] ? ' star' : ''}"><h3>${t[0]}</h3><p>${t[1]}</p></div>`).join('');
function revealTeams() {
  $$('.note').forEach((t, i) => { t.classList.remove('in'); setTimeout(() => t.classList.add('in'), 500 + i * 900); });
}

/* ---------- Screen 5: envelope ---------- */
const env = $('#envelope');
function openEnvelope() {
  if (env.classList.contains('open')) return;
  env.classList.add('open');
  $('#envHint').textContent = 'A letter, written with love…';
  setTimeout(() => $('#letterOverlay').classList.add('show'), 2000);
}
env.addEventListener('click', openEnvelope);
env.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openEnvelope(); });
$('#closeLetter').addEventListener('click', () => $('#letterOverlay').classList.remove('show'));
$('#replayBtn').addEventListener('click', () => {
  $('#letterOverlay').classList.remove('show');
  env.classList.remove('open');
  $('#envHint').textContent = 'Tap the purple seal to open';
  go('s1');
});

/* =========================================================
   MUSIC
   Option A: put your own song at assets/song.mp3 (it plays automatically).
   Option B: if no file exists, a soft piano-style melody is generated
   in the browser, so there is always emotional music.
   ========================================================= */
let musicOn = false, audio = null, ctx = null, synthTimer = null, usingSynth = false;

function startMusic() {
  if (musicOn) return;
  musicOn = true; $('#musicBtn').classList.add('on');
  audio = new Audio('assets/song.mp3'); audio.loop = true; audio.volume = .6;
  audio.addEventListener('error', startSynth);
  audio.play().catch(startSynth);
}
function stopMusic() {
  musicOn = false; $('#musicBtn').classList.remove('on');
  if (audio) audio.pause();
  clearTimeout(synthTimer); usingSynth = false;
  if (ctx) { ctx.close(); ctx = null; }
}
$('#musicBtn').addEventListener('click', () => musicOn ? stopMusic() : startMusic());

function startSynth() {
  if (usingSynth || !musicOn) return;
  usingSynth = true;
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  ctx.resume();
  // Hall reverb (generated) so every note floats and echoes softly
  const len = ctx.sampleRate * 4, ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5); }
  const verb = ctx.createConvolver(); verb.buffer = ir;
  const master = ctx.createGain(), wet = ctx.createGain(); wet.gain.value = .6;
  master.connect(ctx.destination); master.connect(verb); verb.connect(wet); wet.connect(ctx.destination);
  const hz = (n) => 440 * Math.pow(2, (n - 69) / 12);

  function piano(n, t, dur, vol) {            // soft piano: 3 partials, quick attack, long fade
    [[1, 1], [2, .35], [3, .12]].forEach(([m, a]) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = hz(n) * m;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol * a, t + .015);
      g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g).connect(master); o.start(t); o.stop(t + dur + .1);
    });
  }
  function strings(notes, t, dur, vol) {      // warm swelling string pad
    notes.forEach(n => [-7, 7].forEach(det => {
      const o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      o.type = 'sawtooth'; o.frequency.value = hz(n); o.detune.value = det;
      f.type = 'lowpass'; f.frequency.value = 650;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + dur * .5); g.gain.linearRampToValueAtTime(0, t + dur);
      o.connect(f).connect(g).connect(master); o.start(t); o.stop(t + dur + .1);
    }));
  }
  // 8 slow bars: Am  F  C  G  Am  F  Dm  E   [bass note, chord notes]
  const bars = [[45, [57, 60, 64]], [41, [53, 57, 60]], [48, [55, 60, 64]], [43, [55, 59, 62]],
                [45, [57, 60, 64]], [41, [53, 57, 60]], [50, [53, 57, 62]], [40, [56, 59, 64]]];
  // Singing melody: [bar, beat, note, beats]
  const mel = [[0,0,76,3],[0,3,74,1],[1,0,72,2],[1,2,69,2],[2,0,67,2],[2,2,72,2],[3,0,74,3],[3,3,71,1],
               [4,0,76,2],[4,2,79,2],[5,0,77,3],[5,3,76,1],[6,0,74,2],[6,2,69,2],[7,0,71,3],[7,3,68,1]];
  const beat = 1.05;
  function playLoop() {
    if (!musicOn || !usingSynth) return;
    const t0 = ctx.currentTime + .1;
    bars.forEach(([bass, ch], b) => {
      const t = t0 + b * 4 * beat;
      piano(bass, t, 4 * beat, .22); piano(bass + 12, t, 3 * beat, .12);
      strings(ch, t, 4 * beat + .6, .018);
      for (let i = 0; i < 8; i++) piano(ch[i % 3] + 12, t + i * beat / 2, 2.2, .05);
    });
    mel.forEach(([b, off, n, l]) => piano(n, t0 + (b * 4 + off) * beat, l * beat + 1.4, .2));
    synthTimer = setTimeout(playLoop, 32 * beat * 1000 - 100);
  }
  playLoop();
}

/* ---------- Floating sparkles background ---------- */
(function sparkles() {
  const c = $('#sparkles'), x = c.getContext('2d'); let dots = [];
  function size() { c.width = innerWidth; c.height = innerHeight; }
  size(); addEventListener('resize', size);
  for (let i = 0; i < 55; i++) dots.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight,
    r: Math.random() * 2.2 + .5, s: Math.random() * .5 + .15, a: Math.random() });
  (function draw() {
    x.clearRect(0, 0, c.width, c.height);
    dots.forEach(d => {
      d.y -= d.s; d.a += .02; if (d.y < -5) { d.y = c.height + 5; d.x = Math.random() * c.width; }
      x.beginPath(); x.arc(d.x, d.y, d.r, 0, 7);
      x.fillStyle = `rgba(244,232,214,${.25 + Math.sin(d.a) * .25})`; x.fill();
    });
    requestAnimationFrame(draw);
  })();
})();
