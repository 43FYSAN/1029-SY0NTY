const SHEET_URL = "https://script.google.com/macros/s/AKfycbwImWkDcTPmR_TqaVgNfaFD8zmVdk72kiSExGqMCp2wKHn3OdJjIqMW9y2JxJe9nddF/exec";
const HIS_NAME = "SHAWN";

const LETTER = {
  title: "A LETTER FOR SHAWN",
  lines: [
    "happy birthday, Shawn!",
    "today is all about you, and i’m so happy i get to celebrate it with you.",
    "i still remember our first date, super bango mo and sobrang obvious that were trying to impress me HAHAHAHAHAHA, and what you didn’t know is that it worked. i never imagined that scent would become one of my favorite memories, kasi until now nire-recall ko pa rin siya.",
    "since then, you’ve made even the most ordinary days feel special. i love how you make me laugh and put me at ease, even when i’m exhausted. you make me want to be a better person, and i’m grateful for every moment we share.",
    "my wish for you this birthday is good health, big wins, all the things you dream of, and plenty of good food. i hope this year brings you as much joy and love as you bring to me. i can’t wait to see what adventures we’ll have together.",
],
  photos: ["photos1.jpeg", "photos2.jpg", "photos3.jpg"],
  spacing: "                                                                                                                                                                                    ",
  ps: " ps. i hope you like the game i made for you. i know it’s not perfect, but i made it with love and a lot of sweat (and tears).",
  sign: "- aefy baby",
};

const END_MESSAGE = [
  "HAPPY BIRTHDAY, SHAWN!",
  "NOW THAT YOU CLEARED EVERY LEVEL,",
  "THE REAL PRIZE IS ON ITS WAY.",
  "I LOVE YOU, BABY!",
];

const W = 400, H = 225;
const cv = document.getElementById("c");
const ctx = cv.getContext("2d");
ctx.imageSmoothingEnabled = false;
const FONT = "'Press Start 2P', monospace";

const SPEED = 1.8, ACCEL = 0.35, JUMP = -5.6, GRAV = 0.3;

const S = (x, y, w, h) => ({ k: "s", x, y, w, h: h || 8 });
const GR = (x, y, w) => ({ k: "s", x, y, w, h: 40, ground: true });
const C = (x, y, w) => ({ k: "c", x, y, w, h: 8, t: -1, gone: false });
const G = (x, y, w) => ({ k: "g", x, y, w, h: 8, hit: 0 });
const HID = (x, y, w) => ({ k: "h", x, y, w, h: 8, seen: false });
const M = (x0, y0, dx, dy, sp, w) => ({ k: "m", x0, y0, dx, dy, sp, w: w || 40, h: 8, x: x0, y: y0, mdx: 0, mdy: 0 });
const SP = (x, y, w) => ({ k: "sp", x, y, w });                             // spikes
const POP = (x, y, w, from) => ({ k: "pop", x, y, w, from, up: 0, on: false });
const FLAG = (x, y) => ({ k: "flag", x, y });
const FF = (x, y, win) => ({ k: "ff", x, y, win: !!win });
const CP = (x, y) => ({ k: "cp", x, y });
const FCP = (x, y) => ({ k: "fcp", x, y });
const REV = (x, w) => ({ k: "rev", x, w });
const opt = (id, label, icon) => ({ id, label, icon });
const pick = (x, y, key, o) => ({ k: "pick", x, y, key, id: o.id, label: o.label, icon: o.icon });
const bad = (x, y, label, icon, msg) => ({ k: "bad", x, y, label, icon, msg });
const MAIL = (x, y) => ({ k: "letter", x, y, real: true });
const FAKEDOC = (x, y) => ({ k: "letter", x, y, real: false });

function fork(b, key, hi, lo, decoy) {
  return [
    S(b + 30, 140, 50), S(b + 110, 125, 50), S(b + 190, 140, 50), S(b + 265, 165, 30),
    pick(b + 135, 113, key, hi),
    GR(b + 30, 190, 70), C(b + 130, 190, 40), GR(b + 200, 190, 60),
    bad(b + 55, 178, decoy[0], decoy[1], decoy[2]),
    pick(b + 230, 178, key, lo),
  ];
}

