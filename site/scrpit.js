let recivedData;
const container = document.getElementById("container")
const localContainer = document.getElementById('localContainer');
const base64srcPathMap = {};
const remember = document.getElementById('remember');
let lastSelectedData;

// Selection tracking
const selectedDownloads = new Set(); // wallpaper IDs
const selectedLocal = new Set(); // local file names

// Error popup elements
const errorPopup = document.getElementById('errorPopup');
const errorMessage = document.getElementById('errorMessage');
const overlay = document.getElementById('overlay');
const closeErrorBtn = document.getElementById('closeErrorBtn');

// Error popup functions
function showError(message) {
    errorMessage.textContent = message;
    errorPopup.classList.add('show');
    overlay.classList.add('show');
}

function hideError() {
    errorPopup.classList.remove('show');
    overlay.classList.remove('show');
}

// Load saved values from localStorage into input fields
function getReceivedData() {
    if (typeof Storage === 'undefined' || !window.localStorage) {
        console.warn("NO storage")
        return
    }
    const apiInput = document.getElementById('apiKey');
    const saveDirInput = document.getElementById('saveDir');
    const purityInput = document.getElementById('purity');
    const handlerInput = document.getElementById('handler');
    const localHandlerInput = document.getElementById('localHandler');

    // Get saved values from localStorage (convert null to empty string)
    const api = localStorage.getItem('api') || '';
    const saveDir = localStorage.getItem('saveDir') || '';
    const purity = localStorage.getItem('purity') || '';
    const handler = localStorage.getItem('handler') || '';
    const localHandler = localStorage.getItem('localHandler') || '';

    // Set input values if elements exist
    if (apiInput) apiInput.value = api;
    if (saveDirInput) saveDirInput.value = saveDir;
    if (purityInput) purityInput.value = purity;
    if (handlerInput) handlerInput.value = handler;
    if (localHandlerInput) localHandlerInput.value = localHandler;
}

// Save user choices to localStorage
function rememberUserChoices() {
    if (typeof Storage === 'undefined' || !window.localStorage) {
        console.warn("NO storage")
        return
    }
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
    console.log('updateDownloadButtons called, selectedDownloads.size:', selectedDownloads.size);
    console.log('buttonContainer:', buttonContainer);

    if (!buttonContainer) {
        console.error('Button container not found!');
        return;
    }

    buttonContainer.innerHTML = '';

    // Only update display if we're currently showing this tab
    if (buttonContainer.style.display !== 'none') {
        buttonContainer.style.display = 'flex';
    }

    const saveDir = document.getElementById('saveDir').value || './images';
    const handler = document.getElementById('handler').value;
    const isDisabled = selectedDownloads.size === 0;

    if (selectedDownloads.size === 0) {
        // No selection: gray disabled button
        console.log('Creating disabled button');
        const disabledBtn = document.createElement('button');
        disabledBtn.textContent = 'Download & Apply';
        disabledBtn.disabled = true;
        buttonContainer.appendChild(disabledBtn);
        console.log('Disabled button added, disabled:', disabledBtn.disabled);
    } else if (selectedDownloads.size === 1) {
        // Single selection: Download & Apply button
        console.log('Creating enabled button for single selection');
        const applyBtn = document.createElement('button');
        applyBtn.textContent = 'Download & Apply';
        applyBtn.disabled = false;
        applyBtn.removeAttribute('disabled');
        applyBtn.addEventListener('click', async () => {
            if (!window.pywebview || !window.pywebview.api) {
                showError('PyWebView API not available. Please restart the application.');
                return;
            }
            try {
                const id = Array.from(selectedDownloads)[0];
                await window.pywebview.api.setWallpaper(id, saveDir, handler);
                selectedDownloads.clear();
                document.querySelectorAll('.card.selected').forEach(c => c.classList.remove('selected'));
                updateDownloadButtons();
            } catch (error) {
                console.error('Error applying wallpaper:', error);
                showError(`Failed to apply wallpaper: ${error.message || 'Unknown error'}`);
            }
        });
        buttonContainer.appendChild(applyBtn);
    } else {
        // Multiple selection: Download only
        console.log('Creating enabled button for multiple selection');
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = `Download (${selectedDownloads.size})`;
        downloadBtn.disabled = false;
        downloadBtn.removeAttribute('disabled');
        downloadBtn.addEventListener('click', async () => {
            if (!window.pywebview || !window.pywebview.api) {
                showError('PyWebView API not available. Please restart the application.');
                return;
            }
            try {
                for (const id of selectedDownloads) {
                    await window.pywebview.api.downloadWallpaper(id, saveDir);
                }
                selectedDownloads.clear();
                document.querySelectorAll('.card.selected').forEach(c => c.classList.remove('selected'));
                updateDownloadButtons();
            } catch (error) {
                console.error('Error downloading wallpapers:', error);
                showError(`Failed to download wallpapers: ${error.message || 'Unknown error'}`);
            }
        });
        buttonContainer.appendChild(downloadBtn);
    }
}

