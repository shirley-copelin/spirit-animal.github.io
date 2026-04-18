/* =========================================
   SpiritZoo — app logic
   - Keyword-based spirit animal matching
   - ANIMALS data lives in animals-data.js
   ========================================= */


/* ============ Matching logic ============
   How this works:
   1. Score every animal by how many of its keywords show up in the text
   2. Instead of ALWAYS picking the single highest score, we consider
      animals that are "close enough" to the top (within 1 point) as
      co-finalists. This lets less-common animals win more often.
   3. Among co-finalists, pick one randomly — but give higher-scoring
      animals more weight (so the best match is still usually chosen).
   4. If nothing matches at all, pick from a friendly fallback list.
============================================ */
function findSpiritAnimal(text) {
  const normalized = text.toLowerCase();
  const scores = {};

  // Step 1: score each animal by keyword hits
  for (const [key, animal] of Object.entries(ANIMALS)) {
    scores[key] = 0;
    for (const kw of animal.keywords) {
      if (normalized.includes(kw.toLowerCase())) {
        scores[key] += 1;
      }
    }
  }

  // Step 2: find the top score
  let maxScore = 0;
  for (const score of Object.values(scores)) {
    if (score > maxScore) maxScore = score;
  }

  // Step 3: if nothing matched, random fallback
  if (maxScore === 0) {
    const friendlyFallbacks = [
      "dolphin", "otter", "fox", "hummingbird", "butterfly", "panda",
      "quokka", "koala", "platypus", "sugarglider", "lorikeet"
    ];
    const pick = friendlyFallbacks[Math.floor(Math.random() * friendlyFallbacks.length)];
    return ANIMALS[pick];
  }

  // Step 4: gather "co-finalists" — animals within 1 point of the max score
  // This lets us bring some variety: if elephant scores 3 and dolphin scores 2,
  // both are in the running (instead of elephant always winning).
  const contenders = [];
  for (const [key, score] of Object.entries(scores)) {
    if (score >= maxScore - 1 && score > 0) {
      // Weight: top scorers get more tickets in the "raffle"
      // Score of maxScore → 3 tickets, score of maxScore-1 → 1 ticket
      const tickets = score === maxScore ? 3 : 1;
      for (let i = 0; i < tickets; i++) contenders.push(key);
    }
  }

  // Step 5: random pick among weighted contenders
  const winnerKey = contenders[Math.floor(Math.random() * contenders.length)];
  return ANIMALS[winnerKey];
}

/* ============ Screen navigation ============ */
const screens = {
  greet:    document.getElementById("screen-greet"),
  describe: document.getElementById("screen-describe"),
  thinking: document.getElementById("screen-thinking"),
  reveal:   document.getElementById("screen-reveal")
};

function showScreen(name) {
  for (const [key, el] of Object.entries(screens)) {
    if (key === name) {
      el.hidden = false;
      el.classList.add("screen--active");
    } else {
      el.hidden = true;
      el.classList.remove("screen--active");
    }
  }
  // reset animation by forcing reflow
  const target = screens[name];
  target.style.animation = "none";
  target.offsetHeight; // trigger reflow
  target.style.animation = "";
  // scroll to top for mobile
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ============ State ============ */
let kidName = "";

/* ============ Screen 1: Name ============ */
const nameInput = document.getElementById("name-input");
const nameSubmit = document.getElementById("name-submit");

function capitalize(s) {
  if (!s) return "friend";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function handleNameSubmit() {
  const val = nameInput.value.trim();
  if (!val) {
    nameInput.focus();
    nameInput.style.animation = "none";
    nameInput.offsetHeight;
    nameInput.style.animation = "shake 0.3s";
    return;
  }
  kidName = capitalize(val);
  document.getElementById("name-echo").textContent = kidName;
  document.getElementById("name-echo-2").textContent = kidName;
  showScreen("describe");
  setTimeout(() => document.getElementById("describe-input").focus(), 400);
}

nameSubmit.addEventListener("click", handleNameSubmit);
nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleNameSubmit();
});
// focus on load
window.addEventListener("load", () => nameInput.focus());

/* ============ Screen 2: Describe ============ */
const describeInput = document.getElementById("describe-input");
const describeSubmit = document.getElementById("describe-submit");
const describeBack = document.getElementById("describe-back");

describeBack.addEventListener("click", () => showScreen("greet"));

function handleDescribeSubmit() {
  const val = describeInput.value.trim();
  if (!val || val.length < 3) {
    describeInput.focus();
    return;
  }
  const animal = findSpiritAnimal(val);
  showScreen("thinking");
  runThinkingSequence(animal);
}

describeSubmit.addEventListener("click", handleDescribeSubmit);
describeInput.addEventListener("keydown", (e) => {
  // Ctrl/Cmd+Enter to submit from textarea
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleDescribeSubmit();
});

/* ============ Microphone (Web Speech API) ============ */
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