const LEVELS = [
  { name: "TUTORIAL (IT'S EASY, TRUST ME)", w: 900, bg: ["#2a1b5e", "#5b3a9e"], pal: ["#4ec04e", "#6b4a2b"], spawn: [20, 170],
    build: () => [
      GR(0, 190, 120), GR(150, 190, 60), S(240, 175, 50), C(320, 160, 40), S(390, 175, 50), CP(410, 175),
      S(470, 175, 70), POP(505, 175, 20, 455), S(570, 175, 40), S(640, 160, 60), FF(655, 160),
      S(730, 175, 50), GR(810, 190, 90), FLAG(870, 190),
    ] },

  { name: "BREAKFAST OF CHAMPIONS", w: 830, bg: ["#5e2a1b", "#c9733a"], pal: ["#7fd35a", "#7a4a2a"], spawn: [20, 170],
    build: () => [
      GR(0, 190, 110), S(140, 185, 50), S(220, 170, 50),
      ...fork(270, "cake", opt("Red Ribbon Black Forest", "BLACK FOREST", "emoji:🍮"), opt("Red Ribbon Tiramisu", "TIRAMISU", "emoji:🍰"),
              ["BROCCOLI", "emoji:🥦", "BROCCOLI?? WHO PUT THAT HERE"]),
      GR(560, 190, 270), CP(580, 190), POP(650, 190, 20, 625), FLAG(780, 190),
    ] },

  { name: "TRUST ISSUES", w: 1150, bg: ["#0f3b4a", "#2a8aa0"], pal: ["#6fd0c8", "#2f5a66"], spawn: [20, 170],
    build: () => [
      GR(0, 190, 100), S(130, 190, 40), G(200, 190, 40), S(195, 162, 30), S(250, 155, 30),
      GR(310, 190, 70), CP(330, 190),
      REV(390, 230), S(410, 185, 40), S(480, 185, 40), S(550, 185, 40),
      GR(620, 190, 80), FAKEDOC(660, 178),
      GR(730, 190, 140), POP(780, 190, 24, 750), FCP(830, 190),
      C(900, 185, 50), FF(925, 185), C(980, 185, 30), GR(1040, 190, 110), FLAG(1100, 190),
    ] },

  { name: "FOOD COURT SPEEDRUN", w: 1280, bg: ["#3b0f1f", "#a2324c"], pal: ["#ffd23f", "#7a3a2a"], spawn: [20, 170],
    build: () => [
      GR(0, 190, 100), S(130, 185, 50), S(210, 170, 40),
      ...fork(250, "snack", opt("J.CO Donuts", "DONUTS", "emoji:🍩"), opt("Buffalo Chicken", "BUFFALO", "emoji:🍗"),
              ["CABBAGE", "emoji:🥬", "CABBAGE. REALLY?"]),
      GR(540, 190, 160), CP(560, 190), POP(600, 190, 20, 575),
      S(730, 170, 40),
      ...fork(770, "drink", opt("Coke", "COKE", "emoji:🥤"), opt("Royal", "ROYAL", "emoji:🍹"),
              ["EXPIRED MILK", "emoji:🥛", "THAT MILK IS EXPIRED"]),
      GR(1060, 190, 220), POP(1120, 190, 20, 1095), FLAG(1230, 190),
    ] },

  { name: "IT'S GIVING SPIKES", w: 1340, bg: ["#1b1145", "#6a2c91"], pal: ["#c77dff", "#3a2a5a"], spawn: [20, 170],
    build: () => [
      GR(0, 190, 90), M(175, 190, 45, 0, 0.035), GR(260, 190, 60),
      C(350, 175, 30), C(400, 160, 30), C(450, 145, 30),
      S(500, 130, 70), POP(525, 130, 24, 495), CP(545, 130),
      S(600, 150, 40), M(670, 160, 0, 30, 0.04), S(740, 150, 60),
      HID(840, 155, 30), HID(900, 160, 30), S(960, 170, 70), CP(990, 170),
      GR(1060, 190, 280), POP(1110, 190, 24, 1080), POP(1190, 190, 24, 1160), FLAG(1290, 190),
    ] },

  { name: "WARDROBE MALFUNCTION", w: 1340, bg: ["#14301f", "#2e7a4a"], pal: ["#9be564", "#5a3a22"], spawn: [20, 170],
    build: () => [
      GR(0, 190, 100), S(130, 185, 50), S(210, 170, 40),
      ...fork(250, "color", opt("Black", "BLACK", "flag:#111111"), opt("Blue", "BLUE", "flag:#2f6bff"),
              ["HOT PINK", "flag:#ff5ca8", "PINK IS NOT YOUR COLOR"]),
      GR(540, 190, 100), CP(555, 190), M(675, 190, 35, 0, 0.03), S(790, 170, 40),
      ...fork(830, "clothes", opt("Wide pajama-like bottoms", "WIDE PANTS", "pants:wide"), opt("Jorts", "JORTS", "pants:jorts"),
              ["SUIT & TIE", "emoji:👔", "SUIT & TIE? NOT TODAY"]),
      GR(1120, 190, 220), POP(1170, 190, 24, 1145), FLAG(1290, 190),
    ] },

  { name: "THE REAL FINAL LEVEL (PROMISE)", w: 1440, bg: ["#3d0f0f", "#d1344f"], pal: ["#ff9f43", "#5a2a1a"], spawn: [20, 170],
    build: () => [
      GR(0, 190, 90), C(120, 185, 30), C(180, 185, 30), C(240, 185, 30), S(300, 170, 50), CP(320, 170),
      REV(360, 210), S(380, 170, 40), S(450, 170, 40), S(520, 170, 40),
      S(590, 170, 90), FF(625, 170, true), S(710, 170, 40),
      M(825, 170, 40, 0, 0.03), S(940, 150, 50), CP(950, 150),
      HID(1030, 150, 30), HID(1090, 155, 30),
      S(1150, 170, 110), MAIL(1200, 158),
      GR(1290, 190, 150), FLAG(1380, 190),
    ] },
];

const TAUNTS = [
  "SKILL ISSUE", "BOO", "IT'S EASY, REMEMBER?", "NICE JUMP... INTO THE VOID", "LMAO",
  "TOUCH GRASS (NOT THIS GRASS)", "THE FLOOR SAYS HI", "ARE YOU EVEN TRYING", "HAVE YOU TRIED JUMPING?",
  "THAT WAS A CHECKPOINT. WAS.", "LAG. (IT WASN'T LAG)", "BIRTHDAY BOY MOMENT", "OLD AGE IS HITTING EARLY",
  "AGE +1, REFLEXES -1", "PLEASE DON'T BREAK YOUR DEVICE",
];