function updateLocalButtons() {
    const buttonContainer = document.getElementById('localActionButtons');
    console.log('updateLocalButtons called, selectedLocal.size:', selectedLocal.size);
    buttonContainer.innerHTML = '';

    // Only update display if we're currently showing this tab
    if (buttonContainer.style.display !== 'none') {
        buttonContainer.style.display = 'flex';
    }

    const handler = document.getElementById('localHandler').value;

    if (selectedLocal.size === 0) {
        // No selection: gray disabled button
        const disabledBtn = document.createElement('button');
        disabledBtn.textContent = 'Apply';
        disabledBtn.disabled = true;
        buttonContainer.appendChild(disabledBtn);
    } else if (selectedLocal.size === 1) {
        // Single selection: Apply button
        const applyBtn = document.createElement('button');
        applyBtn.textContent = 'Apply';
        applyBtn.disabled = false;
        applyBtn.removeAttribute('disabled');
        applyBtn.addEventListener('click', async () => {
            if (!window.pywebview || !window.pywebview.api) {
                showError('PyWebView API not available. Please restart the application.');
                return;
            }
            try {
                const name = Array.from(selectedLocal)[0];
                const filePath = base64srcPathMap[name];
                await window.pywebview.api.applyLocalWallpaper(filePath, handler);
                selectedLocal.clear();
                document.querySelectorAll('#localContainer .card.selected').forEach(c => c.classList.remove('selected'));
                updateLocalButtons();
            } catch (error) {
                console.error('Error applying local wallpaper:', error);
                showError(`Failed to apply local wallpaper: ${error.message || 'Unknown error'}`);
            }
        });
        buttonContainer.appendChild(applyBtn);
    } else {
        // Multiple selection: disabled button with info
        const disabledBtn = document.createElement('button');
        disabledBtn.textContent = 'Apply (Select one at a time)';
        disabledBtn.disabled = true;
        buttonContainer.appendChild(disabledBtn);
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
        console.log('Card clicked:', id);
        if (selectedDownloads.has(id)) {
            selectedDownloads.delete(id);
            card.classList.remove('selected');
        } else {
            selectedDownloads.add(id);
            card.classList.add('selected');
        }
        console.log('After click, selectedDownloads.size:', selectedDownloads.size);
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
        console.log('Local card clicked:', name);
        if (selectedLocal.has(name)) {
            selectedLocal.delete(name);
            card.classList.remove('selected');
        } else {
            selectedLocal.add(name);
            card.classList.add('selected');
        }
        console.log('After click, selectedLocal.size:', selectedLocal.size);
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
    console.log('getData called with:', { input, api, purity });

    if (!window.pywebview || !window.pywebview.api) {
        console.error('PyWebView API not available!');
        displayDataError('PyWebView API not available. Please restart the application.');
        return;
    }

    try {
        // Call Python method with input
        console.log('Calling window.pywebview.api.getData...');
        recivedData = await window.pywebview.api.getData(input, api, purity);
        console.log("Python response:", recivedData);

    } catch (err) {
        console.error("Error calling Python:", err);
        displayDataError('Failed to communicate with Python backend: ' + err.message);
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
    console.log('getFiles called with:', dir);

    if (!window.pywebview || !window.pywebview.api) {
        console.error('PyWebView API not available!');
        displayFileDataError('PyWebView API not available. Please restart the application.');
        return;
    }

    let localFiles;
    try {
        console.log('Calling window.pywebview.api.getFiles...');
        localFiles = await window.pywebview.api.getFiles(dir);
        console.log('Local files response:', localFiles);
        if (typeof localFiles === "string") {
            localFiles = JSON.parse(localFiles);
        }
    } catch (e) {
        console.warn("Didn't receive data", e);
        displayFileDataError("Failed to get local files: " + e.message);
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
});

// Attach event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, attaching event listeners');

    // Load saved values from localStorage
    getReceivedData();

    // Initialize buttons - show download by default, hide local
    document.getElementById('downloadActionButtons').style.display = 'flex';
    document.getElementById('localActionButtons').style.display = 'none';

    updateDownloadButtons();
    updateLocalButtons();

    // Download button
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) {
        console.log('Send button found, attaching listener');
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
    } else {
        console.error('Send button not found!');
    }

    // Local button
    const localBtn = document.getElementById('localFileBtn');
    if (localBtn) {
        console.log('Local button found, attaching listener');
        localBtn.addEventListener('click', async function () {
            console.log('Local button clicked!');
            const localFileDir = document.getElementById('localFileDir').value;
            getFiles(localFileDir);
        });
    } else {
        console.error('Local button not found!');
    }

    // Header navigation
    const main = document.getElementById('main');
    const header = document.querySelector('header');

    if (header) {
        console.log('Header found, attaching navigation listener');
        header.addEventListener('click', function (event) {
            console.log('Header clicked, target:', event.target);
            const target = event.target.closest('.headBtn') || event.target.closest('h3')?.parentElement;
            console.log('Closest headBtn:', target);

            if (!target || !target.classList.contains('headBtn')) return;

            switch (target.id) {
                case 'download':
                    console.log('Switching to download tab');
                    main.style.transform = 'translateX(0vw)';
                    // Hide local buttons, show download buttons
                    document.getElementById('localActionButtons').style.display = 'none';
                    document.getElementById('downloadActionButtons').style.display = 'flex';
                    updateDownloadButtons();
                    break;
                case 'local':
                    console.log('Switching to local tab');
                    main.style.transform = 'translateX(-100vw)';
                    // Hide download buttons, show local buttons
                    document.getElementById('downloadActionButtons').style.display = 'none';
                    document.getElementById('localActionButtons').style.display = 'flex';
                    updateLocalButtons();
                    break;
            }
        });
    } else {
        console.error('Header not found!');
    }

    // Error popup close button
    if (closeErrorBtn) {
        closeErrorBtn.addEventListener('click', hideError);
    }

    // Close popup when clicking overlay
    if (overlay) {
        overlay.addEventListener('click', hideError);
    }

    // Close popup on Escape key
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && errorPopup.classList.contains('show')) {
            hideError();
        }
    });
});



