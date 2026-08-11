const sampleButtons = [
    { title: 'Endless Button', description: 'A button that only counts clicks.' },
    { title: 'Random Color Button', description: 'Shows a random color and its hex value.' },
    { title: 'Cats and Dogs Button', description: 'Shows random cat and dog pictures.' },
    { title: 'Random Word Button', description: 'Gives you a random word.' },
    { title: 'Random Code Button', description: 'Gives you a random line of code.'},
    { title: 'Askew Button', description: 'Makes your whole tab askew.'},
    { title: 'Scream Button', description: 'Let out a primal scream.' },
    { title: 'Insult Generator', description: 'Get a random insult to cope with life.' },
    { title: 'Fortune Cookie', description: 'Receive a random fortune.' },
    { title: 'Page Shaker', description: 'Give the page a little shake.' },
    { title: 'Banana Fact', description: 'Learn a random fact about bananas.' },
    { title: 'Emoji Generator', description: 'Get random emojis to express yourself.' },
    { title: 'Password Generator', description: 'Create secure random passwords.' },
    { title: 'Dice Roller', description: 'Roll virtual dice for games and decisions.' },
    { title: 'Magic 8 Ball', description: 'Ask the mystical 8 ball for guidance.' },
    { title: 'Mood Indicator', description: 'Discover your current emotional state.' },
    { title: 'Excuse Generator', description: 'Generate believable excuses for anything.' },
    { title: 'Compliment Generator', description: 'Receive uplifting compliments.' },
    { title: 'Weather Report', description: 'Get a whimsical weather forecast.' },
    { title: 'Lorem Ipsum', description: 'Generate placeholder text for design.' },
    { title: 'Film Effect', description: 'Add vintage film grain to your screen.' }
];

const projectsContainer = document.getElementById('projects');
const searchInput = document.getElementById('search');

let buttonsList = [...sampleButtons];

function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function(character) {
        const map = { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' };
        return map[character];
    });
}