const state = {
  screen: "title", level: 0, frame: 0, flash: 0, shake: 0, paused: false,
  answers: {}, deaths: 0, lvlDeaths: 0, session: Math.random().toString(36).slice(2, 10),
  cp: null, ents: [], toast: null, taunt: null, letterRead: false, cardT: 0, rev: false,
  clearT: 0, fw: 0, jk: 0, endT: 0, endReady: false,
};
const P = { x: 20, y: 150, w: 10, h: 14, vx: 0, vy: 0, ground: false, coyote: 0, face: 1, on: null };
const look = { color: "#e0b030", pants: "default" };
const keys = { left: false, right: false, jump: false };
let jumpHeld = false, cam = 0;
let particles = [];

let ac = null;
function beep(f, d, type, vol, slide) {
  try {
    if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === "suspended") ac.resume();
    const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
    o.type = type || "square"; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.linearRampToValueAtTime(Math.max(30, f + slide), t + d);
    g.gain.setValueAtTime(vol || 0.04, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d);
  } catch (e) {}
}

function saveAnswer(key, value) {
  const payload = { session: state.session, key, value, time: new Date().toISOString() };
  try {
    const q = JSON.parse(localStorage.getItem("obbyq") || "[]");
    q.push(payload);
    localStorage.setItem("obbyq", JSON.stringify(q));
  } catch (e) {}
  flushQueue();
}
let flushing = false;
async function flushQueue() {
  if (flushing || !SHEET_URL.startsWith("http")) return;
  flushing = true;
  try {
    const q = JSON.parse(localStorage.getItem("obbyq") || "[]");
    while (q.length) {
      await fetch(SHEET_URL, { method: "POST", mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(q[0]) });
      q.shift();
      localStorage.setItem("obbyq", JSON.stringify(q));
    }
  } catch (e) { /* retry on next answer / reload */ }
  flushing = false;
}
window.addEventListener("online", flushQueue);
flushQueue();

const ov = document.getElementById("ov");
function showOverlay(data) {
  state.paused = true; keys.left = keys.right = keys.jump = false;
  document.getElementById("ovTitle").textContent = data.title;
  const body = document.getElementById("ovBody"); body.innerHTML = "";
  data.lines.forEach(t => { const p = document.createElement("p"); p.textContent = t; body.appendChild(p); });
  const ph = document.getElementById("ovPhotos"); ph.innerHTML = "";
  (data.photos || []).forEach(src => {
    const f = document.createElement("div"); f.className = "polaroid";
    const im = new Image(); im.alt = ""; im.onerror = () => f.remove(); im.src = src;
    f.appendChild(im); ph.appendChild(f);
  });
  document.getElementById("ovSign").textContent = data.sign || "";
  ov.hidden = false;
}
function closeOverlay() { ov.hidden = true; state.paused = false; jumpHeld = true; }
document.getElementById("ovClose").addEventListener("click", closeOverlay);

const map = { ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right",
  ArrowUp: "jump", KeyW: "jump", Space: "jump" };
addEventListener("keydown", e => {
  if (!ov.hidden) { if (e.code === "Enter" || e.code === "Escape") closeOverlay(); return; }
  if (map[e.code]) { keys[map[e.code]] = true; e.preventDefault(); }
  if (e.code === "Enter" || e.code === "Space") startIfNeeded();
});
addEventListener("keyup", e => { if (map[e.code]) keys[map[e.code]] = false; });
function bindBtn(id, k) {
  const el = document.getElementById(id);
  const on = e => { e.preventDefault(); keys[k] = true; startIfNeeded(); };
  const off = e => { e.preventDefault(); keys[k] = false; };
  el.addEventListener("pointerdown", on);
  el.addEventListener("pointerup", off);
  el.addEventListener("pointerleave", off);
  el.addEventListener("pointercancel", off);
}
bindBtn("left", "left"); bindBtn("right", "right"); bindBtn("jump", "jump");
cv.addEventListener("pointerdown", startIfNeeded);

function startIfNeeded() {
  beep(1, 0.01, "square", 0.0001); // unlocks audio on first touch
  if (state.screen === "title") { state.deaths = 0; loadLevel(0); state.screen = "play"; beep(660, .12, "square", .05, 200); }
  else if (state.screen === "end" && state.endReady) { location.reload(); }
}

function buildEnts() {
  const L = LEVELS[state.level];
  return L.build().filter(e => {
    if (e.k === "pick" && state.answers[e.key]) return false;
    if (e.k === "letter" && e.real && state.letterRead) return false;
    return true;
  });
}
function respawn() {
  const L = LEVELS[state.level];
  const s = state.cp || L.spawn;
  state.ents = buildEnts();
  P.x = s[0]; P.y = s[1]; P.vx = 0; P.vy = 0; P.ground = false; P.coyote = 0; P.on = null;
  cam = Math.max(0, Math.min(L.w - W, P.x - 150));
}
function loadLevel(i) {
  state.level = i; state.cp = null; state.lvlDeaths = 0; state.cardT = 150; state.jk = 0;
  respawn();
}
function die(msg) {
  burst(P.x + 5, P.y + 7, 18, ["#ffffff", "#ff5c7a", "#ffd23f"]);
  state.deaths++; state.lvlDeaths++; state.shake = 10;
  beep(220, 0.3, "sawtooth", 0.06, -170);
  state.taunt = { text: msg || TAUNTS[(Math.random() * TAUNTS.length) | 0], t: 130 };
  respawn();
}
function toast(text, color) { state.toast = { text, color: color || "#ffe066", t: 100 }; }
function burst(x, y, n, cols) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * 6.28, s = 0.6 + Math.random() * 2;
    particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1, l: 30 + Math.random() * 20, c: cols[i % cols.length] });
  }
}

const ovl = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

