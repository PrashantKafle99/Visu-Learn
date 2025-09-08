// ===== Gemini Flash Image (Nano Banana) Client =====
// Minimal front-end helper to call Google Generative AI REST API
// Replace YOUR_API_KEY_HERE with a valid API key that has access to Gemini models
// WARNING: Exposing API keys in client-side code is insecure. For production deploy a secure backend proxy.

const API_KEY = "AIzaSyAFcIbB3CtygIPP-GPkl63DFC6Weuif8q4"; // ←—— set your key
const MODEL = "gemini-2.5-flash-image-preview";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

// ------------- Core helpers -------------
async function geminiGenerate(partsArray) {
  const body = {
    contents: [{ role: "user", parts: partsArray }],
  };

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Gemini API error ${res.status}`);
  return res.json();
}

function extractImageBase64(apiResponse) {
  const candidate = apiResponse.candidates?.[0];
  if (!candidate) throw new Error("No candidate returned");
  const part = candidate.content.parts.find((p) => p.inlineData?.data);
  if (!part) throw new Error("No image in response");
  return part.inlineData.data; // base64 string (PNG)
}

// ------------- High-level wrappers -------------
async function generateImage(prompt) {
  const resJson = await geminiGenerate([{ text: prompt }]);
  const b64 = extractImageBase64(resJson);
  return `data:image/png;base64,${b64}`;
}

async function editImage(file, prompt) {
  const base64Img = await fileToBase64(file);
  const parts = [
    { text: prompt },
    {
      inlineData: {
        mimeType: file.type || "image/png",
        data: base64Img,
      },
    },
  ];
  const resJson = await geminiGenerate(parts);
  const b64 = extractImageBase64(resJson);
  return `data:image/png;base64,${b64}`;
}

// ---------- Utility ----------
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result.split(",")[1]; // strip data:mime;base64,
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ------------- UI bindings -------------
window.addEventListener("DOMContentLoaded", () => {
  const genBtn = qs("#generateBtn");
  const editBtn = qs("#editBtn");

  genBtn.addEventListener("click", async () => {
    const prompt = qs("#generatePrompt").value.trim();
    if (!prompt) return alert("Enter a prompt");
    toggle(genBtn, true, "#generateLoader");
    try {
      const url = await generateImage(prompt);
      show("#generatedPreview", url);
    } catch (e) {
      alert(e.message);
    } finally {
      toggle(genBtn, false, "#generateLoader");
    }
  });

  editBtn.addEventListener("click", async () => {
    const prompt = qs("#editPrompt").value.trim();
    const file = qs("#editImage").files[0];
    if (!prompt || !file) return alert("Select image & prompt");
    toggle(editBtn, true, "#editLoader");
    try {
      const url = await editImage(file, prompt);
      show("#editedPreview", url);
    } catch (e) {
      alert(e.message);
    } finally {
      toggle(editBtn, false, "#editLoader");
    }
  });

  // TTS
  const ttsBtn = qs("#ttsBtn");
  ttsBtn.addEventListener("click", async () => {
    const text = qs("#ttsText").value.trim();
    if (!text) return alert("Enter text");
    toggle(ttsBtn, true, "#ttsLoader");
    try {
      const audioUrl = await tts(text);
      const audio = qs("#ttsAudio");
      audio.src = audioUrl;
      audio.hidden = false;
      audio.play();
    } catch (e) {
      alert(e.message);
    } finally {
      toggle(ttsBtn, false, "#ttsLoader");
    }
  });

  // STT with recording
  const recBtn = qs("#sttRecordBtn");
  let mediaRecorder;
  let chunks = [];
  let recording = false;

  recBtn.addEventListener("click", async () => {
    if (!recording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        chunks = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = async () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          toggle(recBtn, true, "#sttLoader");
          try {
            const text = await stt(blob);
            const out = qs("#sttOutput");
            out.hidden = false;
            out.value = text;
          } catch (err) {
            alert(err.message);
          } finally {
            toggle(recBtn, false, "#sttLoader");
            recBtn.textContent = "Start Recording";
            recording = false;
          }
        };
        mediaRecorder.start();
        recBtn.textContent = "Stop Recording";
        recording = true;
      } catch (err) {
        alert("Microphone access denied or not available: " + err.message);
      }
    } else {
      mediaRecorder.stop();
    }
  });

  // ---------- DOM helpers ----------
  function qs(sel) {
    return document.querySelector(sel);
  }
  function toggle(btn, loading, loaderSel) {
    btn.disabled = loading;
    qs(loaderSel).style.display = loading ? "block" : "none";
  }
  function show(imgSel, src) {
    const img = qs(imgSel);
    img.src = src;
    img.hidden = false;
  }

  // ------------- ElevenLabs TTS -------------
  const ELEVEN_KEY = "sk_8aa964fcda367e2d831a33c12d228811afa38d2c5f8a67bc";
  async function tts(text) {
    const voiceId = "JBFqnCBsd6RMkjVDRZzb"; // default voice from docs
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVEN_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        output_format: "mp3_44100_128",
      }),
    });
    if (!res.ok) throw new Error(`TTS error ${res.status}`);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  }

  // ------------- ElevenLabs Speech-to-Text -------------
  async function stt(fileOrBlob) {
    const modelId = "scribe_v1"; // ElevenLabs STT model ID per docs

    const fd = new FormData();
    fd.append("model_id", modelId);
    fd.append("file", fileOrBlob, "speech.webm");

    const res = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: {
        "xi-api-key": ELEVEN_KEY,
        // boundary set automatically
      },
      body: fd,
    });
    if (!res.ok) throw new Error(`STT error ${res.status}`);
    const data = await res.json();
    return data.text || data.transcript || JSON.stringify(data);
  }
});
