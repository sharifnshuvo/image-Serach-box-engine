
const accessKey = "fElqhM7P_wsbloxMvqL4unWcHgT7y1zFc0c4W8EIS-g";

const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchResult = document.getElementById("search-result");
const showMoreBtn = document.getElementById("show-more-btn");

let keyword = "";
let page = 1;

async function searchImages() {

    keyword = searchBox.value.trim();

    if (keyword === "") {
        alert("Please enter something to search!");
        return;
    }

    page = 1;
    searchResult.innerHTML = "<p id='message'>Loading images...</p>";
    showMoreBtn.style.display = "none";

    await getImages();
}

async function getImages() {

    const apiUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&page=${page}&per_page=12&client_id=${accessKey}`;

    try {

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("Unable to fetch images. Check your API key.");
        }

        const data = await response.json();

        if (page === 1) {
            searchResult.innerHTML = "";
        }

        if (data.results.length === 0 && page === 1) {
            searchResult.innerHTML =
                "<p id='message'>No images found. Try another keyword.</p>";
            return;
        }

        data.results.forEach(photo => {

            const card = document.createElement("div");
            card.className = "result-card";

            const image = document.createElement("img");
            image.src = photo.urls.small;
            image.alt = photo.alt_description || keyword;
            image.loading = "lazy";

            const info = document.createElement("div");
            info.className = "image-info";

            const photographer = document.createElement("p");
            photographer.textContent =
                "Photo by " + photo.user.name;

            const link = document.createElement("a");
            link.href = photo.links.html;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "View on Unsplash";

            info.append(photographer, link);
            card.append(image, info);

            searchResult.appendChild(card);

        });

        showMoreBtn.style.display =
            data.results.length > 0 ? "block" : "none";

    } catch (error) {

        searchResult.innerHTML =
            "<p id='message'>" + error.message + "</p>";

        console.error(error);

    }
}

searchForm.addEventListener("submit", function(e) {

    e.preventDefault();

    searchImages();

});

showMoreBtn.addEventListener("click", function() {

    page++;

    getImages();

});