function update() {
  state.frame++;
  if (state.flash > 0) state.flash--;
  if (state.shake > 0) state.shake--;
  for (const p of particles) { p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.l--; }
  particles = particles.filter(p => p.l > 0);
  if (state.toast && --state.toast.t <= 0) state.toast = null;
  if (state.taunt && --state.taunt.t <= 0) state.taunt = null;
  if (state.paused) return;

  if (state.screen === "clear") {
    if (--state.clearT <= 0) {
      if (state.level + 1 >= LEVELS.length) {
        saveAnswer("completed", "yes (oops: " + state.deaths + ")");
        state.screen = "end"; state.endT = 0; state.endReady = false;
        setTimeout(() => state.endReady = true, 7000);
      } else { loadLevel(state.level + 1); state.screen = "play"; }
    }
    return;
  }
  if (state.screen === "fakewin") {
    if (++state.fw > 170) { state.screen = "play"; die("THAT FLAG WAS FAKE. AGAIN."); }
    return;
  }
  if (state.screen !== "play") return;
  stepLevel();
}

function stepLevel() {
  const L = LEVELS[state.level];
  if (state.cardT > 0) state.cardT--;
  if (state.jk > 0 && --state.jk === 0) toast("...JK. LOL.", "#ff8fa3");

  // movers
  for (const e of state.ents) {
    if (e.k === "m") {
      const a = state.frame * e.sp;
      const nx = e.x0 + Math.sin(a) * e.dx, ny = e.y0 + Math.sin(a) * e.dy;
      e.mdx = nx - e.x; e.mdy = ny - e.y; e.x = nx; e.y = ny;
    }
  }

  state.rev = false;
  const cx = P.x + P.w / 2;
  for (const e of state.ents) if (e.k === "rev" && cx > e.x && cx < e.x + e.w) state.rev = true;
  let left = keys.left, right = keys.right;
  if (state.rev) { const t = left; left = right; right = t; }

  if (left) { P.vx -= ACCEL; P.face = -1; }
  if (right) { P.vx += ACCEL; P.face = 1; }
  if (!left && !right) P.vx *= 0.7;
  P.vx = Math.max(-SPEED, Math.min(SPEED, P.vx));

  if (P.ground) P.coyote = 6; else if (P.coyote > 0) P.coyote--;
  if (keys.jump && !jumpHeld && P.coyote > 0) { P.vy = JUMP; P.ground = false; P.coyote = 0; beep(520, 0.1, "square", 0.03, 220); }
  jumpHeld = keys.jump;
  if (!keys.jump && P.vy < -2) P.vy += 0.25;
  P.vy = Math.min(P.vy + GRAV, 6);

  const solids = state.ents.filter(e => e.k === "s" || e.k === "h" || e.k === "m" || (e.k === "c" && !e.gone));

  if (P.on && P.on.k === "m") { P.x += P.on.mdx; P.y += P.on.mdy; }

  P.x += P.vx;
  for (const p of solids) {
    if (P.x < p.x + p.w && P.x + P.w > p.x && P.y < p.y + p.h && P.y + P.h > p.y + 2) {
      if (p.k === "h") p.seen = true;
      if (P.vx > 0) P.x = p.x - P.w; else if (P.vx < 0) P.x = p.x + p.w;
      P.vx = 0;
    }
  }
  P.x = Math.max(0, Math.min(L.w - P.w, P.x));

  const prevBottom = P.y + P.h, prevTop = P.y;
  P.y += P.vy;
  P.ground = false; P.on = null;
  let landed = null;
  for (const p of solids) {
    if (P.x + P.w > p.x && P.x < p.x + p.w) {
      if (P.vy >= 0 && prevBottom <= p.y + 1 + (p.k === "m" ? 3 : 0) && P.y + P.h >= p.y) {
        P.y = p.y - P.h; P.vy = 0; P.ground = true; landed = p;
      } else if (P.vy < 0 && prevTop >= p.y + p.h - 1 && P.y < p.y + p.h) {
        P.y = p.y + p.h; P.vy = 0; if (p.k === "h") p.seen = true;
      }
    }
  }
  if (landed) {
    P.on = landed;
    if (landed.k === "c" && landed.t < 0) landed.t = 30;
    if (landed.k === "h") landed.seen = true;
  }

  for (const e of state.ents) {
    if (e.k === "c" && e.t > 0 && --e.t === 0) { e.gone = true; burst(e.x + e.w / 2, e.y + 4, 8, ["#8a6b4a", "#5a3a22"]); beep(120, .15, "sawtooth", .04, -60); }
    if (e.k === "g") {
      if (e.hit > 0) e.hit--;
      if (P.x + P.w > e.x && P.x < e.x + e.w && P.y + P.h > e.y - 2 && P.y < e.y + e.h) e.hit = 14;
    }
    if (e.k === "pop") {
      if (!e.on && P.x + P.w >= e.from && P.x <= e.x + e.w + 4) e.on = true;
      if (e.on && e.up < 6) e.up += 0.5;
    }
  }

  const pr = { x: P.x + 2, y: P.y + 3, w: P.w - 4, h: P.h - 3 };
  for (const e of state.ents) {
    if (e.k === "sp" && ovl(pr, { x: e.x + 2, y: e.y - 5, w: e.w - 4, h: 5 })) return die("OUCH. THAT WAS A SPIKE.");
    if (e.k === "pop" && e.up >= 4 && ovl(pr, { x: e.x + 2, y: e.y - e.up, w: e.w - 4, h: e.up })) return die("SURPRISE SPIKES!");
    if (e.k === "flag" && ovl(pr, { x: e.x - 2, y: e.y - 24, w: 14, h: 24 })) {
      if (state.level === LEVELS.length - 1 && !state.letterRead) {
        if (!state.toast) toast("FLAG LOCKED. CHECK YOUR MAIL!", "#ff8fa3");
      } else {
        state.screen = "clear"; state.clearT = 80; state.flash = 12; beep(880, .3, "square", .05, 440);
        burst(P.x, P.y, 24, ["#ffe066", "#ff5c7a", "#4ec0ff"]);
        return;
      }
    }
    if (e.k === "ff" && ovl(pr, { x: e.x - 2, y: e.y - 24, w: 14, h: 24 })) {
      if (e.win) { state.screen = "fakewin"; state.fw = 0; beep(880, .3, "square", .05, 440); return; }
      return die("FAKE FLAG. HAHA.");
    }
    if (e.k === "cp" && ovl(pr, { x: e.x - 2, y: e.y - 16, w: 12, h: 16 })) {
      const s = [e.x - 2, e.y - 15];
      if (!state.cp || state.cp[0] !== s[0] || state.cp[1] !== s[1]) { state.cp = s; toast("CHECKPOINT!", "#7dff7d"); beep(700, .12, "square", .04, 300); }
    }
    if (e.k === "fcp" && ovl(pr, { x: e.x - 2, y: e.y - 16, w: 12, h: 16 }) && !e.used) {
      e.used = true; state.cp = null; toast("CHECKPOINT SAVED!", "#7dff7d"); state.jk = 55; beep(700, .12, "square", .04, 300);
    }
    if (e.k === "pick" && ovl(pr, { x: e.x - 8, y: e.y - 9, w: 16, h: 18 })) { takePick(e); return; }
    if (e.k === "bad" && ovl(pr, { x: e.x - 8, y: e.y - 9, w: 16, h: 18 })) return die(e.msg);
    if (e.k === "letter" && ovl(pr, { x: e.x - 8, y: e.y - 9, w: 16, h: 18 })) {
      if (e.real) {
        state.letterRead = true; state.ents = state.ents.filter(x => x !== e);
        saveAnswer("letter", "opened"); beep(880, .25, "square", .05, 330);
        showOverlay(LETTER);
      } else {
        state.ents = state.ents.filter(x => x !== e);
        showOverlay({ title: "SKILL_ISSUE.TXT", lines: ["ako naman ang mang-aasar sa 'yo ;P"], photos: [], sign: "- pikunin" });
      }
      return;
    }
  }

  if (P.y > H + 30) die();
}

