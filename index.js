const sample = [
    {title:'Endless Button', desc:'A button that only counts clicks.'},
    {title:'Random Color Button', desc:'Show a random color and its hex value.'}
];

const projectsEl = document.getElementById('projects');
const searchInput = document.getElementById('search');

let projects = [...sample];

function render(list){
    projectsEl.innerHTML = '';
    if(list.length === 0){
        projectsEl.innerHTML = '<div class="empty">No matching buttons found.</div>';
        return;
    }
    list.forEach((p, i) => {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
            <div>
                <h3>${escapeHtml(p.title)}</h3>
                <p>${escapeHtml(p.desc || '')}</p>
            </div>
            <div class="meta">
                <a class="open" href="#" data-index="${i}" role="button">Open</a>
            </div>
        `;
        projectsEl.appendChild(card);
    });
}

function escapeHtml(s){ 
    return String(s).replace(/[&<>"']/g, c => ({
        '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
}

function filter(q){
    q = (q||'').toLowerCase().trim();
    return projects.filter(p => ((p.title||'') + ' ' + (p.desc||''))
        .toLowerCase().includes(q));
}

searchInput.addEventListener('input', e => render(filter(e.target.value)));

projectsEl.addEventListener('click', e => {
    const btn = e.target.closest('.open');
    if(!btn) return;
    e.preventDefault();
    const idx = Number(btn.dataset.index);
    const p = projects[idx];
    if(!p) return;
    openProject(p);
});

function openProject(p){
    if(p.title.includes('Endless')) return openCounter();
    if(p.title.includes('Color')) return openColor();
    openPanel(`<h2>${escapeHtml(p.title)}</h2><p>${escapeHtml(p.desc||'')}</p>`);
}

function openPanel(innerHtml, focusSelector){
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `<div class="panel" role="dialog" aria-modal="true">${innerHtml}<div style="text-align:right;margin-top:12px"><button class="btn close">Close</button></div></div>`;
    document.body.appendChild(overlay);
    const close = overlay.querySelector('.close');
    function remove(){ document.body.removeChild(overlay); document.removeEventListener('keydown', onKey); }
    close.addEventListener('click', remove);
    function onKey(e){ if(e.key === 'Escape') remove(); }
    document.addEventListener('keydown', onKey);
    if(focusSelector){
        const el = overlay.querySelector(focusSelector);
        if(el) el.focus();
    } else {
        close.focus();
    }
}

function openCounter(){
    const html = `
        <h2>Endless Button</h2>
        <p>Click the button below. It only counts clicks.</p>
        <div class="row">
            <button id="countBtn" class="btn">Clicks: <span id="count">0</span></button>
            <button id="reset" class="btn ghost">Reset</button>
        </div>
    `;
    openPanel(html, '#countBtn');
    const overlay = document.querySelector('.overlay:last-of-type');
    const countEl = overlay.querySelector('#count');
    const btn = overlay.querySelector('#countBtn');
    const reset = overlay.querySelector('#reset');
    let c = 0;
    btn.addEventListener('click', () => { c++; countEl.textContent = c; });
    reset.addEventListener('click', () => { c = 0; countEl.textContent = c; });
}

function randHex(){
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0').toUpperCase();
}

function openColor(){
    const color = randHex();
    const html = `
        <h2>Random Color Button</h2>
        <p>Click "New Color" to generate a random color. The hex value is shown.</p>
        <div class="row">
            <div class="color-box" id="colorBox" style="background:${color}"></div>
            <div style="flex:1">
                <div style="font-weight:600" id="hex">${color}</div>
                <div style="margin-top:8px">
                    <button id="newColor" class="btn">New Color</button>
                    <button id="copyHex" class="btn ghost">Copy</button>
                </div>
            </div>
        </div>
    `;
    openPanel(html, '#newColor');
    const overlay = document.querySelector('.overlay:last-of-type');
    const box = overlay.querySelector('#colorBox');
    const hexEl = overlay.querySelector('#hex');
    const newColorBtn = overlay.querySelector('#newColor');
    const copyBtn = overlay.querySelector('#copyHex');

    newColorBtn.addEventListener('click', () => {
        const h = randHex();
        box.style.background = h;
        hexEl.textContent = h;
    });
    copyBtn.addEventListener('click', async () => {
        try{ 
            await navigator.clipboard.writeText(hexEl.textContent); 
            copyBtn.textContent='Copied'; 
            setTimeout(()=>copyBtn.textContent='Copy',1000); 
        }catch(e){ /* ignore */ }
    });
}

render(projects);
