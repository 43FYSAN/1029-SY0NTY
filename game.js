// ============ CONFIG (edit these) ============
const SHEET_URL = "https://script.google.com/macros/s/AKfycbwImWkDcTPmR_TqaVgNfaFD8zmVdk72kiSExGqMCp2wKHn3OdJjIqMW9y2JxJe9nddF/exec";
const HIS_NAME = "SHAWN";
const BIRTHDAY_MESSAGE = [
  "HAPPY BIRTHDAY, SHAWN!",
  "YOU CLEARED EVERY LEVEL.",
  "THANK YOU FOR BEING MY",
  "FAVORITE PLAYER 2.",
  "I LOVE YOU!",
];
// =============================================

const W = 400, H = 225;
const cv = document.getElementById("c");
const ctx = cv.getContext("2d");
ctx.imageSmoothingEnabled = false;
const FONT = "'Press Start 2P', monospace";

// ---------- stages ----------
// Each stage: title, hint, key (saved to sheet), two options, and a platform layout.
const FORK = [ // shared fork at the end: high pedestal (A) and low pedestal (B)
  { x: 290, y: 110, w: 44, h: 8, ped: 0 },
  { x: 312, y: 185, w: 64, h: 8, ped: 1 },
];
const STAGES = [
  { title: "LEVEL 1", hint: "GRAB A POWER-UP!", key: "cake",
    opts: [{ id: "Red Ribbon Black Forest", label: "BLACK FOREST", icon: "emoji:🍫" },
           { id: "Red Ribbon Tiramisu", label: "TIRAMISU", icon: "emoji:🍰" }],
    bg: ["#2a1b5e", "#5b3a9e"],
    plats: [{ x: 0, y: 185, w: 70, h: 40 }, { x: 100, y: 170, w: 44, h: 8 }, { x: 175, y: 150, w: 44, h: 8 },
            { x: 236, y: 160, w: 36, h: 8 }] },
  { title: "LEVEL 2", hint: "PICK YOUR SNACK!", key: "snack",
    opts: [{ id: "J.CO Donuts", label: "DONUTS", icon: "emoji:🍩" },
           { id: "Buffalo Chicken", label: "BUFFALO", icon: "emoji:🍗" }],
    bg: ["#0f3b4a", "#1f7a8c"],
    plats: [{ x: 0, y: 185, w: 60, h: 40 }, { x: 90, y: 175, w: 36, h: 8 }, { x: 150, y: 155, w: 36, h: 8 },
            { x: 205, y: 140, w: 36, h: 8 }, { x: 250, y: 160, w: 30, h: 8 }] },
  { title: "LEVEL 3", hint: "CHOOSE A DRINK!", key: "drink",
    opts: [{ id: "Coke", label: "COKE", icon: "emoji:🥤" },
           { id: "Royal", label: "ROYAL", icon: "emoji:🍊" }],
    bg: ["#3b0f1f", "#a2324c"],
    plats: [{ x: 0, y: 185, w: 56, h: 40 }, { x: 88, y: 172, w: 32, h: 8 }, { x: 152, y: 158, w: 32, h: 8 },
            { x: 214, y: 168, w: 28, h: 8 }, { x: 258, y: 150, w: 26, h: 8 }] },
  { title: "LEVEL 4", hint: "PICK A FLAG COLOR!", key: "color",
    opts: [{ id: "Black", label: "BLACK", icon: "flag:#111111" },
           { id: "Blue", label: "BLUE", icon: "flag:#2f6bff" }],
    bg: ["#14301f", "#2e7a4a"],
    plats: [{ x: 0, y: 185, w: 52, h: 40 }, { x: 84, y: 170, w: 30, h: 8 }, { x: 146, y: 155, w: 30, h: 8 },
            { x: 204, y: 140, w: 30, h: 8 }, { x: 252, y: 155, w: 28, h: 8 }] },
  { title: "FINAL LEVEL", hint: "EQUIP YOUR GEAR!", key: "clothes",
    opts: [{ id: "Wide pajama-like bottoms", label: "WIDE PANTS", icon: "pants:wide" },
           { id: "Jorts", label: "JORTS", icon: "pants:jorts" }],
    bg: ["#3d2a0a", "#c58a22"],
    plats: [{ x: 0, y: 185, w: 48, h: 40 }, { x: 80, y: 172, w: 28, h: 8 }, { x: 140, y: 158, w: 28, h: 8 },
            { x: 196, y: 142, w: 28, h: 8 }, { x: 246, y: 158, w: 28, h: 8 }] },
];