function takePick(e) {
  state.answers[e.key] = e.id;
  saveAnswer(e.key, e.id);
  state.ents = state.ents.filter(x => !(x.k === "pick" && x.key === e.key));
  if (e.key === "color") look.color = e.id === "Black" ? "#222222" : "#2f6bff";
  if (e.key === "clothes") look.pants = e.id.startsWith("Wide") ? "wide" : "jorts";
  const msg = { cake: "YUM! +10 HP", snack: "SNACK ACQUIRED!", drink: "HYDRATED! +1 SPEED", color: "SKIN UPDATED!", clothes: "NEW FIT EQUIPPED!" };
  toast(msg[e.key] || "NICE!", "#7dff7d");
  state.flash = 8; beep(660, .15, "square", .05, 330);
  burst(e.x, e.y, 14, ["#ffe066", "#ffffff", "#7dff7d"]);
}

// ---------- drawing ----------
function text(str, x, y, size, color, align) {
  ctx.font = size + "px " + FONT;
  ctx.textAlign = align || "left";
  ctx.fillStyle = "#000"; ctx.fillText(str, x + 1, y + 1);
  ctx.fillStyle = color || "#fff"; ctx.fillText(str, x, y);
}

function drawSky(c1, c2, parallax) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 34; i++) {
    const sx = (((i * 97 + 13) - cam * parallax * 0.2) % W + W) % W, sy = (i * 53 + 7) % 120;
    if ((state.frame + i * 11) % 60 < 40) { ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.fillRect(sx | 0, sy, 1, 1); }
  }
  if (parallax) {
    ctx.fillStyle = "rgba(0,0,0,.22)";
    for (let x = 0; x < W; x += 4) {
      const wx = x + cam * 0.3, hh = 38 + Math.sin(wx * 0.02) * 14 + Math.sin(wx * 0.053) * 8;
      ctx.fillRect(x, H - hh | 0, 4, hh);
    }
  }
}

function drawPlat(p, pal, style) {
  let x = p.x;
  if (style === "crumble" && p.t > 0) x += (state.frame % 2 ? 1 : -1);
  const top = style === "mover" ? "#8fe0ff" : pal[0], body = style === "mover" ? "#3a7fa3" : (style === "crumble" ? "#8a6b4a" : pal[1]);
  ctx.fillStyle = body; ctx.fillRect(x, p.y, p.w, p.h);
  ctx.fillStyle = top; ctx.fillRect(x, p.y, p.w, 3);
  ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.fillRect(x, p.y + 3, p.w, 1);
  ctx.fillStyle = "rgba(0,0,0,.2)";
  for (let yy = p.y + 6; yy < p.y + p.h; yy += 8)
    for (let xx = x + 3 + ((yy / 8 | 0) % 2) * 3; xx < x + p.w - 2; xx += 7) ctx.fillRect(xx, yy, 2, 1);
  if (style === "crumble") { ctx.fillStyle = "rgba(0,0,0,.4)"; ctx.fillRect(x + 8, p.y + 3, 1, 5); ctx.fillRect(x + p.w - 10, p.y + 3, 1, 5); }
}

