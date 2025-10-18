import { w as f, c as g, G as me, H as pe } from "./gameboard-C3BA8vXA.mjs";
import { playInvestorAudio as fe } from "./mediaService-B2cFC06z.mjs";
function se(e) {
  return "/images/investor/manager/Jake-Cook.svg";
}
function D(e) {
  let t;
  return e <= 2 ? t = 1 : e <= 4 ? t = 2 : e <= 6 ? t = 3 : e <= 8 ? t = 4 : t = 5, `/images/investor/manager/happiness-${t}.svg`;
}
function E(e) {
  let t;
  switch (e) {
    case "EMERALD":
      t = "#035716";
      break;
    case "SAPPHIRE":
      t = "#0037fc";
      break;
    case "RUBY":
      t = "#ff1f00";
      break;
    case "AMETHYST":
      t = "#853fcb";
      break;
    case "TOPAZ":
      t = "#e0c225";
      break;
    case "DIAMOND":
      t = "#858d8f";
      break;
    case "PERIDOT":
      t = "#08c710";
      break;
    case "TURQUOISE":
      t = "#00FFF0";
      break;
    case "AMBER":
      t = "#FF8D07";
      break;
    case "ROSE":
      t = "#FF5FEF";
      break;
    default:
      t = "#94a3b8";
      break;
  }
  return t;
}
function ye(e) {
  return {
    EMERALD: "Emerald Capital Investing",
    RUBY: "Ruby Investment Group",
    SAPPHIRE: "Sapphire Mutual Funds",
    AMETHYST: "Amethyst Asset Management",
    TOPAZ: "Topaz Financial Services",
    PERIDOT: "Peridot Investment Trust",
    TURQUOISE: "Turquoise Investment Co.",
    DIAMOND: "Diamond Capital Group",
    AMBER: "Amber Investment Group",
    ROSE: "Rose Capital Management"
  }[e] || "Investment Group";
}
function ge(e, t = null) {
  const n = document.createElement("div");
  if (n.className = "floating-manager-avatar", e.happiness < 1)
    return n;
  const a = document.createElement("div");
  a.className = "floating-avatar-container";
  const o = document.createElement("img");
  o.className = "floating-avatar", o.src = se(), o.alt = `${e.name}'s avatar`, o.title = `${e.name} - Happiness: ${e.happiness}/10`;
  const r = document.createElement("img");
  r.className = "floating-happiness-overlay", r.src = D(e.happiness), r.alt = `Happiness level: ${e.happiness}`, o.onerror = () => {
    console.warn("Failed to load Jake Cook avatar"), o.src = "/images/investor/manager/Jake-Cook.svg";
  }, r.onerror = () => {
    console.warn("Failed to load happiness overlay: " + e.happiness), r.src = "/images/investor/manager/happiness-3.svg";
  }, a.appendChild(o), a.appendChild(r), n.appendChild(a);
  const s = document.createElement("div");
  s.className = "floating-speech-bubble", s.style.display = "none", s.style.opacity = "0";
  const i = document.createElement("div");
  return i.className = "speech-bubble-text", i.textContent = "", s.appendChild(i), n.appendChild(s), f && f.state && f.state.year === 1 && f.state.gameStage === 1 && he(n), n;
}
function he(e, t, n) {
  e.classList.add("expanded"), setTimeout(() => {
    e.classList.remove("expanded");
  }, 2e4);
}
function ve(e) {
  const t = document.querySelector(".floating-manager-avatar");
  if (!t) return;
  const n = t.querySelector(".floating-happiness-overlay");
  if (!n) return;
  let a;
  e >= 90 ? a = 10 : e >= 80 ? a = 8 : e >= 70 ? a = 6 : e >= 60 ? a = 4 : e >= 50 ? a = 2 : a = 1, n.src = D(a);
}
function ie() {
  const e = document.querySelector(".floating-manager-avatar");
  if (!e) return;
  const t = e.querySelector(".floating-happiness-overlay");
  if (!t) return;
  const n = e.querySelector(".floating-avatar");
  if (n && n.title) {
    const a = n.title.match(/Happiness: (\d+)\/10/);
    if (a) {
      const o = parseInt(a[1]);
      t.src = D(o);
      return;
    }
  }
  if (f && f.state && f.state.players) {
    const a = f.state.players.get(g.myPlayerId);
    a && a.manager && (t.src = D(a.manager.happiness));
  }
}
function be(e, t = null) {
  const n = document.createElement("div");
  if (n.className = "centered-manager-avatar", e.happiness < 1)
    return n;
  const a = document.createElement("div");
  a.className = "centered-avatar-container";
  const o = document.createElement("img");
  o.className = "centered-avatar", o.src = se(), o.alt = `${e.name}'s avatar`, o.title = `${e.name} - Happiness: ${e.happiness}/10`;
  const r = document.createElement("img");
  r.className = "centered-happiness-overlay", r.src = D(e.happiness), r.alt = `Happiness level: ${e.happiness}`, o.onerror = () => {
    console.warn("Failed to load Jake Cook avatar for centered manager"), o.src = "/images/investor/manager/Jake-Cook.svg";
  }, r.onerror = () => {
    console.warn("Failed to load happiness overlay for centered manager: " + e.happiness), r.src = "/images/investor/manager/happiness-3.svg";
  }, a.appendChild(o), a.appendChild(r), n.appendChild(a);
  const s = document.createElement("div");
  s.className = "centered-speech-bubble", s.style.display = "none", s.style.opacity = "0";
  const i = document.createElement("div");
  return i.className = "speech-bubble-text", i.textContent = "", s.appendChild(i), n.appendChild(s), n;
}
function M(e, t) {
  const n = e.find((r) => r.id === t);
  if (!n || g.isAdmin) return;
  const a = n.manager, o = f?.state?.gameStage || 0;
  a && a.happiness >= 1 ? o === 0 ? (Ce(a, n.teamColor), ee()) : (xe(a, n.teamColor), te(), Ee()) : (ee(), te());
}
function Ce(e, t) {
  const n = document.getElementById("centered-manager-container");
  if (!n) return;
  n.innerHTML = "";
  const a = be(e, t);
  n.appendChild(a);
}
function xe(e, t) {
  const n = document.querySelector(".floating-manager-avatar");
  if (n)
    Se(n, e);
  else {
    const a = ge(e, t);
    document.body.appendChild(a);
  }
}
function ee() {
  const e = document.querySelector(".floating-manager-avatar");
  e && (e.style.display = "none");
}
function Ee() {
  const e = document.querySelector(".floating-manager-avatar");
  e && (e.style.display = "block");
}
function te() {
  const e = document.getElementById("centered-manager-container");
  e && (e.innerHTML = "");
}
function Se(e, t, n) {
  const a = e.querySelector(".floating-avatar");
  a && (a.title = `${t.name} - Happiness: ${t.happiness}/10`);
  const o = e.querySelector(".floating-happiness-overlay");
  o && (o.src = `/images/investor/manager/happiness-${Ae(t.happiness)}.svg`, o.alt = `Happiness level: ${t.happiness}`);
}
function Ae(e) {
  return e <= 2 ? 1 : e <= 4 ? 2 : e <= 6 ? 3 : e <= 8 ? 4 : 5;
}
let P = null;
function Te(e, t = !1, n = null, a = !1) {
  let o = document.querySelector(".manager-speech-bubble"), r = document.querySelector(".manager-speech-bubble .speech-bubble-text");
  if (o || (o = document.querySelector(".floating-speech-bubble"), r = document.querySelector(".floating-speech-bubble .speech-bubble-text")), o && r) {
    if (r.textContent = e, n !== null && !t && ve(n), o.classList.contains("floating-speech-bubble")) {
      const i = o.closest(".floating-manager-avatar");
      i && i.classList.add("expanded");
    }
    o.style.display = "block", o.style.opacity = "1", P && clearTimeout(P), P = setTimeout(() => {
      o.style.opacity = "0", setTimeout(() => {
        if (o.style.display = "none", r.textContent = "", ie(), o.classList.contains("floating-speech-bubble")) {
          const i = o.closest(".floating-manager-avatar");
          i && i.classList.remove("expanded");
        }
      }, 300);
    }, a ? 2e4 : 1e4);
  }
}
function Sn() {
  let e = document.querySelector(".manager-speech-bubble"), t = document.querySelector(".manager-speech-bubble .speech-bubble-text");
  if (e || (e = document.querySelector(".floating-speech-bubble"), t = document.querySelector(".floating-speech-bubble .speech-bubble-text")), e && t && (e.style.display = "none", e.style.opacity = "0", t.textContent = "", ie(), e.classList.contains("floating-speech-bubble"))) {
    const n = e.closest(".floating-manager-avatar");
    n && n.classList.remove("expanded");
  }
  P && (clearTimeout(P), P = null);
}
function Ie(e) {
  const t = document.createElement("div");
  t.className = "end-screen-quadrant", t.innerHTML = `
        <h2>Best Investment Firms</h2>
        <div class="quadrant-content"></div>
    `;
  const n = $e(e);
  if (!n.length) return t;
  const a = t.querySelector(".quadrant-content");
  if (!a) return t;
  const o = document.createElement("div");
  return o.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 0;
    `, n.forEach((r, s) => {
    const i = Me(r, s, e);
    if (o.appendChild(i), s < n.length - 1) {
      const u = Ne();
      o.appendChild(u);
    }
  }), a.innerHTML = "", a.appendChild(o), t;
}
function $e(e) {
  const t = [];
  e.players.forEach((o) => t.push(o));
  const n = t.filter((o) => o.teamColor !== "ADMIN" && o.teamColor !== "OBSERVER").reduce((o, r) => {
    const s = r.teamColor;
    if (!o[s]) {
      const i = e[`${s}Array`], u = i && i.length > 0 ? i[i.length - 1] : 0;
      o[s] = {
        team: s,
        finalScore: u
      };
    }
    return o;
  }, {}), a = Object.values(n);
  return a.sort((o, r) => r.finalScore - o.finalScore), a.slice(0, 3);
}
function Me(e, t, n) {
  const a = ["🥇", "🥈", "🥉"], o = document.createElement("div");
  o.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0;
        padding: 0;
    `;
  const r = we(e.team, a[t]);
  o.appendChild(r);
  const s = Le(e.finalScore);
  o.appendChild(s);
  const i = document.createElement("div");
  i.appendChild(o);
  const u = ke(e.team, n);
  return i.appendChild(u), i;
}
function we(e, t) {
  const n = document.createElement("div");
  return n.style.cssText = `
        font-size: 1.25rem;
        font-weight: bold;
        color: ${E(e)};
        text-transform: capitalize;
        display: flex;
        align-items: center;
        gap: 8px;
    `, n.innerHTML = `<span style="font-size: 1.2rem;">${t}</span> ${e}`, n;
}
function Le(e) {
  const t = document.createElement("div");
  return t.style.cssText = `
        font-size: 1.25rem;
        color: #181818;
        margin-left: 15px;
    `, t.textContent = `$${e.toLocaleString()}`, t;
}
function ke(e, t) {
  const n = document.createElement("div");
  n.style.cssText = `
        padding: 5px 15px;
        font-size: 1rem;
        color: ${E(e)};
        margin-top: -5px;
    `;
  const a = [];
  t.players.forEach((r) => a.push(r));
  const o = a.filter((r) => r.teamColor === e).map((r) => r.name).sort();
  return n.textContent = o.length > 0 ? o.join(", ") : "No active players", n;
}
function Ne() {
  const e = document.createElement("div");
  return e.style.cssText = `
        height: 1px;
        background-color: #e0e0e0;
        margin: 10px 0;
    `, e;
}
function Be(e) {
  const t = document.createElement("div");
  t.className = "end-screen-quadrant", t.innerHTML = `
        <h2>Highest Earning Brokers</h2>
        <div class="quadrant-content"></div>
    `;
  const n = Re(e);
  if (!n.length) return t;
  const a = t.querySelector(".quadrant-content");
  if (!a) return t;
  const o = document.createElement("div");
  return o.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 0;
    `, n.forEach((r, s) => {
    const i = Pe(r, s);
    if (o.appendChild(i), s < n.length - 1) {
      const u = Oe();
      o.appendChild(u);
    }
  }), a.innerHTML = "", a.appendChild(o), t;
}
function Re(e) {
  const t = [];
  e.players.forEach((a) => t.push(a));
  const n = t.filter((a) => a.teamColor !== "ADMIN" && a.teamColor !== "OBSERVER").map((a) => ({
    name: a.name,
    teamColor: a.teamColor,
    capital: a.capitalArray && a.capitalArray[a.capitalArray.length - 1] || 0
  }));
  return n.sort((a, o) => o.capital - a.capital), n.slice(0, 3);
}
function Pe(e, t) {
  const n = ["🥇", "🥈", "🥉"], a = document.createElement("div");
  a.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0;
        padding: 0;
    `;
  const o = Fe(e, n[t]);
  a.appendChild(o);
  const r = qe(e.capital);
  return a.appendChild(r), a;
}
function Fe(e, t) {
  const n = document.createElement("div");
  return n.style.cssText = `
        font-size: 1.25rem;
        font-weight: bold;
        color: ${E(e.teamColor)};
        display: flex;
        align-items: center;
        gap: 8px;
    `, n.innerHTML = `<span style="font-size: 1.2rem;">${t}</span> ${e.name}`, n;
}
function qe(e) {
  const t = document.createElement("div");
  return t.style.cssText = `
        font-size: 1.25rem;
        color: #181818;
        margin-left: 15px;
    `, t.textContent = `$${e.toLocaleString()}`, t;
}
function Oe() {
  const e = document.createElement("div");
  return e.style.cssText = `
        height: 1px;
        background-color: #e0e0e0;
        margin: 10px 0;
    `, e;
}
function He(e) {
  const t = document.createElement("div");
  t.className = "end-screen-quadrant", t.innerHTML = `
        <h2>Most Accurate Brokers</h2>
        <div class="quadrant-content"></div>
    `;
  const n = De(e);
  if (!n.length) return t;
  const a = t.querySelector(".quadrant-content");
  if (!a) return t;
  const o = document.createElement("div");
  return o.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 0;
    `, n.forEach((r, s) => {
    const i = ze(r, s);
    if (o.appendChild(i), s < n.length - 1) {
      const u = je();
      o.appendChild(u);
    }
  }), a.innerHTML = "", a.appendChild(o), t;
}
function De(e) {
  const t = [];
  e.players.forEach((a) => t.push(a));
  const n = t.filter((a) => a.teamColor !== "ADMIN" && a.teamColor !== "OBSERVER").map((a) => ({
    name: a.name,
    teamColor: a.teamColor,
    accuracy: a.allYearsAverageAccuracy || 0
  }));
  return n.sort((a, o) => o.accuracy - a.accuracy), n.slice(0, 3);
}
function ze(e, t) {
  const n = ["🥇", "🥈", "🥉"], a = document.createElement("div");
  a.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0;
        padding: 0;
    `;
  const o = Ye(e, n[t]);
  a.appendChild(o);
  const r = _e(e.accuracy);
  return a.appendChild(r), a;
}
function Ye(e, t) {
  const n = document.createElement("div");
  return n.style.cssText = `
        font-size: 1.25rem;
        font-weight: bold;
        color: ${E(e.teamColor)};
        display: flex;
        align-items: center;
        gap: 8px;
    `, n.innerHTML = `<span style="font-size: 1.2rem;">${t}</span> ${e.name}`, n;
}
function _e(e) {
  const t = document.createElement("div");
  return t.style.cssText = `
        font-size: 1.25rem;
        color: #181818;
        margin-left: 15px;
    `, t.textContent = `${e.toFixed(1)}%`, t;
}
function je() {
  const e = document.createElement("div");
  return e.style.cssText = `
        height: 1px;
        background-color: #e0e0e0;
        margin: 10px 0;
    `, e;
}
function Ue(e) {
  const t = document.createElement("div");
  t.className = "end-screen-quadrant", t.innerHTML = `
        <h2>Investment Firm Accuracy</h2>
        <div class="quadrant-content"></div>
    `;
  const n = Ve(e);
  if (!n.length) return t;
  const a = t.querySelector(".quadrant-content");
  if (!a) return t;
  const o = document.createElement("div");
  return o.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 0;
    `, n.forEach((r, s) => {
    const i = We(r, s);
    if (o.appendChild(i), s < n.length - 1) {
      const u = Ze();
      o.appendChild(u);
    }
  }), a.innerHTML = "", a.appendChild(o), t;
}
function Ve(e) {
  const t = [];
  e.players.forEach((o) => t.push(o));
  const n = t.filter((o) => o.teamColor !== "ADMIN" && o.teamColor !== "OBSERVER").reduce((o, r) => {
    const s = r.teamColor;
    o[s] || (o[s] = {
      team: s,
      totalAccuracy: 0,
      playerCount: 0,
      players: []
    });
    const i = r.allYearsAverageAccuracy || 0;
    return o[s].totalAccuracy += i, o[s].playerCount += 1, o[s].players.push(r.name), o;
  }, {}), a = Object.values(n).map((o) => ({
    team: o.team,
    averageAccuracy: o.playerCount > 0 ? o.totalAccuracy / o.playerCount : 0,
    playerCount: o.playerCount,
    players: o.players
  }));
  return a.sort((o, r) => r.averageAccuracy - o.averageAccuracy), a.slice(0, 3);
}
function We(e, t) {
  const n = ["🥇", "🥈", "🥉"], a = document.createElement("div");
  a.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0;
        padding: 0;
    `;
  const o = Ge(e.team, n[t]);
  a.appendChild(o);
  const r = Je(e.averageAccuracy);
  a.appendChild(r);
  const s = document.createElement("div");
  s.appendChild(a);
  const i = Ke(e.team, e.players);
  return s.appendChild(i), s;
}
function Ge(e, t) {
  const n = document.createElement("div");
  return n.style.cssText = `
        font-size: 1.25rem;
        font-weight: bold;
        color: ${E(e)};
        display: flex;
        align-items: center;
        gap: 8px;
    `, n.innerHTML = `<span style="font-size: 1.2rem;">${t}</span> ${e.charAt(0).toUpperCase() + e.slice(1)}`, n;
}
function Je(e) {
  const t = document.createElement("div");
  return t.style.cssText = `
        font-size: 1.25rem;
        color: #181818;
        margin-left: 15px;
    `, t.textContent = `${e.toFixed(1)}%`, t;
}
function Ke(e, t) {
  const n = document.createElement("div");
  return n.style.cssText = `
        padding: 5px 15px;
        font-size: 1rem;
        color: ${E(e)};
        margin-top: -5px;
    `, n.textContent = t.length > 0 ? t.join(", ") : "No active players", n;
}
function Ze() {
  const e = document.createElement("div");
  return e.style.cssText = `
        height: 1px;
        background-color: #e5e7eb;
        margin: 8px 0;
        width: 100%;
    `, e;
}
const C = {
  // Voice Settings
  VOICE_SETTINGS: {
    stability: 0.5,
    // v3/v2: Must be 0.0 (Creative), 0.5 (Natural), or 1.0 (Robust)
    similarity_boost: 0.8,
    // 0-1: Lower = more creative, Higher = more similar to training
    style: 0,
    // v3/v2: Set to 0.0 for best compatibility
    use_speaker_boost: !0
  },
  // Feature Toggles
  ENABLED: !0,
  // Master enable/disable switch
  CACHE_ENABLED: !0,
  // Enable audio caching
  SHOW_ERRORS: !1,
  // Show TTS error notifications to users
  // Model Configuration
  MODEL_ID: "eleven_multilingual_v2"
  // 11 Labs model to use eleven_v3, eleven_flash_v2_5, eleven_turbo_v2_5, eleven_multilingual_v2
};
class Qe {
  constructor(t = 100) {
    this.maxSize = t, this.cache = /* @__PURE__ */ new Map();
  }
  get(t) {
    if (this.cache.has(t)) {
      const n = this.cache.get(t);
      return this.cache.delete(t), this.cache.set(t, n), n;
    }
  }
  set(t, n) {
    if (this.cache.has(t))
      this.cache.delete(t);
    else if (this.cache.size >= this.maxSize) {
      const a = this.cache.keys().next().value;
      this.cache.delete(a);
    }
    this.cache.set(t, n);
  }
  has(t) {
    return this.cache.has(t);
  }
  clear() {
    this.cache.clear();
  }
  get size() {
    return this.cache.size;
  }
}
const U = new Qe(100);
let T = null, I = null;
function Xe(e) {
  return e.replace(/\s+/g, " ").trim();
}
function et(e, t = {}) {
  const n = {
    // Voice settings from config
    stability: C.VOICE_SETTINGS.stability,
    similarityBoost: C.VOICE_SETTINGS.similarity_boost,
    style: C.VOICE_SETTINGS.style,
    useSpeakerBoost: C.VOICE_SETTINGS.use_speaker_boost,
    modelId: C.MODEL_ID
  };
  return JSON.stringify({
    text: Xe(e),
    settings: n
  });
}
async function tt(e, t = {}) {
  const n = et(e, t);
  if (U.has(n))
    return console.log("🎵 Using cached TTS audio (no API call needed)"), U.get(n);
  console.log("🎵 No cache found - generating TTS via API...");
  try {
    const a = await fetch("/api/tts/generate", {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: e,
        game: "investor",
        modelId: C.MODEL_ID,
        stability: C.VOICE_SETTINGS.stability,
        similarityBoost: C.VOICE_SETTINGS.similarity_boost,
        style: C.VOICE_SETTINGS.style,
        useSpeakerBoost: C.VOICE_SETTINGS.use_speaker_boost
      })
    });
    if (!a.ok) {
      const r = await a.json().catch(() => ({}));
      throw new Error(`TTS API error: ${a.status} ${a.statusText} - ${r.error || "Unknown error"}`);
    }
    const o = await a.arrayBuffer();
    return U.set(n, o), console.log(`🎵 TTS audio generated via API and cached (cache size: ${U.size}/100)`), o;
  } catch (a) {
    throw console.error("❌ TTS Error:", a), a;
  }
}
async function nt(e, t = {}) {
  ce();
  try {
    console.log("🎵 Processing TTS for:", e.substring(0, 50) + "...");
    const n = await tt(e, t), a = new Blob([n], { type: "audio/mpeg" }), o = URL.createObjectURL(a), r = new Audio(o);
    r.volume = t.volume ?? 0.7;
    const s = () => {
      URL.revokeObjectURL(o), r.removeEventListener("ended", s), T = null, I = null, console.log("🎵 Manager speech finished and cleaned up");
    };
    r.addEventListener("ended", s), T = r, I = o, await r.play(), console.log("🎵 Playing manager speech");
  } catch (n) {
    console.error("❌ Failed to play manager speech:", n), I && (URL.revokeObjectURL(I), I = null), T = null, t.showFailureMessage !== !1 && console.warn("💬 TTS failed, message displayed as text only");
  }
}
function ce() {
  T && (T.pause(), T.src = "", T.load(), T = null, console.log("🔇 Stopped manager speech")), I && (URL.revokeObjectURL(I), I = null, console.log("🗑️ Cleaned up audio URL"));
}
function at() {
  if (!f?.state || !g.myPlayerId) return null;
  const e = f.state.players.get(g.myPlayerId);
  return e?.manager ? {
    message: e.manager.message,
    messageType: e.manager.messageType,
    accuracy: e.thisYearAverageAccuracy || 0
  } : null;
}
function J(e) {
  const t = at();
  !t || !t.message || (ce(), t && C.ENABLED && nt(t.message, {
    volume: 0.5,
    showFailureMessage: C.SHOW_ERRORS
  }), setTimeout(() => {
    t.messageType === "welcome" ? ot(t) : rt(t);
  }, e));
}
function ot(e) {
  const t = document.querySelector(".centered-speech-bubble"), n = document.querySelector(".centered-speech-bubble .speech-bubble-text");
  t && n && (n.textContent = e.message, t.style.display = "block", t.style.opacity = "1");
}
function rt(e) {
  const t = e.messageType === "intro", n = e.messageType === "team";
  Te(
    e.message,
    t,
    e.accuracy,
    n
  );
}
function Q(e, t) {
  const n = document.getElementById("year"), a = document.getElementById("all-years-average-accuracy"), o = document.getElementById("firm-name"), r = document.getElementById("player-money");
  n && (n.innerText = `${t.year} of ${t.totalYears}`);
  const s = t.players.get(e), i = s?.allYearsAverageAccuracy || 0, u = s?.prevAllYearsAverageAccuracy || 0;
  if (o && s?.teamColor) {
    const l = ye(s.teamColor).split(" "), d = l[0], p = l.slice(1).join(" "), y = E(s.teamColor);
    o.innerHTML = `<span class="team-color-word" style="color: ${y};">${d}</span> <span class="firm-name-rest">${p}</span>`;
  }
  if (r) {
    const m = s?.capitalArray || [], l = m.length ? m[m.length - 1] : 0, d = s?.bonusReceived || 0, p = s?.bonusDistributed && d > 0 ? l - d : l;
    r.textContent = `$${Number(p || 0).toLocaleString()}`;
  }
  a && !window.roundAverageAnimationInProgress && (a.innerText = `${i.toFixed(1)}%`);
  const c = document.getElementById("accuracy-triangle");
  c && (t.gameStage === 2 && !window.roundAverageAnimationInProgress ? (c.style.display = "inline-block", c.style.marginLeft = "4px", c.style.width = "0", c.style.height = "0", c.style.borderLeft = "6px solid transparent", c.style.borderRight = "6px solid transparent", c.style.verticalAlign = "middle", c.className = "triangle-indicator", i > u ? (c.classList.add("triangle-up"), c.style.borderBottom = "8px solid #00b300", c.style.borderTop = "0") : i < u && (c.classList.add("triangle-down"), c.style.borderTop = "8px solid #ff4d4d", c.style.borderBottom = "0")) : c.style.display = "none");
}
function An(e, t) {
  const n = document.getElementById(`capital-value-${e}`);
  if (!n) return;
  const a = n.querySelector(".triangle-indicator");
  a && a.remove();
  const o = document.createElement("span");
  o.className = "triangle-indicator", o.style.display = "inline-block", o.style.marginLeft = "4px", o.style.width = "0", o.style.height = "0", o.style.borderLeft = "6px solid transparent", o.style.borderRight = "6px solid transparent", o.style.verticalAlign = "middle", t === "increase" ? (o.classList.add("triangle-up"), o.style.borderBottom = "8px solid #00b300", o.style.borderTop = "0") : (o.classList.add("triangle-down"), o.style.borderTop = "8px solid #ff4d4d", o.style.borderBottom = "0"), n.appendChild(o);
}
function st(e, t) {
  const n = document.createElement("div");
  n.className = "invest-deal", n.dataset.dealId = t, ct(n, e.name);
  const a = ht();
  n.appendChild(a);
  const o = dt(e.name);
  n.appendChild(o);
  const r = ut();
  if (n.appendChild(r), !g.isAdmin) {
    const s = mt(t);
    n.appendChild(s);
  }
  if (yt(n, e), gt(n, e.optimalFraction), g.isAdmin || bn(n, t), f && f.state && f.state.hideOptimalInvestment) {
    const s = n.querySelector(".determine-optimal-button");
    s && (s.style.display = "none");
  }
  return n;
}
function it(e) {
  return `/images/investor/deal-cards/${e.replace(/,\s*(LLC|Corp|Inc|Biz|Co)\s*©?/i, "").trim().replace(/\s+/g, "-").toLowerCase()}.png`;
}
function ct(e, t) {
  const n = it(t), a = new Image();
  a.onload = () => {
    e.classList.add("invest-deal-custom-background"), e.style.backgroundImage = `url('${n}')`, e.style.backgroundSize = "cover", e.style.backgroundPosition = "center", e.style.backgroundRepeat = "no-repeat", e.setAttribute("data-deal-name", lt(t));
  }, a.onerror = () => {
    console.log(`No custom background found for deal: "${t}" -> URL: "${n}"`);
  }, a.src = n;
}
function lt(e) {
  return e.replace(/,\s*(LLC|Corp|Inc|Biz|Co)\s*©?/i, "").trim().toUpperCase().replace(/\s+/g, "_");
}
function dt(e) {
  const t = document.createElement("div");
  return t.className = "invest-deal-title", t.textContent = e, t;
}
function ut() {
  const e = document.createElement("div");
  return e.className = "invest-deal-details", e;
}
function mt(e) {
  const t = document.createElement("div");
  return t.className = "invest-form", t.innerHTML = `
        <div class="input-container">
            <div class="input-text-and-dollar">
                <input type="text" class="input-invest-amount" name="invest-amount-${e}" autocomplete="off" required value="0">
                <span class="input-dollar-sign">$</span>
            </div>   
            <span class="invest-amount-error error-message"></span>
            <div class="range-slider-container">
                <input type="range" class="invest-range-slider" min="0" max="100" value="0" step="1" style="flex-grow: 1;">
                <span class="investment-percentage">0%</span>
            </div>
            <button type="button" class="determine-optimal-button" data-deal-id="${e}">
                Find Optimal %
            </button>
        </div>
    `, t;
}
function ne(e, t, n) {
  return e >= t ? "#00A86B" : e >= n ? "#da8300" : "#FF0000";
}
function pt() {
  const e = document.createElement("div");
  return e.className = "investment-comparison", e.style.display = "none", e.innerHTML = `
        <div>
            <span style="color:#7CABFC;">You Invested: $0</span> | 
            <span style="color:rgb(26, 208, 69);">Optimal: $0</span>
        </div>
        <div class="comparison-bar-container">
            <div class="comparison-bar" style="--optimal-pos5493FFition: 0%"></div>
            <div class="player-marker" style="left: 0%;" title="Your investment: 0%" data-label="You: 0%"></div>
            <div class="optimal-marker" style="left: 0%;" title="Optimal investment: 0%" data-label="Optimal: 0%"></div>
            <div class="percentage-labels"></div>
        </div>
    `, e;
}
function ft(e) {
  const t = Math.round(e.chanceOfWinning * 100), n = ne(t, 70, 40), a = ne(e.multiplier, 5, 2.5), o = document.createElement("p");
  return o.innerHTML = `
        <span class="tooltip" style="color: ${n}; font-weight: bold;">${t}%
            <span class="tooltiptext">${t}% chance the deal succeeds. <b>${100 - t}%</b> chance it fails</span>
        </span> probability to
        <span class="tooltip" style="color: ${a}; font-weight: bold;">${e.multiplier}x
            <span class="tooltiptext">If successful your investment will be multiplied by ${e.multiplier}</span>
        </span> 
        <br>
    `, o;
}
function yt(e, t) {
  const n = e.querySelector(".invest-deal-details");
  n.innerHTML = "";
  const a = ft(t);
  n.appendChild(a);
  const o = pt();
  n.appendChild(o);
}
function ae(e, t) {
  if (f.state.gameStage !== 1) return;
  const n = e.querySelector(".player-marker");
  n && (n.style.left = `${Math.round(t)}%`, n.title = `Your investment: ${Math.round(t)}%`, n.dataset.label = `You: ${Math.round(t)}%`);
}
function gt(e, t) {
  const n = Math.max(0, Math.min(1, Number(t) || 0)), a = Math.round(n * 100), o = e.querySelector(".optimal-marker");
  o && (o.style.left = `${a}%`, o.title = `Optimal investment: ${a}%`, o.dataset.label = `Optimal: ${a}%`);
  const r = e.querySelector(".comparison-bar");
  r && r.style.setProperty("--optimal-position", `${a}%`);
}
function ht() {
  const e = document.createElement("div");
  return e.className = "investment-status-label", e.style.display = "none", e;
}
function le(e, t, n) {
  const a = e.querySelector(".investment-status-label");
  if (!a) return;
  (n[t] || 0) > 0 ? (a.textContent = "Invested", a.className = "investment-status-label invested") : (a.textContent = "No investment", a.className = "investment-status-label not-invested"), a.style.display = "block";
}
function vt() {
  document.querySelectorAll(".investment-status-label").forEach((e) => {
    e.style.display = "none";
  });
}
function bt(e) {
  document.querySelectorAll(".invest-deal").forEach((t) => {
    const n = t.dataset.dealId;
    n && le(t, n, e);
  });
}
function Ct(e, t, n, a, o) {
  const r = e.querySelector(".deal-results");
  r && r.remove();
  const s = o[t] || 0, i = n.outcome, u = n.multiplier, c = g.myPlayerId, l = a?.players?.get(c)?.accuracy?.get(t) || 0;
  let d = "excellent";
  l < 50 ? d = "poor" : l < 75 && (d = "good");
  const p = document.createElement("div");
  if (p.className = "deal-results", s === 0)
    p.innerHTML = `
            <div class="investment-flow no-investment">
                <div class="flow-text">No investment made</div>
                <div class="accuracy-display">
                    <span class="accuracy-label">Accuracy:</span>
                    <span class="accuracy-value ${d}">${l.toFixed(1)}%</span>
                </div>
            </div>
        `;
  else {
    const h = i ? s * u : 0, b = i ? (u - 1) * 100 : -100, A = b > 0, B = b === 0, w = Math.round(s).toLocaleString(), O = Math.round(h).toLocaleString(), H = A ? "+" : "";
    p.innerHTML = `
            <div class="investment-flow">
                <div class="investment-table">
                    <div class="table-headers">
                        <div class="header-cell">Investment</div>
                        <div class="header-cell"></div>
                        <div class="header-cell">Final</div>
                    </div>
                    <div class="table-values">
                        <div class="value-cell initial-amount">$${w}</div>
                        <div class="value-cell arrow-cell">
                            <svg class="flow-arrow" width="16" height="10" viewBox="0 0 16 10" fill="none">
                                <path d="M1 5h14m-4-4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="value-cell final-column">
                            <span class="final-amount ${A ? "positive" : B ? "neutral" : "negative"}">$${O}</span>
                            <span class="return-percentage ${A ? "positive" : B ? "neutral" : "negative"}">
                                ${H}${Math.round(b)}%
                            </span>
                        </div>
                    </div>
                </div>
                <div class="accuracy-display">
                    <span class="accuracy-label">Accuracy:</span>
                    <span class="accuracy-value ${d}">${l.toFixed(1)}%</span>
                </div>
            </div>
        `;
  }
  const y = e.querySelector(".invest-deal-details");
  y && y.appendChild(p);
}
function xt() {
  const e = document.createElement("div");
  return e.className = "bankrupt-overlay", e.innerHTML = `
        <div class="bankrupt-banner">
            <span class="bankrupt-text">BANKRUPT</span>
        </div>
    `, e;
}
function Et(e) {
  const t = e.querySelector(".bankrupt-overlay");
  t && t.remove();
  const n = xt();
  e.appendChild(n);
}
function St(e, t) {
  const n = document.querySelectorAll(".invest-deal");
  n.forEach((s, i) => {
    setTimeout(() => {
      At(s, e, t);
    }, i * 2e3);
  });
  const r = (n.length - 1) * 2e3 + 1e3 + 1e3;
  setTimeout(() => {
    $t(e);
  }, r);
}
function At(e, t, n) {
  const a = e.dataset.dealId;
  t.currentDeals?.get(a) && (e.classList.add("flipping"), e.style.transform = "perspective(1200px) rotateY(90deg)", e.style.transformOrigin = "center center", setTimeout(() => {
    Tt(e, t, n), e.style.transform = "rotateY(180deg)", setTimeout(() => {
      e.classList.remove("flipping"), e.style.transform = "perspective(1200px) rotateY(180deg) translateY(-3px)", setTimeout(() => {
        e.style.transform = "perspective(1200px) rotateY(180deg) translateY(0px)";
      }, 150);
    }, 250);
  }, 250));
}
function Tt(e, t, n) {
  const a = e.dataset.dealId, o = t.currentDeals?.get(a);
  if (!o) return;
  const r = e.querySelector(".invest-form");
  r && (r.style.display = "none");
  const s = e.querySelector(".investment-comparison");
  s && (s.style.display = "flex", It(e, a, o, t, n)), le(e, a, n), Ct(e, a, o, t, n), o.outcome ? (e.classList.add("deal-success"), e.classList.remove("deal-failure")) : (e.classList.add("deal-failure"), e.classList.remove("deal-success"), Et(e));
}
function It(e, t, n, a, o) {
  const r = a.players?.get(g.myPlayerId);
  if (!r) return;
  const s = r.prevPersonalCapital || 0, i = e.querySelector(".investment-comparison");
  if (!i) return;
  const u = o[t] || 0, c = s * (n.optimalFraction || 0), m = s > 0 ? u / s * 100 : 0, l = i.querySelector("div:first-child");
  l && (l.innerHTML = `
            <span style="color:#7CABFC;">You Invested: $${Math.round(u).toLocaleString()}</span> | 
            <span style="color:rgb(26, 208, 69);">Optimal: $${Math.round(c).toLocaleString()}</span>
        `);
  const d = e.querySelector(".player-marker");
  d && (d.dataset.label = `You: ${Math.round(m)}%`);
}
function $t(e) {
  const t = g.myPlayerId, n = e.players?.get(t);
  if (!n) return;
  const a = [];
  if (n.accuracy.forEach((m) => {
    a.push(m);
  }), a.length === 0) return;
  const o = a.reduce((m, l) => m + l, 0) / a.length, r = n?.allYearsAverageAccuracy || 0, s = n?.prevAllYearsAverageAccuracy || 0, i = document.getElementById("year-capital-info");
  if (!i) return;
  let u = "excellent";
  o < 50 ? u = "poor" : o < 75 && (u = "good");
  const c = document.createElement("div");
  c.className = "round-accuracy-on-card", c.innerHTML = `
        <div class="round-accuracy-label">Round Accuracy</div>
        <div class="round-accuracy-value ${u}">${o.toFixed(1)}%</div>
    `, i.appendChild(c), setTimeout(() => {
    Mt(c, r, s, o, e);
  }, 4e3);
}
function Mt(e, t, n, a, o) {
  const r = document.getElementById("all-years-average-accuracy");
  if (!r) return;
  e.classList.add("moving-sideways");
  const s = o, i = a;
  setTimeout(() => {
    r.textContent = `${t.toFixed(1)}%`, r.style.animation = "accuracyRamInto 0.5s ease-in-out", wt(r, n, i), e.remove(), window.roundAverageAnimationInProgress = !1;
    const u = document.getElementById("accuracy-triangle");
    u && (u.style.display = "inline-block"), Q(g.myPlayerId, s);
  }, 1e3), J(1e3);
}
function wt(e, t, n) {
  const a = document.createElement("div");
  a.className = "accuracy-tooltip", a.innerHTML = `
        <div class="tooltip-content">
            <div class="tooltip-row">
                <span class="tooltip-label">Previous Average:</span>
                <span class="tooltip-value">${t.toFixed(1)}%</span>
            </div>
            <div class="tooltip-row">
                <span class="tooltip-label">This Round:</span>
                <span class="tooltip-value">${n.toFixed(1)}%</span>
            </div>
        </div>
    `, document.body.appendChild(a), e._accuracyTooltip = a, window.cleanupAccuracyTooltip = function() {
    e._accuracyTooltip && (document.body.removeChild(e._accuracyTooltip), e._accuracyTooltip = null), e.removeEventListener("mouseenter", e._tooltipMouseEnter), e.removeEventListener("mouseleave", e._tooltipMouseLeave);
  }, e._tooltipMouseEnter = () => {
    const o = e.getBoundingClientRect();
    a.style.left = o.left + "px", a.style.top = o.bottom + 5 + "px", a.style.display = "block";
  }, e._tooltipMouseLeave = () => {
    a.style.display = "none";
  }, e.addEventListener("mouseenter", e._tooltipMouseEnter), e.addEventListener("mouseleave", e._tooltipMouseLeave);
}
const de = ["RUBY", "SAPPHIRE", "EMERALD", "AMETHYST", "TOPAZ", "DIAMOND", "PERIDOT", "TURQUOISE", "AMBER", "ROSE"];
function X() {
  if (!f || !f.state)
    return console.warn("Room state not available for team scores"), {};
  const e = {};
  return de.forEach((t) => {
    const n = `${t}Array`, a = f.state[n];
    a ? e[t] = Array.from(a) : e[t] = [];
  }), e;
}
function Lt() {
  if (!f || !f.state)
    return console.warn("Room state not available for team scores without bonus"), {};
  const e = {};
  return de.forEach((t) => {
    const n = `${t}Array`, a = f.state[n];
    if (a && a.length > 0) {
      const o = Array.from(a), r = o[o.length - 1], s = Nt(t), i = [...o];
      s > 0 && (i[i.length - 1] = r - s, console.log(`Team ${t}: Current=${r}, Bonus=${s}, Pre-bonus=${i[i.length - 1]}`)), e[t] = i;
    } else
      e[t] = [];
  }), e;
}
function kt() {
  return X();
}
function Nt(e) {
  return !f || !f.state || !f.state.teamBonuses ? 0 : f.state.teamBonuses.get(e) || 0;
}
const S = {
  performanceChart: null,
  endScreenChart: null
};
function V(e, t = null) {
  const n = document.getElementById(e);
  if (!n) return;
  n.parentElement && (n.style.width = "100%", n.style.height = "100%");
  const o = Array.from({ length: f.state.totalYears + 1 }, (l, d) => d), r = t || X(), s = Object.fromEntries(
    Object.entries(r).filter(
      ([l, d]) => l !== "admin" && l !== "observer" && (me[l] > 0 || d.length > 0 && d[d.length - 1] > 1e4)
    )
  ), i = (l) => l.map((d) => d === 0 ? 1e-6 : d), u = e === "endScreenChart";
  let c = null;
  if (u) {
    let l = null;
    f.state.players.forEach((d) => {
      d.id === g.myPlayerId && (l = d);
    }), l && l.capitalArray && (c = {
      name: l.name,
      teamColor: l.teamColor,
      capitalArray: l.capitalArray
    });
  }
  if (S[e]) {
    const l = S[e];
    if (l.data.labels = o, Object.keys(s).forEach((d) => {
      const p = l.data.datasets.find(
        (y) => y.label === d
      );
      if (p) {
        const y = p.data, h = i(s[d]);
        h.length > y.length ? (y.push(y[y.length - 1] || 1e-6), l.update("none"), y[y.length - 1] = h[h.length - 1]) : p.data = h;
      } else
        l.data.datasets.push({
          label: d,
          // Keep original case for consistency
          data: i(s[d]),
          // Include initial value (year 0)
          borderWidth: 1,
          borderColor: E(d),
          order: 2
        });
    }), u && c) {
      const d = l.data.datasets.find(
        (p) => p.label === `${c.name} (You)`
      );
      d ? d.data = i(c.capitalArray) : l.data.datasets.push({
        label: `${c.name} (You)`,
        data: i(c.capitalArray),
        // Include initial value (year 0)
        borderWidth: 3,
        borderColor: E(c.teamColor),
        borderDash: [],
        order: 1,
        zIndex: 1
      });
    }
    l.data.datasets = l.data.datasets.filter((d) => d.label === `${c?.name} (You)` ? !0 : Object.keys(s).includes(d.label)), l.update("none");
  } else {
    const l = Object.keys(s).map((d) => ({
      label: d,
      // Keep original case for consistency
      data: i(s[d]),
      // Include initial value (year 0)
      borderWidth: 1,
      borderColor: E(d),
      order: 2
      // Higher order means it's drawn first (behind)
    }));
    u && c && l.push({
      label: `${c.name} (You)`,
      data: i(c.capitalArray),
      // Include initial value (year 0)
      borderWidth: 3,
      borderColor: E(c.teamColor),
      borderDash: [],
      // Solid line
      order: 1,
      // Lower order means it's drawn last (on top)
      zIndex: 1
    }), S[e] = new Chart(n, {
      type: "line",
      data: {
        labels: o,
        datasets: l
      },
      options: {
        responsive: !0,
        maintainAspectRatio: !1,
        layout: {
          padding: {
            left: 15,
            right: 30,
            top: 20,
            bottom: 10
          }
        },
        scales: {
          x: {
            grid: {
              color: "#8452C733"
            },
            ticks: {
              padding: 10,
              font: {
                size: 14
              }
            }
          },
          y: {
            type: "logarithmic",
            beginAtZero: !0,
            grid: {
              color: "#8452C733"
            },
            ticks: {
              padding: 10,
              maxTicksLimit: 6,
              font: {
                size: 14
              },
              callback: function(d, p, y) {
                return d === 0 ? "0" : d === 1e9 || d === 1e8 || d === 1e7 || d === 1e6 || d === 1e5 || d === 1e4 || d === 1e3 || d === 100 ? d >= 1e9 ? d / 1e9 + "B" : d >= 1e6 ? d / 1e6 + "M" : d >= 1e3 ? d / 1e3 + "K" : d.toLocaleString() : "";
              }
            }
          }
        },
        plugins: {
          legend: {
            position: "right",
            align: "center",
            labels: {
              boxWidth: 20,
              padding: 20,
              font: {
                size: 14
              },
              filter: function(d, p) {
                return !0;
              }
            }
          }
        },
        animation: {
          duration: 0
          // Disable animations to prevent resize triggers
        }
      }
    });
  }
}
function Bt(e = null) {
  e ? S[e] && (S[e].destroy(), S[e] = null) : Object.keys(S).forEach((t) => {
    S[t] && (S[t].destroy(), S[t] = null);
  });
}
function Rt() {
  function e() {
    const o = X(), r = {};
    Object.keys(o).forEach((s) => {
      const i = o[s];
      r[s] = i && i.length > 1 ? i.slice(0, -1) : i;
    }), console.log("PerformanceGraph: Drawing chart with data up to previous year"), V("performanceChart", r);
  }
  function t() {
    const o = Lt();
    console.log("PerformanceGraph: Updating chart with current year data (no bonus)"), V("performanceChart", o);
  }
  function n() {
    const o = kt();
    console.log("PerformanceGraph: Updating chart with current year data (with bonus)"), V("performanceChart", o);
  }
  function a() {
    e(), setTimeout(() => {
      try {
        t();
      } catch (o) {
        console.warn("Failed to update chart with current year (no bonus):", o);
      }
    }, 2e3), setTimeout(() => {
      try {
        n();
      } catch (o) {
        console.warn("Failed to update chart with bonus:", o);
      }
    }, 14e3);
  }
  return { play: a };
}
function Pt(e, t) {
  const n = document.createElement("div");
  n.className = "team-member-card", n.setAttribute("data-player-id", e.id);
  const a = e.capitalArray[e.capitalArray.length - 1] || 0, o = e.bonusReceived || 0, r = e.bonusDistributed && o > 0 ? a - o : a, s = e.capturedRoundAccuracy !== void 0 ? e.capturedRoundAccuracy : Ft(e);
  return n.innerHTML = `
        <div class="teammate-name">${e.name}</div>
        <div class="teammate-stats">
            <div class="teammate-stat">
                <span>Investment Capital</span>
                <span class="teammate-money">$${r.toLocaleString()}</span>
            </div>
            <div class="teammate-divider"></div>
            <div class="teammate-stat">
                <span>Round Accuracy</span>
                <span class="teammate-accuracy">${s.toFixed(1)}%</span>
            </div>
        </div>
    `, n;
}
function Ft(e) {
  if (e.accuracy && typeof e.accuracy.forEach == "function") {
    let t = [];
    return e.accuracy.forEach((n) => {
      t.push(n);
    }), t.length > 0 ? t[t.length - 1] : 0;
  }
  return 0;
}
function qt(e, t, n) {
  const a = e.players.get(t);
  if (!a) return;
  const s = Array.from(e.players.values()).filter(
    (c) => c.teamColor === a.teamColor && c.teamColor !== "ADMIN" && c.teamColor !== "OBSERVER"
  ).sort((c, m) => c.id === t ? -1 : m.id === t ? 1 : 0).map((c) => ({
    ...c,
    capturedRoundAccuracy: Ot(c)
  })), i = document.createElement("div");
  i.className = "team-review-cards-container", s.forEach((c, m) => {
    const l = Pt(c);
    i.appendChild(l);
  }), n && n.appendChild(i);
  const u = a.teamBonusAmount || 0;
  return Ht(u, s), i;
}
function Ot(e) {
  if (e.accuracy && typeof e.accuracy.forEach == "function") {
    let t = [];
    if (e.accuracy.forEach((n) => {
      t.push(n);
    }), t.length > 0)
      return t.reduce((a, o) => a + o, 0) / t.length;
  }
  return 0;
}
function Ht(e, t, n) {
  setTimeout(() => {
    Dt(), zt(e, t);
  }, 500);
}
function Dt() {
  document.querySelectorAll(".team-review-cards-container .team-member-card").forEach((t, n) => {
    setTimeout(() => {
      t.classList.add("slide-in");
    }, n * 300);
  });
}
function zt(e, t, n) {
  J(3e3), setTimeout(() => {
    Yt(e, t);
  }, 14e3);
}
function Yt(e, t, n) {
  t.forEach((a, o) => {
    const r = document.querySelector(`[data-player-id="${a.id}"]`);
    if (r) {
      const s = r.querySelector(".teammate-money");
      if (s) {
        const i = a.capitalArray[a.capitalArray.length - 1] || 0, u = a.bonusReceived || 0;
        if (u === 0) {
          console.log(`No bonus animation for ${a.name} (no bonus received)`);
          return;
        }
        const c = i - u;
        console.log(`${a.name}: Pre-bonus: $${c.toLocaleString()}, Bonus: +$${u.toLocaleString()}, Final: $${i.toLocaleString()}`), s.textContent = `$${c.toLocaleString()}`;
        const m = document.createElement("div");
        m.className = "bonus-amount-display", m.innerHTML = `
                    <div class="bonus-amount-label">Increase</div>
                    <div class="bonus-amount-value">+$${u.toLocaleString()}</div>
                `, m.style.cssText = `
                    position: absolute;
                    left: -120px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #00ff00;
                    font-weight: 600;
                    font-size: 1rem;
                    opacity: 1;
                    transition: all 1s ease-out;
                    z-index: 10;
                    text-align: center;
                `, s.style.position = "relative", s.appendChild(m), m.style.left = "-80px", setTimeout(() => {
          setTimeout(() => {
            m.style.left = "0px", m.style.opacity = "0.3", setTimeout(() => {
              s.textContent = `$${i.toLocaleString()}`, s.style.animation = "accuracyRamInto 0.5s ease-in-out", setTimeout(() => {
                m.remove(), s.style.animation = "";
              }, 500);
            }, 1e3);
          }, 3e3);
        }, o * 200);
      }
    }
  });
}
function _t() {
  console.log("%c StartScreen() -- startScreen.js", "color: lime;");
  const e = document.createElement("div");
  e.id = "start-description";
  const t = document.createElement("h3");
  t.className = "fade-in-hello", t.textContent = "Hello Investor!";
  const n = document.createElement("div");
  return n.id = "centered-manager-container", n.className = "centered-manager-container", e.appendChild(t), e.appendChild(n), e;
}
function jt(e) {
  const t = document.querySelector(`[data-deal-id="${e.dealId}"]`);
  if (!t)
    return console.error(`Deal card not found for dealId: ${e.dealId}`), null;
  const n = document.createElement("div");
  n.className = "investment-table-modal-overlay", n.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        z-index: 1000;
        pointer-events: auto;
    `, Wt(t);
  const a = document.createElement("div");
  a.className = "investment-table-modal-content spotlighted-table", a.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 25px 20px 20px 20px;
        width: fit-content;
        max-height: none;
        overflow: visible;
        position: relative;
        z-index: 1001;
        border: 2px solid rgba(76, 175, 80, 0.5);
        margin: 20px auto;
        pointer-events: auto;
        transition: all 0.3s ease;
        transform: translateY(0px);
        opacity: 0;
    `;
  const o = Vt(e);
  return a.appendChild(o), Kt(n, a, t), Jt(a, t), n;
}
function oe(e) {
  const t = document.querySelector(".investment-table-modal-overlay");
  if (t) {
    const a = document.querySelector(".spotlighted-deal");
    z(t, a);
  }
  const n = jt(e);
  n && (document.body.appendChild(n), n.style.opacity = "0", requestAnimationFrame(() => {
    n.style.transition = "opacity 0.3s ease", n.style.opacity = "1";
  }));
}
function z(e, t) {
  t && Gt(t);
  const n = document.querySelector(".investment-table-modal-content");
  n && n.parentNode && n.parentNode.removeChild(n), e && e.parentNode && e.parentNode.removeChild(e);
}
function Ut() {
  const e = document.querySelector(".investment-table-modal-overlay");
  if (e) {
    const t = document.querySelector(".spotlighted-deal");
    z(e, t);
  }
}
function Vt(e) {
  const t = document.createElement("div");
  t.style.cssText = `
        overflow: visible;
        border: 1px solid #ddd;
        border-radius: 8px;
        width: auto;
        display: flex;
        justify-content: center;
    `;
  const n = [1.5, 1.5, 2, 2, 2, 2.5, 2.5, 2.5, 3, 3, 3, 3, 3.5, 3.5, 3.5, 3.5, 4, 4, 4, 4, 4.5, 4.5, 4.5, 4.5, 5, 5, 5, 5, 6, 6, 6.5, 6.5, 7, 7, 7.5, 8, 8.5, 9, 9.5, 10], a = [0.1, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.5, 0.55, 0.55, 0.6, 0.6, 0.65, 0.7, 0.7, 0.75, 0.75, 0.8, 0.8, 0.85, 0.9], o = [...new Set(n)].sort((m, l) => m - l), r = [...new Set(a)].sort((m, l) => l - m), s = document.createElement("table");
  s.style.cssText = `
        border-collapse: collapse;
        width: auto;
        background-color: white;
        color: black;
        text-align: center;
        position: relative;
        table-layout: fixed;
        font-size: 14px;
        margin: 0 auto;
    `, s.tableData = e;
  const i = document.createElement("tr");
  i.innerHTML = `<th style="
        padding: 2px 3px;
        border: 1px solid #444;
        font-weight: bold;
        background-color: white;
        color: black;
        position: sticky;
        top: 0;
        z-index: 10;
        width: 38px;
        font-size: 14px;
    "></th>`, o.forEach((m) => {
    i.innerHTML += `<th style="
            padding: 2px 3px;
            border: 1px solid #444;
            font-weight: bold;
            background-color: white;
            color: black;
            position: sticky;
            top: 0;
            z-index: 10;
            width: 30px;
            font-size: 14px;
        " data-multiplier="${m}">${m}x</th>`;
  }), s.appendChild(i);
  const u = `
        padding: 2px 3px;
        border: 1px solid #444;
        position: relative;
        width: 30px;
        height: 24px;
        font-size: 14px;
    `, c = `
        ${u}
        font-weight: bold;
        background-color: white;
        color: black;
        width: 38px;
    `;
  return r.forEach((m) => {
    const l = document.createElement("tr");
    l.innerHTML = `<td style="${c}" data-chance="${(m * 100).toFixed(0)}">${(m * 100).toFixed(0)}%</td>`, o.forEach((d) => {
      const y = (d * m - 1) / (d - 1), h = Math.max(0, Math.min(1, y)), b = Math.round(h * 100);
      let A;
      if (h === 0)
        A = "rgba(220, 53, 69, 0.5)";
      else {
        const B = h;
        if (B < 0.5) {
          const w = B * 2, O = 220, H = Math.round(53 + 176 * w), K = Math.round(69 + 20 * w);
          A = `rgba(${O}, ${H}, ${K}, 0.5)`;
        } else {
          const w = (B - 0.5) * 2, O = Math.round(220 - 180 * w), H = 176, K = Math.round(20 + 50 * w);
          A = `rgba(${O}, ${H}, ${K}, 0.5)`;
        }
      }
      l.innerHTML += `
                <td style="${u} background-color: ${A};"
                    data-chance="${(m * 100).toFixed(0)}"
                    data-multiplier="${d}"
                    class="data-cell"
                    title="${(m * 100).toFixed(0)}% chance, ${d}x multiplier = ${b}%"
                >${b}</td>`;
    }), s.appendChild(l);
  }), Zt(), Qt(s), t.appendChild(s), t;
}
function Wt(e) {
  e.classList.add("spotlighted-deal");
}
function Gt(e) {
  e.classList.remove("spotlighted-deal");
}
function Jt(e, t) {
  (t.closest("#invest-deals-container") || t.parentElement).insertAdjacentElement("afterend", e), e.style.opacity = "1", e.style.transform = "translateY(-40px)";
}
function Kt(e, t, n) {
  const a = (r) => {
    !t.contains(r.target) && !n.contains(r.target) && (z(e, n), document.removeEventListener("click", a));
  };
  setTimeout(() => {
    document.addEventListener("click", a);
  }, 100);
  const o = (r) => {
    r.key === "Escape" && (z(e, n), document.removeEventListener("keydown", o), document.removeEventListener("click", a));
  };
  document.addEventListener("keydown", o);
}
function Zt() {
  if (document.querySelector("#investment-table-modal-styles"))
    return;
  const e = document.createElement("style");
  e.id = "investment-table-modal-styles", e.textContent = `
        .investment-table-modal-overlay table {
            border-spacing: 0;
        }
        .investment-table-modal-overlay td.data-cell {
            transition: background-color 0.15s;
            cursor: pointer;
        }
        .investment-table-modal-overlay td.data-cell:hover {
            position: relative;
            z-index: 1;
        }
        .investment-table-modal-overlay td.data-cell.highlight-cell {
            position: relative;
            z-index: 1;
            outline: 2px solid white;
            outline-offset: -2px;
            font-weight: bold;
            box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.8) inset;
        }
        .investment-table-modal-overlay td.highlight-axis {
            position: relative;
            z-index: 1;
        }
        
        /* Modal content animation and spotlight effect */
        .investment-table-modal-content {
            position: relative;
            z-index: 1002 !important;
            filter: brightness(1.1);
        }
        
        .spotlighted-table {
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), 0 0 40px rgba(76, 175, 80, 0.8), 0 0 20px rgba(255, 255, 255, 0.2) !important;
        }
        
        .investment-table-modal-content:before {
            content: '';
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
            background: linear-gradient(45deg, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.1));
            border-radius: 16px;
            z-index: -1;
            animation: tablePulse 2s ease-in-out infinite;
        }
        
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        @keyframes tablePulse {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.4; }
        }
    `, document.head.appendChild(e);
}
function Qt(e) {
  const t = e.getElementsByTagName("td");
  Array.from(t).forEach((n) => {
    n.classList.contains("data-cell") && n.setAttribute("data-original-bg", window.getComputedStyle(n).backgroundColor);
  }), e.addEventListener("mouseover", (n) => {
    const a = n.target;
    a.classList.contains("data-cell") && Xt(a, e);
  }), e.addEventListener("mouseout", (n) => {
    const a = n.target;
    a.classList.contains("data-cell") && en(a, e);
  }), e.addEventListener("click", (n) => {
    const a = n.target;
    if (a.classList.contains("data-cell")) {
      const o = parseInt(a.textContent), r = e.tableData;
      r && r.dealId && tn(r.dealId, o);
    }
  });
}
function Xt(e, t) {
  const n = e.dataset.chance, a = e.dataset.multiplier;
  e.classList.add("highlight-cell");
  const o = Array.from(e.parentElement.children).indexOf(e), r = Array.from(e.parentElement.parentElement.children).indexOf(e.parentElement), s = e.parentElement.querySelectorAll("td");
  for (let u = 1; u < o; u++) {
    const c = s[u];
    if (c.classList.contains("data-cell")) {
      const l = window.getComputedStyle(c).backgroundColor.replace(/[\d.]+\)$/g, "0.9)");
      c.style.backgroundColor = l, c.classList.add("highlight-axis");
    }
  }
  const i = Array.from(t.querySelectorAll(`tr td:nth-child(${o + 1})`));
  for (let u = 0; u < r; u++) {
    const c = i[u];
    if (c.classList.contains("data-cell")) {
      const l = window.getComputedStyle(c).backgroundColor.replace(/[\d.]+\)$/g, "0.9)");
      c.style.backgroundColor = l, c.classList.add("highlight-axis");
    }
  }
  t.querySelectorAll(`th[data-multiplier="${a}"]`).forEach((u) => {
    u.style.backgroundColor = "#e0e0e0", u.style.color = "#000000", u.style.fontWeight = "bold";
  }), t.querySelectorAll(`td[data-chance="${n}"]`).forEach((u) => {
    u.classList.contains("data-cell") || (u.style.backgroundColor = "#e0e0e0", u.style.color = "#000000", u.style.fontWeight = "bold");
  });
}
function en(e, t) {
  e.classList.remove("highlight-cell"), t.querySelectorAll("th, td:first-child").forEach((n) => {
    n.style.backgroundColor = "white", n.style.color = "black", n.style.fontWeight = n === t.querySelector("th:first-child") ? "normal" : "bold";
  }), t.querySelectorAll(".highlight-axis").forEach((n) => {
    const a = n.getAttribute("data-original-bg");
    if (a)
      n.style.backgroundColor = a;
    else {
      const o = parseFloat(n.dataset.chance) / 100, r = parseFloat(n.dataset.multiplier), i = (r * o - 1) / (r - 1), u = Math.max(0, Math.min(1, i));
      let c;
      if (u === 0)
        c = "rgba(220, 53, 69, 0.5)";
      else {
        const m = u;
        if (m < 0.5) {
          const l = m * 2, d = 220, p = Math.round(53 + 176 * l), y = Math.round(69 + 20 * l);
          c = `rgba(${d}, ${p}, ${y}, 0.5)`;
        } else {
          const l = (m - 0.5) * 2, d = Math.round(220 - 180 * l), p = 176, y = Math.round(20 + 50 * l);
          c = `rgba(${d}, ${p}, ${y}, 0.5)`;
        }
      }
      n.style.backgroundColor = c;
    }
    n.classList.remove("highlight-axis");
  });
}
function tn(e, t) {
  try {
    const n = document.querySelector(`[data-deal-id="${e}"]`);
    if (!n) {
      console.error(`Deal card not found for dealId: ${e}`);
      return;
    }
    const a = n.querySelector(".invest-range-slider"), o = n.querySelector(".input-invest-amount"), r = n.querySelector(".investment-percentage");
    if (!a || !o || !r) {
      console.error("Investment controls not found in deal card");
      return;
    }
    const s = document.querySelector(".investment-table-modal-overlay");
    if (s) {
      const c = document.querySelector(`[data-deal-id="${e}"]`);
      z(s, c);
    }
    nn();
    const i = parseInt(a.value), u = t;
    n.classList.add("investment-updated"), an(a, i, u, () => {
      const c = new Event("input", { bubbles: !0 });
      a.dispatchEvent(c), r.classList.add("percentage-pulse"), o.classList.add("money-input-highlight"), setTimeout(() => {
        n.classList.remove("investment-updated"), r.classList.remove("percentage-pulse"), o.classList.remove("money-input-highlight");
      }, 1e3);
    }), console.log(`Set investment for deal ${e} to ${t}%`);
  } catch (n) {
    console.error("Error setting investment percentage:", n);
  }
}
function nn() {
  if (document.querySelector("#investment-animation-styles"))
    return;
  const e = document.createElement("style");
  e.id = "investment-animation-styles", e.textContent = `
        .investment-updated {
            animation: investmentHighlight 1s ease-out;
            position: relative;
        }
        
        @keyframes investmentHighlight {
            0% {
                box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
                transform: scale(1);
            }
            50% {
                box-shadow: 0 0 0 10px rgba(76, 175, 80, 0.3);
                transform: scale(1.02);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
                transform: scale(1);
            }
        }
        
        .percentage-pulse {
            animation: percentagePulse 0.6s ease-out;
        }
        
        @keyframes percentagePulse {
            0% {
                transform: scale(1);
                color: inherit;
            }
            50% {
                transform: scale(1.3);
                color: #4CAF50;
                font-weight: bold;
            }
            100% {
                transform: scale(1);
                color: inherit;
            }
        }
        
        .money-input-highlight {
            animation: moneyInputHighlight 1s ease-out;
            position: relative;
        }
        
        @keyframes moneyInputHighlight {
            0% {
                box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.6);
                background-color: rgba(76, 175, 80, 0.1);
            }
            50% {
                box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.3);
                background-color: rgba(76, 175, 80, 0.2);
                transform: scale(1.02);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
                background-color: rgba(76, 175, 80, 0);
                transform: scale(1);
            }
        }
        
        .invest-range-slider {
            transition: all 0.3s ease-out;
        }
    `, document.head.appendChild(e);
}
function an(e, t, n, a) {
  const r = performance.now();
  function s(i) {
    const u = i - r, c = Math.min(u / 500, 1), m = 1 - Math.pow(1 - c, 3), l = t + (n - t) * m;
    e.value = Math.round(l), c < 1 ? requestAnimationFrame(s) : (e.value = n, a && a());
  }
  requestAnimationFrame(s);
}
function on(e) {
  if (!e || !e.players) {
    console.warn("Cannot log yearly accuracy: room state or players not available");
    return;
  }
  console.log(`
📊 YEAR ${e.year} ACCURACY SCORES:`), console.log("=".repeat(50));
  const t = [];
  e.players.forEach((n) => {
    n.teamColor !== "ADMIN" && n.teamColor !== "OBSERVER" && t.push({
      name: n.name,
      yearlyAccuracy: n.thisYearAverageAccuracy || 0,
      allTimeAccuracy: n.allYearsAverageAccuracy || 0
    });
  }), t.sort((n, a) => a.yearlyAccuracy - n.yearlyAccuracy), t.forEach((n, a) => {
    const o = a + 1, r = n.yearlyAccuracy.toFixed(2);
    console.log(`${o}. ${n.name}: ${r}%`);
  }), t.length === 0 && console.log("No players found to display accuracy scores"), console.log("=".repeat(50));
}
let k, q, Y, W, R, Z, F, N;
const rn = {
  0: sn,
  1: cn,
  2: ln,
  3: dn,
  4: un
};
function Tn() {
  return console.log("%c initializeScreenManager() -- screenManagerService.js", "color: orange;"), k = document.getElementById("start-screen"), q = document.getElementById("game-screen"), Y = document.getElementById("game-result"), W = document.getElementById("end-screen"), R = document.getElementById("end-results"), Z = document.getElementById("game-result"), F = document.getElementById("invest-confirm"), N = document.getElementById("invest-confirm-button"), k !== null && q !== null;
}
function re(e) {
  if (!e) {
    console.error("Room state is not available");
    return;
  }
  const t = e.gameStage;
  console.log(`%c showGameScreen - Stage: ${t}`, "color: cyan;");
  const n = rn[t];
  n ? n(e) : console.warn(`No screen function defined for game stage: ${t}`);
}
function sn(e) {
  _(), j(), G(), k.style.display = "block", k.innerHTML = "";
  const t = _t();
  k.appendChild(t);
  try {
    const n = [];
    e.players && typeof e.players.forEach == "function" && e.players.forEach((a) => n.push(a)), n.length > 0 && typeof M == "function" && M(n, g.myPlayerId);
  } catch (n) {
    console.warn("populateManagerSection failed:", n);
  }
  g.isAdmin || J(1500);
}
function cn(e) {
  if (!e) {
    console.error("Room state is not available for deal screen");
    return;
  }
  try {
    _(), j(), q.style.display = "block", Cn(e), vt(), Q(g.myPlayerId, e);
    try {
      const t = [];
      e.players && typeof e.players.forEach == "function" && e.players.forEach((n) => t.push(n)), t.length > 0 && typeof M == "function" && M(t, g.myPlayerId);
    } catch (t) {
      console.warn("populateManagerSection failed:", t);
    }
    ue(e), fn(), e.year === 1 && !g.isAdmin && J(1e3), N && !g.isAdmin && (N.style.display = "block"), Y && (Y.innerHTML = "");
  } catch (t) {
    console.error("Error in showDealScreen:", t);
  }
}
function ln(e) {
  if (!e) {
    console.error("Room state is not available for results screen");
    return;
  }
  _(), j(), G(), q.style.display = "block", window.roundAverageAnimationInProgress = !0, Q(g.myPlayerId, e);
  const t = document.getElementById("all-years-average-accuracy");
  if (t && !t.textContent.trim()) {
    const s = g.myPlayerId, u = e.players?.get(s)?.allYearsAverageAccuracy || 0;
    t.textContent = `${u.toFixed(1)}%`;
  }
  const n = document.querySelectorAll(".invest-deal");
  Array.from(n).some((s) => s.classList.contains("flipped") || s.querySelector(".deal-results")) && (window.roundAverageAnimationInProgress = !1);
  try {
    const s = [];
    e.players && typeof e.players.forEach == "function" && e.players.forEach((i) => s.push(i)), s.length > 0 && typeof M == "function" && M(s, g.myPlayerId);
  } catch (s) {
    console.warn("populateManagerSection failed:", s);
  }
  const r = document.getElementById("invest-deals-container")?.querySelectorAll(".invest-deal");
  (!r || r.length === 0) && ue(e), G(), Y && (Y.innerHTML = ""), on(e), St(e, v);
}
function dn(e) {
  _();
  const t = mn();
  t.style.display = "flex";
  const n = document.getElementById("scoreboard");
  n && (n.style.zIndex = "1100");
  try {
    const o = [];
    e.players && typeof e.players.forEach == "function" && e.players.forEach((r) => o.push(r)), o.length > 0 && typeof M == "function" && M(o, g.myPlayerId);
  } catch (o) {
    console.warn("populateManagerSection failed:", o);
  }
  const a = document.getElementById("team-review-section");
  a && (a.innerHTML = "", setTimeout(() => {
    qt(e, g.myPlayerId, a);
  }, 100)), setTimeout(() => {
    Rt().play();
  }, 1e3);
}
function un(e) {
  if (!e) {
    console.error("Room state is not available for end screen");
    return;
  }
  try {
    _(), j(), G(), W.style.display = "block";
    const t = e.players.get(g.myPlayerId), n = t?.capitalArray?.[t.capitalArray.length - 1] || 0, a = t?.allYearsAverageAccuracy || 0;
    if (R) {
      R.innerHTML = "";
      const o = document.createElement("div");
      o.className = "game-over-banner", o.innerHTML = `
                <h1>Final Report</h1>
                <p>Your Capital: <b>$${n.toLocaleString()}</b>
                &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                Your Accuracy: <b>${a.toFixed(2)}%</b></p>
            `, R.appendChild(o);
      const r = document.createElement("div");
      r.className = "end-screen-grid";
      const s = Ue(e), i = He(e), u = Ie(e), c = Be(e);
      r.appendChild(s), r.appendChild(i), r.appendChild(u), r.appendChild(c), R.appendChild(r);
      const m = document.createElement("div");
      m.className = "end-screen-chart", m.innerHTML = '<canvas id="endScreenChart"></canvas>', R.appendChild(m);
    }
    requestAnimationFrame(() => {
      Bt(), V("endScreenChart");
    }), setTimeout(() => {
      pe(e);
    }, 500);
  } catch (t) {
    console.error("Error in showEndScreen:", t);
  }
}
function _() {
  k && (k.style.display = "none"), q && (q.style.display = "none"), W && (W.style.display = "none"), j();
}
let x = null;
function mn() {
  if (x) return x;
  x = document.createElement("div"), x.id = "team-performance-container", x.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: none;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        z-index: 1000;
        padding: 40px;
        box-sizing: border-box;
        gap: 30px;
        overflow-y: auto;
        overflow-x: hidden;
    `;
  const e = document.createElement("div");
  e.id = "team-review-section", e.style.cssText = `
        width: 100%;
        max-width: 1200px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin: 0 auto;
        flex-shrink: 0;
        margin-bottom: 20px;
    `;
  const t = document.createElement("div");
  t.id = "performance-graph-section", t.style.cssText = `
        width: 60%;
        max-width: 600px;
        height: 400px;
        min-height: 300px;
        background: linear-gradient(180deg,rgb(245, 245, 245),rgb(221, 221, 221));
        background-color: rgb(245, 245, 245);
        border-radius: 20px;
        padding: 30px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        position: relative;
        flex-shrink: 0;
        margin-bottom: 40px;
    `;
  const n = document.createElement("canvas");
  return n.id = "performanceChart", n.style.cssText = `
        width: 100%;
        height: 100%;
    `, t.appendChild(n), x.appendChild(e), x.appendChild(t), document.body.appendChild(x), x;
}
function j() {
  x && (x.style.display = "none");
  const e = document.getElementById("scoreboard");
  e && (e.style.zIndex = "100");
}
function G() {
  const e = document.getElementsByClassName("invest-form");
  e.length > 0 && Array.from(e).forEach((t) => {
    t.style.display = "none";
  }), N && (N.style.display = "none"), Z && (Z.style.display = "none"), F && (F.style.display = "none");
}
function pn() {
  const e = document.getElementsByClassName("invest-form");
  e.length > 0 && Array.from(e).forEach((t) => {
    t.classList.add("investment-locked");
    const n = t.querySelectorAll("input"), a = t.querySelectorAll("button");
    n.forEach((o) => {
      o.disabled = !0;
    }), a.forEach((o) => {
      o.disabled = !0;
    });
  }), N && (N.style.display = "none");
}
function fn() {
  const e = document.getElementsByClassName("invest-form");
  e.length > 0 && Array.from(e).forEach((t) => {
    t.classList.remove("investment-locked");
    const n = t.querySelectorAll("input"), a = t.querySelectorAll("button");
    n.forEach((o) => {
      o.disabled = !1;
    }), a.forEach((o) => {
      o.disabled = !1;
    });
  });
}
function ue(e) {
  const t = document.getElementById("invest-deals-container");
  t && (t.innerHTML = "", e.currentDeals && e.currentDeals.forEach((n, a) => {
    const o = st(n, a);
    t.appendChild(o);
  }));
}
function yn() {
  if (!F) return;
  F.style.display = "block";
  const e = $();
  F.innerHTML = `<p>You invested a total of <b>$${L.toLocaleString()}</b> from your available <b>$${e.toLocaleString()}</b>.</p>
    <p><span style="color: #e0e0e0;">Waiting for other investors...</span></p>`, bt(v);
}
function gn(e, t) {
  hn(e), setTimeout(() => {
    if (!t) {
      console.error("Room state not available for stage transition");
      return;
    }
    if (e === 2) {
      re(t);
      return;
    }
    const n = e === 1 || e === 2, a = !!(t.currentDeals && t.currentDeals.size > 0);
    !n || a || e === 0 ? re(t) : (console.warn("Waiting for currentDeals data, retrying..."), setTimeout(() => gn(e, t), 500));
  }, 1e3);
}
function hn(e) {
  switch (e) {
    case 1:
      f && f.send("resetHasInvest");
      break;
    case 2:
      Ut();
      break;
  }
}
let v = {}, L = 0;
function In(e, t) {
  if (e == g.myPlayerId) {
    if (f?.state?.gameStage === 1) {
      v = {}, L = 0;
      return;
    }
    t && typeof t.forEach == "function" ? (v = {}, t.forEach((n, a) => {
      v[a] = n;
    })) : t && typeof t == "object" ? v = { ...t } : v = {};
  }
}
function vn() {
  let e = !1;
  if (L = 0, (f?.state?.currentDeals ? (() => {
    const n = [];
    return f.state.currentDeals.forEach((a, o) => n.push(o)), n;
  })() : Object.keys(v)).forEach((n) => {
    const a = v[n], o = typeof a == "number" ? a : Number(a);
    if (isNaN(o) || !isFinite(o)) {
      console.warn(`FRONTEND MONEY WARNING: Invalid investment amount for deal ${n}: ${a}, setting to 0`), v[n] = 0, e = !0;
      return;
    }
    if (o < 0) {
      console.warn(`FRONTEND MONEY WARNING: Negative investment amount for deal ${n}: ${o}, setting to 0`), v[n] = 0, e = !0;
      return;
    }
    v[n] = o, L += o;
  }), e && console.warn("FRONTEND MONEY WARNING: Some invalid investment amounts were corrected to 0"), L > $()) {
    alert(`Your total investment of $${L.toLocaleString()} exceeds your available funds of $${$().toLocaleString()}. Please adjust your investments.`);
    return;
  }
  fe("INVEST_CONFIRM"), f.send("submitInvest", JSON.stringify(v)), f.send("confirmInvest"), pn(), yn();
}
window.confirmInvest = vn;
function $() {
  if (!f?.state || !g.myPlayerId) return 0;
  const e = f.state.players.get(g.myPlayerId);
  if (!e?.manager || e.manager.happiness < 1 || !e.capitalArray || e.capitalArray.length === 0) return 0;
  const t = e.capitalArray[e.capitalArray.length - 1];
  return typeof t != "number" || isNaN(t) || !isFinite(t) ? (console.warn(`FRONTEND MONEY WARNING: Invalid capital value ${t} for player ${e.name}`), 0) : Math.max(0, t);
}
function bn(e, t, n) {
  if (g.isAdmin) return;
  const a = e.querySelector(".input-invest-amount"), o = e.querySelector(".invest-range-slider"), r = e.querySelector(".investment-percentage"), s = e.querySelector(".invest-amount-error"), i = () => {
    const l = Object.values(v).reduce((p, y) => p + (Number(y) || 0), 0);
    return Math.max(0, $() - l + (Number(v[t]) || 0));
  }, u = () => {
    try {
      const l = i(), d = l / $() * 100, p = o.value;
      let y = parseInt(p, 10);
      (isNaN(y) || !isFinite(y)) && (y = 0, o.value = 0);
      const h = Math.min(y, d);
      let b = Math.round(h / 100 * $());
      (isNaN(b) || !isFinite(b)) && (b = 0), h !== y && (o.value = h), a.value = b.toLocaleString(), r.innerText = `${Math.round(h)}%`, v[t] = b, f.state.gameStage === 1 && ae(e, h), s.style.display = l <= 0 ? "block" : "none", s.textContent = l <= 0 ? "You have no more money to invest." : "";
    } catch (l) {
      console.error("Error in updateInvestInputFromSlider:", l), a.value = "0", r.innerText = "0%", v[t] = 0;
    }
  }, c = () => {
    try {
      const l = i(), d = a.value.replace(/,/g, "");
      let p = parseInt(d, 10) || 0;
      (isNaN(p) || !isFinite(p)) && (p = 0, a.value = "0"), p = Math.min(l, p), p < 0 && (p = 0, a.value = "0");
      const y = $();
      let h = y > 0 ? p / y * 100 : 0;
      (isNaN(h) || !isFinite(h)) && (h = 0), h = Math.min(Math.max(h, 0), 100), o.value = h, r.innerText = `${Math.round(h)}%`, a.value = p.toLocaleString(), v[t] = p, f.state.gameStage === 1 && ae(e, h), s.style.display = l <= 0 ? "block" : "none", s.textContent = l <= 0 ? "You have no more money to invest." : "";
    } catch (l) {
      console.error("Error in updateSliderFromInvestInput:", l), a.value = "0", r.innerText = "0%", v[t] = 0;
    }
  };
  o.addEventListener("input", u), a.addEventListener("input", (l) => {
    let d = l.target.value.replace(/[^0-9]/g, "");
    const p = i();
    let y = Math.min(parseInt(d, 10) || 0, p);
    l.target.value = y.toLocaleString(), v[t] = y, c(), parseInt(d, 10) > p ? (s.textContent = `Maximum investment: $${p.toLocaleString()}`, s.style.display = "block") : s.style.display = "none";
  }), f.state.gameStage === 1 && (a.value = (v[t] || 0).toLocaleString(), o.value = (v[t] || 0) / $() * 100, u());
  const m = e.querySelector(".determine-optimal-button");
  m && m.addEventListener("click", () => {
    typeof oe == "function" ? oe({ dealId: t }) : console.error("showInvestmentTableModal function not available");
  });
}
function Cn(e) {
  v = {}, L = 0, e.currentDeals && e.currentDeals.size > 0 && e.currentDeals.forEach((t, n) => {
    v[n] = 0;
  });
}
function $n(e) {
  document.querySelectorAll(".determine-optimal-button").forEach((n) => {
    n.style.display = e ? "none" : "block";
  });
}
export {
  $n as a,
  In as b,
  Sn as c,
  M as d,
  gn as h,
  Tn as i,
  v as p,
  Cn as r,
  An as u
};