function renderButtons(list) {
    projectsContainer.innerHTML = '';

    if (list.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty';
        emptyMessage.innerHTML = `
            <h3>No matching buttons found.</h3>
        `;
        projectsContainer.appendChild(emptyMessage);
        return;
    }

    list.forEach((button, index) => {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
            <div>
                <h3>${escapeHtml(button.title)}</h3>
                <p>${escapeHtml(button.description)}</p>
            </div>
            <div class="meta">
                <a class="open" href="#" data-index="${index}" role="button">Open</a>
            </div>
        `;
        projectsContainer.appendChild(card);
    });
}

function filterButtons(query) {
    const lowerQuery = query.toLowerCase().trim();
    return buttonsList.filter(button => {
        const text = (button.title + ' ' + button.description).toLowerCase();
        return text.includes(lowerQuery);
    });
}

let buttons = [...buttonsList];
let currentSearch = '';

function showOverlay() {
    overlayVisible++;
    if (overlayVisible === 1) {
        document.body.style.overflow = 'hidden';
    }
}

function hideOverlay() {
    overlayVisible--;
    if (overlayVisible === 0) {
        document.body.style.overflow = '';
    }
}

searchInput.addEventListener('input', function(event) {
    const filtered = filterButtons(event.target.value);
    currentSearch = event.target.value;
    buttons = [...filtered];
    renderButtons(filtered);
});

projectsContainer.addEventListener('click', function(event) {
    const openButton = event.target.closest('.open');

    if (!openButton) return;
    event.preventDefault();
    if (currentSearch === '') buttons = [...buttonsList];
    const index = Number(openButton.dataset.index);
    const button = buttons[index];

    if (!button) return;
    openButtonPanel(button);
});


let overlayVisible = 0;

function openButtonPanel(button) {
    if (button.title.includes('Endless')) {
        openCounterButton();
    } else if (button.title.includes('Color')) {
        openColorButton();
    } else if (button.title.includes('Cats')) {
        openCatsAndDogsButton();
    } else if (button.title.includes('Random Word')) {
        openRandomWordButton();
    } else if (button.title.includes('Random Code')) {
        openRandomCodeButton();
    } else if (button.title.includes('Askew')) {
        openAskewButton();
    } else if (button.title.includes('Scream')) {
        openScreamButton();
    } else if (button.title.includes('Insult')) {
        openInsultGeneratorButton();
    } else if (button.title.includes('Fortune')) {
        openFortuneCookieButton();
    } else if (button.title.includes('Page Shaker')) {
        openPageShakerButton();
    } else if (button.title.includes('Banana')) {
        openBananaFactButton();
    } else if (button.title.includes('Emoji')) {
        openEmojiGeneratorButton();
    } else if (button.title.includes('Password')) {
        openPasswordGeneratorButton();
    } else if (button.title.includes('Dice')) {
        openDiceRollerButton();
    } else if (button.title.includes('Magic 8 Ball')) {
        openMagic8BallButton();
    } else if (button.title.includes('Mood')) {
        openMoodIndicatorButton();
    } else if (button.title.includes('Excuse')) {
        openExcuseGeneratorButton();
    } else if (button.title.includes('Compliment')) {
        openComplimentGeneratorButton();
    } else if (button.title.includes('Weather')) {
        openWeatherReportButton();
    } else if (button.title.includes('Lorem Ipsum')) {
        openLoremIpsumButton();
    } else if (button.title.includes('Film Effect')) {
        openFilmEffectButton();
    } else {
        openGenericPanel(button);
    }
}

function openGenericPanel(button) {
    showOverlay();
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
        <div class="panel" role="dialog" aria-modal="true">
            <h2>${escapeHtml(button.title)}</h2>
            <p>${escapeHtml(button.description)}</p>
            <div style="text-align:right;margin-top:12px">
                <button class="btn close">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    const savedAskewDegree = localStorage.getItem('askewDegree') || 0;
    const overlayPanel = document.querySelector('.panel-askew');
    overlayPanel.style.transform = `rotate(${savedAskewDegree}deg)`;

    const closeButton = overlay.querySelector('.close');
    closeButton.addEventListener('click', () => removeOverlay(overlay));

    document.addEventListener('keydown', function onKey(event) {
        if (event.key === 'Escape') removeOverlay(overlay);
    });

    closeButton.focus();
}

function removeOverlay(overlay) {
    document.body.removeChild(overlay);
    hideOverlay();
    changeTheme()
}

function openRandomWordButton() {
    const html = `
        <h2>Random Word</h2>
        <p>Click the button to get a random word.</p>
        <div class="row" style="align-items:center; gap:8px;">
            <button id="newWordBtn" class="btn">New Word</button>
            <div id="wordDisplay" style="font-weight:600"></div>
        </div>
    `;
    createOverlay(html);

    const overlay = document.querySelector('.overlay:last-of-type');
    const wordDisplay = overlay.querySelector('#wordDisplay');
    const newWordBtn = overlay.querySelector('#newWordBtn');

    wordDisplay.textContent = randomWordFromList();

    newWordBtn.addEventListener('click', () => {
        wordDisplay.textContent = randomWordFromList();
    });
}

function openRandomCodeButton() {
    const html = `
        <h2>Random Code</h2>
        <p>Click to get a random line of code.</p>
        <div class="row" style="align-items:center; gap:8px;">
            <button id="newCodeBtn" class="btn">New line of code</button>
            <div id="codeDisplay" style="font-weight:600"></div>
        </div>
    `;
    createOverlay(html);

    const overlay = document.querySelector('.overlay:last-of-type');
    const codeDisplay = overlay.querySelector('#codeDisplay');
    const newCodeBtn = overlay.querySelector('#newCodeBtn');

    codeDisplay.textContent = randomCodeFromList();

    newCodeBtn.addEventListener('click', () => {
        codeDisplay.textContent = randomCodeFromList();
    });
}

function openAskewButton() {
    const html = `
        <h2>Askew Button</h2>
        <p>Click the left button below and your tab will be askew.</p>
        <div class="row">
            <button id="askewBtn" class="btn">Askew screen</button>
            <button id="resetAskewBtn" class="btn ghost">Reset askew</button>
        </div>
    `;
    createOverlay(html);

    const overlay = document.querySelector('.overlay:last-of-type');
    const resetAskewButton = overlay.querySelector('#resetAskewBtn');
    const overlayPanel = document.querySelector('.panel-askew');
    const projectsGrid = document.querySelector('.wrap');
    const askewButton = overlay.querySelector('#askewBtn');

    askewButton.addEventListener('click', () => {
        let askewDegree = Math.round((Math.random() * (5 - -5) + -5) * 1000) / 1000;
        while (askewDegree >= -0.199 && askewDegree <= 0.199) {
            askewDegree = Math.round((Math.random() * (5 - -5) + -5) * 1000) / 1000};
        overlayPanel.style.transform = `rotate(${askewDegree}deg)`;
        projectsGrid.style.transform = `rotate(${askewDegree}deg)`;
        localStorage.setItem('askewDegree', askewDegree);
    });

    resetAskewButton.addEventListener('click', () => {
        overlayPanel.style.transform = 'rotate(0deg)';
        projectsGrid.style.transform = 'rotate(0deg)';
        localStorage.setItem('askewDegree', 0);
    });
}

function openCounterButton() {
    const html = `
        <h2>Endless Button</h2>
        <p>Click the button below. It only counts clicks.</p>
        <div class="row">
            <button id="countBtn" class="btn">Clicks: <span id="count">0</span></button>
            <button id="resetBtn" class="btn ghost">Reset</button>
        </div>
    `;
    createOverlay(html);

    const overlay = document.querySelector('.overlay:last-of-type');
    const countElement = overlay.querySelector('#count');
    const countButton = overlay.querySelector('#countBtn');
    const resetButton = overlay.querySelector('#resetBtn');

    let count = 0;

    countButton.addEventListener('click', () => {
        count++;
        countElement.textContent = count;
    });

    resetButton.addEventListener('click', () => {
        count = 0;
        countElement.textContent = count;
    });
}

function randHexColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6,'0').toUpperCase();
}

function openColorButton() {
    const initialColor = randHexColor();

    const html = `
        <h2>Random Color Button</h2>
        <p>Click "New Color" to generate a random color. The hex value is shown.</p>
        <div class="row">
            <div class="color-box" id="colorBox" style="background:${initialColor}"></div>
            <div style="flex:1">
                <div style="font-weight:600" id="hexValue">${initialColor}</div>
                <div style="margin-top:8px">
                    <button id="newColorBtn" class="btn">New Color</button>
                    <button id="copyHexBtn" class="btn ghost">Copy</button>
                </div>
            </div>
        </div>
    `;
    createOverlay(html);

    const overlay = document.querySelector('.overlay:last-of-type');
    const colorBox = overlay.querySelector('#colorBox');
    const hexText = overlay.querySelector('#hexValue');
    const newColorButton = overlay.querySelector('#newColorBtn');
    const copyButton = overlay.querySelector('#copyHexBtn');

    newColorButton.addEventListener('click', () => {
        const newColor = randHexColor();
        colorBox.style.background = newColor;
        hexText.textContent = newColor;
    });

    copyButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(hexText.textContent);
            copyButton.textContent = 'Copied';
            setTimeout(() => copyButton.textContent = 'Copy', 1000);
        } catch (e) {
            console.error('Copy failed', e);
        }
    });
}

function openCatsAndDogsButton() {
    const html = `
        <h2>Cats and Dogs Button</h2>
        <p>This button shows random images of cats and dogs.</p>
        <div class="row">
            <button id="newImageBtn" class="btn">New Image</button>
            <div id="imageContainer" style="margin-top:12px;text-align:center; max-height:400px; overflow-y:auto; display:flex; flex-direction:column; gap:8px;"></div>
        </div>
    `;
    createOverlay(html);

    const overlay = document.querySelector('.overlay:last-of-type');
    const imageContainer = overlay.querySelector('#imageContainer');
    const newImageButton = overlay.querySelector('#newImageBtn');

    async function fetchRandomImage() {
        const isCat = Math.random() < 0.5;
        if (isCat) {
            return `https://cataas.com/cat?${Date.now()}`;
        }

        try {
            const response = await fetch('https://random.dog/woof.json');
            const data = await response.json();

            if (!data.url.match(/\.(jpg|jpeg|png|gif)$/i)) {
                return fetchRandomImage();
            }

            return data.url;
        } catch (e) {
            console.warn('Fetch failed, retrying...', e);
            return fetchRandomImage();
        }
    }

    async function showNewImage() {
        const imageUrl = await fetchRandomImage();

        const img = new Image();
        img.src = imageUrl;
        img.alt = "Random Animal";
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        img.style.borderRadius = "8px";

        img.onerror = async () => {
            console.warn("Image failed to load, retrying...");
            showNewImage();
        };

        imageContainer.innerHTML = "";
        imageContainer.appendChild(img);
    }

    newImageButton.addEventListener("click", showNewImage);

    showNewImage();
}


