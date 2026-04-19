let recivedData;
const container = document.getElementById("container")
const localContainer = document.getElementById('localContainer');
const base64srcPathMap = {};
const remember = document.getElementById('remember');
let lastSelectedData;

// Selection tracking
const selectedDownloads = new Set(); // wallpaper IDs
const selectedLocal = new Set(); // local file names

getReceivedData();

// Load saved values from localStorage into input fields
function getReceivedData() {
    const apiInput = document.getElementById('apiKey');
    const saveDirInput = document.getElementById('saveDir');
    const purityInput = document.getElementById('purity');
    const handlerInput = document.getElementById('handler');
    const localHandlerInput = document.getElementById('localHandler');

    // Get saved values from localStorage
    const api = localStorage.getItem('api');
    const saveDir = localStorage.getItem('saveDir');
    const purity = localStorage.getItem('purity');
    const handler = localStorage.getItem('handler');
    const localHandler = localStorage.getItem('localHandler');

    // Set input values if they exist
    if (api) apiInput.value = api;
    if (saveDir) saveDirInput.value = saveDir;
    if (purity) purityInput.value = purity;
    if (handler) handlerInput.value = handler;
    if (localHandler) localHandlerInput.value = localHandler;
}

// Save user choices to localStorage
function rememberUserChoices() {
    const api = document.getElementById('apiKey').value;
    const saveDir = document.getElementById('saveDir').value;
    const purity = document.getElementById('purity').value;
    const handler = document.getElementById('handler').value;
    const localHandler = document.getElementById('localHandler').value;

    if (remember.checked) {
        localStorage.setItem('api', api);
        localStorage.setItem('saveDir', saveDir);
        localStorage.setItem('purity', purity);
        localStorage.setItem('handler', handler);
        localStorage.setItem('localHandler', localHandler);
    }
}

function updateDownloadButtons() {
    const buttonContainer = document.getElementById('downloadActionButtons');
    buttonContainer.innerHTML = '';

    if (selectedDownloads.size === 0) {
        return;
    }

    const saveDir = document.getElementById('saveDir').value || './images';
    const handler = document.getElementById('handler').value;

    if (selectedDownloads.size === 1) {
        // Single selection: Download & Apply button
        const applyBtn = document.createElement('button');
        applyBtn.textContent = 'Download & Apply';
        applyBtn.addEventListener('click', async () => {
            const id = Array.from(selectedDownloads)[0];
            await window.pywebview.api.setWallpaper(id, saveDir, handler);
            selectedDownloads.clear();
            document.querySelectorAll('.card.selected').forEach(c => c.classList.remove('selected'));
            updateDownloadButtons();
        });
        buttonContainer.appendChild(applyBtn);
    } else {
        // Multiple selection: Download only
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = `Download (${selectedDownloads.size})`;
        downloadBtn.addEventListener('click', async () => {
            for (const id of selectedDownloads) {
                await window.pywebview.api.downloadWallpaper(id, saveDir);
            }
            selectedDownloads.clear();
            document.querySelectorAll('.card.selected').forEach(c => c.classList.remove('selected'));
            updateDownloadButtons();
        });
        buttonContainer.appendChild(downloadBtn);
    }
}

function updateLocalButtons() {
    const buttonContainer = document.getElementById('localActionButtons');
    buttonContainer.innerHTML = '';

    if (selectedLocal.size === 0) {
        return;
    }

    const handler = document.getElementById('localHandler').value;

    if (selectedLocal.size === 1) {
        // Single selection: Apply button
        const applyBtn = document.createElement('button');
        applyBtn.textContent = 'Apply';
        applyBtn.addEventListener('click', async () => {
            const name = Array.from(selectedLocal)[0];
            const filePath = base64srcPathMap[name];
            await window.pywebview.api.applyLocalWallpaper(filePath, handler);
            selectedLocal.clear();
            document.querySelectorAll('#localContainer .card.selected').forEach(c => c.classList.remove('selected'));
            updateLocalButtons();
        });
        buttonContainer.appendChild(applyBtn);
    } else {
        // Multiple selection: no button (can't apply multiple at once)
        const info = document.createElement('p');
        info.textContent = `${selectedLocal.size} selected (can only apply one at a time)`;
        info.style.color = '#aaa';
        info.style.textAlign = 'center';
        buttonContainer.appendChild(info);
    }
}

function loadWallpaper(id, thumbnail) {
    // Create the card element 
    const card = document.createElement('div');
    card.className = 'card';
    card.id = id;

    const title = document.createElement('h1');
    title.textContent = id;

    const img = document.createElement('img');
    img.src = thumbnail;
    img.alt = thumbnail;

    card.appendChild(title);
    card.appendChild(img);

    // Add selection click listener
    card.addEventListener('click', () => {
        if (selectedDownloads.has(id)) {
            selectedDownloads.delete(id);
            card.classList.remove('selected');
        } else {
            selectedDownloads.add(id);
            card.classList.add('selected');
        }
        updateDownloadButtons();
    });

    container.appendChild(card);
}