/**
 * Wire up a mic button to an input/textarea field.
 * Options:
 *   singleLine: if true, treat as a name field (only first word, strip punctuation)
 *   listeningMsg: status shown while listening
 *   doneMsg:      status shown after a successful capture
 */
function setupMic({ btn, input, status, singleLine = false, listeningMsg, doneMsg }) {
  if (!btn) return;

  const setStatus = (text, isError) => {
    if (!status) return;
    status.textContent = text || "";
    status.classList.toggle("mic-status--error", !!isError);
  };

  if (!SpeechRecognition) {
    btn.classList.add("mic-btn--unsupported");
    btn.addEventListener("click", () => {
      setStatus("Talking doesn't work in this browser — try Chrome or Safari! You can still type.", true);
    });
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = !singleLine;    // name mode: capture one phrase and stop
  recognition.interimResults = true;
  recognition.lang = "en-US";
  recognition.maxAlternatives = 1;

  let isListening = false;
  let finalTranscript = "";
  let startingText = "";

  const cleanForName = (raw) => {
    // Keep only letters/spaces, take first word, capitalize handled elsewhere
    return raw.replace(/[^A-Za-z\s'-]/g, "").trim().split(/\s+/)[0] || "";
  };

  recognition.onstart = () => {
    isListening = true;
    btn.classList.add("mic-btn--listening");
    btn.setAttribute("aria-label", "Tap to stop listening");
    setStatus(listeningMsg || "🎙️ I'm listening…");
    startingText = singleLine ? "" : input.value.trim();
    finalTranscript = "";
  };

  recognition.onresult = (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) {
        finalTranscript += result[0].transcript + " ";
      } else {
        interim += result[0].transcript;
      }
    }
    const heard = (finalTranscript + interim).trim();

    if (singleLine) {
      input.value = cleanForName(heard);
      // Auto-stop when we have a final result — one word is enough for a name
      if (finalTranscript.trim().length > 0) {
        try { recognition.stop(); } catch (e) { /* ignore */ }
      }
    } else {
      input.value = [startingText, heard]
        .filter(Boolean)
        .join(startingText ? " " : "");
    }
  };

  recognition.onerror = (event) => {
    isListening = false;
    btn.classList.remove("mic-btn--listening");
    btn.setAttribute("aria-label", "Tap to talk to Gus");
    if (event.error === "not-allowed" || event.error === "service-not-allowed") {
      setStatus("I need permission to hear you! Check your browser's microphone settings.", true);
    } else if (event.error === "no-speech") {
      setStatus("I didn't hear anything — try again!", true);
    } else if (event.error === "audio-capture") {
      setStatus("I can't find a microphone on this device.", true);
    } else {
      setStatus("Oops, something went wrong. Try typing instead!", true);
    }
  };

  recognition.onend = () => {
    isListening = false;
    btn.classList.remove("mic-btn--listening");
    btn.setAttribute("aria-label", "Tap to talk to Gus");
    if (status && !status.classList.contains("mic-status--error")) {
      const gotSomething = singleLine
        ? input.value.trim().length > 0
        : input.value.trim().length > startingText.length;
      setStatus(gotSomething ? (doneMsg || "✨ Got it!") : "");
    }
  };

  btn.addEventListener("click", () => {
    if (isListening) {
      recognition.stop();
    } else {
      setStatus("");
      try { recognition.start(); } catch (err) { /* already started — ignore */ }
    }
  });
}

// Wire up the describe (3-things) mic
setupMic({
  btn:    document.getElementById("mic-btn"),
  input:  describeInput,
  status: document.getElementById("mic-status"),
  singleLine: false,
  listeningMsg: "🎙️ I'm listening! Tell me about you…",
  doneMsg:      "✨ Got it! Tap the mic again to add more, or hit 'Find my animal'."
});

// Wire up the name mic
setupMic({
  btn:    document.getElementById("name-mic-btn"),
  input:  nameInput,
  status: document.getElementById("name-mic-status"),
  singleLine: true,
  listeningMsg: "🎙️ I'm listening! Say your name…",
  doneMsg:      "✨ Got it! Tap 'Let's go' to continue."
});

/* ============ Screen 3: Thinking ============ */
const thinkingStatus = document.getElementById("thinking-status");
const thinkingSteps = [
  "Reading your answer…",
  "Asking my animal friends…",
  "Checking the Nat Geo files…",
  "Almost got it!"
];

function runThinkingSequence(animal) {
  let i = 0;
  thinkingStatus.textContent = thinkingSteps[0];
  const interval = setInterval(() => {
    i++;
    if (i < thinkingSteps.length) {
      thinkingStatus.textContent = thinkingSteps[i];
    }
  }, 750);

  // Reveal after ~3.2s
  setTimeout(() => {
    clearInterval(interval);
    revealAnimal(animal);
  }, 3200);
}

/* ============ Screen 4: Reveal ============ */
function revealAnimal(animal) {
  document.getElementById("animal-emoji").textContent = animal.emoji;
  document.getElementById("animal-name").textContent = animal.name;
  document.getElementById("animal-tag").textContent = animal.tag;
  document.getElementById("animal-fact").textContent = animal.fact;
  showScreen("reveal");
}

/* ============ Try again ============ */
document.getElementById("try-again").addEventListener("click", () => {
  stopSpeakingIfAny();
  describeInput.value = "";
  showScreen("describe");
  setTimeout(() => describeInput.focus(), 400);
});

/* ============ Read to me (text-to-speech) ============
   Uses the browser's built-in SpeechSynthesis API. No API key, no cost.
   We try to pick a warm-sounding female English voice. Browsers ship
   different voices (Samantha on Apple, Zira on Windows, Google voices
   on Chrome, etc.) so we score them and pick the best available.
============================================ */
const readBtn = document.getElementById("read-to-me");

function pickFriendlyVoice() {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  // Prefer these by name — they're consistently the warmest female voices
  // across platforms. Higher-indexed = higher preference.
  const preferredNames = [
    "Samantha",        // macOS / iOS — great warm tone, works on most Apple devices
    "Karen",           // macOS — Australian warmth
    "Google US English", // Chrome female voice
    "Microsoft Aria",  // Windows — newer natural voice
    "Microsoft Jenny", // Windows — newer natural voice
    "Microsoft Zira",  // Windows — older fallback
    "Moira",           // macOS — Irish-English
    "Tessa"            // macOS
  ];

  const scoreVoice = (v) => {
    let score = 0;
    // Must be English-ish
    if (!/^en/i.test(v.lang || "")) return -1;
    // Prefer en-US and en-GB slightly
    if (/^en-US/i.test(v.lang)) score += 3;
    if (/^en-GB/i.test(v.lang)) score += 2;
    // Name-based preference (the big signal)
    preferredNames.forEach((name, i) => {
      if ((v.name || "").includes(name)) score += 20 + i;
    });
    // "Female" in the name is a strong hint
    if (/female/i.test(v.name)) score += 10;
    // Avoid known male voices
    if (/(Daniel|Alex|Fred|Thomas|Rishi|male)/i.test(v.name)) score -= 15;
    return score;
  };

  const best = voices
    .map(v => ({ v, s: scoreVoice(v) }))
    .filter(x => x.s >= 0)
    .sort((a, b) => b.s - a.s)[0];

  return best ? best.v : voices.find(v => /^en/i.test(v.lang)) || voices[0];
}

// Voices load asynchronously in some browsers — prime the list
if ("speechSynthesis" in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged", () => {
    // no-op; just triggers voice list to populate
  });
}