// ---------- state ----------
const state = {
  screen: "title", // title | play | choose | end
  stage: 0, frame: 0, flash: 0, shake: 0,
  answers: {}, deaths: 0, session: Math.random().toString(36).slice(2, 10),
};
const P = { x: 20, y: 150, w: 10, h: 14, vx: 0, vy: 0, ground: false, coyote: 0, face: 1 };
const look = { color: "#e0b030", pants: "default" };
const keys = { left: false, right: false, jump: false };
let jumpHeld = false;

function stagePlats() {
  const s = STAGES[state.stage];
  return s.plats.concat(FORK.map(f => ({ ...f })));
}

function resetPlayer() {
  P.x = 14; P.y = 160; P.vx = 0; P.vy = 0; P.ground = false; P.coyote = 0;
}

// ---------- saving ----------
function saveAnswer(key, value) {
  const payload = { session: state.session, key, value, time: new Date().toISOString() };
  try { // keep a local backup in case the network drops
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
    let q = JSON.parse(localStorage.getItem("obbyq") || "[]");
    while (q.length) {
      await fetch(SHEET_URL, { method: "POST", mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(q[0]) });
      q.shift();
      localStorage.setItem("obbyq", JSON.stringify(q));
    }
  } catch (e) { /* will retry on next answer / reload */ }
  flushing = false;
}
window.addEventListener("online", flushQueue);
flushQueue();

// ---------- input ----------
const map = { ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right",
  ArrowUp: "jump", KeyW: "jump", Space: "jump" };
addEventListener("keydown", e => {
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
  if (state.screen === "title") { state.screen = "play"; state.stage = 0; resetPlayer(); }
  else if (state.screen === "end" && state.endReady) { location.reload(); }
}

// ---------- update ----------
function update() {
  state.frame++;
  if (state.flash > 0) state.flash--;
  if (state.shake > 0) state.shake--;
  if (state.screen === "choose") {
    state.chooseT--;
    if (state.chooseT <= 0) nextStage();
    return;
  }
  if (state.screen !== "play") return;

  const accel = 0.35, max = 1.6;
  if (keys.left) { P.vx -= accel; P.face = -1; }
  if (keys.right) { P.vx += accel; P.face = 1; }
  if (!keys.left && !keys.right) P.vx *= 0.7;
  P.vx = Math.max(-max, Math.min(max, P.vx));

  if (P.ground) P.coyote = 6; else if (P.coyote > 0) P.coyote--;
  if (keys.jump && !jumpHeld && P.coyote > 0) { P.vy = -5.3; P.ground = false; P.coyote = 0; }
  jumpHeld = keys.jump;
  if (!keys.jump && P.vy < -2) P.vy += 0.25; // short hop if released early
  P.vy = Math.min(P.vy + 0.3, 6);

  const plats = stagePlats();
  // horizontal move + wall collision
  P.x += P.vx;
  for (const p of plats) {
    if (P.x < p.x + p.w && P.x + P.w > p.x && P.y < p.y + p.h && P.y + P.h > p.y + 2) {
      if (P.vx > 0) P.x = p.x - P.w; else if (P.vx < 0) P.x = p.x + p.w;
      P.vx = 0;
    }
  }
  P.x = Math.max(0, Math.min(W - P.w, P.x));

  // vertical move + landing
  const prevBottom = P.y + P.h;
  P.y += P.vy;
  P.ground = false;
  let landed = null;
  for (const p of plats) {
    if (P.x + P.w > p.x && P.x < p.x + p.w) {
      if (P.vy >= 0 && prevBottom <= p.y + 1 && P.y + P.h >= p.y) {
        P.y = p.y - P.h; P.vy = 0; P.ground = true; landed = p;
      } else if (P.vy < 0 && P.y < p.y + p.h && P.y + P.h > p.y + p.h && prevBottom > p.y + p.h) {
        P.y = p.y + p.h; P.vy = 0;
      }
    }
  }
  if (P.y > H + 20) { state.deaths++; state.shake = 8; resetPlayer(); }

  if (landed && landed.ped !== undefined) choose(landed.ped);
}

function choose(i) {
  const s = STAGES[state.stage];
  const opt = s.opts[i];
  state.answers[s.key] = opt.id;
  saveAnswer(s.key, opt.id);
  if (s.key === "color") look.color = opt.id === "Black" ? "#222" : "#2f6bff";
  if (s.key === "clothes") look.pants = i === 0 ? "wide" : "jorts";
  state.screen = "choose"; state.chooseT = 75; state.pick = i; state.flash = 12;
}

function nextStage() {
  state.stage++;
  if (state.stage >= STAGES.length) {
    saveAnswer("completed", "yes (deaths: " + state.deaths + ")");
    state.screen = "end"; state.endT = 0; state.endReady = false;
    setTimeout(() => state.endReady = true, 6000);
    return;
  }
  state.screen = "play"; resetPlayer();
}

// ---------- drawing ----------
function text(str, x, y, size, color, align) {
  ctx.font = size + "px " + FONT;
  ctx.textAlign = align || "left";
  ctx.fillStyle = "#000"; ctx.fillText(str, x + 1, y + 1);
  ctx.fillStyle = color || "#fff"; ctx.fillText(str, x, y);
}

function drawBg(c1, c2) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // twinkling pixel stars
  for (let i = 0; i < 28; i++) {
    const sx = (i * 97 + 13) % W, sy = (i * 53 + 7) % 120;
    if ((state.frame + i * 11) % 60 < 40) { ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.fillRect(sx, sy, 1, 1); }
  }
}

