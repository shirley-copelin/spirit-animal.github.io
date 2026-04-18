/* =========================================
   SpiritZoo — app logic
   - Keyword-based spirit animal matching
   - ANIMALS data lives in animals-data.js
   ========================================= */


/* ============ Matching logic ============ */
function findSpiritAnimal(text) {
  const normalized = text.toLowerCase();
  const scores = {};

  // Score each animal by keyword hits
  for (const [key, animal] of Object.entries(ANIMALS)) {
    scores[key] = 0;
    for (const kw of animal.keywords) {
      // simple substring match is best for kid input
      if (normalized.includes(kw)) {
        scores[key] += 1;
      }
    }
  }

  // Find max score
  let maxScore = 0;
  let winners = [];
  for (const [key, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      winners = [key];
    } else if (score === maxScore && score > 0) {
      winners.push(key);
    }
  }

  // If nothing matched, pick a random fun animal so every kid gets something
  if (maxScore === 0) {
    const friendlyFallbacks = ["dolphin", "otter", "fox", "hummingbird", "butterfly", "panda"];
    const pick = friendlyFallbacks[Math.floor(Math.random() * friendlyFallbacks.length)];
    return ANIMALS[pick];
  }

  // If tied, pick one of the winners randomly
  const winnerKey = winners[Math.floor(Math.random() * winners.length)];
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
  describeInput.value = "";
  showScreen("describe");
  setTimeout(() => describeInput.focus(), 400);
});

/* ============ Restart (back to the very beginning) ============ */
document.getElementById("restart").addEventListener("click", () => {
  // Clear everything so the next kid starts fresh
  nameInput.value = "";
  describeInput.value = "";
  kidName = "";
  // Also clear any lingering mic status messages
  const nameMicStatus = document.getElementById("name-mic-status");
  const micStatus = document.getElementById("mic-status");
  if (nameMicStatus) nameMicStatus.textContent = "";
  if (micStatus) micStatus.textContent = "";
  showScreen("greet");
  setTimeout(() => nameInput.focus(), 400);
});

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
