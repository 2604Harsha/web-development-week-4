
"use strict";


const games = [
    {
        id: 1,
        name: "Neon Velocity",
        category: "Racing",
        description: "Race through neon-lit streets, master sharp turns, and push your speed to the limit. Experience the thrill of a futuristic racing universe.",
        shortDescription: "Race through neon streets and chase the ultimate speed record.",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80",
        keywords: "car driving speed racing neon velocity"
    },
    {
        id: 2,
        name: "Galaxy Defender",
        category: "Action",
        description: "Protect the galaxy from incoming threats in an action-packed space adventure. Stay alert, plan your moves, and defend your universe.",
        shortDescription: "Defend the galaxy in an intense cosmic action adventure.",
        image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=900&q=80",
        keywords: "space galaxy shooter aliens action sci-fi"
    },
    {
        id: 3,
        name: "Mind Maze",
        category: "Puzzle",
        description: "Challenge your brain with clever puzzles, hidden clues, and tricky challenges. Think carefully, find patterns, and unlock every level.",
        shortDescription: "Solve clever puzzles and unlock your hidden potential.",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80",
        keywords: "brain logic mind maze puzzle strategy retro"
    },
    {
        id: 4,
        name: "Lost Kingdom",
        category: "Adventure",
        description: "Explore mysterious landscapes, uncover forgotten secrets, and discover hidden treasures. Every journey leads to a new adventure.",
        shortDescription: "Explore mysterious worlds and uncover forgotten treasures.",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80",
        keywords: "adventure kingdom exploration fantasy quest"
    },
    {
        id: 5,
        name: "Cricket Clash",
        category: "Sports",
        description: "Step onto the virtual pitch, take on exciting cricket challenges, and aim for the winning shot. Bring your competitive spirit to every match.",
        shortDescription: "Take on cricket challenges and chase the winning score.",
        image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=900&q=80",
        keywords: "cricket sports bat ball stadium match"
    },
    {
        id: 6,
        name: "Shadow Survival",
        category: "Survival",
        description: "Enter a dangerous world where every decision matters. Gather resources, avoid threats, and test your survival instincts in a mysterious setting.",
        shortDescription: "Survive a dangerous world and outsmart every threat.",
        image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80",
        keywords: "survival zombie horror dark mystery"
    }
];

const gamesGrid = document.getElementById("gamesGrid");
const gameSearch = document.getElementById("gameSearch");
const gameCount = document.getElementById("gameCount");
const searchStatus = document.getElementById("searchStatus");
const clearSearch = document.getElementById("clearSearch");
const resetSearch = document.getElementById("resetSearch");
const noResults = document.getElementById("noResults");

const gameDetails = document.getElementById("gameDetails");
const closeDetails = document.getElementById("closeDetails");
const detailsImage = document.getElementById("detailsImage");
const detailsCategory = document.getElementById("detailsCategory");
const detailsGameName = document.getElementById("detailsGameName");
const detailsDescription = document.getElementById("detailsDescription");
const detailsPlay = document.getElementById("detailsPlay");

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

let selectedGameId = null;


function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

function getFilteredGames() {
    const query = gameSearch.value.trim().toLowerCase();

    if (!query) {
        return games;
    }

    return games.filter(function (game) {
        const searchableText = [
            game.name,
            game.category,
            game.description,
            game.shortDescription,
            game.keywords
        ].join(" ").toLowerCase();

        return searchableText.includes(query);
    });
}