function loadLocalWallpaper(name, base64src) {
    const card = document.createElement('div');
    card.className = 'card';
    card.id = name;

    const title = document.createElement('h1');
    title.textContent = name;

    const img = document.createElement('img');
    img.src = base64src;
    img.alt = name;

    card.appendChild(title);
    card.appendChild(img);

    // Add selection click listener
    card.addEventListener('click', () => {
        if (selectedLocal.has(name)) {
            selectedLocal.delete(name);
            card.classList.remove('selected');
        } else {
            selectedLocal.add(name);
            card.classList.add('selected');
        }
        updateLocalButtons();
    });

    localContainer.appendChild(card);
}

function displayDataError(errorMsg) {
    container.innerHTML = "<h2>Error: " + errorMsg + "</h2>";
}

function displayData(json) {
    container.innerHTML = ""
    selectedDownloads.clear();
    updateDownloadButtons();

    for (const wallpaper of json.data.data) {
        loadWallpaper(wallpaper.id, wallpaper.thumbs.small)
    }
}

function displayFileDataError(errorMsg) {
    localContainer.innerHTML = "<h2>Error: " + errorMsg + "</h2>";
}

function displayFileData(json) {
    localContainer.innerHTML = "";
    selectedLocal.clear();
    updateLocalButtons();

    const namesArray = json.id[0];
    const srcArray = json.id[1];

    for (let i = 0; i < Math.min(namesArray.length, srcArray.length); i++) {
        const name = namesArray[i].name;
        const srcObj = srcArray[i];

        base64srcPathMap[name] = srcObj.filePath;
        loadLocalWallpaper(name, srcObj.src);
    }
}

async function getData(input, api, purity) {
    try {
        // Call Python method with input
        recivedData = await window.pywebview.api.getData(input, api, purity);

        // Show raw response
        console.log("Python response:", recivedData);

    } catch (err) {
        console.error("Error calling Python:", err);
        return;
    }

    // Check if the API call was successful
    if (!recivedData.success) {
        const status = recivedData.status_code ? ` (HTTP ${recivedData.status_code})` : "";
        const errorMsg = recivedData.error || "Unknown error";
        console.error("Failed to fetch wallpapers" + status + ": " + errorMsg);
        displayDataError(errorMsg);
        return;
    }

    // Check if wallpapers data is empty
    const wallpapers = recivedData.data?.data || [];
    if (wallpapers.length === 0) {
        console.warn(`No wallpapers found for your query (API returned empty data).`);
        displayDataError(`No wallpapers found for your query (API returned empty data).`)
        return;
    }

    // If everything is fine, pass data to display function
    displayData(recivedData);
}

async function getFiles(dir) {
    let localFiles;
    try {
        localFiles = await window.pywebview.api.getFiles(dir);
        if (typeof localFiles === "string") {
            localFiles = JSON.parse(localFiles);
        }
    } catch (e) {
        console.warn("Didn't receive data", e);
        displayFileDataError("Failed to get local files");
        return;
    }

    const namesArray = Array.isArray(localFiles?.id?.[0]) ? localFiles.id[0] : [];
    const srcArray = Array.isArray(localFiles?.id?.[1]) ? localFiles.id[1] : [];

    if (namesArray.length === 0 || srcArray.length === 0) {
        console.warn("Your folder doesn't contain wallhaven wallpapers");
        displayFileDataError("No wallpapers found in folder");
        return;
    }

    displayFileData(localFiles);
}

// Ensure pywebview API is ready
window.addEventListener('pywebviewready', function () {
    console.log('PyWebView is ready!');

    // Download part
    const sendBtn = document.getElementById('sendBtn');
    console.log('Send button found:', sendBtn);

    sendBtn.addEventListener('click', async function () {
        console.log('Send button clicked!');
        const currentData = {
            input: document.getElementById('userInput').value,
            api: document.getElementById('apiKey').value,
            purity: document.getElementById('purity').value
        };

        if (
            lastSelectedData &&
            currentData.input === lastSelectedData.input &&
            currentData.api === lastSelectedData.api &&
            currentData.purity === lastSelectedData.purity
        ) {
            return;
        }

        lastSelectedData = currentData;

        getData(currentData.input, currentData.api, currentData.purity);
        rememberUserChoices();
    });

    // Local part
    const localBtn = document.getElementById('localFileBtn');
    console.log('Local button found:', localBtn);

    localBtn.addEventListener('click', async function () {
        console.log('Local button clicked!');
        const localFileDir = document.getElementById('localFileDir').value

        getFiles(localFileDir)
    })

});

// Header navigation - moved outside pywebviewready
const main = document.getElementById('main')
const header = document.querySelector('header')

header.addEventListener('click', function (event) {
    console.log('Header clicked, target:', event.target);
    const target = event.target.closest('.headBtn')
    console.log('Closest headBtn:', target);

    if (!target) return

    switch (target.id) {

        case 'download':
            console.log('Switching to download tab');
            main.style.transform = 'translateX(0vw)'
            break

        case 'local':
            console.log('Switching to local tab');
            main.style.transform = 'translateX(-100vw)'
            break

    }
})