let codeList = [];

async function loadCodeList(url) {
  try {
    const response = await fetch(url);
    const text   = await response.text();
    codeList = text.split(/\r?\n/).filter(w => w.length > 0);
  } catch (err) {
    console.error('Failed to load code list:', err);
  }
}

function randomCodeFromList() {
  if (codeList.length === 0) {
    console.warn('Code list is empty – falling back to random chars');
    return randomWordFallback(8);
  }
  const idx = Math.floor(Math.random() * codeList.length);
  return codeList[idx];
}

let wordList = [];

async function loadWordList(url) {
  try {
    const response = await fetch(url);
    const text   = await response.text();
    wordList = text.split(/\r?\n/).filter(w => w.length > 0);
  } catch (err) {
    console.error('Failed to load word list:', err);
  }
}

function randomWordFromList() {
  if (wordList.length === 0) {
    console.warn('Word list is empty – falling back to random chars');
    return randomWordFallback(8);
  }
  const idx = Math.floor(Math.random() * wordList.length);
  return wordList[idx];
}

function randomWordFallback(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Additional data for new buttons
const screams = [
  'AAAAAAH!',
  'YOOOOO!',
  'WHEEEEEE!',
  'WHY IS THIS HAPPENING?!',
  'I CAN\'T BELIEVE IT!',
  'TOO MUCH EXCITEMENT!',
  'MY EARS ARE BLEEDING!',
  'NOT AGAIN!',
  'MAKE IT STOP!',
  'I\'M LOSING MY MIND!'
];

const insults = [
  'You have the personality of a wet sock.',
  'If you were any more clueless, you\'d need watering.',
  'You\'re about as useful as a screen door on a submarine.',
  'Your secrets are always safe with me. I never even listen when you tell me them.',
  'You\'re the reason they put instructions on shampoo bottles.',
  'If you were any less intelligent, we\'d have to water you.',
  'I\'d agree with you, but then we\'d both be wrong.',
  'You\'re not the sharpest tool in the shed.',
  'You bring everyone down to your level, then beat them with experience.',
  'You\'re as useless as a screen door on a submarine.'
];

const fortunes = [
  'A beautiful, smart, and loving person will be coming into your life.',
  'A dubious friend may be an enemy in camouflage.',
  'A faithful friend is a strong defense.',
  'A feather in the hand is better than a bird in the air.',
  'A fresh start will put you on your way.',
  'A golden egg of opportunity falls into your lap this month.',
  'A hug is waiting for you.',
  'A knife cannot stab the heart that does not love itself.',
  'A lifetime friend shall soon be made.',
  'A long-lost relation will soon arrive.'
];

const bananaFacts = [
  'Bananas are slightly radioactive due to their potassium content.',
  'Bananas grow on plants that are technically herbs, not trees.',
  'The inside of a banana peel can help relieve itching from mosquito bites.',
  'Bananas can float in water because they are less dense than water.',
  'There are over 1,000 varieties of bananas worldwide.',
  'Bananas were the first fruit to be grown on a farm.',
  'The average person eats 27 pounds of bananas a year.',
  'Bananas can help reduce swelling.',
  'Bananas contain a natural antacid that can relieve heartburn.',
  'The banana tree is not a tree but the world\'s largest herb.'
];

document.addEventListener('DOMContentLoaded', () => {
  loadWordList('./12dicts_words.txt');
  loadCodeList('');
});

function getRandomScream() {
  return screams[Math.floor(Math.random() * screams.length)];
}
function getRandomInsult() {
  return insults[Math.floor(Math.random() * insults.length)];
}
function getRandomFortune() {
  return fortunes[Math.floor(Math.random() * fortunes.length)];
}
function getRandomBananaFact() {
  return bananaFacts[Math.floor(Math.random() * bananaFacts.length)];
}

// Data arrays for new buttons
const emojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🤐', '🤧', '😷', '🤒', '🤕', '🤢', '🤮', '🤠', '🤡', '🤹', '🧘', '🤸', '🤼', '🤽', '🤾', '🤹‍♂️', '🤹‍♀️', '💪', '👈', '👉', '👆', '👇', '✊', '👊', '🤛', '🤜', '👌', '🤌', '🤏', '✌️', '🤞', '👌', '✋', '🤚', '👋', '🤙', '💪', '✊', '👊', '🤛', '🤜'
];
const passwordPrefixes = ['Secure', 'Strong', 'Mega', 'Ultra'];
const passwordSuffixes = ['Guard', 'Shield', 'Vault', 'Fortress'];
const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
const magic8BallAnswers = [
  'It is certain.',
  'It is decidedly so.',
  'Without a doubt.',
  'Yes - definitely.',
  'You may rely on it.',
  'As I see it, yes.',
  'Most likely.',
  'Outlook good.',
  'Yes.',
  'Signs point to yes.',
  'Reply hazy, try again.',
  'Ask again later.',
  'Better not tell you now.',
  'Cannot predict now.',
  'Concentrate and ask again.',
  "Don't count on it.",
  'My reply is no.',
  'My sources say no.',
  'Outlook not so good.',
  'Very doubtful.'
];
const moods = [
  'Ecstatic    😄    🌈',
  'Blissful    😌    ☀️',
  'Content    😊    😌',
  'Meh    😐    😐',
  'Grumpy    😠    😠',
  'Melancholy    😔    🌧️',
  'Energetic    ⚡    ⚡',
  'Relaxed    😌    🧘',
  'Nostalgic    😔    📼',
  'Whimsical    😄    🦄',
  'Focused    🎯    🎯',
  'Playful    😄    🎮',
  'Zen    😌    🕊️',
  'Chaotic    💥    💥',
  'Dreamy    😌    ☁️'
];
const excuses = [
  'My dog ate my homework.',
  'I got stuck in a time loop.',
  'Aliens abducted my motivation.',
  'The Wi-Fi was possessed by ghosts.',
  'I was busy contemplating the meaning of sock loss.',
  'A squirrel hijacked my productivity.',
  'My caffeine levels were insufficient.',
  'I was waiting for inspiration to strike (it missed me).',
  'The cat demanded emergency cuddles.',
  'I got lost in the library of my mind.',
  'My plants needed emotional support.',
  'I was calibrating my aura.',
  'The toaster had a philosophical crisis.',
  'I was practicing advanced napping techniques.',
  'My shadow went on strike.'
];
const compliments = [
  'You have an amazing sense of style!',
  'Your smile could light up a room.',
  'You are incredibly thoughtful and kind.',
  'Your ideas are brilliant and innovative.',
  'You have a wonderful sense of humor.',
  'You are incredibly resilient and strong.',
  'Your passion is contagious and inspiring.',
  'You have incredible attention to detail.',
  'You make everyone around you better.',
  'Your creativity knows no bounds.',
  'You handle challenges with grace.',
  'Your laughter is infectious.',
  'You have a heart of gold.',
  'You are remarkably perceptive.',
  'Your dedication is truly admirable.'
];
const weatherConditions = [
  'Sunny with a chance of smileys    ☀️😊',
  'Partly cloudy with scattered confetti    ⛅🎉',
  'Light sprinkles of laughter    🌦️😂',
  'Thunderstorm of applause    ⚡👏',
  'Foggy with brief moments of clarity    🌫️💡',
  'Heatwave of awesomeness    🔥💯',
  'Blizzard of brilliance    ❄️🌟',
  'Drizzle of inspiration    💧💡',
  'Solar flare of creativity    ☀️✨',
  'Aurora borealis of amazement    🌌🎨'
];
const loremIpsumSentences = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.',
  'Nullam quis risus eget urna mollis ornare vel eu leo.',
  'Pellentesque habitant morbi tristique senectus et netus.',
  'Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis.',
  'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curea;'
];
const filmGrainIntensities = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3];


