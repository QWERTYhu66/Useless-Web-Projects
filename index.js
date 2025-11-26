const sampleButtons = [
    { title: 'Endless Button', description: 'A button that only counts clicks.' },
    { title: 'Random Color Button', description: 'Shows a random color and its hex value.' },
    { title: 'Cats and Dogs Button', description: 'Shows random cat and dog pictures.' },
    { title: 'Random Word Button', description: 'Gives you a random word.' },
    { title: 'Random Code Button', description: 'Gives you a random line of code.'},
    { title: 'Askew Button', description: 'Makes your whole tab askew.'}
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
        emptyMessage.textContent = 'No matching buttons found.';
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


let overlayVisible = "";

function openButtonPanel(button) {
    const darkToggle = document.getElementById('darkModeToggle');
    const htmlEl = document.documentElement;
    
    if (darkToggle.checked) {
        overlayVisible = "true";
        localStorage.setItem('theme', 'dark');
        htmlEl.setAttribute('data-theme', 'dark-overlay');
    } else {
        overlayVisible = "true";
        localStorage.setItem('theme', 'light');
        htmlEl.setAttribute('data-theme', 'light-overlay');
    };

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
    } else {
        openGenericPanel(button);
    };
}

function openGenericPanel(button) {
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
    overlayVisible = "false";
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
        let max = 5;
        let min = -5;
        let askewDegree = Math.round((Math.random() * (max - min) + min) * 1000) / 1000;
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
    console.warn('Word list is empty – falling back to random chars');
    return randomWordFallback(8);  // maybe call your old method
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
    return randomWordFallback(8);  // maybe call your old method
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

document.addEventListener('DOMContentLoaded', () => {
  loadWordList('./12dicts_words.txt');
  loadCodeList('');
});

function createOverlay(innerHTML) {
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

    if (overlayVisible === "true") {
        if (darkToggle.checked) {
            overlayVisible = "true";
            localStorage.setItem('theme', 'dark');
            htmlEl.setAttribute('data-theme', 'dark-overlay');
        } else {
            overlayVisible = "true";
            localStorage.setItem('theme', 'light');
            htmlEl.setAttribute('data-theme', 'light-overlay');
        };
    } else {
        if (darkToggle.checked) {
            overlayVisible = "false";
            localStorage.setItem('theme', 'dark');
            htmlEl.setAttribute('data-theme', 'dark');
        } else {
            overlayVisible = "false";
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
});

renderButtons(buttonsList);