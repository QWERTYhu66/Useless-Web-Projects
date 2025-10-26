// Sample Buttons 
const sampleButtons = [
    { title: 'Endless Button', description: 'A button that only counts clicks.' },
    { title: 'Random Color Button', description: 'Show a random color and its hex value.' },
    { title: 'Cats and Dogs Button', description: 'Shows random cat and dog pictures.' }
];

// DOM Elements
const projectsContainer = document.getElementById('projects');
const searchInput = document.getElementById('search');

// State
let buttonsList = [...sampleButtons];

// Escape HTML to prevent injection (YES THIS IS VERY IMPORTANT ANYONE WHO EVEN EVER TOUCHED HTML SHOULD KNOW THIS)
function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function(character) {
        const map = { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' };
        return map[character];
    });
}

// Rendering
function renderButtons(list) {
    // Clear previous cards
    projectsContainer.innerHTML = '';

    // Show empty state if nothing matches
    if (list.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty';
        emptyMessage.textContent = 'No matching buttons found.';
        projectsContainer.appendChild(emptyMessage);
        return;
    }

    // Create cards for each button
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

// Filtering 
function filterButtons(query) {
    const lowerQuery = query.toLowerCase().trim();
    return buttonsList.filter(button => {
        const text = (button.title + ' ' + button.description).toLowerCase();
        return text.includes(lowerQuery);
    });
}

// Update displayed buttons when typing in search
searchInput.addEventListener('input', function(event) {
    const filtered = filterButtons(event.target.value);
    renderButtons(filtered);
});

// Open Button Handler 
projectsContainer.addEventListener('click', function(event) {
    const openButton = event.target.closest('.open');
    if (!openButton) return;

    event.preventDefault();
    const index = Number(openButton.dataset.index);
    const button = buttonsList[index];
    if (!button) return;

    openButtonPanel(button);
});

// Open specific panel
function openButtonPanel(button) {
    if (button.title.includes('Endless')) {
        openCounterButton();
    } else if (button.title.includes('Color')) {
        openColorButton();
    } else if (button.title.includes('Cats')) {
        openCatsAndDogsButton();
    } else {
        openGenericPanel(button);
    }
}

// Panel
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

    const closeButton = overlay.querySelector('.close');
    closeButton.addEventListener('click', () => removeOverlay(overlay));

    document.addEventListener('keydown', function onKey(event) {
        if (event.key === 'Escape') removeOverlay(overlay);
    });

    closeButton.focus();
}

function removeOverlay(overlay) {
    document.body.removeChild(overlay);
}

// Endless Button
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

// Random Color Button
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

// Cats and Dogs button
function openCatsAndDogsButton() {
    const html = `
        <h2>Cats and Dogs Button</h2>
        <p>This button shows random images of cats and dogs.</p>
        <div class="row">
            <button id="newImageBtn" class="btn">New Image</button>
            <div id="imageContainer" style="margin-top:12px;text-align:center"></div>
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


// Create Overlay
function createOverlay(innerHTML) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    // Always add the close button at the bottom
    overlay.innerHTML = `
        <div class="panel" role="dialog" aria-modal="true">
            ${innerHTML}
            <div style="text-align:right;margin-top:12px">
                <button class="btn close">Close</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const closeButton = overlay.querySelector('.close');
    closeButton.addEventListener('click', () => removeOverlay(overlay));

    document.addEventListener('keydown', function onKey(e) {
        if (e.key === 'Escape') removeOverlay(overlay);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    // Dark Mode Toggle
    const darkToggle = document.getElementById('darkModeToggle');
    const darkLabel = document.getElementById('darkModeLabel');

    darkToggle.addEventListener('change', () => {
        const htmlEl = document.documentElement;
        if (darkToggle.checked) {
            htmlEl.setAttribute('data-theme', 'dark');
            darkLabel.textContent = 'Dark';
            localStorage.setItem('theme', 'dark');
        } else {
            htmlEl.removeAttribute('data-theme');
            darkLabel.textContent = 'Light';
            localStorage.setItem('theme', 'light');
        }
    });

    // Load user preference
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        darkToggle.checked = true;
        darkLabel.textContent = 'Dark';
    }
});


// Initial render
renderButtons(buttonsList);