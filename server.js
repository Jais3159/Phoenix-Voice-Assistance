const express = require('express');
const path = require('path');
const { getReply } = require('./phoenix-brain');
const { detectLang, getSpeechLang, getTTSLang } = require('./lang-detect');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Chat endpoint — now async (Grok AI powered)
app.post('/api/chat', async (req, res) => {
    const { message, userName, sessionId } = req.body;
    if (!message) return res.status(400).json({ error: 'No message' });

    try {
        const result = await getReply(message, userName || 'buddy', sessionId || 'default');
        const replyLang = result.lang || 'en';
        res.json({
            reply: result.reply,
            lang: detectLang(message),
            replyLang,
            ttsLang: getTTSLang(replyLang),
            speechLang: getSpeechLang(detectLang(message))
        });
    } catch (err) {
        console.error('Chat error:', err);
        res.status(500).json({ reply: 'Oops, something went wrong! 😅', lang: 'en', replyLang: 'en', ttsLang: 'en' });
    }
});

// Weather endpoint
app.get('/api/weather', async (req, res) => {
    const city = req.query.city || 'auto';
    try {
        const url = city === 'auto'
            ? 'https://wttr.in/?format=j1'
            : `https://wttr.in/${encodeURIComponent(city)}?format=j1`;
        const resp = await fetch(url);
        const data = await resp.json();
        const c = data.current_condition[0];
        const a = data.nearest_area[0];
        res.json({
            location: a.areaName[0].value,
            region: a.region[0].value,
            country: a.country[0].value,
            temp_c: c.temp_C, temp_f: c.temp_F,
            feels_like_c: c.FeelsLikeC,
            description: c.weatherDesc[0].value,
            humidity: c.humidity,
            wind_kph: c.windspeedKmph,
            uv: c.uvIndex
        });
    } catch {
        res.status(500).json({ error: 'Could not fetch weather' });
    }
});

app.listen(PORT, () => {
    console.log(`\n🔥 Phoenix v4 (Groq-powered) is alive at http://localhost:${PORT}`);
    if (!process.env.GROQ_API_KEY) {
        console.log('⚠️  GROQ_API_KEY not set! Get free key at https://console.groq.com\n');
    } else {
        console.log('✅ Groq API key detected — AI brain is active!\n');
    }
});