function drawPlat(p) {
  ctx.fillStyle = "#6b4a2b"; ctx.fillRect(p.x, p.y, p.w, p.h);
  ctx.fillStyle = "#4ec04e"; ctx.fillRect(p.x, p.y, p.w, 3);
  ctx.fillStyle = "#2a8a2a"; ctx.fillRect(p.x, p.y + 3, p.w, 1);
  ctx.fillStyle = "#4a321c";
  for (let x = p.x + 2; x < p.x + p.w - 1; x += 6) ctx.fillRect(x, p.y + 5, 2, 1);
  if (p.ped !== undefined) { // pedestal glow
    ctx.fillStyle = (state.frame % 30 < 15) ? "#ffe066" : "#fff3b0";
    ctx.fillRect(p.x, p.y, p.w, 1);
  }
}

function drawPants(x, y, type, scale) {
  const s = scale || 1;
  ctx.fillStyle = type === "jorts" ? "#5b86c7" : "#8f8fa8";
  if (type === "jorts") {
    ctx.fillRect(x, y, 14 * s, 4 * s); ctx.fillRect(x, y + 4 * s, 6 * s, 4 * s); ctx.fillRect(x + 8 * s, y + 4 * s, 6 * s, 4 * s);
    ctx.fillStyle = "#3a5c96"; ctx.fillRect(x, y, 14 * s, 1 * s);
  } else {
    ctx.fillRect(x, y, 16 * s, 4 * s); ctx.fillRect(x - 1 * s, y + 4 * s, 8 * s, 9 * s); ctx.fillRect(x + 9 * s, y + 4 * s, 8 * s, 9 * s);
    ctx.fillStyle = "#6c6c88"; ctx.fillRect(x, y, 16 * s, 1 * s);
  }
}

function drawIcon(icon, cx, cy) {
  const [kind, val] = icon.split(":");
  const bob = Math.round(Math.sin(state.frame / 10) * 2);
  if (kind === "emoji") {
    ctx.font = "16px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#fff";
    ctx.fillText(val, cx, cy + 6 + bob);
  } else if (kind === "flag") {
    ctx.fillStyle = "#ddd"; ctx.fillRect(cx - 7, cy - 10 + bob, 2, 20);
    ctx.fillStyle = val; ctx.fillRect(cx - 5, cy - 10 + bob, 13, 9);
    ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.fillRect(cx - 5, cy - 10 + bob, 13, 2);
  } else if (kind === "pants") {
    drawPants(cx - 7, cy - 7 + bob, val === "wide" ? "wide" : "jorts", 1);
  }
}

function drawPlayer() {
  const x = Math.round(P.x), y = Math.round(P.y);
  // head
  ctx.fillStyle = "#f3c9a0"; ctx.fillRect(x + 1, y, 8, 6);
  ctx.fillStyle = "#2b1b0e"; ctx.fillRect(x + 1, y, 8, 2);
  ctx.fillStyle = "#000"; ctx.fillRect(x + (P.face > 0 ? 6 : 2), y + 3, 1, 1);
  // shirt
  ctx.fillStyle = look.color; ctx.fillRect(x, y + 6, 10, 4);
  ctx.fillStyle = "rgba(255,255,255,.2)"; ctx.fillRect(x, y + 6, 10, 1);
  // bottoms
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
  // shoes
  ctx.fillStyle = "#fff";
  ctx.fillRect(x + (step ? 0 : 1), y + 13, 4, 1); ctx.fillRect(x + (step ? 6 : 5), y + 13, 4, 1);
}

