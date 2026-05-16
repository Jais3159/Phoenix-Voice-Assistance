/**
 * Phoenix Multilingual Response Bank v2 — Way more conversational
 */
const rand = arr => arr[Math.floor(Math.random() * arr.length)];

const R = {
    greetings: {
        en: (n) => rand([`Hey ${n}! 🔥 What's up?`, `Yo ${n}! How's it going?`, `Hey ${n}! Good to see you! 😊`]),
        hinglish: (n) => rand([`Arey ${n}! 🔥 Kya haal hai bhai?`, `Yo ${n}! Kaise ho yaar?`, `${n}! Kya scene hai? 😎`, `Oye ${n}! Bol na kya chal raha? 🔥`]),
        hi: (n) => rand([`अरे ${n}! 🔥 कैसे हो?`, `${n}! क्या हाल है?`, `हेलो ${n}! 😊`]),
        fr: (n) => rand([`Salut ${n}! 🔥 Comment ça va?`, `Hey ${n}! Ça roule? 😊`]),
    },
    howAreYou: {
        en: [`I'm vibing! 😎 How about YOU?`, `Doing great! What about you?`, `Living my best digital life! You tell me about yours 😄`],
        hinglish: [`Mast hai yaar! 😎 Tu bata?`, `Ekdum first class! Tera kya haal?`, `Chill hai bhai! 🔥 Tu suna?`, `Badia yaar! Tu bata kya chal raha?`],
        hi: [`बहुत बढ़िया! 😎 तुम बताओ?`, `मजे में! तुम कैसे हो?`],
        fr: [`Ça va super bien! 😎 Et toi?`, `Je vais bien! Et toi?`],
    },
    jokes: {
        en: [
            `Why don't scientists trust atoms? They make up everything! 😂`,
            `What do you call fake spaghetti? An impasta! 🍝`,
            `Why did the bicycle fall over? It was two-tired! 🚲`,
            `I told my computer I needed a break... now it shows me vacation ads 🏖️`,
            `What do you call a bear with no teeth? A gummy bear! 🐻`,
            `Why don't skeletons fight? They don't have the guts! 💀`,
            `What did the ocean say to the beach? Nothing, it just waved 🌊`,
        ],
        hinglish: [
            `Teacher: Tum school kyun nahi aaye? Student: Sir, sapne mein Ambani ne job di thi 😂`,
            `Pappu se pucha — Google kaun chalata hai? Pappu: Jo phone unlock karta hai! 🤣`,
            `Doctor: Aapko roz subah daudna chahiye. Patient: Par sir, main toh baraat mein bhi nahi dauda! 😂`,
            `Ek aadmi ne WiFi ka password pucha — jawab mila: "Pehle chai toh lao" ☕😂`,
            `Santa: Meri biwi mujhse baat nahi karti. Banta: Yaar tu lucky hai, meri toh chup hi nahi hoti! 😂`,
            `Judge: Tumne isko kyun maara? Accused: Judge sahab, yeh mere jokes pe nahi hasta tha! 😤😂`,
        ],
        hi: [
            `टीचर: स्कूल क्यों नहीं आए? स्टूडेंट: सर, सपने में अंबानी ने जॉब दी थी 😂`,
            `डॉक्टर: रोज़ सुबह दौड़ो। मरीज़: सर, बारात में भी नहीं दौड़ा! 😂`,
        ],
        fr: [
            `Pourquoi les plongeurs plongent-ils toujours en arrière? Sinon ils tomberaient dans le bateau! 😂`,
        ],
    },
    funFacts: {
        en: [
            `🧠 Octopuses have three hearts and blue blood!`,
            `🍌 Bananas are berries, but strawberries aren't!`,
            `🍯 Honey never spoils — 3000-year-old honey was found edible!`,
            `🦈 Sharks are older than trees — 400 million years!`,
            `🌧️ It rains diamonds on Jupiter and Saturn!`,
            `🦩 Flamingos are white. Their diet turns them pink!`,
        ],
        hinglish: [
            `🧠 Octopus ke 3 dil hote hai aur unka khoon neela hota hai! Crazy na?`,
            `🍌 Banana berry hai lekin strawberry nahi! Mind = blown 🤯`,
            `🍯 Shahad kabhi kharab nahi hota — 3000 saal purana bhi kha sakte ho!`,
            `🦈 Sharks pedh se bhi purane hain — 400 million saal! 😱`,
            `🌧️ Jupiter aur Saturn pe heere ki baarish hoti hai! Soch, wahan jaake umbrella lagao 💎😂`,
        ],
    },
    feelingBad: {
        en: (n) => rand([`Hey ${n}, rough patches don't last. You've got this! 💪`, `I'm here for you ${n} 🤗 Want a joke?`]),
        hinglish: (n) => rand([
            `Arey ${n}, tension mat le yaar! Sab theek hoga 💪 Joke sunau?`,
            `${n} bhai, bure waqt hamesha nahi rehte. Tu strong hai! 🔥`,
            `Yaar ${n}, chill maar. Tera Phoenix hai na tere saath! 🤗`,
            `${n} dekh, zindagi mein ups-downs toh aate rehte hai. Par tu toh champion hai! 💪😎`,
        ]),
    },
    feelingGood: {
        en: [`That's awesome! Keep that energy! 🚀`, `Yesss! Good vibes! ✨`],
        hinglish: [`Yeh hui na baat! 🚀 Mast reh!`, `Bhai kamaal! Aise hi vibe rakh! ✨`, `Yehi sunna tha! 🔥`, `Sahi hai yaar! Keep rocking! 💪`],
    },
    thanks: {
        en: [`Anytime buddy! 😊`, `No worries! That's what friends are for ✨`],
        hinglish: [`Arey koi baat nahi yaar! 😊`, `Dost ke liye itna toh banta hai! ✨`, `Koi na bhai! 🔥`],
        fr: [`De rien mon ami! 😊`],
    },
    goodbye: {
        en: (n) => rand([`Catch you later ${n}! 👋`, `Bye ${n}! Come back anytime 🔥`]),
        hinglish: (n) => rand([`Chal phir milte hai ${n}! 👋`, `Bye yaar! Jaldi aana wapas 🔥`, `Nikal bhai, mast reh! ✌️😂`]),
        fr: (n) => rand([`À plus ${n}! 👋`, `Au revoir! 🔥`]),
    },
    whoAreYou: {
        en: [`I'm Phoenix 🔥 — your chill digital buddy! Chat, jokes, trivia, weather — I do it all!`],
        hinglish: [`Main Phoenix hoon yaar 🔥 — tera digital dost! Chat, jokes, trivia, weather — sab karta hoon! 😂`],
    },
    food: {
        en: [`Pizza is never wrong 🍕 Or try some butter chicken & naan!`, `Snack time? Chips, fruit, or samosas! 😋`],
        hinglish: [`Yaar chole bhature khale! 😋 Ya phir pizza manga le!`, `Maggi bana le bhai, 2 minute mein ready! 🍜`, `Bhai butter chicken aur naan — bass yehi sahi hai! 🤤`],
    },
    music: {
        en: [`Working? Lo-fi beats. Gym? Hip-hop. Sad? Arijit Singh. Happy? Anything with bass! 🎵`],
        hinglish: [`Kaam kar raha hai? Lo-fi laga. Sad? Arijit bhai. Party mood? AP Dhillon! 🎵`, `Bhai mood ke hisaab se — chill hai toh lo-fi, hype hai toh Punjabi songs! 🔥`],
    },
    // ===== NEW: General conversation responses =====
    school: {
        en: (n) => rand([`School/college can be stressful ${n}! But it gets better. What subject? 📚`, `Study hard, party harder! That's the motto right? 😂`]),
        hinglish: (n) => rand([`Yaar ${n} padhai toh karni padti hai! Kaunsa subject? 📚`, `College life best life hai yaar! Enjoy kar! 😂`, `Bhai exam season hai kya? Tension mat le, sab hoga! 💪`]),
    },
    relationship: {
        en: (n) => rand([`Love is complicated ${n}! But you'll figure it out 💛`, `Aww, someone's got feelings! Tell me more 😏`]),
        hinglish: (n) => rand([`Arey ${n} pyaar vyaar ke chakkar mein hai kya? 😏`, `Bhai dil ka mamla hai, samajh sakta hoon! 💛`, `Love life? Phoenix tere saath hai yaar, bata kya scene hai 😂`]),
    },
    movie: {
        en: [`What genre? Action, comedy, horror? I got recommendations! 🎬`, `Watched anything good lately? 🍿`],
        hinglish: [`Kaunsi genre — action, comedy, horror? Bata recommend karta hoon! 🎬`, `Bhai recent koi achi movie dekhi? 🍿`, `Bollywood ya Hollywood — dono mein expert hoon! 😎`],
    },
    gaming: {
        en: [`What games do you play? I'm curious! 🎮`, `Gaming is the best stress buster! What's your fav? 🎮`],
        hinglish: [`Kya khelta hai bhai? BGMI, Valorant, ya kuch aur? 🎮`, `Gaming toh best hai stress ke liye! Kya khel raha aajkal? 🔥`, `Bhai ek match laga le, mood fresh ho jaayega! 🎮`],
    },
    sleep: {
        en: (n) => rand([`Go sleep ${n}! Your health matters! 😴`, `Night owl mode on? Get some rest! 🌙`]),
        hinglish: (n) => rand([`${n} ja yaar so ja! Kal baat karte hai 😴`, `Bhai neend nahi aa rahi? Boring story sunau? 😂`, `Itni raat ko jaag raha hai? Phone rakh aur so ja! 🌙`]),
    },
    daily: {
        en: (n) => rand([`Tell me about your day ${n}! I'm all ears 👂`, `How was your day? Spill the tea! ☕`]),
        hinglish: (n) => rand([`Bata ${n} aaj ka din kaisa raha? 👂`, `Aaj kya kiya poora din? Sab bata! ☕`, `Din kaisa gaya yaar? Kuch interesting hua? 😄`]),
    },
    agree: {
        en: [`Right? I knew we'd vibe! 😎`, `Exactly! Great minds think alike! 🔥`],
        hinglish: [`Bilkul sahi bola! 😎`, `Haan na yaar! 🔥`, `Ekdum! Meri baat sun, tu smart hai! 😂`],
    },
    confused: {
        en: (n) => rand([`No worries ${n}, I'm here! What do you wanna know?`, `Ask me anything ${n}! Jokes, trivia, weather, or just chat! 😊`]),
        hinglish: (n) => rand([`Koi baat nahi ${n}! Bol kya jaanna hai?`, `${n} tension mat le, puch jo puchna hai — joke, trivia, weather ya bas timepass! 😊`, `Confuse mat ho yaar, seedha bol kya chahiye! 😄`]),
    },
    opinion: {
        en: [`That's an interesting take! I see what you mean 🤔`, `Hmm good point! What made you think that?`],
        hinglish: [`Interesting yaar! Sahi bol raha hai 🤔`, `Hmm accha point hai! Aur bata?`, `Haan yaar, tere point mein dum hai! 🔥`],
    },
    random_chat: {
        en: (n) => rand([
            `That's cool ${n}! Tell me more 😄`,
            `Oh really? That's interesting! What else? 🤔`,
            `Haha nice ${n}! Keep going, I'm listening! 😊`,
            `I love chatting with you ${n}! What's on your mind? 🔥`,
            `Interesting! You always have something cool to say ${n}! 😎`,
        ]),
        hinglish: (n) => rand([
            `Accha yaar ${n}! Aur bata? 😄`,
            `Sach mein? Interesting hai! Aur suna? 🤔`,
            `Haha mast hai ${n}! Bol bol, sun raha hoon! 😊`,
            `Yaar ${n} tere se baat karke maza aata hai! Aur bata kya chal raha? 🔥`,
            `Waah bhai! Aur kya scene hai? 😎`,
            `Chal phir aur bata, main toh free hoon! 😂`,
            `Hmm hmm, sun raha hoon ${n}! Bol na? 👂`,
            `Arey waah! Phir kya hua? Suspense mat rakh! 😄`,
        ]),
        hi: (n) => rand([
            `अच्छा ${n}! और बताओ? 😄`,
            `सच में? बहुत interesting है! 🤔`,
            `${n} तुमसे बात करके मज़ा आता है! 🔥`,
        ]),
    },
    fallbacks: {
        en: (n) => rand([
            `Hmm interesting ${n}! Tell me more about that 😊`,
            `Oh cool! I wanna know more ${n}! 🤔`,
            `That's something ${n}! What do you think about it?`,
            `Haha ${n}, you always keep me on my toes! What else is going on? 😄`,
            `I hear you ${n}! So what's the plan? 😎`,
        ]),
        hinglish: (n) => rand([
            `Accha accha ${n}! Aur bata iske baare mein? 😊`,
            `Hmm interesting yaar! Thoda aur detail de? 🤔`,
            `Haan ${n}, sun raha hoon! Bol aur kya? 😄`,
            `Yaar ${n} acchi baat hai! Phir kya socha tune? 😎`,
            `Sahi hai bhai! Aur bata kya chal raha life mein? 🔥`,
            `Hmm ${n}, samajh raha hoon! Aur suna? 👂`,
            `Waah yaar! Chal aur bata, main hoon na tere saath! 😊`,
            `Accha ji ${n}! Phir aage kya plan hai? 😄`,
        ]),
        hi: (n) => rand([
            `अच्छा ${n}! और बताओ इसके बारे में? 😊`,
            `हां ${n}, सुन रहा हूं! और क्या? 😄`,
        ]),
        fr: (n) => rand([`Intéressant ${n}! Dis-moi en plus? 😊`]),
    },
};

function getResp(key, lang, ...args) {
    const data = R[key];
    if (!data) return null;
    const responses = data[lang] || data['hinglish'] || data['en'];
    if (!responses) return null;
    const resp = rand(Array.isArray(responses) ? responses : [responses]);
    return typeof resp === 'function' ? resp(...args) : resp;
}

module.exports = { getResp, rand, R };