function drawSpikes(x, y, w, up) {
  const h = up === undefined ? 6 : up;
  if (h <= 0) return;
  ctx.fillStyle = "#e8e8f0";
  for (let sx = x; sx < x + w; sx += 6) {
    for (let r = 0; r < h; r++) { const half = Math.max(0, 3 - Math.floor(r / 2)); ctx.fillRect(sx + 3 - half, y - 1 - r, Math.max(1, half * 2), 1); }
  }
  ctx.fillStyle = "#8a8a9e"; ctx.fillRect(x, y - 1, w, 1);
}

function drawFlag(x, y) {
  ctx.fillStyle = "#ddd"; ctx.fillRect(x, y - 24, 2, 24);
  ctx.fillStyle = "#ffe066"; ctx.fillRect(x - 1, y - 25, 4, 2);
  const wave = Math.round(Math.sin(state.frame / 8));
  ctx.fillStyle = "#ffd23f"; ctx.fillRect(x + 2, y - 23, 11, 8);
  ctx.fillStyle = "#e8a800"; ctx.fillRect(x + 2, y - 23 + wave, 11, 2);
  ctx.fillStyle = "#fff"; ctx.fillRect(x + 6, y - 20, 3, 3);
}
function drawCP(x, y, on) {
  ctx.fillStyle = "#ccc"; ctx.fillRect(x, y - 16, 2, 16);
  ctx.fillStyle = on ? "#7dff7d" : "#4ec0ff"; ctx.fillRect(x + 2, y - 16, 7, 5);
}

function drawPants(x, y, type) {
  if (type === "jorts") {
    ctx.fillStyle = "#5b86c7"; ctx.fillRect(x, y, 14, 4); ctx.fillRect(x, y + 4, 6, 4); ctx.fillRect(x + 8, y + 4, 6, 4);
    ctx.fillStyle = "#3a5c96"; ctx.fillRect(x, y, 14, 1);
  } else {
    ctx.fillStyle = "#8f8fa8"; ctx.fillRect(x, y, 16, 4); ctx.fillRect(x - 1, y + 4, 8, 9); ctx.fillRect(x + 9, y + 4, 8, 9);
    ctx.fillStyle = "#6c6c88"; ctx.fillRect(x, y, 16, 1);
  }
}

function drawIcon(icon, cx, cy) {
  const [kind, val] = icon.split(":");
  const bob = Math.round(Math.sin(state.frame / 10) * 2);
  if (kind === "emoji") {
    ctx.font = "16px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#fff";
    ctx.fillText(val, cx, cy + 6 + bob);
  } else if (kind === "flag") {
    ctx.fillStyle = "#ddd"; ctx.fillRect(cx - 7, cy - 9 + bob, 2, 18);
    ctx.fillStyle = val; ctx.fillRect(cx - 5, cy - 9 + bob, 13, 9);
    ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.fillRect(cx - 5, cy - 9 + bob, 13, 2);
  } else if (kind === "pants") {
    drawPants(cx - 7, cy - 6 + bob, val);
  }
}

function drawLabel(label, cx, y) {
  text(label, cx, y, 6, "#ffe066", "center");
}

function drawEnvelope(x, y, real) {
  const bob = Math.round(Math.sin(state.frame / 9) * 2);
  const glow = (state.frame % 40) < 20;
  if (real) {
    ctx.fillStyle = glow ? "rgba(255,230,120,.45)" : "rgba(255,230,120,.25)"; ctx.fillRect(x - 10, y - 10 + bob, 20, 20);
    ctx.fillStyle = "#fff"; ctx.fillRect(x - 7, y - 5 + bob, 14, 10);
    ctx.fillStyle = "#d9d9e6"; ctx.fillRect(x - 7, y - 5 + bob, 14, 1); ctx.fillRect(x - 6, y - 4 + bob, 12, 1); ctx.fillRect(x - 4, y - 3 + bob, 8, 1);
    ctx.fillStyle = "#e0405e"; ctx.fillRect(x - 1, y - 1 + bob, 3, 3);
    drawLabel("NEW MAIL!", x, y - 14 + bob);
  } else {
    ctx.fillStyle = "#fff"; ctx.fillRect(x - 5, y - 7 + bob, 11, 14);
    ctx.fillStyle = "#9aa"; for (let i = 0; i < 4; i++) ctx.fillRect(x - 3, y - 4 + bob + i * 3, 7, 1);
    drawLabel("README.TXT", x, y - 11 + bob);
  }
}

function drawPlayer() {
  const x = Math.round(P.x), y = Math.round(P.y);
  ctx.fillStyle = "#f3c9a0"; ctx.fillRect(x + 1, y, 8, 6);
  ctx.fillStyle = "#2b1b0e"; ctx.fillRect(x + 1, y, 8, 2);
  ctx.fillStyle = "#000"; ctx.fillRect(x + (P.face > 0 ? 6 : 2), y + 3, 1, 1);
  ctx.fillStyle = look.color; ctx.fillRect(x, y + 6, 10, 4);
  ctx.fillStyle = "rgba(255,255,255,.2)"; ctx.fillRect(x, y + 6, 10, 1);
  const step = P.ground && Math.abs(P.vx) > 0.3 && state.frame % 12 < 6;
  if (look.pants === "wide") {
    ctx.fillStyle = "#8f8fa8"; ctx.fillRect(x - 1, y + 10, 12, 4);
    ctx.fillStyle = "#6c6c88"; ctx.fillRect(x - 1, y + 10, 12, 1);
  } else if (look.pants === "jorts") {
    ctx.fillStyle = "#5b86c7"; ctx.fillRect(x, y + 10, 10, 2);
    ctx.fillStyle = "#f3c9a0"; ctx.fillRect(x + 1, y + 12, 3, 2); ctx.fillRect(x + 6, y + 12, 3, 2);
  } else {
    ctx.fillStyle = "#3b3b5c"; ctx.fillRect(x + 1, y + 10, 3, 4); ctx.fillRect(x + 6, y + 10, 3, 4);
  }
  ctx.fillStyle = "#fff";
  ctx.fillRect(x + (step ? 0 : 1), y + 13, 4, 1); ctx.fillRect(x + (step ? 6 : 5), y + 13, 4, 1);
}