function renderGames() {
    const filteredGames = getFilteredGames();
    const query = gameSearch.value.trim();

    gameCount.textContent =
        String(filteredGames.length).padStart(2, "0") +
        (filteredGames.length === 1 ? " GAME" : " GAMES");

    clearSearch.hidden = query.length === 0;

    noResults.hidden = filteredGames.length > 0;
    gamesGrid.hidden = filteredGames.length === 0;

    if (query) {
        searchStatus.textContent =
            filteredGames.length +
            (filteredGames.length === 1
                ? " matching game found."
                : " matching games found.");
    } else {
        searchStatus.textContent = "";
    }

    if (filteredGames.length === 0) {
        gamesGrid.replaceChildren();
        return;
    }

    gamesGrid.innerHTML = filteredGames.map(function (game, index) {
        return `
            <article class="game-card" data-game-id="${game.id}"
                     style="animation-delay:${index * 50}ms">

                <div class="game-image-wrap">
                    <img
                        class="game-image"
                        src="${escapeHTML(game.image)}"
                        alt="${escapeHTML(game.name)} game artwork"
                        loading="lazy">

                    <span class="game-category">
                        ${escapeHTML(game.category.toUpperCase())}
                    </span>

                    <span class="game-number">
                        GAME / ${String(game.id).padStart(2, "0")}
                    </span>
                </div>

                <div class="game-card-content">
                    <h3>${escapeHTML(game.name)}</h3>
                    <p>${escapeHTML(game.shortDescription)}</p>

                    <div class="game-card-actions">
                        <button
                            class="game-details-button"
                            type="button"
                            data-action="details"
                            data-id="${game.id}"
                            aria-pressed="${selectedGameId === game.id}">
                            Details <i class="fa-solid fa-arrow-right"></i>
                        </button>

                        <button
                            class="play-button"
                            type="button"
                            data-action="play"
                            data-id="${game.id}">
                            <i class="fa-solid fa-play"></i> Play
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join("");

    handleBrokenImages(gamesGrid);
}

function handleBrokenImages(container) {
    container.querySelectorAll(".game-image").forEach(function (image) {
        image.addEventListener("error", function () {
            image.style.display = "none";

            const wrapper = image.closest(".game-image-wrap");

            if (wrapper) {
                wrapper.style.background =
                    "linear-gradient(135deg, #19231b, #19172a, #080a0d)";
            }
        }, { once: true });
    });
}

function showGameDetails(gameId) {
    const game = games.find(function (item) {
        return item.id === Number(gameId);
    });

    if (!game) return;

    selectedGameId = game.id;

    detailsGameName.textContent = game.name;
    detailsCategory.textContent = game.category;
    detailsDescription.textContent = game.description;

    detailsImage.style.display = "block";
    detailsImage.src = game.image;
    detailsImage.alt = game.name + " game artwork";

    const imageWrapper = detailsImage.closest(".details-image-wrap");
    imageWrapper.style.background = "";

    detailsImage.onerror = function () {
        detailsImage.style.display = "none";
        imageWrapper.style.background =
            "linear-gradient(135deg, #19231b, #19172a, #080a0d)";
    };

    detailsImage.onload = function () {
        detailsImage.style.display = "block";
        imageWrapper.style.background = "";
    };

    gameDetails.hidden = false;

    renderGames();

    gameDetails.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function hideGameDetails() {
    gameDetails.hidden = true;
    selectedGameId = null;
    renderGames();
}

closeDetails.addEventListener("click", hideGameDetails);

function playGame(gameId) {
    const game = games.find(function (item) {
        return item.id === Number(gameId);
    });

    if (!game) return;

    
    alert("Game is starting...");
}

detailsPlay.addEventListener("click", function () {
    if (selectedGameId !== null) {
        playGame(selectedGameId);
    }
});

gamesGrid.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const gameId = Number(button.dataset.id);

    if (button.dataset.action === "details") {
        showGameDetails(gameId);
    } else if (button.dataset.action === "play") {
        playGame(gameId);
    }
});

gameSearch.addEventListener("input", function () {
    renderGames();

    if (selectedGameId !== null) {
        const selectedGame = games.find(function (game) {
            return game.id === selectedGameId;
        });

        const query = gameSearch.value.trim().toLowerCase();

        const selectedMatches = selectedGame && [
            selectedGame.name,
            selectedGame.category,
            selectedGame.description,
            selectedGame.shortDescription,
            selectedGame.keywords
        ].join(" ").toLowerCase().includes(query);

        if (!selectedMatches) {
            hideGameDetails();
        }
    }
});

function resetSearchResults() {
    gameSearch.value = "";
    renderGames();
    gameSearch.focus();
}

clearSearch.addEventListener("click", resetSearchResults);
resetSearch.addEventListener("click", resetSearchResults);

menuToggle.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
});

navLinks.addEventListener("click", function (event) {
    if (event.target.closest("a")) {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
});
document.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
        document.querySelectorAll(".nav-link").forEach(function (item) {
            item.classList.remove("active");
        });

        link.classList.add("active");
    });
});


document.getElementById("currentYear").textContent =
    new Date().getFullYear();

renderGames();

console.log("GameZone loaded successfully.");