function speakAnimal() {
  if (!("speechSynthesis" in window)) {
    alert("Sorry! Your browser doesn't support reading text out loud. Try Chrome or Safari.");
    return;
  }

  const synth = window.speechSynthesis;

  // If already speaking, clicking again stops it
  if (synth.speaking) {
    synth.cancel();
    readBtn.classList.remove("is-speaking");
    return;
  }

  const animalName = document.getElementById("animal-name").textContent;
  const animalFact = document.getElementById("animal-fact").textContent;
  const text = `${kidName ? kidName + ", " : ""}your spirit animal is ${animalName}. ${animalFact}`;

  const utter = new SpeechSynthesisUtterance(text);
  const voice = pickFriendlyVoice();
  if (voice) utter.voice = voice;
  utter.rate = 0.95;   // slightly slower for 1st graders
  utter.pitch = 1.1;   // a touch brighter / warmer
  utter.volume = 1.0;

  utter.onstart = () => readBtn.classList.add("is-speaking");
  utter.onend   = () => readBtn.classList.remove("is-speaking");
  utter.onerror = () => readBtn.classList.remove("is-speaking");

  synth.speak(utter);
}

if (readBtn) {
  readBtn.addEventListener("click", speakAnimal);
}

// If the kid leaves the reveal screen while it's talking, stop the voice
function stopSpeakingIfAny() {
  if ("speechSynthesis" in window && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    readBtn?.classList.remove("is-speaking");
  }
}

/* ============ Restart (back to the very beginning) ============ */
const restartBtn = document.getElementById("restart");
if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    stopSpeakingIfAny();
    // Clear everything so the next kid starts fresh
    if (nameInput) nameInput.value = "";
    if (describeInput) describeInput.value = "";
    kidName = "";
    // Also clear any lingering mic status messages
    const nameMicStatus = document.getElementById("name-mic-status");
    const micStatus = document.getElementById("mic-status");
    if (nameMicStatus) nameMicStatus.textContent = "";
    if (micStatus) micStatus.textContent = "";
    showScreen("greet");
    setTimeout(() => { if (nameInput) nameInput.focus(); }, 400);
  });
}

/* ============ Input shake animation ============ */
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }
`;
document.head.appendChild(styleSheet);