function drawWorld() {
  const L = LEVELS[state.level];
  drawSky(L.bg[0], L.bg[1], 1);
  ctx.save();
  ctx.translate(-Math.round(cam), 0);
  for (const e of state.ents) {
    switch (e.k) {
      case "rev": ctx.fillStyle = "rgba(180,60,255,.12)"; ctx.fillRect(e.x, 0, e.w, H);
        text("? ? ?", e.x + e.w / 2, 40, 8, "#d9a8ff", "center"); break;
      case "s": drawPlat(e, L.pal); break;
      case "c": if (!e.gone) drawPlat(e, L.pal, "crumble"); break;
      case "g": ctx.globalAlpha = e.hit > 0 && state.frame % 4 < 2 ? 0.3 : 1; drawPlat(e, L.pal); ctx.globalAlpha = 1; break;
      case "h":
        if (e.seen) drawPlat(e, L.pal);
        else if ((state.frame + (e.x | 0)) % 30 < 8) { ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.fillRect(e.x + ((state.frame * 3) % e.w), e.y, 1, 1); ctx.fillRect(e.x + ((state.frame * 5) % e.w), e.y + 3, 1, 1); }
        break;
      case "m": drawPlat(e, L.pal, "mover"); break;
      case "sp": drawSpikes(e.x, e.y, e.w); break;
      case "pop": drawSpikes(e.x, e.y, e.w, Math.floor(e.up)); break;
      case "flag": case "ff": drawFlag(e.x, e.y); break;
      case "cp": drawCP(e.x, e.y, state.cp && state.cp[0] === e.x - 2); break;
      case "fcp": drawCP(e.x, e.y, e.used); break;
      case "pick": case "bad": drawIcon(e.icon, e.x, e.y); drawLabel(e.label, e.x, e.y - 14); break;
      case "letter": drawEnvelope(e.x, e.y, e.real); break;
    }
  }
  drawPlayer();
  for (const p of particles) { ctx.fillStyle = p.c; ctx.fillRect(p.x | 0, p.y | 0, 2, 2); }
  ctx.restore();
}

function drawHUD() {
  const L = LEVELS[state.level];
  text("LV " + (state.level + 1) + "/" + LEVELS.length, 6, 12, 7, "#fff");
  text("OOPS x" + state.deaths, W - 6, 12, 7, "#ffb3b3", "right");
  const rage = Math.min(1, state.lvlDeaths / 12);
  ctx.fillStyle = "#000"; ctx.fillRect(W - 62, 17, 56, 7);
  ctx.fillStyle = rage > 0.66 ? "#ff3b3b" : (rage > 0.33 ? "#ff9f43" : "#7dff7d"); ctx.fillRect(W - 61, 18, Math.round(54 * rage), 5);
  text("RAGE", W - 66, 24, 5, "#ffb3b3", "right");
  if (state.rev) text("CONTROLS: INVERTED", W / 2, 24, 7, "#d9a8ff", "center");
  if (state.cardT > 0) {
    const a = Math.min(1, state.cardT / 30);
    ctx.globalAlpha = a;
    ctx.fillStyle = "rgba(0,0,0,.45)"; ctx.fillRect(0, 44, W, 36);
    text("LEVEL " + (state.level + 1), W / 2, 60, 8, "#ffe066", "center");
    text(L.name, W / 2, 74, 8, "#fff", "center");
    ctx.globalAlpha = 1;
  }
  if (state.toast) text(state.toast.text, W / 2, 110, 8, state.toast.color, "center");
  if (state.taunt) text(state.taunt.text, W / 2, 212, 8, "#ffe066", "center");
  if (state.flash > 0) { ctx.fillStyle = "rgba(255,255,255," + (state.flash / 24) + ")"; ctx.fillRect(0, 0, W, H); }
}

function drawCake(cx, y) {
  ctx.fillStyle = "#e8e8f0"; ctx.fillRect(cx - 50, y + 46, 100, 4);
  ctx.fillStyle = "#8a4b2a"; ctx.fillRect(cx - 40, y + 26, 80, 20);
  ctx.fillStyle = "#ff8fb3"; ctx.fillRect(cx - 40, y + 26, 80, 5);
  for (let i = -36; i < 40; i += 12) ctx.fillRect(cx + i, y + 31, 4, 4 + (i % 3 === 0 ? 3 : 1));
  ctx.fillStyle = "#ffd23f"; for (let i = -30; i < 36; i += 14) ctx.fillRect(cx + i, y + 40, 2, 2);
  ctx.fillStyle = "#a85c34"; ctx.fillRect(cx - 26, y + 10, 52, 16);
  ctx.fillStyle = "#ffd1e0"; ctx.fillRect(cx - 26, y + 10, 52, 4);
  for (const i of [-14, 0, 14]) {
    ctx.fillStyle = "#4ec0ff"; ctx.fillRect(cx + i - 1, y, 3, 10);
    ctx.fillStyle = ((state.frame >> 2) + i) % 2 ? "#ffd23f" : "#ff9f43"; ctx.fillRect(cx + i - 1, y - 5, 3, 4);
    ctx.fillStyle = "#fff"; ctx.fillRect(cx + i, y - 4, 1, 2);
  }
}

