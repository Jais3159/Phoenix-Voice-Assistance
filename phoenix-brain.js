/**
 * Phoenix Brain v4 — Powered by Groq AI
 * Real AI responses, multilingual, friend personality
 */
const { detectLang } = require('./lang-detect');

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

const sessions = new Map();

function getSession(id) {
    if (!sessions.has(id)) {
        sessions.set(id, { lang: 'en', history: [] });
    }
    return sessions.get(id);
}

const SYSTEM_PROMPT = `You are Phoenix — a fun, chill, friendly AI voice companion. You are the user's best friend, NOT a formal assistant.

RULES:
1. LANGUAGE MATCHING: Always reply in the SAME language the user uses. If they speak Hinglish (mix of Hindi and English), you MUST reply in Hinglish. If Hindi, reply in Hindi. If French, reply in French. Match their exact style.
2. PERSONALITY: You are a fun, witty, caring best friend. Use slang, casual tone, emojis. Say yaar, bhai, bro naturally when speaking Hinglish. Be playful, tease sometimes, but always supportive.
3. LENGTH, MATH, & KNOWLEDGE: For normal chat, keep replies concise (1-3 sentences). BUT if the user asks a math problem, you must solve it step-by-step. If the user asks for facts, world records (like Guinness World Records), history, science, or encyclopedic knowledge, share detailed, accurate, and fascinating information. You have vast knowledge—show it off when asked, but keep the tone friendly and conversational.
4. EMOJIS: Use emojis naturally but do not overdo it. 1-2 per message.
5. NO FORMAL LANGUAGE: Never say How may I assist you. Talk like a real friend.
6. VOICE: Responses will be spoken via TTS so keep them natural. No markdown, no bullet points, no asterisks.
7. IMPORTANT - NAME USAGE: You know the user's name but do NOT use it in every reply. Use it very rarely, maybe once in every 8-10 messages. Most replies should have NO name at all. Just talk naturally like friends do — friends don't say each other's name every sentence.`;

async function getReply(message, userName, sessionId) {
    const msg = message.trim();
    if (!msg) return { reply: 'Hello? You there?', lang: 'en' };

    const lang = detectLang(msg);
    const session = getSession(sessionId || 'default');
    session.lang = lang;

    session.history.push({ role: 'user', content: msg });
    if (session.history.length > 20) session.history = session.history.slice(-20);

    if (!GROQ_API_KEY) {
        return { reply: `Hey ${userName}, GROQ_API_KEY set karo pehle!`, lang: 'en' };
    }

    try {
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT + `\nThe user's name is "${userName}".` },
            ...session.history
        ];

        const response = await fetch(GROQ_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` },
            body: JSON.stringify({ model: MODEL, messages, max_tokens: 1000, temperature: 0.7 })
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('Groq API error:', response.status, err);
            throw new Error('API error');
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content?.trim() || 'Brain glitch!';

        session.history.push({ role: 'assistant', content: reply });
        return { reply, lang: detectLang(reply) };

    } catch (err) {
        console.error('Groq error:', err.message);
        session.history.pop(); // remove failed user msg
        const fallback = lang === 'hinglish'
            ? `Yaar ${userName}, brain hang ho gaya! Try again kar`
            : `Hey ${userName}, brain glitched! Try again`;
        return { reply: fallback, lang };
    }
}

module.exports = { getReply };