function drawStage() {
  const s = STAGES[state.stage];
  drawBg(s.bg[0], s.bg[1]);
  for (const p of stagePlats()) drawPlat(p);
  // item + label above each pedestal
  FORK.forEach((f, i) => {
    const o = s.opts[i], cx = f.x + f.w / 2;
    drawIcon(o.icon, cx, f.y - 16);
    text(o.label, Math.min(Math.max(cx, 40), W - 40), f.y - 32, 7, "#ffe066", "center");
  });
  // HUD
  text(s.title, 6, 12, 8, "#fff");
  text(s.hint, W / 2, 12, 8, "#ffe066", "center");
  text("OOPS x" + state.deaths, W - 6, 12, 6, "#ffb3b3", "right");
  // progress pips
  for (let i = 0; i < STAGES.length; i++) {
    ctx.fillStyle = i < state.stage ? "#ffe066" : (i === state.stage ? "#fff" : "#555");
    ctx.fillRect(6 + i * 9, 18, 6, 4);
  }
  drawPlayer();
}

function drawTitle() {
  drawBg("#1b1145", "#6a2c91");
  // balloons
  for (let i = 0; i < 6; i++) {
    const bx = 40 + i * 64, by = 170 - ((state.frame * 0.4 + i * 30) % 190) + 20;
    ctx.fillStyle = ["#ff5c7a", "#ffd23f", "#4ec0ff", "#7dff7d", "#c77dff", "#ff9f43"][i];
    ctx.fillRect(bx, by, 10, 12); ctx.fillRect(bx + 1, by - 1, 8, 1); ctx.fillRect(bx + 4, by + 12, 2, 2);
    ctx.fillStyle = "#fff"; ctx.fillRect(bx + 2, by + 2, 2, 3);
  }
  text("HAPPY BIRTHDAY", W / 2, 70, 14, "#ffe066", "center");
  text(HIS_NAME + "!", W / 2, 95, 18, "#fff", "center");
  text("THE BIRTHDAY OBBY", W / 2, 125, 8, "#c9b8ff", "center");
  if (state.frame % 50 < 30) text("TAP / PRESS ENTER TO START", W / 2, 170, 7, "#fff", "center");
  text("ARROWS / WASD + SPACE TO JUMP", W / 2, 200, 6, "#9a8cc9", "center");
}

function drawChoose() {
  drawStage();
  ctx.fillStyle = "rgba(0,0,0,.45)"; ctx.fillRect(0, 70, W, 70);
  const lines = ["NICE PICK!", "+1 POWER-UP", "NEXT LEVEL..."];
  text(lines[0], W / 2, 98, 12, "#ffe066", "center");
  text(lines[1], W / 2, 118, 8, "#fff", "center");
  if (state.flash > 0) { ctx.fillStyle = "rgba(255,255,255," + state.flash / 16 + ")"; ctx.fillRect(0, 0, W, H); }
}

const confetti = Array.from({ length: 60 }, (_, i) => ({
  x: Math.random() * W, y: Math.random() * H, v: 0.6 + Math.random() * 1.2,
  c: ["#ff5c7a", "#ffd23f", "#4ec0ff", "#7dff7d", "#c77dff"][i % 5],
}));
function drawEnd() {
  state.endT++;
  drawBg("#1b1145", "#6a2c91");
  for (const c of confetti) { c.y += c.v; if (c.y > H) { c.y = -4; c.x = Math.random() * W; } ctx.fillStyle = c.c; ctx.fillRect(c.x, c.y, 3, 3); }
  text("YOU WIN!", W / 2, 38, 16, "#ffe066", "center");
  const shown = Math.floor(state.endT / 40);
  BIRTHDAY_MESSAGE.forEach((ln, i) => { if (i <= shown) text(ln, W / 2, 75 + i * 20, i === 0 ? 9 : 8, i === BIRTHDAY_MESSAGE.length - 1 ? "#ff8fa3" : "#fff", "center"); });
  if (state.endReady && state.frame % 50 < 30) text("TAP TO PLAY AGAIN", W / 2, 210, 6, "#9a8cc9", "center");
}

function render() {
  ctx.save();
  if (state.shake > 0) ctx.translate((Math.random() - .5) * 4, (Math.random() - .5) * 4);
  ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
  if (state.screen === "title") drawTitle();
  else if (state.screen === "play") drawStage();
  else if (state.screen === "choose") drawChoose();
  else drawEnd();
  ctx.restore();
}

// fixed 60fps timestep
let last = 0, acc = 0;
function loop(t) {
  acc += Math.min(t - last, 100); last = t;
  while (acc >= 1000 / 60) { update(); acc -= 1000 / 60; }
  render();
  requestAnimationFrame(loop);
}
(document.fonts && document.fonts.load ? document.fonts.load("8px 'Press Start 2P'") : Promise.resolve())
  .catch(() => {}).then(() => requestAnimationFrame(loop));