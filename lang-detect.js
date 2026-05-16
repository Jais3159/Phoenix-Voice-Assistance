/**
 * Language Detection Module for Phoenix
 */

const langPatterns = {
    hindi: /[\u0900-\u097F]/,
    punjabi: /[\u0A00-\u0A7F]/,
    marathi: /[\u0900-\u097F]/,
    french: /\b(bonjour|salut|merci|oui|non|comment|bienvenue|je suis|s'il vous|bonsoir|au revoir|c'est|très|avec)\b/i,
    spanish: /\b(hola|gracias|buenos|buenas|cómo|está|por favor|amigo|señor|hasta)\b/i,
    german: /\b(hallo|danke|guten|bitte|wie geht|ich bin|auf wiedersehen|ja|nein|sehr)\b/i,
    japanese: /[\u3040-\u309F\u30A0-\u30FF]/,
    chinese: /[\u4E00-\u9FFF]/,
    korean: /[\uAC00-\uD7AF]/,
    arabic: /[\u0600-\u06FF]/,
    tamil: /[\u0B80-\u0BFF]/,
    telugu: /[\u0C00-\u0C7F]/,
    bengali: /[\u0980-\u09FF]/,
    gujarati: /[\u0A80-\u0AFF]/,
};

const hinglishWords = /\b(yaar|bhai|kya|hai|nahi|mein|tum|kaise|accha|theek|haan|naa|abhi|karo|bolo|bol|dekh|chal|chalo|matlab|aur|lekin|toh|kyun|kab|kaha|kaun|kitna|bahut|bohot|bro|yrr|yr|krna|krne|kya|kar|kre|krte|nhi|rha|rhi|rhe|hota|hoti|hote|wala|wali|wale|mujhe|tujhe|apna|apni|apne|suno|sunna|batao|btao|pata|pta|samajh|smjh|milke|dost|yeh|woh|uska|uski|unka|unki|merko|terko|bilkul|pakka|sach|jhooth|pagal|kamaal|mast|bindaas|dil|pyaar|ishq|zindagi|duniya|sapna|khushi|dukh|mazaa|maja|aaja|jaao|khaana|peena|ghar|paisa|paise|time|scene|vibe|vibes)\b/i;

function detectLang(text) {
    if (!text) return 'en';
    
    const hasDevanagari = langPatterns.hindi.test(text);
    const hasLatin = /[a-zA-Z]/.test(text);
    
    // Pure Hindi (Devanagari script)
    if (hasDevanagari && !hasLatin) return 'hi';
    
    // Hinglish (Hindi words in Latin script or mixed)
    if (hasDevanagari && hasLatin) return 'hinglish';
    if (hasLatin && hinglishWords.test(text)) return 'hinglish';
    
    // Punjabi
    if (langPatterns.punjabi.test(text)) return 'pa';
    
    // Other scripts
    if (langPatterns.bengali.test(text)) return 'bn';
    if (langPatterns.tamil.test(text)) return 'ta';
    if (langPatterns.telugu.test(text)) return 'te';
    if (langPatterns.gujarati.test(text)) return 'gu';
    if (langPatterns.japanese.test(text)) return 'ja';
    if (langPatterns.chinese.test(text)) return 'zh';
    if (langPatterns.korean.test(text)) return 'ko';
    if (langPatterns.arabic.test(text)) return 'ar';
    
    // Latin-script languages
    if (langPatterns.french.test(text)) return 'fr';
    if (langPatterns.spanish.test(text)) return 'es';
    if (langPatterns.german.test(text)) return 'de';
    
    return 'en';
}

// Get speech recognition lang code
function getSpeechLang(lang) {
    const map = {
        en: 'en-US', hi: 'hi-IN', hinglish: 'hi-IN',
        pa: 'pa-IN', mr: 'mr-IN', bn: 'bn-IN',
        ta: 'ta-IN', te: 'te-IN', gu: 'gu-IN',
        fr: 'fr-FR', es: 'es-ES', de: 'de-DE',
        ja: 'ja-JP', zh: 'zh-CN', ko: 'ko-KR', ar: 'ar-SA'
    };
    return map[lang] || 'en-US';
}

// Get TTS voice lang prefix
function getTTSLang(lang) {
    const map = {
        en: 'en', hi: 'hi', hinglish: 'hi',
        pa: 'pa', mr: 'hi', bn: 'bn',
        ta: 'ta', te: 'te', gu: 'gu',
        fr: 'fr', es: 'es', de: 'de',
        ja: 'ja', zh: 'zh', ko: 'ko', ar: 'ar'
    };
    return map[lang] || 'en';
}

module.exports = { detectLang, getSpeechLang, getTTSLang };