function drawTitle() {
  drawSky("#150d38", "#6a2c91", 0);
  // skyline
  ctx.fillStyle = "#0e0828";
  for (let i = 0; i < 14; i++) { const bx = i * 30 - 4, bh = 30 + ((i * 37) % 40); ctx.fillRect(bx, H - bh, 24, bh); }
  ctx.fillStyle = "#ffd23f";
  for (let i = 0; i < 14; i++) { const bx = i * 30 - 4, bh = 30 + ((i * 37) % 40); for (let r = 0; r < 4; r++) if ((i * 7 + r * 3 + (state.frame >> 5)) % 5 === 0) ctx.fillRect(bx + 4 + (r % 2) * 10, H - bh + 6 + r * 9, 3, 3); }
  // balloons
  for (let i = 0; i < 7; i++) {
    const bx = 14 + i * 58, by = 230 - ((state.frame * 0.5 + i * 40) % 260);
    ctx.fillStyle = ["#ff5c7a", "#ffd23f", "#4ec0ff", "#7dff7d", "#c77dff", "#ff9f43", "#ff5c7a"][i];
    ctx.fillRect(bx, by, 10, 12); ctx.fillRect(bx + 1, by - 1, 8, 1); ctx.fillRect(bx + 4, by + 12, 2, 3);
    ctx.fillStyle = "#fff"; ctx.fillRect(bx + 2, by + 2, 2, 3);
  }
  text("A BIRTHDAY OBBY", W / 2, 30, 6, "#c9b8ff", "center");
  text(HIS_NAME + "'S", W / 2, 58, 20, "#ffe066", "center");
  text("EXTRA LIFE", W / 2, 82, 16, "#ffffff", "center");
  const pop = Math.abs(Math.sin(state.frame / 14)) * 4;
  text("+1", 328, 62 - pop, 12, "#7dff7d", "left");
  drawCake(W / 2, 98);
  text("HAPPY 20TH BIRTHDAY!", W / 2, 170, 7, "#fff", "center");
  text("SANA WALANG SKILL ISSUES XD", W / 2, 184, 6, "#c9b8ff", "center");
  if (state.frame % 50 < 32) text("PRESS START", W / 2, 210, 9, "#ffe066", "center");
}

const confetti = Array.from({ length: 60 }, (_, i) => ({
  x: Math.random() * W, y: Math.random() * H, v: 0.6 + Math.random() * 1.2,
  c: ["#ff5c7a", "#ffd23f", "#4ec0ff", "#7dff7d", "#c77dff"][i % 5],
}));
function drawConfetti() {
  for (const c of confetti) { c.y += c.v; if (c.y > H) { c.y = -4; c.x = Math.random() * W; } ctx.fillStyle = c.c; ctx.fillRect(c.x | 0, c.y | 0, 3, 3); }
}

function drawFakeWin() {
  drawSky("#1b1145", "#6a2c91", 0); drawConfetti();
  if (state.fw < 100) {
    text("YOU WIN!", W / 2, 90, 20, "#ffe066", "center");
    text("LEVEL CLEARED. GOOD JOB.", W / 2, 120, 8, "#fff", "center");
  } else {
    if (state.fw % 6 < 3) { ctx.fillStyle = "rgba(255,0,60,.25)"; ctx.fillRect(0, 0, W, H); }
    text("...JUST KIDDING.", W / 2, 100, 14, "#ff5c7a", "center");
    text("IT WAS A FAKE FLAG.", W / 2, 124, 8, "#fff", "center");
  }
}

function drawEnd() {
  state.endT++;
  drawSky("#1b1145", "#6a2c91", 0); drawConfetti();
  text("YOU WIN!", W / 2, 38, 16, "#ffe066", "center");
  const shown = Math.floor(state.endT / 45);
  END_MESSAGE.forEach((ln, i) => { if (i <= shown) text(ln, W / 2, 78 + i * 20, i === 0 ? 9 : 8, i === END_MESSAGE.length - 1 ? "#ff8fa3" : "#fff", "center"); });
  if (shown > END_MESSAGE.length) text("TOTAL OOPS: " + state.deaths, W / 2, 178, 8, "#ffb3b3", "center");
  if (state.endReady && state.frame % 50 < 30) text("TAP TO PLAY AGAIN", W / 2, 210, 6, "#9a8cc9", "center");
}

function render() {
  ctx.save();
  if (state.shake > 0) ctx.translate((Math.random() - .5) * 4, (Math.random() - .5) * 4);
  ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
  if (state.screen === "title") drawTitle();
  else if (state.screen === "end") drawEnd();
  else if (state.screen === "fakewin") drawFakeWin();
  else {
    const L = LEVELS[state.level];
    const target = Math.max(0, Math.min(L.w - W, P.x + P.w / 2 - 150));
    cam += (target - cam) * 0.15;
    drawWorld(); drawHUD();
    if (state.screen === "clear") {
      ctx.fillStyle = "rgba(0,0,0,.5)"; ctx.fillRect(0, 85, W, 50);
      text("LEVEL CLEAR!", W / 2, 118, 14, "#ffe066", "center");
    }
  }
  ctx.restore();
}

let last = 0, acc = 0;
function loop(t) {
  acc += Math.min(t - last, 100); last = t;
  while (acc >= 1000 / 60) { update(); acc -= 1000 / 60; }
  render();
  requestAnimationFrame(loop);
}
(document.fonts && document.fonts.load ? document.fonts.load("8px 'Press Start 2P'") : Promise.resolve())
  .catch(() => {}).then(() => requestAnimationFrame(loop));
