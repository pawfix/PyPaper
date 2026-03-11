let recivedData;
const container = document.getElementById("container")
const localContainer = document.getElementById('localContainer');
const base64srcPathMap = {};

function loadWallpaper(id, thumbnail) {
    // Create the card element instead of using innerHTML string
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

    const hander = document.getElementById('handler').value

    console.log(hander)
    // Add click listener to log id
    card.addEventListener('click', () => {
        const saveDir = document.getElementById('saveDir').value || './images';
        window.pywebview.api.setWallpaper(card.id, saveDir, hander);
    });

    container.appendChild(card);
}
function applyLocalWallpaper(cardId, filePath) {
    window.pywebview.api.setWallpaper(filePath)
    
        .then(() => {
            console.log(`Applied local wallpaper: ${cardId}`);
        })
        .catch(err => {
            console.error("Failed to apply local wallpaper:", err);
        });
    card.addEventListener('click', () => {
        const filePath = base64srcPathMap[name]; // absolute path from Python
        window.pywebview.api.applyLocalWallpaper(filePath)  // <-- call new function
            .then(() => console.log(`Applied local wallpaper: ${name}`))
            .catch(err => console.error("Failed to apply local wallpaper:", err));
        });
}
function loadLocalWallpaper(name, base64src) {
    const card = document.createElement('div');
    card.className = 'card'; // same style as API cards
    card.id = name;

    const title = document.createElement('h1');
    title.textContent = name;

    const img = document.createElement('img');
    img.src = base64src;
    img.alt = name;

    card.appendChild(title);
    card.appendChild(img);

    // Click to apply local wallpaper (no download)
    card.addEventListener('click', () => {
        const filePath = base64srcPathMap[name];
        window.pywebview.api.applyLocalWallpaper(filePath)
            .then(() => console.log(`Applied local wallpaper: ${name}`))
            .catch(err => console.error("Failed to apply local wallpaper:", err));
    });

    localContainer.appendChild(card);
}

function displayDataError(errorMsg) {
    container.innerHTML = "<h2>Error: " + errorMsg + "</h2>";
}
function displayData(json) {
    container.innerHTML = ""

    for (const wallpaper of json.data.data) {
        loadWallpaper(wallpaper.id, wallpaper.thumbs.small)
    }

}

function displayFileDataError(errorMsg) {
    localContainer.innerHTML = "<h2>Error: " + errorMsg + "</h2>";
}

function displayFileData(json) {
    localContainer.innerHTML = ""; // clear previous

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
    let recivedData;
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

    // Download part
    const sendBtn = document.getElementById('sendBtn');

    sendBtn.addEventListener('click', async function () {
        const input = document.getElementById('userInput').value;
        const api = document.getElementById('apiKey').value;
        const purity = document.getElementById("purity").value

        getData(input, api, purity);
    });

    // Local part
    const localBtn = document.getElementById('localFileBtn');

    localBtn.addEventListener('click', async function () {
        const localFileDir = document.getElementById('localFileDir').value

        getFiles(localFileDir)
    })


});


const main = document.getElementById('main')
const header = document.querySelector('header')

header.addEventListener('click', function (event) {

    const target = event.target.closest('.headBtn')

    if (!target) return

    switch (target.id) {

        case 'download':
            main.style.transform = 'translateX(0vw)'
            break

        case 'local':
            main.style.transform = 'translateX(-100vw)'
            break

    }
})