// Helper functions for new buttons
function getRandomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}
function getRandomPassword() {
  const prefix = passwordPrefixes[Math.floor(Math.random() * passwordPrefixes.length)];
  const suffix = passwordSuffixes[Math.floor(Math.random() * passwordSuffixes.length)];
  const num = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${num}-${suffix}`;
}
function getRandomDice() {
  return diceFaces[Math.floor(Math.random() * diceFaces.length)];
}
function getRandomMagic8Ball() {
  return magic8BallAnswers[Math.floor(Math.random() * magic8BallAnswers.length)];
}
function getRandomMood() {
  return moods[Math.floor(Math.random() * moods.length)];
}
function getRandomExcuse() {
  return excuses[Math.floor(Math.random() * excuses.length)];
}
function getRandomCompliment() {
  return compliments[Math.floor(Math.random() * compliments.length)];
}
function getRandomWeather() {
  return weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
}
function getRandomLoremIpsum() {
  return loremIpsumSentences[Math.floor(Math.random() * loremIpsumSentences.length)];
}
function getRandomFilmGrain() {
  return filmGrainIntensities[Math.floor(Math.random() * filmGrainIntensities.length)];
}

function openEmojiGeneratorButton() {
    const html = `
        <h2>Emoji Generator</h2>
        <p>Get random emojis to express yourself.</p>
        <div class="row" style="align-items:center; gap:8px;">
            <button id="emojiBtn" class="btn">New Emoji</button>
            <div id="emojiDisplay" style="font-size:2em; min-height:1.5em;"></div>
        </div>
    `;
    createOverlay(html);
    const overlay = document.querySelector('.overlay:last-of-type');
    const emojiDisplay = overlay.querySelector('#emojiDisplay');
    const emojiBtn = overlay.querySelector('#emojiBtn');
    emojiDisplay.textContent = getRandomEmoji();
    emojiBtn.addEventListener('click', () => {
        emojiDisplay.textContent = getRandomEmoji();
    });
}

function openPasswordGeneratorButton() {
    const html = `
        <h2>Password Generator</h2>
        <p>Create secure random passwords.</p>
        <div class="row" style="align-items:center; gap:8px;">
            <button id="passBtn" class="btn">Generate Password</button>
            <div id="passDisplay" style="font-weight:600; letter-spacing:1px; font-family:monospace;"></div>
        </div>
    `;
    createOverlay(html);
    const overlay = document.querySelector('.overlay:last-of-type');
    const passDisplay = overlay.querySelector('#passDisplay');
    const passBtn = overlay.querySelector('#passBtn');
    passDisplay.textContent = getRandomPassword();
    passBtn.addEventListener('click', () => {
        passDisplay.textContent = getRandomPassword();
    });
}

function openDiceRollerButton() {
    const html = `
        <h2>Dice Roller</h2>
        <p>Roll virtual dice for games and decisions.</p>
        <div class="row" style="align-items:center; gap:8px;">
            <button id="diceBtn" class="btn">Roll Dice</button>
            <div id="diceDisplay" style="font-size:3em; min-height:1em;"></div>
        </div>
    `;
    createOverlay(html);
    const overlay = document.querySelector('.overlay:last-of-type');
    const diceDisplay = overlay.querySelector('#diceDisplay');
    const diceBtn = overlay.querySelector('#diceBtn');
    diceDisplay.textContent = getRandomDice();
    diceBtn.addEventListener('click', () => {
        diceDisplay.textContent = getRandomDice();
    });
}

function openMagic8BallButton() {
    const html = `
        <h2>Magic 8 Ball</h2>
        <p>Ask the mystical 8 ball for guidance.</p>
        <div class="row" style="align-items:center; gap:8px;">
            <button id="8ballBtn" class="btn">Ask the 8 Ball</button>
            <div id="8ballDisplay" style="font-weight:600; min-height:1.5em;"></div>
        </div>
    `;
    createOverlay(html);
    const overlay = document.querySelector('.overlay:last-of-type');
    const _8ballDisplay = overlay.querySelector('#8ballDisplay');
    const _8ballBtn = overlay.querySelector('#8ballBtn');
    _8ballDisplay.textContent = getRandomMagic8Ball();
    _8ballBtn.addEventListener('click', () => {
        _8ballDisplay.textContent = getRandomMagic8Ball();
    });
}

function openMoodIndicatorButton() {
    const html = `
        <h2>Mood Indicator</h2>
        <p>Discover your current emotional state.</p>
        <div class="row" style="align-items:center; gap:8px;">
            <button id="moodBtn" class="btn">Check Mood</button>
            <div id="moodDisplay" style="font-weight:600; min-height:1.5em;"></div>
        </div>
    `;
    createOverlay(html);
    const overlay = document.querySelector('.overlay:last-of-type');
    const moodDisplay = overlay.querySelector('#moodDisplay');
    const moodBtn = overlay.querySelector('#moodBtn');
    moodDisplay.textContent = getRandomMood();
    moodBtn.addEventListener('click', () => {
        moodDisplay.textContent = getRandomMood();
    });
}

function openExcuseGeneratorButton() {
    const html = `
        <h2>Excuse Generator</h2>
        <p>Generate believable excuses for anything.</p>
        <div class="row" style="align-items:center; gap:8px;">
            <button id="excuseBtn" class="btn">New Excuse</button>
            <div id="excuseDisplay" style="font-weight:600; min-height:1.5em;"></div>
        </div>
    `;
    createOverlay(html);
    const overlay = document.querySelector('.overlay:last-of-type');
    const excuseDisplay = overlay.querySelector('#excuseDisplay');
    const excuseBtn = overlay.querySelector('#excuseBtn');
    excuseDisplay.textContent = getRandomExcuse();
    excuseBtn.addEventListener('click', () => {
        excuseDisplay.textContent = getRandomExcuse();
    });
}

function openComplimentGeneratorButton() {
    const html = `
        <h2>Compliment Generator</h2>
        <p>Receive uplifting compliments.</p>
        <div class="row" style="align-items:center; gap:8px;">
            <button id="compBtn" class="btn">Get Compliment</button>
            <div id="compDisplay" style="font-weight:600; min-height:1.5em;"></div>
        </div>
    `;
    createOverlay(html);
    const overlay = document.querySelector('.overlay:last-of-type');
    const compDisplay = overlay.querySelector('#compDisplay');
    const compBtn = overlay.querySelector('#compBtn');
    compDisplay.textContent = getRandomCompliment();
    compBtn.addEventListener('click', () => {
        compDisplay.textContent = getRandomCompliment();
    });
}

function openWeatherReportButton() {
    const html = `
        <h2>Weather Report</h2>
        <p>Get a whimsical weather forecast.</p>
        <div class="row" style="align-items:center; gap:8px;">
            <button id="weatherBtn" class="btn">New Forecast</button>
            <div id="weatherDisplay" style="font-weight:600; min-height:1.5em;"></div>
        </div>
    `;
    createOverlay(html);
    const overlay = document.querySelector('.overlay:last-of-type');
    const weatherDisplay = overlay.querySelector('#weatherDisplay');
    const weatherBtn = overlay.querySelector('#weatherBtn');
    weatherDisplay.textContent = getRandomWeather();
    weatherBtn.addEventListener('click', () => {
        weatherDisplay.textContent = getRandomWeather();
    });
}

function openLoremIpsumButton() {
    const html = `
        <h2>Lorem Ipsum</h2>
        <p>Generate placeholder text for design.</p>
        <div class="row" style="align-items:center; gap:8px;">
            <button id="loremBtn" class="btn">Generate Text</button>
            <div id="loremDisplay" style="font-weight:600; line-height:1.5; min-height:3em; white-space:pre-line;"></div>
        </div>
    `;
    createOverlay(html);
    const overlay = document.querySelector('.overlay:last-of-type');
    const loremDisplay = overlay.querySelector('#loremDisplay');
    const loremBtn = overlay.querySelector('#loremBtn');
    loremDisplay.textContent = getRandomLoremIpsum();
    loremBtn.addEventListener('click', () => {
        loremDisplay.textContent = getRandomLoremIpsum();
    });
}

function openFilmEffectButton() {
    const html = `
        <h2>Film Effect</h2>
        <p>Add vintage film grain to your screen.</p>
        <div class="row" style="align-items:center; gap:8px;">
            <button id="filmBtn" class="btn">Toggle Grain</button>
            <div id="filmDisplay" style="font-weight:600; min-height:1.5em;"></div>
        </div>
    `;
    createOverlay(html);
    const overlay = document.querySelector('.overlay:last-of-type');
    const filmDisplay = overlay.querySelector('#filmDisplay');
    const filmBtn = overlay.querySelector('#filmBtn');
    const intensity = getRandomFilmGrain();
    filmDisplay.textContent = `Film grain intensity: ${intensity}`;
    filmBtn.addEventListener('click', () => {
        // Toggle a class that adds grain effect via CSS
        document.body.classList.toggle('grain-effect');
        const newIntensity = getRandomFilmGrain();
        filmDisplay.textContent = `Film grain intensity: ${newIntensity}`;
    });
}

function openScreamButton() {
    const html = `
        <h2>Scream Button</h2>
        <p>Click to unleash a primal scream.</p>
        <div class="row" style="align-items:center; gap:8px;">
            <button id="screamBtn" class="btn">Scream!</button>
            <div id="screamDisplay" style="font-weight:600; font-size:1.5em;"></div>
        </div>
    `;
    createOverlay(html);
    const overlay = document.querySelector('.overlay:last-of-type');
    const screamDisplay = overlay.querySelector('#screamDisplay');
    const screamBtn = overlay.querySelector('#screamBtn');
    screamDisplay.textContent = getRandomScream();
    screamBtn.addEventListener('click', () => {
        screamDisplay.textContent = getRandomScream();
    });
}

function openInsultGeneratorButton() {
    const html = `
        <h2>Insult Generator</h2>
        <p>Need a pick-me-up? Get a random insult.</p>
        <div class="row" style="align-items:center; gap:8px;">
            <button id="insultBtn" class="btn">Give me an insult</button>
            <div id="insultDisplay" style="font-weight:600;"></div>
        </div>
    `;
    createOverlay(html);
    const overlay = document.querySelector('.overlay:last-of-type');
    const insultDisplay = overlay.querySelector('#insultDisplay');
    const insultBtn = overlay.querySelector('#insultBtn');
    insultDisplay.textContent = getRandomInsult();
    insultBtn.addEventListener('click', () => {
        insultDisplay.textContent = getRandomInsult();
    });
}

function openFortuneCookieButton() {
    const html = `
        <h2>Fortune Cookie</h2>
        <p>Click to get your fortune.</p>
        <div class="row" style="align-items:center; gap:8px;">
            <button id="fortuneBtn" class="btn">Open Fortune</button>
            <div id="fortuneDisplay" style="font-weight:600;"></div>
        </div>
    `;
    createOverlay(html);
    const overlay = document.querySelector('.overlay:last-of-type');
    const fortuneDisplay = overlay.querySelector('#fortuneDisplay');
    const fortuneBtn = overlay.querySelector('#fortuneBtn');
    fortuneDisplay.textContent = getRandomFortune();
    fortuneBtn.addEventListener('click', () => {
        fortuneDisplay.textContent = getRandomFortune();
    });
}

function openPageShakerButton() {
    const html = `
        <h2>Page Shaker</h2>
        <p>Give the page a little shake.</p>
        <div class="row" style="align-items:center; gap:8px;">
            <button id="shakeBtn" class="btn">Shake!</button>
        </div>
    `;
    createOverlay(html);
    const overlay = document.querySelector('.overlay:last-of-type');
    const shakeBtn = overlay.querySelector('#shakeBtn');
    shakeBtn.addEventListener('click', () => {
        document.body.style.animation = 'shake 0.5s';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
    });
}

function openBananaFactButton() {
    const html = `
        <h2>Banana Fact</h2>
        <p>Learn a random fact about bananas.</p>
        <div class="row" style="align-items:center; gap:8px;">
            <button id="factBtn" class="btn">New Fact</button>
            <div id="factDisplay" style="font-weight:600;"></div>
        </div>
    `;
    createOverlay(html);
    const overlay = document.querySelector('.overlay:last-of-type');
    const factDisplay = overlay.querySelector('#factDisplay');
    const factBtn = overlay.querySelector('#factBtn');
    factDisplay.textContent = getRandomBananaFact();
    factBtn.addEventListener('click', () => {
        factDisplay.textContent = getRandomBananaFact();
    });
}

function createOverlay(innerHTML) {
    showOverlay();
    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    overlay.innerHTML = `
        <div class="panel-askew">
            <div class="panel" role="dialog" aria-modal="true">
                ${innerHTML}
                <div style="text-align:right;margin-top:12px">
                    <button class="btn close">Close</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const savedAskewDegree = localStorage.getItem('askewDegree') || 0;
    const overlayPanel = document.querySelector('.panel-askew');
    overlayPanel.style.transform = `rotate(${savedAskewDegree}deg)`;

    const closeButton = overlay.querySelector('.close');
    closeButton.addEventListener('click', () => removeOverlay(overlay));

    document.addEventListener('keydown', function onKey(e) {
        if (e.key === 'Escape') removeOverlay(overlay);
    });
}

