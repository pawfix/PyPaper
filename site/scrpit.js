let recivedData;
const container = document.getElementById("container")

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

    // Add click listener to log id
    card.addEventListener('click', () => {
        const saveDir = document.getElementById('saveDir').value || './images';
        window.pywebview.api.setWallpaper(card.id, saveDir);
    });

    container.appendChild(card);
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
// Ensure pywebview API is ready
window.addEventListener('pywebviewready', function () {
    const btn = document.getElementById('sendBtn');

    btn.addEventListener('click', async function () {
        const input = document.getElementById('userInput').value;
        const api = document.getElementById('apiKey').value;
        const purity = document.getElementById("purity").value

        getData(input, api, purity);
    });
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


