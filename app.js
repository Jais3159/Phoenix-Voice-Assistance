/* Phoenix v3 — Voice-First Frontend */
(() => {
    'use strict';

    const $ = id => document.getElementById(id);
    const splash = $('welcomeSplash'), nameInput = $('nameInput'), startBtn = $('startBtn');
    const voiceScreen = $('voiceScreen'), voiceOrb = $('voiceOrb');
    const voiceStatus = $('voiceStatus'), voiceTranscript = $('voiceTranscript');
    const chatPanel = $('chatPanel'), messagesArea = $('messagesArea');
    const textInput = $('textInput'), sendBtn = $('sendBtn');
    const closePanelBtn = $('closePanelBtn'), clearChatBtn = $('clearChatBtn');
    const muteSpeechBtn = $('muteSpeechBtn'), muteBtnMain = $('muteBtnMain');
    const openChatBtn = $('openChatBtn'), statusText = $('statusText');
    const langLabel = $('langLabel');

    let userName = localStorage.getItem('phoenix_user') || '';
    const sessionId = 'sess_' + Math.random().toString(36).slice(2, 10);
    let isMuted = false, isListening = false, isChatOpen = false, isBusy = false;
    let recognition = null, synth = window.speechSynthesis;
    let currentLang = 'en';

    const phoenixSVG = `<svg viewBox="0 0 64 64" fill="none" width="26" height="26"><path d="M32 4C28 12 16 18 14 28C12 38 20 48 32 56C44 48 52 38 50 28C48 18 36 12 32 4Z" fill="url(#fg4)"/><path d="M32 16C30 22 24 26 23 32C22 38 26 44 32 48C38 44 42 38 41 32C40 26 34 22 32 16Z" fill="url(#ig4)" opacity="0.8"/><defs><linearGradient id="fg4" x1="32" y1="4" x2="32" y2="56" gradientUnits="userSpaceOnUse"><stop stop-color="#FFD700"/><stop offset="0.5" stop-color="#FF6B35"/><stop offset="1" stop-color="#FF2D2D"/></linearGradient><linearGradient id="ig4" x1="32" y1="16" x2="32" y2="48" gradientUnits="userSpaceOnUse"><stop stop-color="#FFF7AE"/><stop offset="1" stop-color="#FFB347"/></linearGradient></defs></svg>`;

    // ========== PARTICLES ==========
    const canvas = $('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 10;
            this.size = Math.random() * 3 + 1;
            this.speedY = -(Math.random() * 1.2 + 0.3);
            this.speedX = (Math.random() - 0.5) * 0.6;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.life = Math.random() * 200 + 100;
            this.age = 0;
            const colors = ['255,215,0', '255,107,53', '255,45,45', '255,179,71'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.x += this.speedX + Math.sin(this.age * 0.02) * 0.3;
            this.y += this.speedY;
            this.age++;
            this.opacity = Math.max(0, this.opacity - 0.002);
            if (this.age > this.life || this.opacity <= 0) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color},${this.opacity * 0.15})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(60, Math.floor(canvas.width / 25));
        for (let i = 0; i < count; i++) {
            const p = new Particle();
            p.y = Math.random() * canvas.height;
            p.age = Math.random() * p.life;
            particles.push(p);
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // ========== SOUNDS ==========
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function playTone(freq, dur, type = 'sine', vol = 0.08) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type; osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + dur);
    }
    function sfxSend() { playTone(880, 0.1, 'triangle'); }
    function sfxReceive() { playTone(440, 0.12); setTimeout(() => playTone(554, 0.12), 100); }

    // ========== SPLASH ==========
    function initSplash() {
        if (userName) {
            splash.classList.add('hidden');
            activateVoiceScreen();
            return;
        }
        nameInput.addEventListener('input', () => { startBtn.disabled = nameInput.value.trim().length === 0; });
        startBtn.addEventListener('click', handleStart);
        nameInput.addEventListener('keydown', e => { if (e.key === 'Enter' && nameInput.value.trim()) handleStart(); });
    }

    function handleStart() {
        userName = nameInput.value.trim();
        if (!userName) return;
        localStorage.setItem('phoenix_user', userName);
        splash.classList.add('fade-out');
        setTimeout(() => { splash.classList.add('hidden'); activateVoiceScreen(); }, 500);
    }

    function activateVoiceScreen() {
        voiceScreen.classList.remove('hidden');
        voiceStatus.textContent = 'Tap the orb to start talking 🎙️';
    }

    // ========== VOICE ORB CLICK ==========
    voiceOrb.addEventListener('click', () => {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    });

    // ========== CHAT TOGGLE ==========
    openChatBtn.addEventListener('click', () => {
        isChatOpen = true;
        chatPanel.classList.add('open');
        stopListening();
        if (!messagesArea.querySelector('.welcome-msg') && messagesArea.children.length === 0) {
            showWelcomeMessage();
        }
        setTimeout(() => textInput.focus(), 400);
    });

    closePanelBtn.addEventListener('click', () => {
        isChatOpen = false;
        chatPanel.classList.remove('open');
        stopSpeaking();
    });

    // ========== MESSAGES ==========
    function showWelcomeMessage() {
        if (messagesArea.querySelector('.welcome-msg')) return;
        messagesArea.innerHTML = `
            <div class="welcome-msg">
                <div class="welcome-msg-icon">🔥</div>
                <h3>Hey ${userName}!</h3>
                <p>I'm Phoenix — tera dost! Voice ya chat, jo bhi pasand ho. Kisi bhi language mein baat kar!</p>
                <div class="quick-actions">
                    <button class="quick-action-btn" data-msg="Tell me a joke">😂 Joke</button>
                    <button class="quick-action-btn" data-msg="What's the weather?">🌤️ Weather</button>
                    <button class="quick-action-btn" data-msg="Play trivia">🧠 Trivia</button>
                    <button class="quick-action-btn" data-msg="yaar koi fun fact bata">📖 Fun Fact</button>
                </div>
            </div>`;
        messagesArea.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', () => sendMessage(btn.dataset.msg));
        });
    }

    function getTimeStr() {
        return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    function addMessage(text, sender, typewriter = false) {
        const welcome = messagesArea.querySelector('.welcome-msg');
        if (welcome) welcome.remove();
        const msg = document.createElement('div');
        msg.className = `message ${sender}`;
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        if (sender === 'user') { avatar.textContent = userName.charAt(0).toUpperCase(); }
        else { avatar.innerHTML = phoenixSVG; }
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        const content = document.createElement('div');
        content.className = 'message-content';
        const time = document.createElement('div');
        time.className = 'message-time';
        time.textContent = getTimeStr();
        if (typewriter && sender === 'bot') {
            bubble.appendChild(content); bubble.appendChild(time);
            msg.appendChild(avatar); msg.appendChild(bubble);
            messagesArea.appendChild(msg);
            typewriterEffect(content, text);
        } else {
            content.textContent = text;
            bubble.appendChild(content); bubble.appendChild(time);
            msg.appendChild(avatar); msg.appendChild(bubble);
            messagesArea.appendChild(msg);
        }
        scrollToBottom();
    }

    function typewriterEffect(el, text, speed = 18) {
        let i = 0; el.textContent = '';
        function type() {
            if (i < text.length) { el.textContent += text.charAt(i); i++; scrollToBottom(); setTimeout(type, speed); }
        }
        type();
    }

    function showTyping() {
        statusText.textContent = 'Typing...';
        voiceStatus.textContent = 'Phoenix soch raha hai... 🤔';
        const msg = document.createElement('div');
        msg.className = 'message bot'; msg.id = 'typingMsg';
        msg.innerHTML = `<div class="message-avatar">${phoenixSVG}</div><div class="message-bubble"><div class="message-content"><div class="typing-indicator"><span></span><span></span><span></span></div></div></div>`;
        messagesArea.appendChild(msg);
        scrollToBottom();
    }

    function removeTyping() {
        statusText.textContent = 'Online';
        const t = $('typingMsg');
        if (t) t.remove();
    }

    function scrollToBottom() {
        requestAnimationFrame(() => { messagesArea.scrollTop = messagesArea.scrollHeight; });
    }

    // ========== SEND & RECEIVE ==========
    async function sendMessage(text) {
        const msg = text.trim();
        if (!msg) return;
        textInput.value = ''; autoResize();
        sendBtn.disabled = true;
        sfxSend();
        addMessage(msg, 'user');
        showTyping();
        voiceOrb.classList.add('thinking');

        // Pause mic during processing (prevent restart conflicts)
        isBusy = true;
        try { recognition?.stop(); } catch {}

        const delay = 400 + Math.random() * 600;
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg, userName, sessionId })
            });
            const data = await res.json();
            let reply = data.reply;
            currentLang = data.replyLang || 'en';

            const langMap = { en: 'EN', hinglish: 'HI-EN', hi: 'HI', pa: 'PA', fr: 'FR', es: 'ES', de: 'DE', mr: 'MR', bn: 'BN', ta: 'TA', te: 'TE' };
            langLabel.textContent = langMap[currentLang] || 'EN';

            await sleep(delay);
            removeTyping();
            sfxReceive();
            voiceOrb.classList.remove('thinking');
            addMessage(reply, 'bot', true);
            voiceTranscript.textContent = '';

            // isBusy stays true if speaking, to prevent mic from hearing Phoenix
            if (!isMuted) {
                speak(reply, data.ttsLang || 'en');
            } else {
                isBusy = false;
                if (wantsListening) {
                    voiceStatus.textContent = '🎙️ Bol... Main sun raha hoon!';
                    restartListening();
                }
            }
        } catch {
            await sleep(delay);
            removeTyping();
            voiceOrb.classList.remove('thinking');
            addMessage("Oops, brain glitch! Try again? 😅", 'bot');
            isBusy = false;
            // Resume mic after error too
            if (wantsListening) {
                voiceStatus.textContent = '🎙️ Bol... Main sun raha hoon!';
                restartListening();
            }
        }
    }

    async function fetchWeather(msg) {
        const cityMatch = msg.match(/weather\s+(?:in|at|for|of)\s+(.+)/i) || msg.match(/mausam\s+(.+)/i);
        const city = cityMatch ? cityMatch[1].trim() : 'auto';
        try {
            const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
            const w = await res.json();
            if (w.error) throw new Error();
            if (currentLang === 'hinglish') {
                return `${w.location} ka mausam:\n\n🌡️ ${w.temp_c}°C (feels like ${w.feels_like_c}°C)\n☁️ ${w.description}\n💧 Humidity: ${w.humidity}%\n💨 Hawa: ${w.wind_kph} km/h\n\nAccording to that dress karo! 😄`;
            }
            return `Weather in ${w.location}, ${w.region}:\n\n🌡️ ${w.temp_c}°C (feels ${w.feels_like_c}°C)\n☁️ ${w.description}\n💧 Humidity: ${w.humidity}%\n💨 Wind: ${w.wind_kph} km/h\n\nDress accordingly! 😄`;
        } catch {
            return currentLang === 'hinglish'
                ? `Yaar mausam check nahi ho paya. Thodi der baad try kar! 🌧️`
                : `Couldn't check the weather right now. Try again! 🌧️`;
        }
    }

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    // ========== TEXT INPUT ==========
    textInput.addEventListener('input', () => {
        sendBtn.disabled = textInput.value.trim().length === 0;
        autoResize();
    });
    textInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (textInput.value.trim()) sendMessage(textInput.value);
        }
    });
    sendBtn.addEventListener('click', () => { if (textInput.value.trim()) sendMessage(textInput.value); });
    function autoResize() {
        textInput.style.height = 'auto';
        textInput.style.height = Math.min(textInput.scrollHeight, 90) + 'px';
    }

    // ========== VOICE INPUT (continuous mode) ==========
    let wantsListening = false;
    let restartTimer = null;

    function initSpeechRecognition() {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) {
            voiceStatus.textContent = 'Voice not supported. Use chat instead!';
            voiceOrb.style.opacity = '0.5';
            return;
        }
        recognition = new SR();
        recognition.lang = 'hi-IN';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
            isListening = true;
            voiceOrb.classList.add('listening');
            voiceStatus.textContent = '🎙️ Bol... Main sun raha hoon!';
        };

        recognition.onresult = e => {
            let interim = '', final = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
                if (e.results[i].isFinal) { final += e.results[i][0].transcript; }
                else { interim += e.results[i][0].transcript; }
            }
            voiceTranscript.textContent = final || interim;
            if (final.trim()) {
                voiceTranscript.textContent = '';
                sendMessage(final);
            }
        };

        recognition.onerror = (e) => {
            if (e.error === 'no-speech' || e.error === 'aborted' || e.error === 'audio-capture') {
                return;
            }
            console.log('Mic error:', e.error);
        };

        recognition.onend = () => {
            isListening = false;
            // Only auto-restart if we want to listen and are not busy processing/speaking
            if (wantsListening && !isBusy) {
                if (restartTimer) clearTimeout(restartTimer);
                restartTimer = setTimeout(() => {
                    try { recognition.start(); } catch {}
                }, 300);
            } else if (!wantsListening) {
                voiceOrb.classList.remove('listening');
                if (!voiceOrb.classList.contains('thinking') && !voiceOrb.classList.contains('speaking')) {
                    voiceStatus.textContent = 'Tap the orb to talk 🎙️';
                }
            }
        };
    }

    function startListening() {
        if (!recognition) return;
        stopSpeaking();
        wantsListening = true;
        try { recognition.start(); } catch {}
    }

    function stopListening() {
        wantsListening = false;
        if (restartTimer) clearTimeout(restartTimer);
        isListening = false;
        voiceOrb.classList.remove('listening');
        if (!voiceOrb.classList.contains('thinking') && !voiceOrb.classList.contains('speaking')) {
            voiceStatus.textContent = 'Tap the orb to talk 🎙️';
        }
        try { recognition.stop(); } catch {}
    }

    function restartListening() {
        if (!wantsListening || isListening) return;
        try { recognition.start(); } catch {}
    }

    // ========== VOICE OUTPUT ==========
    function speak(text, ttsLang = 'en') {
        if (isMuted || !synth) return;
        stopSpeaking();
        // Pause mic while Phoenix speaks so it doesn't hear itself
        if (isListening) {
            try { recognition?.stop(); } catch {}
        }
        const clean = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}•\n]/gu, ' ').trim();
        if (!clean) {
            isBusy = false;
            if (wantsListening) restartListening();
            return;
        }
        const utter = new SpeechSynthesisUtterance(clean);
        utter.rate = 1.0; utter.pitch = 1.05; utter.volume = 0.85;

        const voices = synth.getVoices();
        const pref = voices.find(v => v.lang.startsWith(ttsLang))
            || voices.find(v => v.lang.startsWith('hi'))
            || voices.find(v => v.name.includes('Google') && v.lang.startsWith('en'))
            || voices.find(v => v.lang.startsWith('en'));
        if (pref) utter.voice = pref;

        utter.onstart = () => {
            voiceOrb.classList.add('speaking');
            voiceStatus.textContent = '🔊 Phoenix bol raha hai...';
        };
        utter.onend = () => {
            voiceOrb.classList.remove('speaking');
            isBusy = false;
            // Auto-resume mic after Phoenix finishes speaking
            if (wantsListening) {
                voiceStatus.textContent = '🎙️ Bol... Main sun raha hoon!';
                setTimeout(() => restartListening(), 400);
            }
        };
        utter.onerror = () => {
            voiceOrb.classList.remove('speaking');
            isBusy = false;
            if (wantsListening) setTimeout(() => restartListening(), 400);
        };
        synth.speak(utter);
    }

    function stopSpeaking() {
        if (synth?.speaking) synth.cancel();
        voiceOrb.classList.remove('speaking');
    }

    if (synth) { synth.getVoices(); synth.onvoiceschanged = () => synth.getVoices(); }

    // ========== MUTE / CLEAR ==========
    function toggleMute() {
        isMuted = !isMuted;
        muteSpeechBtn.classList.toggle('muted', isMuted);
        muteBtnMain.classList.toggle('muted', isMuted);
        if (isMuted) stopSpeaking();
    }
    muteSpeechBtn.addEventListener('click', toggleMute);
    muteBtnMain.addEventListener('click', toggleMute);

    clearChatBtn.addEventListener('click', () => {
        messagesArea.innerHTML = '';
        showWelcomeMessage();
        stopSpeaking();
    });

    // ========== INIT ==========
    initSplash();
    initSpeechRecognition();
})();