function changeTheme() {
    const darkToggle = document.getElementById('darkModeToggle');
    const htmlEl = document.documentElement;

    if (overlayVisible > 0) {
        if (darkToggle.checked) {
            localStorage.setItem('theme', 'dark');
            htmlEl.setAttribute('data-theme', 'dark-overlay');
        } else {
            localStorage.setItem('theme', 'light');
            htmlEl.setAttribute('data-theme', 'light-overlay');
        };
    } else {
        if (darkToggle.checked) {
            localStorage.setItem('theme', 'dark');
            htmlEl.setAttribute('data-theme', 'dark');
        } else {
            htmlEl.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        };
    };
};

document.addEventListener('DOMContentLoaded', () => {
    const darkToggle = document.getElementById('darkModeToggle');
    const savedTheme = localStorage.getItem('theme');

    darkToggle.addEventListener('change', () => {
       changeTheme()
    });
    
    if (savedTheme === 'dark') {
        darkToggle.checked = true;
        changeTheme()
    } else {
        darkToggle.checked = false;
        changeTheme()
    }

});

document.addEventListener('DOMContentLoaded', () => {
    const savedAskewDegree = localStorage.getItem('askewDegree') || 0;
    const overlayPanel = document.querySelector('.panel-askew');
    const projectsGrid = document.querySelector('.wrap');

    if (overlayPanel) overlayPanel.style.transform = `rotate(${savedAskewDegree}deg)`;
    if (projectsGrid) projectsGrid.style.transform = `rotate(${savedAskewDegree}deg)`;
    localStorage.setItem('askewDegree', savedAskewDegree);
});

renderButtons(buttonsList);
