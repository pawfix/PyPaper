let recivedData;

function loadWallpaper(id, thumbnail) {
	const container = document.getElementById("container")

	container.innerHTML += `
  <div class="card ${id}">
    <h1>${id}</h1>
    <img src="${thumbnail}" alt="${thumbnail}">
  </div>
`;
	console.log("loadedcontent" + container.textContent);

}

function displayData(json) {
	for (const wallpaper of json.data) {
		console.log(wallpaper);
		loadWallpaper(wallpaper.id, wallpaper.thumbs.small)
	}
}

async function getData(input) {
	try {
		// Call Python method with input
		recivedData = await window.pywebview.api.getData(input);

		// Show response
		document.getElementById('output').textContent = JSON.stringify(recivedData, null, 2);
		console.log("Python response:", recivedData);

	} catch (err) {
		console.error("Error calling Python:", err);
	}
	displayData(recivedData)
}

// Ensure pywebview API is ready
window.addEventListener('pywebviewready', function () {
	const btn = document.getElementById('sendBtn');

	btn.addEventListener('click', async function () {
		const input = document.getElementById('userInput').value;

		getData(input)
	});
});

